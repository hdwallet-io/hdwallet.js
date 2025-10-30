import { BIP32HD } from './bip32';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { Seed } from '../seeds';
/**
 * Implements hierarchical deterministic (HD) wallet logic for Cardano.
 * Supports multiple Cardano derivation types including Byron Legacy, Icarus, Shelley, and Ledger.
 * Provides methods to derive keys, addresses, and extended keys according to Cardano standards.
 *
 */
export declare class CardanoHD extends BIP32HD {
    protected cardanoType: string;
    /**
     * Creates a new CardanoHD instance.
     * @param options Configuration options for Cardano HD wallet
     * @param options.publicKeyType Type of public key (default: compressed)
     * @param options.cardanoType Cardano derivation type (required)
     * @throws {BaseError} If an invalid Cardano type is provided
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Cardano'
     */
    static getName(): string;
    /**
     * Initializes the HD wallet from a seed.
     * Handles different derivation types and Cardano-specific tweaks.
     *
     * @param seed Seed value as string or Seed instance
     * @param passphrase Optional passphrase for certain derivation types
     * @returns {this} Current CardanoHD instance
     * @throws {SeedError|BaseError} If seed data or length is invalid
     */
    fromSeed(seed: string | Seed, passphrase?: string): this;
    /**
     * Sets the HD wallet from a private key (only supported for Shelley types).
     * @param privateKey Private key as string
     * @returns {this} Current CardanoHD instance
     * @throws {BaseError|PrivateKeyError} If private key is unsupported or invalid
     */
    fromPrivateKey(privateKey: string): this;
    /**
     * Sets the HD wallet from a public key (only supported for Shelley types).
     * @param publicKey Public key as string
     * @returns {this} Current CardanoHD instance
     * @throws {BaseError|PublicKeyError} If public key is unsupported or invalid
     */
    fromPublicKey(publicKey: string): this;
    /**
     * Derives a child key at the given index according to Cardano derivation rules.
     * Supports hardened and non-hardened derivation.
     *
     * @param index Child index to derive
     * @returns {this} Current CardanoHD instance with updated keys
     * @throws {BaseError|DerivationError} If derivation fails
     */
    drive(index: number): this;
    /**
     * Returns the root extended private key (xprv) for the current derivation.
     * Delegates to BIP32HD serialization logic.
     *
     * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string|null} Serialized root extended private key
     */
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Returns the extended private key (xprv) for the current path.
     * Delegates to BIP32HD serialization logic.
     *
     * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string|null} Serialized extended private key
     */
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    /**
     * Computes the Byron Legacy path key used for address generation.
     * @returns {string|null} Computed path key or null for non-Legacy types
     */
    getPathKey(): string | null;
    /**
     * Generates a Cardano address for the current public key and derivation path.
     * Handles Byron Legacy, Icarus, Ledger, and Shelley address types.
     *
     * @param options Address generation options
     * @param options.network Network string ('mainnet' or 'testnet', default: 'mainnet')
     * @param options.addressType Type of address (Payment, Staking, Reward, Public Key)
     * @param options.stakingPublicKey Required for Shelley Payment addresses
     * @returns {string} Encoded Cardano address
     * @throws {BaseError|AddressError} If address type is invalid or staking key is missing
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=cardano.d.ts.map