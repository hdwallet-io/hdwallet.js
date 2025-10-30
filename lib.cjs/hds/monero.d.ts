import { Seed } from '../seeds';
import { PrivateKey, PublicKey } from '../eccs';
import { MoneroDerivation } from '../derivations';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { Network } from '../cryptocurrencies/cryptocurrency';
import { HD } from './hd';
/**
 * Implements hierarchical deterministic (HD) wallet logic for Monero.
 * Supports primary, integrated, and subaddresses according to Monero's key derivation rules.
 * Provides methods to initialize from seed, private key, derivation, or watch-only mode.
 *
 */
export declare class MoneroHD extends HD {
    protected network: Network;
    protected seed?: Uint8Array;
    protected privateKeyRaw?: Uint8Array;
    protected paymentID?: string;
    protected spendPrivateKey?: PrivateKey | null;
    protected viewPrivateKey: PrivateKey;
    protected spendPublicKey: PublicKey;
    protected viewPublicKey: PublicKey;
    /**
     * Creates a new MoneroHD instance.
     * @param options HD wallet configuration options
     * @param options.network Monero network (mainnet/testnet/stagenet)
     * @param options.paymentID Optional payment ID for integrated addresses
     * @param options.minor Derivation minor index (default: 1)
     * @param options.major Derivation major index (default: 0)
     * @throws {NetworkError} If network is invalid
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Monero'
     */
    static getName(): string;
    /**
     * Initializes wallet from a seed.
     * Automatically derives spend and view keys.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current MoneroHD instance
     * @throws {SeedError} If seed is invalid
     */
    fromSeed(seed: Uint8Array | string | Seed): this;
    /**
     * Initializes wallet from a raw private key.
     * @param privateKey Private key string
     * @returns {this} Current MoneroHD instance
     * @throws {PrivateKeyError} If private key is invalid
     */
    fromPrivateKey(privateKey: string): this;
    /**
     * Sets the derivation path.
     * @param derivation MoneroDerivation instance
     * @returns {this} Current MoneroHD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation: MoneroDerivation): this;
    /**
     * Updates derivation path, cleaning previous derivation state.
     * @param derivation MoneroDerivation instance
     * @returns {this} Current MoneroHD instance
     */
    updateDerivation(derivation: MoneroDerivation): this;
    /**
     * Resets derivation state to initial.
     * @returns {this} Current MoneroHD instance
     */
    cleanDerivation(): this;
    /**
     * Initializes HD wallet from a spend private key.
     * Automatically derives the corresponding view key.
     * @param spendPrivateKey Spend private key as string or Uint8Array
     * @returns {this} Current MoneroHD instance
     */
    fromSpendPrivateKey(spendPrivateKey: string | Uint8Array): this;
    /**
     * Initializes wallet in watch-only mode.
     * Only view private key and spend public key are required.
     * @param viewPrivateKey View private key string
     * @param spendPublicKey Spend public key string
     * @returns {this} Current MoneroHD instance
     * @throws {PrivateKeyError|PublicKeyError} If keys are invalid
     */
    fromWatchOnly(viewPrivateKey: string, spendPublicKey: string): this;
    /**
     * Derives subaddress public keys at given minor and major indices.
     * @param minorIndex Minor index
     * @param majorIndex Major index
     * @returns {[PublicKey, PublicKey]} Tuple of [subaddress spend key, subaddress view key]
     * @throws {DerivationError} If indices are invalid
     */
    drive(minorIndex: number, majorIndex: number): [PublicKey, PublicKey];
    /**
     * Returns the raw seed as string.
     * @returns {string|null} Seed string or null if not set
     */
    getSeed(): string | null;
    /**
     * Returns the raw private key as string.
     * @returns {string|null} Private key string or null if not set
     */
    getPrivateKey(): string | null;
    /**
     * Returns spend private key as string.
     * @returns {string|null} Spend private key string
     */
    getSpendPrivateKey(): string | null;
    /**
     * Returns view private key as string.
     * @returns {string} View private key string
     */
    getViewPrivateKey(): string;
    /**
     * Returns spend public key as string.
     * @returns {string} Spend public key string
     */
    getSpendPublicKey(): string;
    /**
     * Returns view public key as string.
     * @returns {string} View public key string
     */
    getViewPublicKey(): string;
    /**
     * Generates the primary Monero address.
     * @returns {string} Encoded primary address
     */
    getPrimaryAddress(): string;
    /**
     * Generates an integrated Monero address with optional payment ID.
     * @param paymentID Optional payment ID
     * @returns {string|null} Encoded integrated address or null if no payment ID
     */
    getIntegratedAddress(paymentID?: string): string | null;
    /**
     * Generates a subaddress for given minor and major indices.
     * Defaults to current derivation indices.
     * @param minor Minor index
     * @param major Major index
     * @returns {string} Encoded subaddress
     */
    getSubAddress(minor?: number, major?: number): string;
    /**
     * Generates a Monero address of the specified type.
     * Supports standard, integrated, and subaddress types.
     * @param options Address generation options
     * @param options.addressType Type of address (STANDARD, INTEGRATED, SUB_ADDRESS)
     * @param options.paymentID Payment ID for integrated addresses
     * @param options.minor Minor index for subaddresses
     * @param options.major Major index for subaddresses
     * @returns {string|null} Encoded Monero address
     * @throws {AddressError} If address type is invalid
     */
    getAddress(options?: HDAddressOptionsInterface): string | null;
}
//# sourceMappingURL=monero.d.ts.map