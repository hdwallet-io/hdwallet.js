import { BIP49Derivation } from '../derivations';
import { BIP44HD } from './bip44';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
/**
 * Implements the BIP49 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support P2WPKH-in-P2SH addresses (SegWit wrapped in P2SH).
 * Provides methods to derive keys, generate extended keys, and encode addresses according to BIP49.
 *
 */
export declare class BIP49HD extends BIP44HD {
    /**
     * Create a new BIP49HD instance with optional configuration.
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
     * @returns {string} 'BIP49'
     */
    static getName(): string;
    /**
     * Apply a full BIP49 derivation path to the HD instance.
     * @param derivation BIP49Derivation instance
     * @returns {this} Current BIP49HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation: BIP49Derivation): this;
    /**
     * Get the root extended private key (xprv) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the root extended public key (xpub) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Generate a P2WPKH-in-P2SH address from the current public key.
     * @param options Address generation options
     * @param options.scriptAddressPrefix Prefix for the P2SH script address (default: Bitcoin mainnet)
     * @returns {string} Encoded P2WPKH-in-P2SH address
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip49.d.ts.map