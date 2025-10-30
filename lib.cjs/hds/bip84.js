"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP84HD = void 0;
const derivations_1 = require("../derivations");
const cryptocurrencies_1 = require("../cryptocurrencies");
const addresses_1 = require("../addresses");
const bip44_1 = require("./bip44");
const consts_1 = require("../consts");
const keys_1 = require("../keys");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * Implements the BIP84 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support native SegWit P2WPKH addresses.
 * Provides methods to derive keys, generate extended keys, and encode addresses according to BIP84.
 *
 */
class BIP84HD extends bip44_1.BIP44HD {
    /**
     * Create a new BIP84HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     * @param options.publicKeyType Type of public key (compressed/uncompressed)
     * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
     * @param options.account Account index (default: 0)
     * @param options.change Change chain (0: external, 1: internal, default: external)
     * @param options.address Address index (default: 0)
     */
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? cryptocurrencies_1.Bitcoin.COIN_TYPE;
        this.derivation = new derivations_1.BIP84Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? derivations_1.CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP84'
     */
    static getName() {
        return 'BIP84';
    }
    /**
     * Apply a full BIP84 derivation path to the HD instance.
     * @param derivation BIP84Derivation instance
     * @returns {this} Current BIP84HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP84Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    /**
     * Get the root extended private key (xprv) for BIP84 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    /**
     * Get the root extended public key (xpub) for BIP84 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH, encoded = true) {
        if (!this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Generate a native SegWit P2WPKH address from the current public key.
     * @param options Address generation options
     * @param options.hrp Human-readable part of Bech32 address (default: Bitcoin mainnet HRP)
     * @param options.witnessVersion Witness version for SegWit (default: P2WPKH)
     * @returns {string} Encoded P2WPKH address
     */
    getAddress(options = {
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        return addresses_1.P2WPKHAddress.encode(this.publicKey, {
            hrp: options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
            witnessVersion: options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.BIP84HD = BIP84HD;
//# sourceMappingURL=bip84.js.map