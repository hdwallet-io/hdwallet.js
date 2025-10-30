import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing Algorand addresses.
 * Extends the abstract Address class to provide Algorand-specific encoding and decoding.
 */
export declare class AlgorandAddress extends Address {
    static checksumLength: number;
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Algorand'
     */
    static getName(): string;
    /**
     * Computes the checksum for a given public key.
     * Algorand uses the last 4 bytes of sha512_256 hash of the public key as checksum.
     *
     * @param publicKey The public key bytes to compute checksum for
     * @returns {Uint8Array} 4-byte checksum
     */
    static computeChecksum(publicKey: Uint8Array): Uint8Array;
    /**
     * Encodes a public key into an Algorand address.
     *
     * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
     * @throws {AddressError} If the public key is invalid
     * @returns {string} Encoded Algorand address
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes an Algorand address back into its raw public key.
     *
     * @param address The Algorand address string to decode
     * @throws {AddressError} If the decoded length is invalid, checksum does not match, or public key is invalid
     * @returns {string} Raw public key as a string
     */
    static decode(address: string): string;
}
//# sourceMappingURL=algorand.d.ts.map