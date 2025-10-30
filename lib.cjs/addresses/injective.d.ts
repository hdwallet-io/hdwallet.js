import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing an Injective blockchain address.
 * Inherits from the base Address class.
 * Uses Bech32 encoding with Ethereum-style public key hashing.
 */
export declare class InjectiveAddress extends Address {
    static readonly hrp: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName(): string;
    /**
    * Encodes a public key into a Bech32 Injective address.
    * Uses Ethereum-style encoding of the public key, then converts to Bech32.
    *
    * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
    * @param {AddressOptionsInterface} [options] - Optional parameters.
    * @param {string} [options.hrp=this.hrp] - Human-readable prefix for Bech32.
    * @returns {string} Bech32-encoded Injective address.
    * @throws {AddressError} If encoding fails.
    */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Bech32 Injective address back into its raw public key bytes.
     *
     * @param {string} address - Bech32-encoded Injective address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Expected human-readable prefix for Bech32.
     * @returns {string} Raw public key bytes as a string.
     * @throws {AddressError} If decoding fails, the HRP does not match, or length is invalid.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=injective.d.ts.map