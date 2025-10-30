import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a NEO blockchain address.
 * Handles encoding and decoding of public keys according to NEO's address format.
 */
export declare class NeoAddress extends Address {
    static addressPrefix: Uint8Array<ArrayBufferLike>;
    static addressSuffix: Uint8Array<ArrayBufferLike>;
    static addressVersion: Uint8Array<ArrayBufferLike>;
    static alphabet: any;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Neo").
     */
    static getName(): string;
    /**
     * Encodes a given public key into a NEO address string.
     * Applies NEO-specific prefix, suffix, and hashing (hash160) before Base58 encoding.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options including address version and alphabet.
     * @returns {string} Encoded NEO address string.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a NEO address back into a public key.
     * Verifies version and length, and extracts the original public key bytes.
     *
     * @param {string} address - The NEO address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including address version and alphabet.
     * @returns {string} The public key as a string extracted from the address.
     * @throws {AddressError} If the address version or length is invalid.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=neo.d.ts.map