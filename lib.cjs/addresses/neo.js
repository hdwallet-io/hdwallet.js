"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeoAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base58_1 = require("../libs/base58");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a NEO blockchain address.
 * Handles encoding and decoding of public keys according to NEO's address format.
 */
class NeoAddress extends address_1.Address {
    static addressPrefix = (0, utils_1.integerToBytes)(cryptocurrencies_1.Neo.PARAMS.ADDRESS_PREFIX);
    static addressSuffix = (0, utils_1.integerToBytes)(cryptocurrencies_1.Neo.PARAMS.ADDRESS_SUFFIX);
    static addressVersion = (0, utils_1.integerToBytes)(cryptocurrencies_1.Neo.PARAMS.ADDRESS_VERSION);
    static alphabet = cryptocurrencies_1.Neo.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Neo").
     */
    static getName() {
        return 'Neo';
    }
    /**
     * Encodes a given public key into a NEO address string.
     * Applies NEO-specific prefix, suffix, and hashing (hash160) before Base58 encoding.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options including address version and alphabet.
     * @returns {string} Encoded NEO address string.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey, options = {
        addressVersion: this.addressVersion, alphabet: this.alphabet
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Nist256p1PublicKey);
        const payload = (0, utils_1.concatBytes)(this.addressPrefix, pk.getRawCompressed(), this.addressSuffix);
        const hashed = (0, crypto_1.hash160)(payload);
        const version = (0, utils_1.getBytes)(options.addressVersion ?? this.addressVersion);
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)((0, utils_1.getBytes)((0, utils_1.concatBytes)(version, hashed)), options.alphabet ?? this.alphabet));
    }
    /**
     * Decodes a NEO address back into a public key.
     * Verifies version and length, and extracts the original public key bytes.
     *
     * @param {string} address - The NEO address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including address version and alphabet.
     * @returns {string} The public key as a string extracted from the address.
     * @throws {AddressError} If the address version or length is invalid.
     */
    static decode(address, options = {
        addressVersion: this.addressVersion, alphabet: this.alphabet
    }) {
        const decoded = (0, base58_1.checkDecode)(address, options.alphabet ?? this.alphabet);
        const version = (0, utils_1.getBytes)(options.addressVersion ?? this.addressVersion);
        const expectedLength = 20 + version.length;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const versionGot = decoded.subarray(0, version.length);
        if (!(0, utils_1.equalBytes)(version, versionGot)) {
            throw new exceptions_1.AddressError('Invalid address version', {
                expected: (0, utils_1.bytesToString)(version), got: (0, utils_1.bytesToString)(versionGot)
            });
        }
        return (0, utils_1.bytesToString)(decoded.subarray(version.length));
    }
}
exports.NeoAddress = NeoAddress;
//# sourceMappingURL=neo.js.map