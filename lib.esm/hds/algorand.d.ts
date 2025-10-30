import { Seed } from '../seeds';
import { BIP32HD } from './bip32';
/**
 * Hierarchical Deterministic (HD) wallet implementation for the **Algorand** blockchain.
 *
 * Extends the base class but uses the **KholawEd25519ECC** curve and Algorand-specific
 * key derivation logic. Implements a variant of SLIP-0010 style derivation with additional clamping
 * and key validation for the Ed25519 curve used by Algorand.
 *
 */
export declare class AlgorandHD extends BIP32HD {
    constructor();
    /**
     * Returns the human-readable name of this HD scheme.
     *
     * @returns {string} The name `"Algorand"`.
     */
    static getName(): string;
    /**
     * Initializes this HD wallet instance from a given seed.
     *
     * @param {string | Uint8Array | Seed} seed - The input seed (hex string, byte array, or Seed instance).
     * @throws {SeedError} If the seed length is less than 16 bytes.
     * @returns {this} The initialized AlgorandHD instance.
     */
    fromSeed(seed: string | Uint8Array | Seed): this;
    /**
     * Derives a child key at the given index according to Algorand's modified SLIP-0010 algorithm.
     *
     * Supports both hardened and non-hardened derivation.
     *
     * @param {number} index - The index of the child key to derive.
     * @throws {DerivationError} If the chain code or required keys are not set or derivation fails.
     * @returns {this} The derived child HD instance.
     */
    drive(index: number): this;
    /**
     * Returns the root extended private key (xprv) encoded using Algorand's version bytes.
     *
     * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
     *   The version prefix to use for encoding.
     * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
     * @returns {string | null} The root xprv or `null` if unavailable.
     */
    getRootXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Returns the current extended private key (xprv) of the HD node.
     *
     * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
     *   The version prefix to use for encoding.
     * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
     * @returns {string | null} The xprv string or `null` if not set.
     */
    getXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    /**
     * Derives and returns the Algorand address associated with the current public key.
     *
     * @returns {string} The encoded Algorand address.
     */
    getAddress(): string;
}
//# sourceMappingURL=algorand.d.ts.map