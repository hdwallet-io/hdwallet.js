"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV2HD = void 0;
const hd_1 = require("../hd");
const derivations_1 = require("../../derivations");
const consts_1 = require("../../consts");
const addresses_1 = require("../../addresses");
const wif_1 = require("../../wif");
const cryptocurrencies_1 = require("../../cryptocurrencies");
const bip32_1 = require("../bip32");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
const eccs_1 = require("../../eccs");
/**
 * Electrum V2 hierarchical deterministic (HD) wallet.
 * Supports standard (P2PKH) and SegWit (P2WPKH) modes.
 * Wraps a BIP32HD instance and provides Electrum-specific derivation logic.
 *
 */
class ElectrumV2HD extends hd_1.HD {
    mode;
    wifType;
    publicKeyType;
    wifPrefix;
    bip32HD;
    /**
     * Constructs a new ElectrumV2HD instance.
     * @param options Configuration options
     * @param options.publicKeyType Type of public key ('compressed' or 'uncompressed')
     * @param options.mode Wallet mode ('standard' or 'segwit')
     * @param options.wifPrefix Optional WIF prefix
     * @param options.change Optional derivation change index
     * @param options.address Optional derivation address index
     * @throws {BaseError} If mode or public key type is invalid
     */
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED,
        mode: consts_1.MODES.STANDARD
    }) {
        super({ ecc: eccs_1.SLIP10Secp256k1ECC, ...options });
        this.mode = options.mode ?? consts_1.MODES.STANDARD;
        if (!consts_1.MODES.getTypes().includes(this.mode)) {
            throw new exceptions_1.BaseError(`Invalid ${this.getName()} mode`, {
                expected: consts_1.MODES.getTypes(),
                got: this.mode
            });
        }
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
        this.bip32HD = new bip32_1.BIP32HD({
            ecc: cryptocurrencies_1.Bitcoin.ECC, publicKeyType: this.publicKeyType
        });
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Electrum-V2'
     */
    static getName() {
        return 'Electrum-V2';
    }
    /**
     * Initializes wallet from a seed.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current ElectrumV2HD instance
     */
    fromSeed(seed) {
        this.bip32HD.fromSeed(seed);
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Sets the derivation path.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV2HD instance
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
     * @returns {this} Current ElectrumV2HD instance
     */
    updateDerivation(derivation) {
        this.cleanDerivation();
        return this.fromDerivation(derivation);
    }
    /**
     * Resets derivation path to initial state.
     * @returns {this} Current ElectrumV2HD instance
     */
    cleanDerivation() {
        this.derivation.clean();
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Derives child keys for given change and address indices.
     * Uses custom Electrum V2 derivation logic.
     * @param changeIndex Change index
     * @param addressIndex Address index
     * @returns {this} Current ElectrumV2HD instance
     */
    drive(changeIndex, addressIndex) {
        const custom = new derivations_1.CustomDerivation();
        if (this.mode === consts_1.MODES.SEGWIT) {
            custom.fromIndex(0, true); // Hardened
        }
        custom.fromIndex(changeIndex);
        custom.fromIndex(addressIndex);
        this.bip32HD.updateDerivation(custom);
        return this;
    }
    /**
     * Returns the current wallet mode ('standard' or 'segwit').
     * @returns {string} Mode string
     */
    getMode() {
        return this.mode;
    }
    /**
     * Returns the raw seed as string.
     * @returns {string|null} Seed or null if not set
     */
    getSeed() {
        return this.bip32HD.getSeed();
    }
    /**
     * Returns master private key as string.
     * @returns {string|null} Master private key
     */
    getMasterPrivateKey() {
        return this.bip32HD.getRootPrivateKey();
    }
    /**
     * Returns master private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getMasterWIF(wifType) {
        if (this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getMasterPrivateKey(), type, this.wifPrefix);
    }
    /**
     * Returns master public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Master public key
     */
    getMasterPublicKey(publicKeyType) {
        return this.bip32HD.getRootPublicKey(publicKeyType ?? this.publicKeyType);
    }
    /**
     * Returns derived private key as string.
     * @returns {string|null} Derived private key
     */
    getPrivateKey() {
        return this.bip32HD.getPrivateKey();
    }
    /**
     * Returns derived private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getWIF(wifType) {
        if (this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getPrivateKey(), type, this.wifPrefix);
    }
    /**
     * Returns the WIF type used by this instance.
     * @returns {string} WIF type
     */
    getWIFType() {
        return this.wifType;
    }
    /**
     * Returns derived public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Public key string
     */
    getPublicKey(publicKeyType) {
        return this.bip32HD.getPublicKey(publicKeyType ?? this.publicKeyType);
    }
    /**
     * Returns public key type used by this instance.
     * @returns {string} Public key type string
     */
    getPublicKeyType() {
        return this.publicKeyType;
    }
    /**
     * Returns derived public key in uncompressed format.
     * @returns {string} Uncompressed public key
     */
    getUncompressed() {
        return this.bip32HD.getUncompressed();
    }
    /**
     * Returns derived public key in compressed format.
     * @returns {string} Compressed public key
     */
    getCompressed() {
        return this.bip32HD.getCompressed();
    }
    /**
     * Generates an address based on the current mode.
     * - Standard mode → P2PKH
     * - SegWit mode → P2WPKH
     *
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Prefix for P2PKH address (standard mode)
     * @param options.hrp Human-readable part for Bech32 address (SegWit mode)
     * @param options.witnessVersion Witness version for SegWit address
     * @returns {string} Encoded Bitcoin address
     * @throws {AddressError} If mode is invalid
     */
    getAddress(options = {
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        if (this.mode === consts_1.MODES.STANDARD) {
            return addresses_1.P2PKHAddress.encode(this.getPublicKey(), {
                publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
                publicKeyType: this.publicKeyType
            });
        }
        else if (this.mode === consts_1.MODES.SEGWIT) {
            return addresses_1.P2WPKHAddress.encode(this.getPublicKey(), {
                hrp: options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
                witnessVersion: options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
                publicKeyType: this.publicKeyType
            });
        }
        throw new exceptions_1.AddressError(`Invalid ${this.getName()} mode`, {
            expected: consts_1.MODES.getTypes(), got: this.mode
        });
    }
}
exports.ElectrumV2HD = ElectrumV2HD;
//# sourceMappingURL=v2.js.map