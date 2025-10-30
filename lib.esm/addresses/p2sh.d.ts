import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a Bitcoin P2SH (Pay-to-Script-Hash) address.
 * Provides methods for encoding public keys to P2SH addresses and decoding P2SH addresses back to the script hash.
 */
export declare class P2SHAddress extends Address {
    static scriptAddressPrefix: number;
    static alphabet: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2SH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a Bitcoin P2SH address.
     * The method generates a standard P2PKH redeem script, computes its hash, and encodes it with the script address prefix.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options:
     *   - scriptAddressPrefix: prefix byte for the address
     *   - publicKeyType: whether to use compressed or uncompressed public key
     *   - alphabet: Base58 alphabet
     * @returns {string} Base58-encoded P2SH address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Bitcoin P2SH address into its script hash.
     *
     * @param {string} address - The P2SH address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options:
     *   - scriptAddressPrefix: expected prefix byte
     *   - alphabet: Base58 alphabet
     * @returns {string} The script hash extracted from the address.
     * @throws {AddressError} If the address has invalid length or prefix.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2sh.d.ts.map