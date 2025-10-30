// SPDX-License-Identifier: MIT
import { ECCError } from '../exceptions';
/**
 * Base class for Hierarchical Deterministic (HD) wallets.
 * Provides a common interface for key and address derivation across multiple blockchain protocols.
 */
export class HD {
    ecc;
    derivation;
    /**
     * Creates an instance of an HD wallet.
     * @param {HDOptionsInterface} [options={}] - Configuration options including ECC implementation.
     */
    constructor(options = {}) {
        if (!options.ecc) {
            throw new ECCError('Elliptic Curve Cryptography (ECC) is required');
        }
        this.ecc = options.ecc;
    }
    /**
     * Returns the name of the HD wallet implementation.
     * @returns {string} The HD wallet name.
     */
    static getName() {
        throw new Error('Must override getName()');
    }
    /**
     * Gets the name of the current HD wallet instance.
     * @returns {string} The name of the HD wallet.
     */
    getName() {
        return this.constructor.getName();
    }
    /**
     * Initializes the HD wallet from a seed.
     * @returns {this} The initialized HD instance.
     */
    fromSeed(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes the HD wallet from an extended private key.
     * @returns {this} The initialized HD instance.
     */
    fromXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes the HD wallet from an extended public key.
     * @returns {this} The initialized HD instance.
     */
    fromXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Loads HD wallet from a Wallet Import Format (WIF) string.
     * @param {string} wif - WIF string.
     * @returns {this} The initialized HD instance.
     */
    fromWIF(wif) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes HD wallet from a private key.
     * @param {string} privateKey - Private key string.
     * @returns {this} The initialized HD instance.
     */
    fromPrivateKey(privateKey) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes HD wallet from a spend private key.
     * @param {string} spendPrivateKey - Spend private key string.
     * @returns {this} The initialized HD instance.
     */
    fromSpendPrivateKey(spendPrivateKey) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes HD wallet from a public key.
     * @param {string} publicKey - Public key string.
     * @returns {this} The initialized HD instance.
     */
    fromPublicKey(publicKey) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes HD wallet from a view private key and spend public key.
     * @param {string} viewPrivateKey - View private key string.
     * @param {string} spendPublicKey - Spend public key string.
     * @returns {this} The initialized HD instance.
     */
    fromWatchOnly(viewPrivateKey, spendPublicKey) {
        throw new Error('Not implemented');
    }
    /**
     * Initializes HD wallet from a derivation object.
     * @param {Derivation} derivation - Derivation path or object.
     * @returns {this} The initialized HD instance.
     */
    fromDerivation(derivation) {
        throw new Error('Not implemented');
    }
    /**
     * Updates the wallet derivation.
     * @param {Derivation} derivation - New derivation object.
     * @returns {this} The updated HD instance.
     */
    updateDerivation(derivation) {
        throw new Error('Not implemented');
    }
    /**
     * Resets the current derivation state.
     * @returns {this} The HD instance with cleared derivation.
     */
    cleanDerivation() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the current derivation object.
     * @returns {Derivation} The derivation instance.
     */
    getDerivation() {
        return this.derivation;
    }
    /**
     * Returns the wallet seed.
     * @returns {string | null} The seed as a string or null if not available.
     */
    getSeed() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the wallet semantic identifier (if applicable).
     * @returns {string | null} The semantic or null.
     */
    getSemantic() {
        return null;
    }
    /**
     * Returns the root extended private key.
     * @returns {string | null} The root xprv.
     */
    getRootXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the root extended public key.
     * @returns {string | null} The root xpub.
     */
    getRootXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the master extended private key (alias of root).
     * @returns {string | null} The master xprv.
     */
    getMasterXPrivateKey(...args) {
        return this.getRootXPrivateKey(...args);
    }
    /**
     * Returns the master extended public key (alias of root).
     * @returns {string | null} The master xpub.
     */
    getMasterXPublicKey(...args) {
        return this.getRootXPublicKey(...args);
    }
    /**
     * Returns the root private key.
     * @returns {string | null} The private key or null.
     */
    getRootPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the root WIF key.
     * @returns {string | null} The WIF string or null.
     */
    getRootWIF(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the root chain code.
     * @returns {string | null} The chain code or null.
     */
    getRootChainCode() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the root public key.
     * @returns {string | null} The public key or null.
     */
    getRootPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the master private key.
     * @returns {string | null} The private key or null.
     */
    getMasterPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the master WIF.
     * @returns {string | null} The WIF string or null.
     */
    getMasterWIF(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the master chain code.
     * @returns {string | null} The chain code or null.
     */
    getMasterChainCode(...args) {
        return this.getRootChainCode();
    }
    /**
     * Returns the master public key.
     * @returns {string | null} The public key or null.
     */
    getMasterPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the derived extended private key.
     * @returns {string | null} The xprv key or null if unavailable.
     */
    getXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the derived extended public key.
     * @returns {string | null} The xpub key or null if unavailable.
     */
    getXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the derived private key.
     * @returns {string | null} The private key string or null.
     */
    getPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Indicates if strict derivation mode is enabled.
     * @returns {boolean | null} True if strict mode is on, otherwise null.
     */
    getStrict() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the spend private key (used in Monero-like systems).
     * @returns {string | null} The spend private key or null.
     */
    getSpendPrivateKey() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the view private key (used in Monero-like systems).
     * @returns {string} The view private key string.
     */
    getViewPrivateKey() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the Wallet Import Format (WIF) string.
     * @returns {string | null} The WIF key string or null.
     */
    getWIF(..._args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the WIF encoding type used.
     * @returns {any} The WIF type identifier.
     */
    getWIFType() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the chain code for key derivation.
     * @returns {any} The chain code object or value.
     */
    getChainCode() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the derived public key.
     * @returns {any} The public key instance or object.
     */
    getPublicKey(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the compressed public key representation.
     * @returns {string} The compressed public key.
     */
    getCompressed() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the uncompressed public key representation.
     * @returns {string} The uncompressed public key.
     */
    getUncompressed() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the spend public key (used in Monero-like systems).
     * @returns {string} The spend public key string.
     */
    getSpendPublicKey() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the view public key (used in Monero-like systems).
     * @returns {string} The view public key string.
     */
    getViewPublicKey() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the public key type or encoding.
     * @returns {string} The public key type (e.g., 'compressed', 'uncompressed').
     */
    getPublicKeyType() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the derivation or address mode (e.g., legacy, segwit).
     * @returns {string} The mode string.
     */
    getMode() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the hash of the derived public key or address.
     * @returns {string} The hash string.
     */
    getHash() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the fingerprint of the key or node.
     * @returns {string} The fingerprint string.
     */
    getFingerprint() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the parent node's fingerprint.
     * @returns {any} The parent fingerprint value.
     */
    getParentFingerprint() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the depth of the current derivation in the HD tree.
     * @returns {number} The derivation depth.
     */
    getDepth() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the full derivation path string.
     * @returns {string} The derivation path (e.g., "m/44'/0'/0'/0").
     */
    getPath() {
        throw new Error('Not implemented');
    }
    /**
     * Returns a key representation of the current derivation path.
     * @returns {string | null} The path key or null.
     */
    getPathKey() {
        return null;
    }
    /**
     * Returns the index of the current derivation level.
     * @returns {number} The derivation index.
     */
    getIndex() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the list of indexes used in the current derivation path.
     * @returns {number[]} An array of index values.
     */
    getIndexes() {
        throw new Error('Not implemented');
    }
    /**
     * Returns the integrated address (used in Monero for payment IDs).
     * @returns {string | null} The integrated address or null.
     */
    getIntegratedAddress(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the primary wallet address.
     * @returns {string} The main wallet address string.
     */
    getPrimaryAddress(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the sub-address for a given index or derivation.
     * @returns {string} The generated sub-address.
     */
    getSubAddress(...args) {
        throw new Error('Not implemented');
    }
    /**
     * Returns the general address derived from the current state.
     * @returns {string | null} The address string or null.
     */
    getAddress(...args) {
        throw new Error('Not implemented');
    }
}
//# sourceMappingURL=hd.js.map