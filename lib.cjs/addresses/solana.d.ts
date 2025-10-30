import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing a Solana (SOL) address.
 * Provides encoding and decoding methods for Solana public keys using Base58.
 */
export declare class SolanaAddress extends Address {
    static alphabet: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Solana").
     */
    static getName(): string;
    /**
     * Encodes a public key into a Solana Base58 address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The Base58-encoded Solana address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes a Solana Base58 address into the corresponding public key bytes.
     * @param {string} address - The Base58 Solana address to decode.
     * @returns {string} The decoded public key as a string.
     * @throws {AddressError} If the decoded public key has an invalid length or is invalid.
     */
    static decode(address: string): string;
}
//# sourceMappingURL=solana.d.ts.map