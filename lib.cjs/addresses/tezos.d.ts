import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a Tezos blockchain address.
 * Supports encoding and decoding of Tezos addresses using Ed25519 public keys.
 * Addresses are encoded in Base58Check format with specific prefixes.
 */
export declare class TezosAddress extends Address {
    static addressPrefix: any;
    static addressPrefixes: Record<string, Uint8Array>;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Tezos").
     */
    static getName(): string;
    /**
     * Encodes a public key into a Tezos address.
     * Uses Blake2b-160 hash of the compressed public key (excluding the first byte)
     * and prepends the appropriate address prefix.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options (address prefix).
     * @returns {string} The Tezos address in Base58Check format.
     * @throws {AddressError} If the provided prefix is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Tezos address into its raw public key hash.
     * Validates the address prefix and length before returning.
     * @param {string} address - The Tezos address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options (address prefix).
     * @returns {string} The raw public key hash as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid prefix or length.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=tezos.d.ts.map