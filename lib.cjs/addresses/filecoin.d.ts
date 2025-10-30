import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing Filecoin blockchain addresses.
 * Provides encoding and decoding of public keys into Filecoin addresses.
 * Supports SECP256K1 and BLS address types and computes checksums using Blake2b.
 * Extends the abstract Address class.
 */
export declare class FilecoinAddress extends Address {
    static alphabet: string;
    static addressPrefix: string;
    static addressType: string;
    static addressTypes: Record<string, number>;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Filecoin'
     */
    static getName(): string;
    /**
     * Computes the checksum for a Filecoin address.
     * Uses Blake2b-32 on the concatenation of address type and public key hash.
     *
     * @param pubKeyHash Public key hash bytes (20-byte Blake2b-160 hash)
     * @param addressType Numeric address type
     * @returns {Uint8Array} Checksum bytes (4 bytes)
     */
    static computeChecksum(pubKeyHash: Uint8Array, addressType: number): Uint8Array;
    /**
     * Encodes a public key into a Filecoin address.
     * Combines the public key hash, address type, and checksum into a base32 string with prefix.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If public key or address type is invalid
     * @returns {string} Encoded Filecoin address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Filecoin address back to its public key hash.
     * Validates prefix, address type, length, and checksum.
     *
     * @param address Filecoin address string to decode
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If prefix, address type, length, or checksum is invalid
     * @returns {string} Decoded public key hash (20-byte hex string)
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=filecoin.d.ts.map