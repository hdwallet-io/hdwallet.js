import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
import { P2WPKHAddress } from './p2wpkh';
/**
 * Class representing a P2WSH (Pay-to-Witness-Script-Hash) Bitcoin address.
 * Extends the P2WPKHAddress class and implements SegWit P2WSH encoding using compressed/uncompressed public keys.
 */
export declare class P2WSHAddress extends P2WPKHAddress implements Address {
    static witnessVersion: number;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WSH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a P2WSH SegWit Bitcoin address.
     * The address is constructed by creating a 1-of-1 witness script from the public key,
     * computing its SHA256 hash, and encoding it with the Bech32 SegWit format.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including HRP, public key type, and witness version.
     * @returns {string} Bech32-encoded P2WSH SegWit address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2wsh.d.ts.map