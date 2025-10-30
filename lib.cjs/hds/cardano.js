"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardanoHD = void 0;
const cbor2_1 = require("cbor2");
const bip32_1 = require("./bip32");
const cryptocurrencies_1 = require("../cryptocurrencies");
const eccs_1 = require("../eccs");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const addresses_1 = require("../addresses");
const seeds_1 = require("../seeds");
const exceptions_1 = require("../exceptions");
const consts_1 = require("../consts");
/**
 * Implements hierarchical deterministic (HD) wallet logic for Cardano.
 * Supports multiple Cardano derivation types including Byron Legacy, Icarus, Shelley, and Ledger.
 * Provides methods to derive keys, addresses, and extended keys according to Cardano standards.
 *
 */
class CardanoHD extends bip32_1.BIP32HD {
    cardanoType;
    /**
     * Creates a new CardanoHD instance.
     * @param options Configuration options for Cardano HD wallet
     * @param options.publicKeyType Type of public key (default: compressed)
     * @param options.cardanoType Cardano derivation type (required)
     * @throws {BaseError} If an invalid Cardano type is provided
     */
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        options.ecc = eccs_1.KholawEd25519ECC;
        super(options);
        if (!options.cardanoType || !cryptocurrencies_1.Cardano.TYPES.getCardanoTypes().includes(options.cardanoType)) {
            throw new exceptions_1.BaseError('Invalid Cardano type', {
                expected: cryptocurrencies_1.Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
            });
        }
        this.cardanoType = options.cardanoType;
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Cardano'
     */
    static getName() {
        return 'Cardano';
    }
    /**
     * Initializes the HD wallet from a seed.
     * Handles different derivation types and Cardano-specific tweaks.
     *
     * @param seed Seed value as string or Seed instance
     * @param passphrase Optional passphrase for certain derivation types
     * @returns {this} Current CardanoHD instance
     * @throws {SeedError|BaseError} If seed data or length is invalid
     */
    fromSeed(seed, passphrase) {
        try {
            this.seed = (0, utils_1.getBytes)(seed instanceof seeds_1.Seed ? seed.getSeed() : seed);
        }
        catch {
            throw new exceptions_1.SeedError('Invalid seed data');
        }
        const digestSize = 64;
        const hmacHalfLength = digestSize / 2;
        const tweakMasterKeyBits = (data) => {
            const d = new Uint8Array(data);
            d[0] = (0, utils_1.resetBits)(d[0], 0x07);
            d[31] = (0, utils_1.resetBits)(d[31], this.cardanoType === cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS || this.cardanoType === cryptocurrencies_1.Cardano.TYPES.SHELLEY_ICARUS ? 0xE0 : 0x80);
            d[31] = (0, utils_1.setBits)(d[31], 0x40);
            return d;
        };
        if (this.cardanoType === cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY) {
            if (this.seed.length !== 32) {
                throw new exceptions_1.BaseError('Invalid seed length', {
                    expected: 32, got: this.seed.length
                });
            }
            const digestSize = 64;
            const data = (0, cbor2_1.encode)(this.seed);
            let iteration = 1;
            while (true) {
                const label = (0, utils_1.toBuffer)(`Root Seed Chain ${iteration}`);
                const i = (0, crypto_1.hmacSha512)(data, label);
                let il = (0, crypto_1.sha512)(i.slice(0, digestSize / 2));
                const ir = i.slice(digestSize / 2);
                il = (0, utils_1.toBuffer)(tweakMasterKeyBits(il));
                if (!(0, utils_1.areBitsSet)(il[31], 0x20)) {
                    this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(il);
                    this.rootChainCode = ir;
                    break;
                }
                iteration++;
            }
        }
        else if ([cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS, cryptocurrencies_1.Cardano.TYPES.SHELLEY_ICARUS].includes(this.cardanoType)) {
            if (this.seed.length < 16) {
                throw new exceptions_1.BaseError('Invalid seed length', { expected: '>= 16', got: this.seed.length });
            }
            const k = tweakMasterKeyBits((0, crypto_1.pbkdf2HmacSha512)(passphrase ?? '', this.seed, 4096, 96));
            this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(k.slice(0, eccs_1.KholawEd25519PrivateKey.getLength()));
            this.rootChainCode = k.slice(eccs_1.KholawEd25519PrivateKey.getLength());
        }
        else if ([cryptocurrencies_1.Cardano.TYPES.BYRON_LEDGER, cryptocurrencies_1.Cardano.TYPES.SHELLEY_LEDGER].includes(this.cardanoType)) {
            if (this.seed.length < 16) {
                throw new exceptions_1.BaseError('Invalid seed length', { expected: '>= 16', got: this.seed.length });
            }
            let hmacData = this.seed;
            let hmac;
            while (true) {
                hmac = (0, crypto_1.hmacSha512)((0, utils_1.getHmac)(this.ecc.NAME), hmacData);
                if ((hmac[31] & 0x20) === 0)
                    break;
                hmacData = hmac;
            }
            let kl = tweakMasterKeyBits(hmac.slice(0, hmacHalfLength));
            const kr = hmac.slice(hmacHalfLength);
            const chainCode = (0, crypto_1.hmacSha256)((0, utils_1.getHmac)(this.ecc.NAME), (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x01]), this.seed));
            this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes((0, utils_1.concatBytes)(kl, kr));
            this.rootChainCode = chainCode;
        }
        this.rootPublicKey = this.rootPrivateKey.getPublicKey();
        this.privateKey = this.rootPrivateKey;
        this.chainCode = this.rootChainCode;
        this.parentFingerprint = new Uint8Array(4);
        this.publicKey = this.privateKey.getPublicKey();
        this.strict = true;
        return this;
    }
    /**
     * Sets the HD wallet from a private key (only supported for Shelley types).
     * @param privateKey Private key as string
     * @returns {this} Current CardanoHD instance
     * @throws {BaseError|PrivateKeyError} If private key is unsupported or invalid
     */
    fromPrivateKey(privateKey) {
        if ([cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS, cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY, cryptocurrencies_1.Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
            throw new exceptions_1.BaseError(`From private key not supported for ${this.cardanoType}`);
        }
        try {
            this.privateKey = this.ecc.PRIVATE_KEY.fromBytes((0, utils_1.getBytes)(privateKey));
            this.publicKey = this.privateKey.getPublicKey();
            this.strict = null;
            return this;
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    /**
     * Sets the HD wallet from a public key (only supported for Shelley types).
     * @param publicKey Public key as string
     * @returns {this} Current CardanoHD instance
     * @throws {BaseError|PublicKeyError} If public key is unsupported or invalid
     */
    fromPublicKey(publicKey) {
        if ([cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS, cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY, cryptocurrencies_1.Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
            throw new exceptions_1.BaseError(`From public key not supported for ${this.cardanoType}`);
        }
        try {
            this.publicKey = this.ecc.PUBLIC_KEY.fromBytes((0, utils_1.getBytes)(publicKey));
            this.strict = null;
            return this;
        }
        catch {
            throw new exceptions_1.PublicKeyError('Invalid public key data');
        }
    }
    /**
     * Derives a child key at the given index according to Cardano derivation rules.
     * Supports hardened and non-hardened derivation.
     *
     * @param index Child index to derive
     * @returns {this} Current CardanoHD instance with updated keys
     * @throws {BaseError|DerivationError} If derivation fails
     */
    drive(index) {
        const digestHalf = 32; // sha512().digest_size / 2
        const isLegacy = this.cardanoType === cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY;
        const indexBytes = (0, utils_1.integerToBytes)(index, 4, isLegacy ? 'big' : 'little');
        if (this.privateKey) {
            let zHmac, hmac;
            if (index & 0x80000000) {
                zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x00]), this.privateKey.getRaw(), indexBytes));
                hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x01]), this.privateKey.getRaw(), indexBytes));
            }
            else {
                const pubRaw = this.publicKey.getRawCompressed().slice(1);
                zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x02]), pubRaw, indexBytes));
                hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x03]), pubRaw, indexBytes));
            }
            const zl = zHmac.slice(0, digestHalf);
            const zr = zHmac.slice(digestHalf);
            const kl = this.privateKey.getRaw().slice(0, digestHalf);
            const kr = this.privateKey.getRaw().slice(digestHalf);
            const _hmacr = hmac.slice(digestHalf);
            const left = isLegacy
                ? (0, utils_1.integerToBytes)(((0, utils_1.bytesToInteger)((0, utils_1.multiplyScalarNoCarry)((0, utils_1.toBuffer)(zl), 8), true) + (0, utils_1.bytesToInteger)(kl, true)) % this.ecc.ORDER, 32, 'little')
                : (() => {
                    const zlInt = (0, utils_1.bytesToInteger)(zl.slice(0, 28), true);
                    const klInt = (0, utils_1.bytesToInteger)(kl, true);
                    const leftInt = zlInt * BigInt(8) + klInt;
                    if (leftInt % this.ecc.ORDER === BigInt(0))
                        throw new exceptions_1.BaseError('Invalid child private key');
                    return (0, utils_1.integerToBytes)(leftInt, eccs_1.KholawEd25519PrivateKey.getLength() / 2, 'little');
                })();
            const right = isLegacy
                ? (0, utils_1.addNoCarry)((0, utils_1.toBuffer)(zr), (0, utils_1.toBuffer)(kr))
                : (() => {
                    const zrInt = (0, utils_1.bytesToInteger)(zr, true);
                    const krInt = (0, utils_1.bytesToInteger)(kr, true);
                    const sum = (zrInt + krInt) % (BigInt(1) << BigInt(256));
                    return (0, utils_1.integerToBytes)(sum, eccs_1.KholawEd25519PrivateKey.getLength() / 2, 'little');
                })();
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            const newPrivateKey = this.ecc.PRIVATE_KEY.fromBytes((0, utils_1.concatBytes)(left, right));
            this.privateKey = newPrivateKey;
            this.chainCode = _hmacr;
            this.publicKey = newPrivateKey.getPublicKey();
        }
        else {
            if (index & 0x80000000) {
                throw new exceptions_1.DerivationError('Hardened derivation path is invalid for xpublic key');
            }
            const pubRaw = this.publicKey.getRawCompressed().slice(1);
            const zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x02]), pubRaw, indexBytes));
            const hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.toBuffer)([0x03]), pubRaw, indexBytes));
            const zl = zHmac.slice(0, digestHalf);
            const tweak = isLegacy
                ? (0, utils_1.bytesToInteger)((0, utils_1.multiplyScalarNoCarry)(zl, 8), true)
                : (0, utils_1.bytesToInteger)(zl.slice(0, 28), true) * BigInt(8);
            const newPoint = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(tweak));
            if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
                throw new exceptions_1.BaseError('Computed public child key is not valid, very unlucky index');
            }
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            this.publicKey = this.ecc.PUBLIC_KEY.fromPoint(newPoint);
            this.chainCode = hmac.slice(digestHalf);
        }
        this.depth += 1;
        this.index = index;
        this.fingerprint = (0, utils_1.getBytes)(this.getFingerprint());
        return this;
    }
    /**
     * Returns the root extended private key (xprv) for the current derivation.
     * Delegates to BIP32HD serialization logic.
     *
     * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string|null} Serialized root extended private key
     */
    getRootXPrivateKey(version = cryptocurrencies_1.Cardano.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getRootXPrivateKey(version, encoded);
    }
    /**
     * Returns the extended private key (xprv) for the current path.
     * Delegates to BIP32HD serialization logic.
     *
     * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string|null} Serialized extended private key
     */
    getXPrivateKey(version = cryptocurrencies_1.Cardano.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getXPrivateKey(version, encoded);
    }
    /**
     * Computes the Byron Legacy path key used for address generation.
     * @returns {string|null} Computed path key or null for non-Legacy types
     */
    getPathKey() {
        if (this.cardanoType === cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY) {
            return (0, utils_1.bytesToString)((0, crypto_1.pbkdf2HmacSha512)((0, utils_1.concatBytes)(this.rootPublicKey.getRawCompressed().slice(1), this.rootChainCode), 'address-hashing', 500, 32));
        }
        return null;
    }
    /**
     * Generates a Cardano address for the current public key and derivation path.
     * Handles Byron Legacy, Icarus, Ledger, and Shelley address types.
     *
     * @param options Address generation options
     * @param options.network Network string ('mainnet' or 'testnet', default: 'mainnet')
     * @param options.addressType Type of address (Payment, Staking, Reward, Public Key)
     * @param options.stakingPublicKey Required for Shelley Payment addresses
     * @returns {string} Encoded Cardano address
     * @throws {BaseError|AddressError} If address type is invalid or staking key is missing
     */
    getAddress(options = {
        network: 'mainnet'
    }) {
        if (this.cardanoType === cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY) {
            return addresses_1.CardanoAddress.encodeByronLegacy(this.publicKey, this.getPath(), this.getPathKey(), this.chainCode, options.addressType ?? cryptocurrencies_1.Cardano.ADDRESS_TYPES.PUBLIC_KEY);
        }
        else if ([cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS, cryptocurrencies_1.Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
            return addresses_1.CardanoAddress.encodeByronIcarus(this.publicKey, this.chainCode, options.addressType ?? cryptocurrencies_1.Cardano.ADDRESS_TYPES.PUBLIC_KEY);
        }
        else if ([cryptocurrencies_1.Cardano.TYPES.SHELLEY_ICARUS, cryptocurrencies_1.Cardano.TYPES.SHELLEY_LEDGER].includes(this.cardanoType)) {
            const addressType = options.addressType ?? cryptocurrencies_1.Cardano.ADDRESS_TYPES.PAYMENT;
            if (addressType === cryptocurrencies_1.Cardano.ADDRESS_TYPES.PAYMENT) {
                if (!options.stakingPublicKey) {
                    throw new exceptions_1.BaseError('stakingPublicKey is required for Payment address type');
                }
                return addresses_1.CardanoAddress.encodeShelley(this.publicKey, options.stakingPublicKey, options.network ?? 'mainnet');
            }
            else if ([cryptocurrencies_1.Cardano.ADDRESS_TYPES.STAKING, cryptocurrencies_1.Cardano.ADDRESS_TYPES.REWARD].includes(addressType)) {
                return addresses_1.CardanoAddress.encodeShelleyStaking(this.publicKey, options.network ?? 'mainnet');
            }
            throw new exceptions_1.AddressError(`Invalid ${this.cardanoType} address type`, {
                expected: [
                    cryptocurrencies_1.Cardano.ADDRESS_TYPES.PAYMENT,
                    cryptocurrencies_1.Cardano.ADDRESS_TYPES.STAKING,
                    cryptocurrencies_1.Cardano.ADDRESS_TYPES.REWARD
                ],
                got: addressType
            });
        }
        throw new exceptions_1.AddressError(`Invalid Cardano type`, {
            expected: cryptocurrencies_1.Cardano.TYPES.getCardanoTypes(), got: this.cardanoType
        });
    }
}
exports.CardanoHD = CardanoHD;
//# sourceMappingURL=cardano.js.map