"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOSAddress = void 0;
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing EOS blockchain addresses.
 * Provides encoding and decoding of public keys into EOS addresses using Base58 with a checksum.
 * Extends the abstract Address class.
 */
class EOSAddress extends address_1.Address {
    static addressPrefix = cryptocurrencies_1.EOS.PARAMS.ADDRESS_PREFIX;
    static checksumLength = cryptocurrencies_1.EOS.PARAMS.CHECKSUM_LENGTH;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'EOS'
     */
    static getName() {
        return 'EOS';
    }
    /**
     * Computes the EOS address checksum for a given public key.
     * Uses RIPEMD160 hash and takes the first `checksumLength` bytes.
     *
     * @param pubKeyBytes Raw public key bytes
     * @returns {Uint8Array} Computed checksum
     */
    static computeChecksum(pubKeyBytes) {
        return (0, crypto_1.ripemd160)(pubKeyBytes).slice(0, this.checksumLength);
    }
    /**
     * Encodes a public key into an EOS address.
     * Appends a checksum to the public key bytes and encodes the result in Base58 with a prefix.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including the prefix
     * @throws {AddressError} If encoding fails
     * @returns {string} Encoded EOS address
     */
    static encode(publicKey, options = {
        addressPrefix: this.addressPrefix
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const raw = (0, utils_1.getBytes)(pk.getRawCompressed());
        const checksum = this.computeChecksum(raw);
        const prefix = options.addressPrefix ?? this.addressPrefix;
        return prefix + (0, utils_1.ensureString)((0, base58_1.encode)((0, utils_1.concatBytes)(raw, checksum)));
    }
    /**
     * Decodes an EOS address into its raw public key bytes.
     * Validates the prefix, length, checksum, and public key bytes.
     *
     * @param address EOS address to decode
     * @param options Address options including the prefix
     * @throws {AddressError} If any validation (prefix, length, checksum, public key) fails
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address, options = {
        addressPrefix: this.addressPrefix
    }) {
        const prefix = options.addressPrefix ?? this.addressPrefix;
        if (!address.startsWith(prefix)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: prefix, got: address.slice(0, prefix.length)
            });
        }
        const withoutPrefix = address.slice(prefix.length);
        const decoded = (0, base58_1.decode)(withoutPrefix);
        const expectedLength = eccs_1.SLIP10Secp256k1PublicKey.getCompressedLength() + this.checksumLength;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const publicKeyBytes = decoded.slice(0, -this.checksumLength);
        const checksum = decoded.slice(-this.checksumLength);
        const computedChecksum = this.computeChecksum(publicKeyBytes);
        if (!(0, utils_1.equalBytes)(checksum, computedChecksum)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToHex)(computedChecksum), got: (0, utils_1.bytesToHex)(checksum)
            });
        }
        if (!eccs_1.SLIP10Secp256k1PublicKey.isValidBytes(publicKeyBytes)) {
            throw new exceptions_1.AddressError('Invalid public key bytes', {
                got: (0, utils_1.bytesToHex)(publicKeyBytes)
            });
        }
        return (0, utils_1.bytesToString)(publicKeyBytes);
    }
}
exports.EOSAddress = EOSAddress;
//# sourceMappingURL=eos.js.map