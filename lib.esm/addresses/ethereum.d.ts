import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing Ethereum blockchain addresses.
 * Provides encoding and decoding of public keys into Ethereum addresses.
 * Supports optional EIP-55 checksum encoding.
 * Extends the abstract Address class.
 */
export declare class EthereumAddress extends Address {
    static addressPrefix: string;
    /**
    * Returns the name of the address implementation.
    * @returns {string} 'Ethereum'
    */
    static getName(): string;
    /**
     * Applies EIP-55 checksum encoding to an Ethereum address.
     * Converts specific characters to uppercase based on the Keccak-256 hash of the address.
     *
     * @param address Address string without prefix
     * @returns {string} Checksummed address string
     */
    static checksumEncode(address: string): string;
    /**
     * Encodes a public key into an Ethereum address.
     * The address is generated from the last 20 bytes of the Keccak-256 hash of the uncompressed public key.
     * Can optionally skip EIP-55 checksum encoding.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including skipChecksumEncode
     * @throws {AddressError} If public key is invalid
     * @returns {string} Encoded Ethereum address with prefix
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes an Ethereum address back to its raw lowercase hexadecimal form (without prefix).
     * Validates prefix, length, and optionally EIP-55 checksum encoding.
     *
     * @param address Ethereum address string to decode
     * @param options Address options including skipChecksumEncode
     * @throws {AddressError} If prefix, length, or checksum encoding is invalid
     * @returns {string} Decoded address string in lowercase (without prefix)
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=ethereum.d.ts.map