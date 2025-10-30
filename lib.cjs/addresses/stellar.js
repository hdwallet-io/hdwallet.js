"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base32_1 = require("../libs/base32");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a Stellar (XLM) address.
 * Provides encoding and decoding methods for Stellar public keys and private keys using Base32.
 */
class StellarAddress extends address_1.Address {
    static checksumLength = cryptocurrencies_1.Stellar.PARAMS.CHECKSUM_LENGTH;
    static addressType = cryptocurrencies_1.Stellar.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        privateKey: cryptocurrencies_1.Stellar.PARAMS.ADDRESS_TYPES.PRIVATE_KEY,
        publicKey: cryptocurrencies_1.Stellar.PARAMS.ADDRESS_TYPES.PUBLIC_KEY
    };
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Stellar").
     */
    static getName() {
        return 'Stellar';
    }
    /**
     * Computes the checksum for a Stellar address payload.
     * @param {Uint8Array} payload - The payload bytes to compute the checksum for.
     * @returns {Uint8Array} The checksum bytes.
     */
    static computeChecksum(payload) {
        return (0, utils_1.bytesReverse)((0, crypto_1.xmodemCrc)(payload));
    }
    /**
     * Encodes a public key or private key into a Stellar Base32 address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public/private key to encode.
     * @param {AddressOptionsInterface} options - Encoding options including address type.
     * @returns {string} The Base32-encoded Stellar address.
     * @throws {AddressError} If the address type is invalid.
     */
    static encode(publicKey, options = {
        addressType: this.addressType
    }) {
        const addressTypeName = options.addressType ?? this.addressType;
        if (!(addressTypeName in this.addressTypes)) {
            throw new exceptions_1.AddressError('Invalid Stellar address type', {
                expected: Object.keys(this.addressTypes), got: addressTypeName
            });
        }
        const addressType = this.addressTypes[addressTypeName];
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const payload = (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(addressType), pk.getRawCompressed().subarray(1));
        const checksum = this.computeChecksum(payload);
        return (0, base32_1.encodeNoPadding)((0, utils_1.bytesToString)((0, utils_1.concatBytes)(payload, checksum)));
    }
    /**
     * Decodes a Stellar Base32 address into the corresponding public key bytes.
     * @param {string} address - The Base32 Stellar address to decode.
     * @param {AddressOptionsInterface} options - Decoding options including address type.
     * @returns {string} The decoded public key as a string.
     * @throws {AddressError} If the decoded address has an invalid type, checksum, length, or invalid public key.
     */
    static decode(address, options = {
        addressType: this.addressType
    }) {
        const addressTypeName = options.addressType ?? this.addressType;
        if (!(addressTypeName in this.addressTypes)) {
            throw new exceptions_1.AddressError('Invalid Stellar address type', {
                expected: Object.keys(this.addressTypes), got: addressTypeName
            });
        }
        const addressType = this.addressTypes[addressTypeName];
        const decoded = (0, utils_1.getBytes)((0, base32_1.decode)(address));
        const expectedLength = eccs_1.SLIP10Ed25519PublicKey.getCompressedLength() + this.checksumLength;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const checksum = decoded.subarray(-this.checksumLength);
        const payload = decoded.subarray(0, -this.checksumLength);
        const addressTypeGot = payload[0];
        if (addressTypeGot !== addressType) {
            throw new exceptions_1.AddressError('Invalid address type', {
                expected: addressType,
                got: addressTypeGot
            });
        }
        const checksumGot = this.computeChecksum(payload);
        if (!(0, utils_1.equalBytes)(checksum, checksumGot)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToString)(checksum),
                got: (0, utils_1.bytesToString)(checksumGot)
            });
        }
        const pubkey = payload.subarray(1);
        if (!eccs_1.SLIP10Ed25519PublicKey.isValidBytes(pubkey)) {
            throw new exceptions_1.AddressError('Invalid public key');
        }
        return (0, utils_1.bytesToString)(pubkey);
    }
}
exports.StellarAddress = StellarAddress;
//# sourceMappingURL=stellar.js.map