import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a Stellar (XLM) address.
 * Provides encoding and decoding methods for Stellar public keys and private keys using Base32.
 */
export declare class StellarAddress extends Address {
    static checksumLength: number;
    static addressType: any;
    static addressTypes: Record<string, number>;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Stellar").
     */
    static getName(): string;
    /**
     * Computes the checksum for a Stellar address payload.
     * @param {Uint8Array} payload - The payload bytes to compute the checksum for.
     * @returns {Uint8Array} The checksum bytes.
     */
    static computeChecksum(payload: Uint8Array): Uint8Array;
    /**
     * Encodes a public key or private key into a Stellar Base32 address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public/private key to encode.
     * @param {AddressOptionsInterface} options - Encoding options including address type.
     * @returns {string} The Base32-encoded Stellar address.
     * @throws {AddressError} If the address type is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Stellar Base32 address into the corresponding public key bytes.
     * @param {string} address - The Base32 Stellar address to decode.
     * @param {AddressOptionsInterface} options - Decoding options including address type.
     * @returns {string} The decoded public key as a string.
     * @throws {AddressError} If the decoded address has an invalid type, checksum, length, or invalid public key.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=stellar.d.ts.map