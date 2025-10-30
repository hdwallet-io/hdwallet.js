import { BIP84Derivation } from '../derivations';
import { BIP44HD } from './bip44';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
/**
 * Implements the BIP84 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support native SegWit P2WPKH addresses.
 * Provides methods to derive keys, generate extended keys, and encode addresses according to BIP84.
 *
 */
export declare class BIP84HD extends BIP44HD {
    /**
     * Create a new BIP84HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     * @param options.publicKeyType Type of public key (compressed/uncompressed)
     * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
     * @param options.account Account index (default: 0)
     * @param options.change Change chain (0: external, 1: internal, default: external)
     * @param options.address Address index (default: 0)
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP84'
     */
    static getName(): string;
    /**
     * Apply a full BIP84 derivation path to the HD instance.
     * @param derivation BIP84Derivation instance
     * @returns {this} Current BIP84HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation: BIP84Derivation): this;
    /**
     * Get the root extended private key (xprv) for BIP84 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the root extended public key (xpub) for BIP84 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Generate a native SegWit P2WPKH address from the current public key.
     * @param options Address generation options
     * @param options.hrp Human-readable part of Bech32 address (default: Bitcoin mainnet HRP)
     * @param options.witnessVersion Witness version for SegWit (default: P2WPKH)
     * @returns {string} Encoded P2WPKH address
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip84.d.ts.map