import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing a Nano (formerly RaiBlocks) blockchain address.
 * Supports encoding and decoding using a modified Base32 scheme and Blake2b checksums.
 */
export declare class NanoAddress extends Address {
    static addressPrefix: string;
    static alphabet: string;
    static payloadPaddingDecoded: Uint8Array;
    static payloadPaddingEncoded: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName(): string;
    /**
     * Computes the Nano checksum for a given public key.
     * Uses Blake2b (40-bit) and reverses the byte order.
     *
     * @param {Uint8Array} publicKey - The public key bytes.
     * @returns {Uint8Array} The checksum bytes.
     */
    static computeChecksum(publicKey: Uint8Array): Uint8Array;
    /**
     * Encodes a public key into a Nano address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The encoded Nano address.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes a Nano address back into the public key bytes.
     * Verifies the address prefix, Base32 decoding, and checksum.
     *
     * @param {string} address - The Nano address to decode.
     * @returns {string} The public key bytes as a string.
     * @throws {AddressError} If the address is invalid or checksum verification fails.
     */
    static decode(address: string): string;
}
//# sourceMappingURL=nano.d.ts.map