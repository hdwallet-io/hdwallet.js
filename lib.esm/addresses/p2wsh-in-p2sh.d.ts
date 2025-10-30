import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
import { P2SHAddress } from './p2sh';
/**
 * Class representing a P2WSH-in-P2SH (Pay-to-Witness-Script-Hash nested in Pay-to-Script-Hash) Bitcoin address.
 * Implements encoding of a compressed or uncompressed public key into a P2WSH-in-P2SH address.
 */
export declare class P2WSHInP2SHAddress extends P2SHAddress implements Address {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WSH-In-P2SH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a P2WSH-in-P2SH Bitcoin address.
     * Constructs the redeem script using a SegWit witness script hash nested in a P2SH structure.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including P2SH prefix, public key type, and alphabet.
     * @returns {string} Base58Check encoded P2WSH-in-P2SH address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2wsh-in-p2sh.d.ts.map