import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing a NEAR Protocol blockchain address.
 * Handles encoding and decoding of public keys in NEAR format.
 */
export declare class NearAddress extends Address {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Near").
     */
    static getName(): string;
    /**
     * Encodes a given public key into a NEAR address string.
     * Strips the first two bytes of the compressed key for NEAR-specific formatting.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} Encoded NEAR address string.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes a NEAR address back into a public key.
     * Verifies the length and validates the public key format.
     *
     * @param {string} address - The NEAR address to decode.
     * @returns {string} The original public key as a string.
     * @throws {AddressError} If the address length is incorrect or the public key is invalid.
     */
    static decode(address: string): string;
}
//# sourceMappingURL=near.d.ts.map