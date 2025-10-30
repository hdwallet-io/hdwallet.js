import { HD } from './hd';
import { Derivation } from '../derivations';
import { PublicKey, PrivateKey } from '../eccs';
import { Seed } from '../seeds';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
/**
 * Implements the BIP32 hierarchical deterministic (HD) wallet standard.
 * Provides methods for key derivation, serialization, address generation, and working
 * with extended keys (xprv/xpub) and WIF format.
 *
 */
export declare class BIP32HD extends HD {
    protected seed?: Uint8Array;
    protected rootPrivateKey?: PrivateKey;
    protected rootChainCode?: Uint8Array;
    protected rootPublicKey?: PublicKey;
    protected privateKey?: PrivateKey;
    protected chainCode?: Uint8Array;
    protected publicKey?: PublicKey;
    protected publicKeyType: string;
    protected wifType: string;
    protected wifPrefix?: number;
    protected fingerprint?: Uint8Array;
    protected parentFingerprint?: Uint8Array;
    protected strict?: boolean | null;
    protected rootDepth: number;
    protected rootIndex: number;
    protected depth: number;
    protected index: number;
    /**
     * Create a new BIP32HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP32'
     */
    static getName(): string;
    /**
     * Initialize HD wallet from a seed.
     * @param seed Seed as Uint8Array, string, or Seed object
     * @returns {this} The current HD instance
     * @throws {SeedError} If the seed is invalid
     */
    fromSeed(seed: Uint8Array | string | Seed): this;
    /**
     * Initialize from extended private key (xprv).
     * @param xprv Extended private key
     * @param encoded Whether the key is encoded in Base58
     * @param strict Whether to enforce root key validation
     * @returns {this} The current HD instance
     * @throws {XPrivateKeyError} If the key is invalid
     */
    fromXPrivateKey(xprv: string, encoded?: boolean, strict?: boolean): this;
    /**
     * Initialize from extended public key (xpub).
     * @param xpub Extended public key
     * @param encoded Whether the key is encoded in Base58
     * @param strict Whether to enforce root key validation
     * @returns {this} The current HD instance
     * @throws {XPublicKeyError} If the key is invalid
     */
    fromXPublicKey(xpub: string, encoded?: boolean, strict?: boolean): this;
    /**
     * Initialize from WIF private key.
     * @param wif WIF string
     * @returns {this} The current HD instance
     * @throws {WIFError} If the WIF prefix is missing
     */
    fromWIF(wif: string): this;
    /**
     * Initialize from a raw private key.
     * @param privateKey Private key as string
     * @returns {this} The current HD instance
     * @throws {PrivateKeyError} If the private key is invalid
     */
    fromPrivateKey(privateKey: string): this;
    /**
     * Initialize from a raw public key.
     * @param publicKey Public key as string
     * @returns {this} The current HD instance
     * @throws {PublicKeyError} If the public key is invalid
     */
    fromPublicKey(publicKey: string): this;
    /**
     * Apply a derivation path to the HD instance.
     * @param derivation Derivation object
     * @returns {this} The current HD instance
     */
    fromDerivation(derivation: Derivation): this;
    /**
     * Update derivation path after clearing previous derivation.
     * @param derivation Derivation object
     * @returns {this} The current HD instance
     */
    updateDerivation(derivation: Derivation): this;
    /**
     * Reset derivation to the root keys.
     * @returns {this} The current HD instance
     */
    cleanDerivation(): this;
    /**
     * Derive a child key at a specific index.
     * @param index Child index
     * @returns {this} The current HD instance
     * @throws {DerivationError} If derivation fails
     */
    drive(index: number): this | null | undefined;
    /**
     * Returns the seed as a string.
     * @returns {string | null} Seed or null if not set
     */
    getSeed(): string | null;
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getRootPrivateKey(): string | null;
    getRootWIF(wifType?: string): string | null;
    getRootChainCode(): string | null;
    getRootPublicKey(publicKeyType?: string): string | null;
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getPrivateKey(): string | null;
    getWIF(wifType?: string): string | null;
    getWIFType(): string | null;
    getChainCode(): string | null;
    getPublicKey(publicKeyType?: string): string;
    getPublicKeyType(): string;
    getCompressed(): string;
    getUncompressed(): string;
    getHash(): string;
    getFingerprint(): string;
    getParentFingerprint(): string | null;
    getDepth(): number;
    getPath(): string;
    getIndex(): number;
    getIndexes(): number[];
    getStrict(): boolean | null;
    /**
     * Generate a cryptocurrency address using current public key.
     * Supports multiple address formats like P2PKH, P2SH, P2TR, P2WPKH, etc.
     * @param options Address generation options
     * @returns {string} Encoded address
     * @throws {AddressError} If the address type is invalid
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip32.d.ts.map