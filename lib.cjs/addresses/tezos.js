"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.TezosAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a Tezos blockchain address.
 * Supports encoding and decoding of Tezos addresses using Ed25519 public keys.
 * Addresses are encoded in Base58Check format with specific prefixes.
 */
class TezosAddress extends address_1.Address {
    static addressPrefix = cryptocurrencies_1.Tezos.DEFAULT_ADDRESS_PREFIX;
    static addressPrefixes = {
        tz1: cryptocurrencies_1.Tezos.PARAMS.ADDRESS_PREFIXES.TZ1,
        tz2: cryptocurrencies_1.Tezos.PARAMS.ADDRESS_PREFIXES.TZ2,
        tz3: cryptocurrencies_1.Tezos.PARAMS.ADDRESS_PREFIXES.TZ3
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
            throw new exceptions_1.AddressError('Invalid Tezos address prefix', {
                expected: Object.keys(this.addressPrefixes), got: prefixKey
            });
        }
        const prefix = (0, utils_1.getBytes)(this.addressPrefixes[prefixKey]);
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const hashed = (0, crypto_1.blake2b160)(pk.getRawCompressed().subarray(1));
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)((0, utils_1.getBytes)((0, utils_1.concatBytes)(prefix, hashed))));
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
            throw new exceptions_1.AddressError('Invalid Tezos address prefix', {
                expected: Object.keys(this.addressPrefixes), got: prefixKey
            });
        }
        const prefix = (0, utils_1.getBytes)(this.addressPrefixes[prefixKey]);
        const decoded = (0, base58_1.checkDecode)(address);
        const expectedLen = prefix.length + 20;
        if (decoded.length !== expectedLen) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLen, got: decoded.length
            });
        }
        const prefixGot = decoded.subarray(0, prefix.length);
        if (!(0, utils_1.equalBytes)(prefixGot, prefix)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: (0, utils_1.bytesToString)(prefix), got: (0, utils_1.bytesToString)(prefixGot)
            });
        }
        return (0, utils_1.bytesToString)(decoded.subarray(prefix.length));
    }
}
exports.TezosAddress = TezosAddress;
//# sourceMappingURL=tezos.js.map