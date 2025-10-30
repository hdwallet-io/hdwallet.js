import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing a Tron blockchain address.
 * Provides methods for encoding a public key to a Tron address and decoding a Tron address to its raw hash.
 * Tron addresses are Base58Check encoded with a network-specific prefix.
 */
export declare class TronAddress extends Address {
    static publicKeyAddressPrefix: number;
    static alphabet: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "Tron".
     */
    static getName(): string;
    /**
     * Encodes a public key into a Tron address.
     * Uses Keccak-256 on the uncompressed public key (without first byte) and takes the last 20 bytes.
     * Prepends the network prefix and encodes the result in Base58Check format.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options including address prefix and alphabet.
     * @returns {string} The encoded Tron address as a Base58Check string.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Tron address into its raw public key hash.
     * Validates the address prefix and length before returning the hash.
     * @param {string} address - The Tron address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including address prefix and alphabet.
     * @returns {string} The raw public key hash as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid length or prefix.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=tron.d.ts.map