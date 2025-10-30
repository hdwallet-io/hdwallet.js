import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing Icon blockchain addresses.
 * Handles encoding and decoding of addresses using SHA3-256 hashing of the public key.
 */
export declare class IconAddress extends Address {
    static addressPrefix: string;
    static keyHashLength: number;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Icon'
     */
    static getName(): string;
    /**
     * Encodes a public key into an Icon address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The encoded Icon address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes an Icon address back into the key hash.
     * @param {string} address - The Icon address to decode.
     * @returns {string} The decoded key hash.
     * @throws {AddressError} If the address prefix or length is invalid.
     */
    static decode(address: string): string;
}
//# sourceMappingURL=icon.d.ts.map