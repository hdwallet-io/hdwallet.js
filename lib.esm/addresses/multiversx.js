// SPDX-License-Identifier: MIT
import { MultiversX } from '../cryptocurrencies';
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { SLIP10Ed25519PublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, getBytes } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';
/**
 * Class representing a MultiversX (formerly Elrond) blockchain address.
 * Supports Bech32 encoding with configurable human-readable part (HRP) for different networks.
 */
export class MultiversXAddress extends Address {
    static hrp = MultiversX.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName() {
        return 'MultiversX';
    }
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
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        return bech32Encode(options.hrp ?? this.hrp, getBytes(raw));
    }
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
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const [hrpGot, data] = bech32Decode(options.hrp ?? this.hrp, address);
        if (!data) {
            throw new AddressError('Invalid Bech32 decoding result');
        }
        return bytesToString(data);
    }
}
//# sourceMappingURL=multiversx.js.map