// SPDX-License-Identifier: MIT
import { Tezos } from '../cryptocurrencies';
import { checkEncode, checkDecode } from '../libs/base58';
import { SLIP10Ed25519PublicKey, validateAndGetPublicKey } from '../eccs';
import { blake2b160 } from '../crypto';
import { bytesToString, concatBytes, getBytes, ensureString, equalBytes } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';
/**
 * Class representing a Tezos blockchain address.
 * Supports encoding and decoding of Tezos addresses using Ed25519 public keys.
 * Addresses are encoded in Base58Check format with specific prefixes.
 */
export class TezosAddress extends Address {
    static addressPrefix = Tezos.DEFAULT_ADDRESS_PREFIX;
    static addressPrefixes = {
        tz1: Tezos.PARAMS.ADDRESS_PREFIXES.TZ1,
        tz2: Tezos.PARAMS.ADDRESS_PREFIXES.TZ2,
        tz3: Tezos.PARAMS.ADDRESS_PREFIXES.TZ3
    };
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Tezos").
     */
    static getName() {
        return 'Tezos';
    }
    /**
     * Encodes a public key into a Tezos address.
     * Uses Blake2b-160 hash of the compressed public key (excluding the first byte)
     * and prepends the appropriate address prefix.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options (address prefix).
     * @returns {string} The Tezos address in Base58Check format.
     * @throws {AddressError} If the provided prefix is invalid.
     */
    static encode(publicKey, options = {
        addressPrefix: this.addressPrefix
    }) {
        const prefixKey = options.addressPrefix ?? this.addressPrefix;
        if (!(prefixKey in this.addressPrefixes)) {
            throw new AddressError('Invalid Tezos address prefix', {
                expected: Object.keys(this.addressPrefixes), got: prefixKey
            });
        }
        const prefix = getBytes(this.addressPrefixes[prefixKey]);
        const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
        const hashed = blake2b160(pk.getRawCompressed().subarray(1));
        return ensureString(checkEncode(getBytes(concatBytes(prefix, hashed))));
    }
    /**
     * Decodes a Tezos address into its raw public key hash.
     * Validates the address prefix and length before returning.
     * @param {string} address - The Tezos address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options (address prefix).
     * @returns {string} The raw public key hash as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid prefix or length.
     */
    static decode(address, options = {
        addressPrefix: this.addressPrefix
    }) {
        const prefixKey = options.addressPrefix ?? this.addressPrefix;
        if (!(prefixKey in this.addressPrefixes)) {
            throw new AddressError('Invalid Tezos address prefix', {
                expected: Object.keys(this.addressPrefixes), got: prefixKey
            });
        }
        const prefix = getBytes(this.addressPrefixes[prefixKey]);
        const decoded = checkDecode(address);
        const expectedLen = prefix.length + 20;
        if (decoded.length !== expectedLen) {
            throw new AddressError('Invalid length', {
                expected: expectedLen, got: decoded.length
            });
        }
        const prefixGot = decoded.subarray(0, prefix.length);
        if (!equalBytes(prefixGot, prefix)) {
            throw new AddressError('Invalid prefix', {
                expected: bytesToString(prefix), got: bytesToString(prefixGot)
            });
        }
        return bytesToString(decoded.subarray(prefix.length));
    }
}
//# sourceMappingURL=tezos.js.map