import { Derivation } from '../derivations';
import { HDOptionsInterface } from '../interfaces';
import { EllipticCurveCryptography } from '../eccs';
/**
 * Base class for Hierarchical Deterministic (HD) wallets.
 * Provides a common interface for key and address derivation across multiple blockchain protocols.
 */
export declare class HD {
    ecc: typeof EllipticCurveCryptography;
    derivation: any;
    /**
     * Creates an instance of an HD wallet.
     * @param {HDOptionsInterface} [options={}] - Configuration options including ECC implementation.
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of the HD wallet implementation.
     * @returns {string} The HD wallet name.
     */
    static getName(): string;
    /**
     * Gets the name of the current HD wallet instance.
     * @returns {string} The name of the HD wallet.
     */
    getName(): string;
    /**
     * Initializes the HD wallet from a seed.
     * @returns {this} The initialized HD instance.
     */
    fromSeed(...args: any[]): this;
    /**
     * Initializes the HD wallet from an extended private key.
     * @returns {this} The initialized HD instance.
     */
    fromXPrivateKey(...args: any[]): this;
    /**
     * Initializes the HD wallet from an extended public key.
     * @returns {this} The initialized HD instance.
     */
    fromXPublicKey(...args: any[]): this;
    /**
     * Loads HD wallet from a Wallet Import Format (WIF) string.
     * @param {string} wif - WIF string.
     * @returns {this} The initialized HD instance.
     */
    fromWIF(wif: string): this;
    /**
     * Initializes HD wallet from a private key.
     * @param {string} privateKey - Private key string.
     * @returns {this} The initialized HD instance.
     */
    fromPrivateKey(privateKey: string): this;
    /**
     * Initializes HD wallet from a spend private key.
     * @param {string} spendPrivateKey - Spend private key string.
     * @returns {this} The initialized HD instance.
     */
    fromSpendPrivateKey(spendPrivateKey: string): this;
    /**
     * Initializes HD wallet from a public key.
     * @param {string} publicKey - Public key string.
     * @returns {this} The initialized HD instance.
     */
    fromPublicKey(publicKey: string): this;
    /**
     * Initializes HD wallet from a view private key and spend public key.
     * @param {string} viewPrivateKey - View private key string.
     * @param {string} spendPublicKey - Spend public key string.
     * @returns {this} The initialized HD instance.
     */
    fromWatchOnly(viewPrivateKey: string, spendPublicKey: string): this;
    /**
     * Initializes HD wallet from a derivation object.
     * @param {Derivation} derivation - Derivation path or object.
     * @returns {this} The initialized HD instance.
     */
    fromDerivation(derivation: Derivation): this;
    /**
     * Updates the wallet derivation.
     * @param {Derivation} derivation - New derivation object.
     * @returns {this} The updated HD instance.
     */
    updateDerivation(derivation: Derivation): this;
    /**
     * Resets the current derivation state.
     * @returns {this} The HD instance with cleared derivation.
     */
    cleanDerivation(): this;
    /**
     * Returns the current derivation object.
     * @returns {Derivation} The derivation instance.
     */
    getDerivation(): Derivation;
    /**
     * Returns the wallet seed.
     * @returns {string | null} The seed as a string or null if not available.
     */
    getSeed(): string | null;
    /**
     * Returns the wallet semantic identifier (if applicable).
     * @returns {string | null} The semantic or null.
     */
    getSemantic(): string | null;
    /**
     * Returns the root extended private key.
     * @returns {string | null} The root xprv.
     */
    getRootXPrivateKey(...args: any[]): string | null;
    /**
     * Returns the root extended public key.
     * @returns {string | null} The root xpub.
     */
    getRootXPublicKey(...args: any[]): string | null;
    /**
     * Returns the master extended private key (alias of root).
     * @returns {string | null} The master xprv.
     */
    getMasterXPrivateKey(...args: any[]): string | null;
    /**
     * Returns the master extended public key (alias of root).
     * @returns {string | null} The master xpub.
     */
    getMasterXPublicKey(...args: any[]): string | null;
    /**
     * Returns the root private key.
     * @returns {string | null} The private key or null.
     */
    getRootPrivateKey(...args: any[]): string | null;
    /**
     * Returns the root WIF key.
     * @returns {string | null} The WIF string or null.
     */
    getRootWIF(...args: any[]): string | null;
    /**
     * Returns the root chain code.
     * @returns {string | null} The chain code or null.
     */
    getRootChainCode(): string | null;
    /**
     * Returns the root public key.
     * @returns {string | null} The public key or null.
     */
    getRootPublicKey(...args: any[]): string | null;
    /**
     * Returns the master private key.
     * @returns {string | null} The private key or null.
     */
    getMasterPrivateKey(...args: any[]): string | null;
    /**
     * Returns the master WIF.
     * @returns {string | null} The WIF string or null.
     */
    getMasterWIF(...args: any[]): string | null;
    /**
     * Returns the master chain code.
     * @returns {string | null} The chain code or null.
     */
    getMasterChainCode(...args: any[]): string | null;
    /**
     * Returns the master public key.
     * @returns {string | null} The public key or null.
     */
    getMasterPublicKey(...args: any[]): string | null;
    /**
     * Returns the derived extended private key.
     * @returns {string | null} The xprv key or null if unavailable.
     */
    getXPrivateKey(...args: any[]): string | null;
    /**
     * Returns the derived extended public key.
     * @returns {string | null} The xpub key or null if unavailable.
     */
    getXPublicKey(...args: any[]): string | null;
    /**
     * Returns the derived private key.
     * @returns {string | null} The private key string or null.
     */
    getPrivateKey(...args: any[]): string | null;
    /**
     * Indicates if strict derivation mode is enabled.
     * @returns {boolean | null} True if strict mode is on, otherwise null.
     */
    getStrict(): boolean | null;
    /**
     * Returns the spend private key (used in Monero-like systems).
     * @returns {string | null} The spend private key or null.
     */
    getSpendPrivateKey(): string | null;
    /**
     * Returns the view private key (used in Monero-like systems).
     * @returns {string} The view private key string.
     */
    getViewPrivateKey(): string;
    /**
     * Returns the Wallet Import Format (WIF) string.
     * @returns {string | null} The WIF key string or null.
     */
    getWIF(..._args: any[]): string | null;
    /**
     * Returns the WIF encoding type used.
     * @returns {any} The WIF type identifier.
     */
    getWIFType(): any;
    /**
     * Returns the chain code for key derivation.
     * @returns {any} The chain code object or value.
     */
    getChainCode(): any;
    /**
     * Returns the derived public key.
     * @returns {any} The public key instance or object.
     */
    getPublicKey(...args: any[]): any;
    /**
     * Returns the compressed public key representation.
     * @returns {string} The compressed public key.
     */
    getCompressed(): string;
    /**
     * Returns the uncompressed public key representation.
     * @returns {string} The uncompressed public key.
     */
    getUncompressed(): string;
    /**
     * Returns the spend public key (used in Monero-like systems).
     * @returns {string} The spend public key string.
     */
    getSpendPublicKey(): string;
    /**
     * Returns the view public key (used in Monero-like systems).
     * @returns {string} The view public key string.
     */
    getViewPublicKey(): string;
    /**
     * Returns the public key type or encoding.
     * @returns {string} The public key type (e.g., 'compressed', 'uncompressed').
     */
    getPublicKeyType(): string;
    /**
     * Returns the derivation or address mode (e.g., legacy, segwit).
     * @returns {string} The mode string.
     */
    getMode(): string;
    /**
     * Returns the hash of the derived public key or address.
     * @returns {string} The hash string.
     */
    getHash(): string;
    /**
     * Returns the fingerprint of the key or node.
     * @returns {string} The fingerprint string.
     */
    getFingerprint(): string;
    /**
     * Returns the parent node's fingerprint.
     * @returns {any} The parent fingerprint value.
     */
    getParentFingerprint(): any;
    /**
     * Returns the depth of the current derivation in the HD tree.
     * @returns {number} The derivation depth.
     */
    getDepth(): number;
    /**
     * Returns the full derivation path string.
     * @returns {string} The derivation path (e.g., "m/44'/0'/0'/0").
     */
    getPath(): string;
    /**
     * Returns a key representation of the current derivation path.
     * @returns {string | null} The path key or null.
     */
    getPathKey(): string | null;
    /**
     * Returns the index of the current derivation level.
     * @returns {number} The derivation index.
     */
    getIndex(): number;
    /**
     * Returns the list of indexes used in the current derivation path.
     * @returns {number[]} An array of index values.
     */
    getIndexes(): number[];
    /**
     * Returns the integrated address (used in Monero for payment IDs).
     * @returns {string | null} The integrated address or null.
     */
    getIntegratedAddress(...args: any[]): string | null;
    /**
     * Returns the primary wallet address.
     * @returns {string} The main wallet address string.
     */
    getPrimaryAddress(...args: any[]): string;
    /**
     * Returns the sub-address for a given index or derivation.
     * @returns {string} The generated sub-address.
     */
    getSubAddress(...args: any[]): string;
    /**
     * Returns the general address derived from the current state.
     * @returns {string | null} The address string or null.
     */
    getAddress(...args: any[]): string | null;
}
//# sourceMappingURL=hd.d.ts.map