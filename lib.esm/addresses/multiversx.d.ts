import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a MultiversX (formerly Elrond) blockchain address.
 * Supports Bech32 encoding with configurable human-readable part (HRP) for different networks.
 */
export declare class MultiversXAddress extends Address {
    static hrp: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName(): string;
    /**
     * Encodes a public key into a MultiversX address.
     * Uses Bech32 encoding, omitting the first byte of the compressed public key.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Human-readable part for Bech32 encoding.
     * @returns {string} The encoded MultiversX address.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a MultiversX address back into the public key bytes.
     * Verifies Bech32 decoding with the specified HRP.
     *
     * @param {string} address - The MultiversX address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Expected human-readable part.
     * @returns {string} The public key bytes as a string.
     * @throws {AddressError} If the address is invalid or Bech32 decoding fails.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=multiversx.d.ts.map