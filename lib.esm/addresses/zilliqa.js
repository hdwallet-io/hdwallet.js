// SPDX-License-Identifier: MIT
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Zilliqa } from '../cryptocurrencies';
import { sha256 } from '../crypto';
import { bytesToString } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing a Zilliqa blockchain address.
 * Uses Bech32 encoding for addresses and derives addresses from the compressed public key.
 */
export class ZilliqaAddress extends Address {
    static hrp = Zilliqa.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "Zilliqa".
     */
    static getName() {
        return 'Zilliqa';
    }
    /**
     * Encodes a public key into a Bech32 Zilliqa address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} [options] - Optional encoding parameters, such as HRP.
     * @returns {string} The Bech32-encoded Zilliqa address.
     * @throws {AddressError} If encoding fails.
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const hash = sha256(pk.getRawCompressed()).slice(-20);
        const hrp = options.hrp ?? this.hrp;
        const encoded = bech32Encode(hrp, hash);
        if (!encoded) {
            throw new AddressError('Failed to encode Bech32 Zilliqa address');
        }
        return encoded;
    }
    /**
     * Decodes a Bech32 Zilliqa address back into its public key hash.
     * @param {string} address - The Bech32-encoded Zilliqa address to decode.
     * @param {AddressOptionsInterface} [options] - Optional decoding parameters, such as HRP.
     * @returns {string} The public key hash in byte string format.
     * @throws {AddressError} If decoding fails or the address length is invalid.
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [gotHrp, data] = bech32Decode(hrp, address);
        if (!gotHrp || !data) {
            throw new AddressError('Failed to decode Bech32 Zilliqa address');
        }
        if (data.length !== 20) {
            throw new AddressError('Invalid address length', {
                expected: 20, got: data.length
            });
        }
        return bytesToString(data);
    }
}
//# sourceMappingURL=zilliqa.js.map