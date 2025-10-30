import { HD } from '../hd';
import { ElectrumDerivation } from '../../derivations';
import { BIP32HD } from '../bip32';
import { Seed } from '../../seeds';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../../interfaces';
/**
 * Electrum V2 hierarchical deterministic (HD) wallet.
 * Supports standard (P2PKH) and SegWit (P2WPKH) modes.
 * Wraps a BIP32HD instance and provides Electrum-specific derivation logic.
 *
 */
export declare class ElectrumV2HD extends HD {
    protected mode: string;
    protected wifType: string;
    protected publicKeyType: string;
    protected wifPrefix?: number;
    protected bip32HD: BIP32HD;
    /**
     * Constructs a new ElectrumV2HD instance.
     * @param options Configuration options
     * @param options.publicKeyType Type of public key ('compressed' or 'uncompressed')
     * @param options.mode Wallet mode ('standard' or 'segwit')
     * @param options.wifPrefix Optional WIF prefix
     * @param options.change Optional derivation change index
     * @param options.address Optional derivation address index
     * @throws {BaseError} If mode or public key type is invalid
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Electrum-V2'
     */
    static getName(): string;
    /**
     * Initializes wallet from a seed.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current ElectrumV2HD instance
     */
    fromSeed(seed: Uint8Array | string | Seed): this;
    /**
     * Sets the derivation path.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV2HD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation: ElectrumDerivation): this;
    /**
     * Updates derivation path by cleaning previous derivation state.
     * @param derivation ElectrumDerivation instance
     * @returns {this} Current ElectrumV2HD instance
     */
    updateDerivation(derivation: ElectrumDerivation): this;
    /**
     * Resets derivation path to initial state.
     * @returns {this} Current ElectrumV2HD instance
     */
    cleanDerivation(): this;
    /**
     * Derives child keys for given change and address indices.
     * Uses custom Electrum V2 derivation logic.
     * @param changeIndex Change index
     * @param addressIndex Address index
     * @returns {this} Current ElectrumV2HD instance
     */
    drive(changeIndex: number, addressIndex: number): this;
    /**
     * Returns the current wallet mode ('standard' or 'segwit').
     * @returns {string} Mode string
     */
    getMode(): string;
    /**
     * Returns the raw seed as string.
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
     * @returns {string} Master public key
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
     * @returns {string} WIF type
     */
    getWIFType(): string;
    /**
     * Returns derived public key as string.
     * @param publicKeyType Optional type ('compressed' or 'uncompressed')
     * @returns {string} Public key string
     */
    getPublicKey(publicKeyType?: string): string;
    /**
     * Returns public key type used by this instance.
     * @returns {string} Public key type string
     */
    getPublicKeyType(): string;
    /**
     * Returns derived public key in uncompressed format.
     * @returns {string} Uncompressed public key
     */
    getUncompressed(): string;
    /**
     * Returns derived public key in compressed format.
     * @returns {string} Compressed public key
     */
    getCompressed(): string;
    /**
     * Generates an address based on the current mode.
     * - Standard mode → P2PKH
     * - SegWit mode → P2WPKH
     *
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Prefix for P2PKH address (standard mode)
     * @param options.hrp Human-readable part for Bech32 address (SegWit mode)
     * @param options.witnessVersion Witness version for SegWit address
     * @returns {string} Encoded Bitcoin address
     * @throws {AddressError} If mode is invalid
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=v2.d.ts.map