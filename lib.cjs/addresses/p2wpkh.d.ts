import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing a P2WPKH (Pay-to-Witness-Public-Key-Hash) Bitcoin address.
 * Implements native SegWit address encoding and decoding.
 */
export declare class P2WPKHAddress extends Address {
    static hrp: string;
    static witnessVersion: number;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WPKH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a native SegWit P2WPKH address.
     * The public key is hashed (RIPEMD160(SHA256(pubKey))) and then encoded in Bech32 format.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including HRP, public key type, and witness version.
     * @returns {string} Bech32 encoded P2WPKH address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a native SegWit P2WPKH address back into the public key hash.
     *
     * @param {string} address - Bech32 encoded P2WPKH address.
     * @param {AddressOptionsInterface} options - Optional HRP for decoding.
     * @returns {string} Public key hash as a string.
     * @throws {AddressError} If the address fails to decode.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2wpkh.d.ts.map