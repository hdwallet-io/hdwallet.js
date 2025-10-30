import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing a Bitcoin P2PKH (Pay-to-PubKey-Hash) address.
 * Provides methods for encoding public keys to P2PKH addresses and decoding P2PKH addresses back to the public key hash.
 */
export declare class P2PKHAddress extends Address {
    static publicKeyAddressPrefix: number;
    static alphabet: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2PKH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a Bitcoin P2PKH address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options:
     *   - publicKeyAddressPrefix: prefix byte for the address
     *   - publicKeyType: whether to use compressed or uncompressed public key
     *   - alphabet: Base58 alphabet
     * @returns {string} Base58-encoded P2PKH address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Bitcoin P2PKH address into its public key hash.
     *
     * @param {string} address - The P2PKH address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options:
     *   - publicKeyAddressPrefix: expected prefix byte
     *   - alphabet: Base58 alphabet
     * @returns {string} The public key hash extracted from the address.
     * @throws {AddressError} If the address has invalid length or prefix.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2pkh.d.ts.map