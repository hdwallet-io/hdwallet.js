// SPDX-License-Identifier: MIT
import { HD } from '../hd';
import { ElectrumDerivation } from '../../derivations';
import { Bitcoin } from '../../cryptocurrencies';
import { SLIP10Secp256k1ECC, SLIP10Secp256k1PrivateKey, SLIP10Secp256k1PublicKey } from '../../eccs';
import { getBytes, bytesToString, bytesToInteger, integerToBytes, ensureTypeMatch, concatBytes } from '../../utils';
import { doubleSha256 } from '../../crypto';
import { WIF_TYPES, PUBLIC_KEY_TYPES } from '../../consts';
import { privateKeyToWIF, wifToPrivateKey } from '../../wif';
import { P2PKHAddress } from '../../addresses';
import { SeedError, DerivationError, PrivateKeyError, PublicKeyError, WIFError, BaseError } from '../../exceptions';
import { Seed } from '../../seeds';
/**
 * Implements Electrum V1 hierarchical deterministic (HD) wallet.
 * Provides methods to derive private/public keys, WIF, and P2PKH addresses
 * according to Electrum V1 derivation rules.
 *
 */
export class ElectrumV1HD extends HD {
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
        publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED
    }) {
        super({ ecc: SLIP10Secp256k1ECC, ...options });
        this.publicKeyType = options.publicKeyType ?? PUBLIC_KEY_TYPES.UNCOMPRESSED;
        if (this.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            this.wifType = WIF_TYPES.WIF;
        }
        else if (this.publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
            this.wifType = WIF_TYPES.WIF_COMPRESSED;
        }
        else {
            throw new BaseError('Invalid public key type', {
                expected: PUBLIC_KEY_TYPES.getTypes(), got: this.publicKeyType
            });
        }
        this.wifPrefix = options.wifPrefix ?? Bitcoin.NETWORKS.MAINNET.WIF_PREFIX;
        this.derivation = new ElectrumDerivation({
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
            this.seed = getBytes(seed instanceof Seed ? seed.getSeed() : seed);
            return this.fromPrivateKey(this.seed);
        }
        catch {
            throw new SeedError('Invalid seed data');
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
            this.masterPrivateKey = SLIP10Secp256k1PrivateKey.fromBytes(getBytes(key));
            this.masterPublicKey = this.masterPrivateKey.getPublicKey();
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new PrivateKeyError('Invalid private key data');
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
            throw new WIFError('WIF prefix is required');
        return this.fromPrivateKey(wifToPrivateKey(wif, this.wifPrefix));
    }
    /**
     * Initializes the wallet from a public key.
     * @param key Public key as Uint8Array or string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {PublicKeyError} If public key is invalid
     */
    fromPublicKey(key) {
        try {
            this.masterPublicKey = SLIP10Secp256k1PublicKey.fromBytes(getBytes(key));
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new PublicKeyError('Invalid public key error');
        }
    }
    /**
     * Sets the derivation path.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV1HD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation) {
        this.derivation = ensureTypeMatch(derivation, ElectrumDerivation, { errorClass: DerivationError });
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
        const sequence = doubleSha256(concatBytes(new TextEncoder().encode(`${addressIndex}:${changeIndex}:`), this.masterPublicKey.getRawUncompressed().slice(1)));
        if (this.masterPrivateKey) {
            const privateKeyInt = (bytesToInteger(this.masterPrivateKey.getRaw()) + bytesToInteger(sequence)) % SLIP10Secp256k1ECC.ORDER;
            this.privateKey = SLIP10Secp256k1PrivateKey.fromBytes(integerToBytes(privateKeyInt, SLIP10Secp256k1PrivateKey.getLength()));
            this.publicKey = this.privateKey.getPublicKey();
        }
        else {
            this.publicKey = SLIP10Secp256k1PublicKey.fromPoint(this.masterPublicKey.getPoint().add(SLIP10Secp256k1ECC.GENERATOR.multiply(bytesToInteger(sequence))));
        }
        return this;
    }
    /**
     * Returns raw seed as string.
     * @returns {string|null} Seed or null if not set
     */
    getSeed() {
        return this.seed ? bytesToString(this.seed) : null;
    }
    /**
     * Returns master private key as string.
     * @returns {string|null} Master private key
     */
    getMasterPrivateKey() {
        return this.masterPrivateKey ? bytesToString(this.masterPrivateKey.getRaw()) : null;
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
        return privateKeyToWIF(this.getMasterPrivateKey(), type, this.wifPrefix);
    }
    /**
     * Returns master public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Master public key string
     * @throws {BaseError} If public key type is invalid
     */
    getMasterPublicKey(publicKeyType = this.publicKeyType) {
        if (publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return bytesToString(this.masterPublicKey.getRawUncompressed());
        }
        else if (publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
            return bytesToString(this.masterPublicKey.getRawCompressed());
        }
        throw new BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(PUBLIC_KEY_TYPES), got: publicKeyType
        });
    }
    /**
     * Returns derived private key as string.
     * @returns {string|null} Derived private key
     */
    getPrivateKey() {
        return this.privateKey ? bytesToString(this.privateKey.getRaw()) : null;
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
        return privateKeyToWIF(this.getPrivateKey(), type, this.wifPrefix);
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
        if (publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return bytesToString(this.publicKey.getRawUncompressed());
        }
        else if (publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
            return bytesToString(this.publicKey.getRawCompressed());
        }
        throw new BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(PUBLIC_KEY_TYPES), got: publicKeyType
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
        return bytesToString(this.publicKey.getRawCompressed());
    }
    /**
     * Returns the derived public key in uncompressed format.
     * @returns {string} Uncompressed public key
     */
    getUncompressed() {
        return bytesToString(this.publicKey.getRawUncompressed());
    }
    /**
     * Generates P2PKH address from the derived public key.
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Network prefix for P2PKH address
     * @returns {string} Encoded P2PKH address
     */
    getAddress(options = {
        publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    }) {
        return P2PKHAddress.encode(this.publicKey, {
            publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
//# sourceMappingURL=v1.js.map