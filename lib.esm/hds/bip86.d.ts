import { BIP86Derivation } from '../derivations';
import { BIP44HD } from './bip44';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
/**
 * Implements the BIP86 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support Taproot (P2TR) addresses.
 * Provides methods for key derivation, extended key generation, and Taproot address encoding.
 *
 */
export declare class BIP86HD extends BIP44HD {
    /**
     * Create a new BIP86HD instance with optional configuration.
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
     * @returns {string} 'BIP86'
     */
    static getName(): string;
    /**
     * Apply a full BIP86 derivation path to the HD instance.
     * @param derivation BIP86Derivation instance
     * @returns {this} Current BIP86HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation: BIP86Derivation): this;
    /**
     * Get the root extended private key (xprv) for BIP86 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the root extended public key (xpub) for BIP86 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Generate a Taproot (P2TR) address from the current public key.
     * @param options Address generation options
     * @param options.hrp Human-readable part of Bech32 address (default: Bitcoin mainnet HRP)
     * @param options.witnessVersion Witness version for Taproot (default: P2TR)
     * @returns {string} Encoded P2TR address
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip86.d.ts.map