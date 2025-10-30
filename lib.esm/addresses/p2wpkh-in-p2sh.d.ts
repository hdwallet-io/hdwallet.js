import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
import { P2SHAddress } from './p2sh';
/**
 * Class representing a P2WPKH-in-P2SH (Pay-to-Witness-Public-Key-Hash nested in P2SH) Bitcoin address.
 * Inherits from P2SHAddress and overrides the encoding method to implement P2WPKH redemption.
 */
export declare class P2WPKHInP2SHAddress extends P2SHAddress implements Address {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WPKH-In-P2SH").
     */
    static getName(): string;
    /**
     * Encodes a public key into a P2WPKH-in-P2SH address.
     * This involves hashing the public key (RIPEMD160(SHA256(pubKey))),
     * building the redeem script for P2WPKH, and then hashing it to get the P2SH address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including script prefix, public key type, and alphabet.
     * @returns {string} Base58 encoded P2WPKH-in-P2SH address.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=p2wpkh-in-p2sh.d.ts.map