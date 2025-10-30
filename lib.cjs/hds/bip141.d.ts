import { BIP141HDSemanticOptionsInterface, HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { BIP32HD } from './bip32';
/**
 * Implements BIP141 hierarchical deterministic wallet functionality.
 */
export declare class BIP141HD extends BIP32HD {
    protected address: string;
    protected xprivateKeyVersion: number | Uint8Array;
    protected xpublicKeyVersion: number | Uint8Array;
    protected semantic: string;
    /**
     * Creates a new BIP141HD instance with semantic validation.
     * @param {HDOptionsInterface} [options={publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED}] - The HD wallet configuration options.
     * @throws {SemanticError} If semantic type is missing.
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the BIP standard name.
     * @returns {string} The name "BIP141".
     */
    static getName(): string;
    /**
     * Retrieves the semantic type of the HD wallet.
     * @returns {string} The semantic type.
     */
    getSemantic(): string;
    /**
     * Initializes the HD wallet based on semantic type.
     * @param {string} semantic - The semantic standard type (e.g., P2WPKH, P2WSH).
     * @param {BIP141HDSemanticOptionsInterface} [options={}] - Optional BIP141-specific configuration.
     * @returns {this} The initialized BIP141HD instance.
     * @throws {SemanticError} If the semantic type is invalid.
     */
    fromSemantic(semantic: string, options?: BIP141HDSemanticOptionsInterface): this;
    /**
     * Returns the root extended private key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The root extended private key or null.
     */
    getRootXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Returns the root extended public key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The root extended public key or null.
     */
    getRootXPublicKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Returns the derived extended private key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The derived extended private key or null.
     */
    getXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Returns the derived extended public key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The derived extended public key or null.
     */
    getXPublicKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Encodes and returns the wallet address based on the selected semantic type.
     * @param {HDAddressOptionsInterface} [options] - Address generation options such as prefix, HRP, and witness version.
     * @returns {string} The encoded Bitcoin SegWit address.
     * @throws {AddressError} If the address type is invalid.
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip141.d.ts.map