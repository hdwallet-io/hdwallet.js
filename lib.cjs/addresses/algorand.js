"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorandAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base32_1 = require("../libs/base32");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing Algorand addresses.
 * Extends the abstract Address class to provide Algorand-specific encoding and decoding.
 */
class AlgorandAddress extends address_1.Address {
    static checksumLength = cryptocurrencies_1.Algorand.PARAMS.CHECKSUM_LENGTH;
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Algorand'
     */
    static getName() {
        return 'Algorand';
    }
    /**
     * Computes the checksum for a given public key.
     * Algorand uses the last 4 bytes of sha512_256 hash of the public key as checksum.
     *
     * @param publicKey The public key bytes to compute checksum for
     * @returns {Uint8Array} 4-byte checksum
     */
    static computeChecksum(publicKey) {
        return (0, crypto_1.sha512_256)(publicKey).subarray(-4);
    }
    /**
     * Encodes a public key into an Algorand address.
     *
     * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
     * @throws {AddressError} If the public key is invalid
     * @returns {string} Encoded Algorand address
     */
    static encode(publicKey) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        const checksum = this.computeChecksum(raw);
        return (0, base32_1.encodeNoPadding)((0, utils_1.bytesToString)((0, utils_1.concatBytes)(raw, checksum)));
    }
    /**
     * Decodes an Algorand address back into its raw public key.
     *
     * @param address The Algorand address string to decode
     * @throws {AddressError} If the decoded length is invalid, checksum does not match, or public key is invalid
     * @returns {string} Raw public key as a string
     */
    static decode(address) {
        const decoded = (0, utils_1.getBytes)((0, base32_1.decode)(address));
        const expectedLength = eccs_1.SLIP10Ed25519PublicKey.getCompressedLength() - 1 + this.checksumLength;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid decoded length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const pubkey = decoded.subarray(0, decoded.length - this.checksumLength);
        const checksum = decoded.subarray(-this.checksumLength);
        const gotChecksum = this.computeChecksum(pubkey);
        if (!(0, utils_1.equalBytes)(checksum, gotChecksum)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToString)(checksum), got: (0, utils_1.bytesToString)(gotChecksum)
            });
        }
        if (!eccs_1.SLIP10Ed25519PublicKey.isValidBytes(pubkey)) {
            throw new exceptions_1.AddressError('Invalid public key');
        }
        return (0, utils_1.bytesToString)(pubkey);
    }
}
exports.AlgorandAddress = AlgorandAddress;
//# sourceMappingURL=algorand.js.map