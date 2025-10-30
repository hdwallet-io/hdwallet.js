"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuiAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a Sui blockchain address.
 * Provides encoding and decoding functionality for Sui addresses based on Ed25519 public keys.
 */
class SuiAddress extends address_1.Address {
    static keyType = (0, utils_1.integerToBytes)(cryptocurrencies_1.Sui.PARAMS.KEY_TYPE);
    static addressPrefix = cryptocurrencies_1.Sui.PARAMS.ADDRESS_PREFIX;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Sui").
     */
    static getName() {
        return 'Sui';
    }
    /**
     * Encodes a public key into a Sui blockchain address.
     * The address is derived by hashing the key type prefix and the raw public key bytes with Blake2b-256.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The Sui address string with the appropriate prefix.
     */
    static encode(publicKey) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        const hash = (0, crypto_1.blake2b256)((0, utils_1.getBytes)(new Uint8Array([...this.keyType, ...raw])));
        return this.addressPrefix + (0, utils_1.bytesToString)(hash);
    }
    /**
     * Decodes a Sui address string into its raw address body (without prefix).
     * Performs basic validation on the address prefix and length.
     * @param {string} address - The Sui address to decode.
     * @returns {string} The raw address body as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid prefix or length.
     */
    static decode(address) {
        const prefix = address.slice(0, this.addressPrefix.length);
        if (prefix !== this.addressPrefix) {
            throw new exceptions_1.AddressError('Invalid address prefix', {
                expected: this.addressPrefix, got: prefix
            });
        }
        const body = address.slice(this.addressPrefix.length);
        if (body.length !== 64) {
            throw new exceptions_1.AddressError('Invalid address length', {
                expected: 64, got: body.length
            });
        }
        return body;
    }
}
exports.SuiAddress = SuiAddress;
//# sourceMappingURL=sui.js.map