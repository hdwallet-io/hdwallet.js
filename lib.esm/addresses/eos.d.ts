import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing EOS blockchain addresses.
 * Provides encoding and decoding of public keys into EOS addresses using Base58 with a checksum.
 * Extends the abstract Address class.
 */
export declare class EOSAddress extends Address {
    static addressPrefix: string;
    static checksumLength: number;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'EOS'
     */
    static getName(): string;
    /**
     * Computes the EOS address checksum for a given public key.
     * Uses RIPEMD160 hash and takes the first `checksumLength` bytes.
     *
     * @param pubKeyBytes Raw public key bytes
     * @returns {Uint8Array} Computed checksum
     */
    static computeChecksum(pubKeyBytes: Uint8Array): Uint8Array;
    /**
     * Encodes a public key into an EOS address.
     * Appends a checksum to the public key bytes and encodes the result in Base58 with a prefix.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including the prefix
     * @throws {AddressError} If encoding fails
     * @returns {string} Encoded EOS address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes an EOS address into its raw public key bytes.
     * Validates the prefix, length, checksum, and public key bytes.
     *
     * @param address EOS address to decode
     * @param options Address options including the prefix
     * @throws {AddressError} If any validation (prefix, length, checksum, public key) fails
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=eos.d.ts.map