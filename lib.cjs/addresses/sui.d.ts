import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing a Sui blockchain address.
 * Provides encoding and decoding functionality for Sui addresses based on Ed25519 public keys.
 */
export declare class SuiAddress extends Address {
    static keyType: Uint8Array;
    static addressPrefix: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Sui").
     */
    static getName(): string;
    /**
     * Encodes a public key into a Sui blockchain address.
     * The address is derived by hashing the key type prefix and the raw public key bytes with Blake2b-256.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The Sui address string with the appropriate prefix.
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes a Sui address string into its raw address body (without prefix).
     * Performs basic validation on the address prefix and length.
     * @param {string} address - The Sui address to decode.
     * @returns {string} The raw address body as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid prefix or length.
     */
    static decode(address: string): string;
}
//# sourceMappingURL=sui.d.ts.map