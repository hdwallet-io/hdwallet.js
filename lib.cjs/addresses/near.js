"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearAddress = void 0;
const exceptions_1 = require("../exceptions");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const address_1 = require("./address");
/**
 * Class representing a NEAR Protocol blockchain address.
 * Handles encoding and decoding of public keys in NEAR format.
 */
class NearAddress extends address_1.Address {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Near").
     */
    static getName() {
        return 'Near';
    }
    /**
     * Encodes a given public key into a NEAR address string.
     * Strips the first two bytes of the compressed key for NEAR-specific formatting.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} Encoded NEAR address string.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        return (0, utils_1.bytesToString)(pk.getRawCompressed()).slice(2);
    }
    /**
     * Decodes a NEAR address back into a public key.
     * Verifies the length and validates the public key format.
     *
     * @param {string} address - The NEAR address to decode.
     * @returns {string} The original public key as a string.
     * @throws {AddressError} If the address length is incorrect or the public key is invalid.
     */
    static decode(address) {
        const bytes = (0, utils_1.getBytes)(address);
        const expectedLength = 32;
        if (bytes.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid address length', {
                expected: expectedLength, got: bytes.length
            });
        }
        (0, eccs_1.validateAndGetPublicKey)(bytes, eccs_1.SLIP10Ed25519PublicKey);
        return address;
    }
}
exports.NearAddress = NearAddress;
//# sourceMappingURL=near.js.map