import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing Cosmos blockchain addresses.
 * Provides encoding and decoding of public keys using Bech32 format.
 * Extends the abstract Address class.
 */
export declare class CosmosAddress extends Address {
    static readonly hrp: string;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Cosmos'
     */
    static getName(): string;
    /**
     * Encodes a public key into a Cosmos address.
     * The public key is first hashed using SHA256, then RIPEMD160, and finally encoded in Bech32 format.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey object)
     * @param options Address options including HRP prefix
     * @throws {AddressError} If Bech32 encoding fails
     * @returns {string} Encoded Cosmos address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Cosmos address into its raw public key bytes.
     * Validates that the HRP prefix matches the expected network prefix.
     *
     * @param address Cosmos address to decode
     * @param options Address options including HRP prefix
     * @throws {AddressError} If HRP prefix is invalid or decoding fails
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=cosmos.d.ts.map