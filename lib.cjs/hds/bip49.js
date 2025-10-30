"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP49HD = void 0;
const derivations_1 = require("../derivations");
const cryptocurrencies_1 = require("../cryptocurrencies");
const addresses_1 = require("../addresses");
const bip44_1 = require("./bip44");
const consts_1 = require("../consts");
const keys_1 = require("../keys");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * Implements the BIP49 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support P2WPKH-in-P2SH addresses (SegWit wrapped in P2SH).
 * Provides methods to derive keys, generate extended keys, and encode addresses according to BIP49.
 *
 */
class BIP49HD extends bip44_1.BIP44HD {
    /**
     * Create a new BIP49HD instance with optional configuration.
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
        this.derivation = new derivations_1.BIP49Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? derivations_1.CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP49'
     */
    static getName() {
        return 'BIP49';
    }
    /**
     * Apply a full BIP49 derivation path to the HD instance.
     * @param derivation BIP49Derivation instance
     * @returns {this} Current BIP49HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP49Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    /**
     * Get the root extended private key (xprv) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    /**
     * Get the root extended public key (xpub) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Generate a P2WPKH-in-P2SH address from the current public key.
     * @param options Address generation options
     * @param options.scriptAddressPrefix Prefix for the P2SH script address (default: Bitcoin mainnet)
     * @returns {string} Encoded P2WPKH-in-P2SH address
     */
    getAddress(options = {
        scriptAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    }) {
        return addresses_1.P2WPKHInP2SHAddress.encode(this.publicKey, {
            scriptAddressPrefix: options.scriptAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.BIP49HD = BIP49HD;
//# sourceMappingURL=bip49.js.map