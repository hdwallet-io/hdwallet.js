import { PublicKey } from '../eccs';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
/**
 * Class representing a Zilliqa blockchain address.
 * Uses Bech32 encoding for addresses and derives addresses from the compressed public key.
 */
export declare class ZilliqaAddress extends Address {
    static readonly hrp: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "Zilliqa".
     */
    static getName(): string;
    /**
     * Encodes a public key into a Bech32 Zilliqa address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} [options] - Optional encoding parameters, such as HRP.
     * @returns {string} The Bech32-encoded Zilliqa address.
     * @throws {AddressError} If encoding fails.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Bech32 Zilliqa address back into its public key hash.
     * @param {string} address - The Bech32-encoded Zilliqa address to decode.
     * @param {AddressOptionsInterface} [options] - Optional decoding parameters, such as HRP.
     * @returns {string} The public key hash in byte string format.
     * @throws {AddressError} If decoding fails or the address length is invalid.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=zilliqa.d.ts.map