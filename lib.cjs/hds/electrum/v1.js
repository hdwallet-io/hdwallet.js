"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV1HD = void 0;
const hd_1 = require("../hd");
const derivations_1 = require("../../derivations");
const cryptocurrencies_1 = require("../../cryptocurrencies");
const eccs_1 = require("../../eccs");
const utils_1 = require("../../utils");
const crypto_1 = require("../../crypto");
const consts_1 = require("../../consts");
const wif_1 = require("../../wif");
const addresses_1 = require("../../addresses");
const exceptions_1 = require("../../exceptions");
const seeds_1 = require("../../seeds");
/**
 * Implements Electrum V1 hierarchical deterministic (HD) wallet.
 * Provides methods to derive private/public keys, WIF, and P2PKH addresses
 * according to Electrum V1 derivation rules.
 *
 */
class ElectrumV1HD extends hd_1.HD {
    seed;
    masterPrivateKey;
    masterPublicKey;
    privateKey;
    publicKey;
    publicKeyType;
    wifType;
    wifPrefix;
    /**
     * Constructs a new ElectrumV1HD instance.
     * @param options Configuration options
     * @param options.publicKeyType Type of public key ('compressed' or 'uncompressed')
     * @param options.wifPrefix Optional WIF prefix for Bitcoin network
     * @param options.change Optional derivation change index
     * @param options.address Optional derivation address index
     * @throws {BaseError} If public key type is invalid
     */
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
    }) {
        super({ ecc: eccs_1.SLIP10Secp256k1ECC, ...options });
        this.publicKeyType = options.publicKeyType ?? consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED;
        if (this.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            this.wifType = consts_1.WIF_TYPES.WIF;
        }
        else if (this.publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            this.wifType = consts_1.WIF_TYPES.WIF_COMPRESSED;
        }
        else {
            throw new exceptions_1.BaseError('Invalid public key type', {
                expected: consts_1.PUBLIC_KEY_TYPES.getTypes(), got: this.publicKeyType
            });
        }
        this.wifPrefix = options.wifPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WIF_PREFIX;
        this.derivation = new derivations_1.ElectrumDerivation({
            change: options.change, address: options.address
        });
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Electrum-V1'
     */
    static getName() {
        return 'Electrum-V1';
    }
    /**
     * Initializes the wallet from a seed.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current ElectrumV1HD instance
     * @throws {SeedError} If seed is invalid
     */
    fromSeed(seed) {
        try {
            this.seed = (0, utils_1.getBytes)(seed instanceof seeds_1.Seed ? seed.getSeed() : seed);
            return this.fromPrivateKey(this.seed);
        }
        catch {
            throw new exceptions_1.SeedError('Invalid seed data');
        }
    }
    /**
     * Initializes the wallet from a raw private key.
     * @param key Private key as Uint8Array or string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {PrivateKeyError} If private key is invalid
     */
    fromPrivateKey(key) {
        try {
            this.masterPrivateKey = eccs_1.SLIP10Secp256k1PrivateKey.fromBytes((0, utils_1.getBytes)(key));
            this.masterPublicKey = this.masterPrivateKey.getPublicKey();
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    /**
     * Initializes the wallet from a WIF string.
     * @param wif Wallet Import Format string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {WIFError} If WIF prefix is missing or WIF is invalid
     */
    fromWIF(wif) {
        if (this.wifPrefix == null)
            throw new exceptions_1.WIFError('WIF prefix is required');
        return this.fromPrivateKey((0, wif_1.wifToPrivateKey)(wif, this.wifPrefix));
    }
    /**
     * Initializes the wallet from a public key.
     * @param key Public key as Uint8Array or string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {PublicKeyError} If public key is invalid
     */
    fromPublicKey(key) {
        try {
            this.masterPublicKey = eccs_1.SLIP10Secp256k1PublicKey.fromBytes((0, utils_1.getBytes)(key));
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new exceptions_1.PublicKeyError('Invalid public key error');
        }
    }
    /**
     * Sets the derivation path.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV1HD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation) {
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.ElectrumDerivation, { errorClass: exceptions_1.DerivationError });
        this.drive(derivation.getChange(), derivation.getAddress());
        return this;
    }
    /**
     * Updates derivation path by cleaning previous derivation state.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV1HD instance
     */
    updateDerivation(derivation) {
        this.cleanDerivation();
        return this.fromDerivation(derivation);
    }
    /**
     * Resets derivation path to initial state.
     * @returns {this} Current ElectrumV1HD instance
     */
    cleanDerivation() {
        this.derivation.clean();
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Derives child private/public key for the specified change and address index.
     * @param changeIndex Change index
     * @param addressIndex Address index
     * @returns {this} Current ElectrumV1HD instance
     */
    drive(changeIndex, addressIndex) {
        const sequence = (0, crypto_1.doubleSha256)((0, utils_1.concatBytes)(new TextEncoder().encode(`${addressIndex}:${changeIndex}:`), this.masterPublicKey.getRawUncompressed().slice(1)));
        if (this.masterPrivateKey) {
            const privateKeyInt = ((0, utils_1.bytesToInteger)(this.masterPrivateKey.getRaw()) + (0, utils_1.bytesToInteger)(sequence)) % eccs_1.SLIP10Secp256k1ECC.ORDER;
            this.privateKey = eccs_1.SLIP10Secp256k1PrivateKey.fromBytes((0, utils_1.integerToBytes)(privateKeyInt, eccs_1.SLIP10Secp256k1PrivateKey.getLength()));
            this.publicKey = this.privateKey.getPublicKey();
        }
        else {
            this.publicKey = eccs_1.SLIP10Secp256k1PublicKey.fromPoint(this.masterPublicKey.getPoint().add(eccs_1.SLIP10Secp256k1ECC.GENERATOR.multiply((0, utils_1.bytesToInteger)(sequence))));
        }
        return this;
    }
    /**
     * Returns raw seed as string.
     * @returns {string|null} Seed or null if not set
     */
    getSeed() {
        return this.seed ? (0, utils_1.bytesToString)(this.seed) : null;
    }
    /**
     * Returns master private key as string.
     * @returns {string|null} Master private key
     */
    getMasterPrivateKey() {
        return this.masterPrivateKey ? (0, utils_1.bytesToString)(this.masterPrivateKey.getRaw()) : null;
    }
    /**
     * Returns master private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getMasterWIF(wifType) {
        if (!this.masterPrivateKey || this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getMasterPrivateKey(), type, this.wifPrefix);
    }
    /**
     * Returns master public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Master public key string
     * @throws {BaseError} If public key type is invalid
     */
    getMasterPublicKey(publicKeyType = this.publicKeyType) {
        if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return (0, utils_1.bytesToString)(this.masterPublicKey.getRawUncompressed());
        }
        else if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            return (0, utils_1.bytesToString)(this.masterPublicKey.getRawCompressed());
        }
        throw new exceptions_1.BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(consts_1.PUBLIC_KEY_TYPES), got: publicKeyType
        });
    }
    /**
     * Returns derived private key as string.
     * @returns {string|null} Derived private key
     */
    getPrivateKey() {
        return this.privateKey ? (0, utils_1.bytesToString)(this.privateKey.getRaw()) : null;
    }
    /**
     * Returns derived private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getWIF(wifType) {
        if (!this.privateKey || this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getPrivateKey(), type, this.wifPrefix);
    }
    /**
     * Returns the WIF type used by this instance.
     * @returns {string} WIF type string
     */
    getWIFType() {
        return this.wifType;
    }
    /**
     * Returns derived public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Public key string
     * @throws {BaseError} If public key type is invalid
     */
    getPublicKey(publicKeyType = this.publicKeyType) {
        if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return (0, utils_1.bytesToString)(this.publicKey.getRawUncompressed());
        }
        else if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            return (0, utils_1.bytesToString)(this.publicKey.getRawCompressed());
        }
        throw new exceptions_1.BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(consts_1.PUBLIC_KEY_TYPES), got: publicKeyType
        });
    }
    /**
     * Returns public key type used by this instance.
     * @returns {string} Public key type string
     */
    getPublicKeyType() {
        return this.publicKeyType;
    }
    /**
     * Returns the derived public key in compressed format.
     * @returns {string} Compressed public key
     */
    getCompressed() {
        return (0, utils_1.bytesToString)(this.publicKey.getRawCompressed());
    }
    /**
     * Returns the derived public key in uncompressed format.
     * @returns {string} Uncompressed public key
     */
    getUncompressed() {
        return (0, utils_1.bytesToString)(this.publicKey.getRawUncompressed());
    }
    /**
     * Generates P2PKH address from the derived public key.
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Network prefix for P2PKH address
     * @returns {string} Encoded P2PKH address
     */
    getAddress(options = {
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    }) {
        return addresses_1.P2PKHAddress.encode(this.publicKey, {
            publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.ElectrumV1HD = ElectrumV1HD;
//# sourceMappingURL=v1.js.map