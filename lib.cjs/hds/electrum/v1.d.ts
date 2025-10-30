import { HD } from '../hd';
import { ElectrumDerivation } from '../../derivations';
import { PublicKey, PrivateKey } from '../../eccs';
import { Seed } from '../../seeds';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../../interfaces';
/**
 * Implements Electrum V1 hierarchical deterministic (HD) wallet.
 * Provides methods to derive private/public keys, WIF, and P2PKH addresses
 * according to Electrum V1 derivation rules.
 *
 */
export declare class ElectrumV1HD extends HD {
    protected seed?: Uint8Array;
    protected masterPrivateKey?: PrivateKey;
    protected masterPublicKey: PublicKey;
    protected privateKey?: PrivateKey;
    protected publicKey: PublicKey;
    protected publicKeyType: string;
    protected wifType: string;
    protected wifPrefix?: number;
    /**
     * Constructs a new ElectrumV1HD instance.
     * @param options Configuration options
     * @param options.publicKeyType Type of public key ('compressed' or 'uncompressed')
     * @param options.wifPrefix Optional WIF prefix for Bitcoin network
     * @param options.change Optional derivation change index
     * @param options.address Optional derivation address index
     * @throws {BaseError} If public key type is invalid
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Electrum-V1'
     */
    static getName(): string;
    /**
     * Initializes the wallet from a seed.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current ElectrumV1HD instance
     * @throws {SeedError} If seed is invalid
     */
    fromSeed(seed: Uint8Array | string | Seed): this;
    /**
     * Initializes the wallet from a raw private key.
     * @param key Private key as Uint8Array or string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {PrivateKeyError} If private key is invalid
     */
    fromPrivateKey(key: Uint8Array | string): this;
    /**
     * Initializes the wallet from a WIF string.
     * @param wif Wallet Import Format string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {WIFError} If WIF prefix is missing or WIF is invalid
     */
    fromWIF(wif: string): this;
    /**
     * Initializes the wallet from a public key.
     * @param key Public key as Uint8Array or string
     * @returns {this} Current ElectrumV1HD instance
     * @throws {PublicKeyError} If public key is invalid
     */
    fromPublicKey(key: Uint8Array | string): this;
    /**
     * Sets the derivation path.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV1HD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation: ElectrumDerivation): this;
    /**
     * Updates derivation path by cleaning previous derivation state.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV1HD instance
     */
    updateDerivation(derivation: ElectrumDerivation): this;
    /**
     * Resets derivation path to initial state.
     * @returns {this} Current ElectrumV1HD instance
     */
    cleanDerivation(): this;
    /**
     * Derives child private/public key for the specified change and address index.
     * @param changeIndex Change index
     * @param addressIndex Address index
     * @returns {this} Current ElectrumV1HD instance
     */
    drive(changeIndex: number, addressIndex: number): this;
    /**
     * Returns raw seed as string.
     * @returns {string|null} Seed or null if not set
     */
    getSeed(): string | null;
    /**
     * Returns master private key as string.
     * @returns {string|null} Master private key
     */
    getMasterPrivateKey(): string | null;
    /**
     * Returns master private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getMasterWIF(wifType?: string): string | null;
    /**
     * Returns master public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Master public key string
     * @throws {BaseError} If public key type is invalid
     */
    getMasterPublicKey(publicKeyType?: string): string;
    /**
     * Returns derived private key as string.
     * @returns {string|null} Derived private key
     */
    getPrivateKey(): string | null;
    /**
     * Returns derived private key in WIF format.
     * @param wifType Optional WIF type override
     * @returns {string|null} WIF string
     */
    getWIF(wifType?: string): string | null;
    /**
     * Returns the WIF type used by this instance.
     * @returns {string} WIF type string
     */
    getWIFType(): string;
    /**
     * Returns derived public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Public key string
     * @throws {BaseError} If public key type is invalid
     */
    getPublicKey(publicKeyType?: string): string;
    /**
     * Returns public key type used by this instance.
     * @returns {string} Public key type string
     */
    getPublicKeyType(): string;
    /**
     * Returns the derived public key in compressed format.
     * @returns {string} Compressed public key
     */
    getCompressed(): string;
    /**
     * Returns the derived public key in uncompressed format.
     * @returns {string} Uncompressed public key
     */
    getUncompressed(): string;
    /**
     * Generates P2PKH address from the derived public key.
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Network prefix for P2PKH address
     * @returns {string} Encoded P2PKH address
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=v1.d.ts.map