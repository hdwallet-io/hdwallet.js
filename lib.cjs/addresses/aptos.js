"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing Aptos blockchain addresses.
 * Extends the abstract Address class to provide Aptos-specific encoding and decoding.
 */
class AptosAddress extends address_1.Address {
    static suffix = (0, utils_1.integerToBytes)(cryptocurrencies_1.Aptos.PARAMS.SUFFIX);
    static addressPrefix = cryptocurrencies_1.Aptos.PARAMS.ADDRESS_PREFIX;
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Aptos'
     */
    static getName() {
        return 'Aptos';
    }
    /**
     * Encodes a public key into an Aptos address.
     *
     * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
     * @throws {AddressError} If the public key is invalid
     * @returns {string} Encoded Aptos address
     */
    static encode(publicKey) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        const payload = new Uint8Array([...raw, ...this.suffix]);
        const hash = (0, crypto_1.sha3_256)(payload);
        return this.addressPrefix + (0, utils_1.bytesToString)(hash).replace(/^0+/, '');
    }
    /**
     * Decodes an Aptos address back into its raw public key hash.
     *
     * @param address The Aptos address string to decode
     * @throws {AddressError} If the prefix or length of the address is invalid
     * @returns {string} Raw public key hash as a string
     */
    static decode(address) {
        const prefix = address.slice(0, this.addressPrefix.length);
        if (prefix !== this.addressPrefix) {
            throw new exceptions_1.AddressError('Invalid address prefix', {
                expected: this.addressPrefix, got: prefix
            });
        }
        const body = address.slice(this.addressPrefix.length).padStart(64, '0');
        if (body.length !== 64) {
            throw new exceptions_1.AddressError('Invalid address length', {
                expected: 64, got: body.length
            });
        }
        return body;
    }
}
exports.AptosAddress = AptosAddress;
//# sourceMappingURL=aptos.js.map