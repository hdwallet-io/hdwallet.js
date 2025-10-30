import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing Ergo blockchain addresses.
 * Provides encoding and decoding of public keys into Ergo addresses using Base58 with a checksum.
 * Supports different address types (p2pkh, p2sh) and networks (mainnet, testnet).
 * Extends the abstract Address class.
 */
export declare class ErgoAddress extends Address {
    static checksumLength: number;
    static addressType: string;
    static addressTypes: Record<string, number>;
    static networkType: string;
    static networkTypes: Record<string, number>;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Ergo'
     */
    static getName(): string;
    /**
     * Computes the checksum for Ergo address encoding.
     * Uses Blake2b256 hash and takes the first `checksumLength` bytes.
     *
     * @param data Bytes to compute checksum from
     * @returns {Uint8Array} Computed checksum
     */
    static computeChecksum(data: Uint8Array): Uint8Array;
    /**
     * Encodes a public key into an Ergo address.
     * Combines network type, address type, and compressed public key bytes with a checksum,
     * then encodes the result in Base58.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including addressType and networkType
     * @throws {NetworkError} If the network type is invalid
     * @throws {AddressError} If the address type is invalid
     * @returns {string} Encoded Ergo address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes an Ergo address back to the raw public key bytes.
     * Validates prefix, length, checksum, and public key bytes.
     *
     * @param address Ergo address to decode
     * @param options Address options including addressType and networkType
     * @throws {NetworkError} If the network type is invalid
     * @throws {AddressError} If the address type, prefix, length, checksum, or public key is invalid
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=ergo.d.ts.map