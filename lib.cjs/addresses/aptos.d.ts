import { PublicKey } from '../eccs';
import { Address } from './address';
/**
 * Class representing Aptos blockchain addresses.
 * Extends the abstract Address class to provide Aptos-specific encoding and decoding.
 */
export declare class AptosAddress extends Address {
    static suffix: Uint8Array;
    static addressPrefix: string;
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Aptos'
     */
    static getName(): string;
    /**
     * Encodes a public key into an Aptos address.
     *
     * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
     * @throws {AddressError} If the public key is invalid
     * @returns {string} Encoded Aptos address
     */
    static encode(publicKey: Uint8Array | string | PublicKey): string;
    /**
     * Decodes an Aptos address back into its raw public key hash.
     *
     * @param address The Aptos address string to decode
     * @throws {AddressError} If the prefix or length of the address is invalid
     * @returns {string} Raw public key hash as a string
     */
    static decode(address: string): string;
}
//# sourceMappingURL=aptos.d.ts.map