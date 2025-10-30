import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing Cardano blockchain addresses.
 * Supports Byron (Legacy & Icarus) and Shelley (Payment & Staking/Reward) address formats.
 * Extends the abstract Address class and provides Cardano-specific encoding and decoding logic.
 */
export declare class CardanoAddress extends Address {
    static readonly addressTypes: any;
    static readonly networkTypes: any;
    static readonly prefixTypes: any;
    static readonly paymentAddressHrp: any;
    static readonly rewardAddressHrp: any;
    static readonly chacha20Poly1305AssociatedData: Uint8Array<ArrayBuffer>;
    static readonly chacha20Poly1305Nonce: Uint8Array<ArrayBufferLike>;
    static readonly payloadTag = 24;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Cardano'
     */
    static getName(): string;
    /**
     * Encodes a public key into a Cardano address.
     * Supports different types: Byron Legacy, Byron Icarus, Shelley Payment, Shelley Staking/Reward.
     *
     * @param publicKey Public key to encode
     * @param options Address options including encodeType, path, chainCode, network, and staking public key
     * @throws {AddressError} If encode type is invalid
     * @returns {string} Encoded Cardano address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Cardano address into its raw public key.
     * Supports Byron and Shelley address types.
     *
     * @param address Cardano address to decode
     * @param options Address options including decodeType, network, or addressType
     * @throws {AddressError} If decode type is invalid
     * @returns {string} Decoded raw public key
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
    /**
     * Encodes a Byron address (generic helper for Icarus & Legacy).
     *
     * @param publicKey Public key object
     * @param chainCode Chain code for HD derivation
     * @param addressAttributes Extra address attributes (Map)
     * @param addressType Address type ('public-key' or 'redemption')
     * @throws {AddressError} If address type is invalid
     * @returns {string} Encoded Byron address (Base58)
     */
    static encodeByron(publicKey: PublicKey, chainCode: Uint8Array, addressAttributes: any, addressType?: string): string;
    /**
     * Encodes a Byron Icarus address.
     * @param publicKey Public key
     * @param chainCode Chain code
     * @param addressType Address type
     * @returns {string} Encoded Byron Icarus address
     */
    static encodeByronIcarus(publicKey: Uint8Array | string | PublicKey, chainCode: Uint8Array | string, addressType?: string): string;
    /**
     * Encodes a Byron Legacy address using HD path encryption.
     *
     * @param publicKey Public key
     * @param path HD derivation path
     * @param pathKey HD path key
     * @param chainCode Chain code
     * @param addressType Address type
     * @throws {BaseError} If HD path key length is invalid
     * @returns {string} Encoded Byron Legacy address
     */
    static encodeByronLegacy(publicKey: Uint8Array | string | PublicKey, path: string, pathKey: Uint8Array | string, chainCode: Uint8Array | string, addressType?: string): string;
    /**
     * Decodes a Byron address (generic for Icarus & Legacy).
     *
     * @param address Address string to decode
     * @param addressType Address type
     * @throws {AddressError} If decoding fails or CRC/payload invalid
     * @returns {string} Decoded raw public key
     */
    static decodeByron(address: string, addressType?: string): string;
    /**
     * Decode Byron Icarus address.
     * @param address Address string
     * @param addressType Address type
     * @returns {string} Decoded raw public key
     */
    static decodeByronIcarus(address: string, addressType?: string): string;
    /**
     * Decode Byron Legacy address.
     * @param address Address string
     * @param addressType Address type
     * @returns {string} Decoded raw public key
     */
    static decodeByronLegacy(address: string, addressType?: string): string;
    /**
     * Encode Shelley payment address.
     * @param publicKey Payment public key
     * @param stakingPublicKey Staking public key
     * @param network Network ('mainnet' or 'testnet')
     * @returns {string} Encoded Shelley payment address
     */
    static encodeShelley(publicKey: Uint8Array | string | PublicKey, stakingPublicKey: Uint8Array | string | PublicKey, network: string): string;
    /**
     * Decode Shelley payment address.
     * @param address Address string
     * @param network Network ('mainnet' or 'testnet')
     * @throws {AddressError} If address length or prefix invalid
     * @returns {string} Decoded raw public key
     */
    static decodeShelley(address: string, network: string): string;
    /**
     * Encode Shelley staking/reward address.
     * @param publicKey Staking public key
     * @param network Network ('mainnet' or 'testnet')
     * @returns {string} Encoded staking/reward address
     */
    static encodeShelleyStaking(publicKey: Uint8Array | string | PublicKey, network: string): string;
    /**
     * Decode Shelley staking/reward address.
     * @param address Address string
     * @param network Network ('mainnet' or 'testnet')
     * @throws {AddressError} If address length or prefix invalid
     * @returns {string} Decoded raw public key
     */
    static decodeShelleyStaking(address: string, network: string): string;
}
//# sourceMappingURL=cardano.d.ts.map