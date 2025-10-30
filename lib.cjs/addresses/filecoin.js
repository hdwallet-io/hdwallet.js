"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilecoinAddress = void 0;
const base32_1 = require("../libs/base32");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing Filecoin blockchain addresses.
 * Provides encoding and decoding of public keys into Filecoin addresses.
 * Supports SECP256K1 and BLS address types and computes checksums using Blake2b.
 * Extends the abstract Address class.
 */
class FilecoinAddress extends address_1.Address {
    static alphabet = cryptocurrencies_1.Filecoin.PARAMS.ALPHABET;
    static addressPrefix = cryptocurrencies_1.Filecoin.PARAMS.ADDRESS_PREFIX;
    static addressType = cryptocurrencies_1.Filecoin.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        secp256k1: cryptocurrencies_1.Filecoin.PARAMS.ADDRESS_TYPES.SECP256K1,
        bls: cryptocurrencies_1.Filecoin.PARAMS.ADDRESS_TYPES.BLS
    };
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Filecoin'
     */
    static getName() {
        return 'Filecoin';
    }
    /**
     * Computes the checksum for a Filecoin address.
     * Uses Blake2b-32 on the concatenation of address type and public key hash.
     *
     * @param pubKeyHash Public key hash bytes (20-byte Blake2b-160 hash)
     * @param addressType Numeric address type
     * @returns {Uint8Array} Checksum bytes (4 bytes)
     */
    static computeChecksum(pubKeyHash, addressType) {
        return (0, crypto_1.blake2b32)((0, utils_1.concatBytes)((0, utils_1.integerToBytes)(addressType), pubKeyHash));
    }
    /**
     * Encodes a public key into a Filecoin address.
     * Combines the public key hash, address type, and checksum into a base32 string with prefix.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If public key or address type is invalid
     * @returns {string} Encoded Filecoin address
     */
    static encode(publicKey, options = {
        addressPrefix: this.addressPrefix,
        addressType: this.addressType
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const pubKeyHash = (0, crypto_1.blake2b160)(pk.getRawUncompressed());
        const typeKey = options.addressType ?? this.addressType;
        const addressType = this.addressTypes[typeKey];
        if (addressType === undefined) {
            throw new exceptions_1.AddressError('Invalid Filecoin address type', {
                expected: Object.keys(FilecoinAddress.addressTypes),
                got: typeKey
            });
        }
        const checksum = FilecoinAddress.computeChecksum(pubKeyHash, addressType);
        const base32Encoded = (0, base32_1.encodeNoPadding)((0, utils_1.bytesToString)((0, utils_1.concatBytes)(pubKeyHash, checksum)), FilecoinAddress.alphabet);
        return FilecoinAddress.addressPrefix + String.fromCharCode(addressType + '0'.charCodeAt(0)) + base32Encoded;
    }
    /**
     * Decodes a Filecoin address back to its public key hash.
     * Validates prefix, address type, length, and checksum.
     *
     * @param address Filecoin address string to decode
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If prefix, address type, length, or checksum is invalid
     * @returns {string} Decoded public key hash (20-byte hex string)
     */
    static decode(address, options = {
        addressPrefix: this.addressPrefix,
        addressType: this.addressType
    }) {
        const prefix = FilecoinAddress.addressPrefix;
        if (!address.startsWith(prefix)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: prefix,
                got: address.slice(0, prefix.length)
            });
        }
        const addressBody = address.slice(prefix.length);
        const typeKey = options.addressType ?? this.addressType;
        const expectedType = FilecoinAddress.addressTypes[typeKey];
        if (expectedType === undefined) {
            throw new exceptions_1.AddressError('Invalid Filecoin address type', {
                expected: Object.keys(FilecoinAddress.addressTypes),
                got: typeKey
            });
        }
        const actualType = addressBody.charCodeAt(0) - '0'.charCodeAt(0);
        if (expectedType !== actualType) {
            throw new exceptions_1.AddressError('Invalid address type', {
                expected: expectedType,
                got: actualType
            });
        }
        const payloadBytes = (0, utils_1.getBytes)((0, base32_1.decode)(addressBody.slice(1), FilecoinAddress.alphabet));
        if (payloadBytes.length !== 24) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: 24, got: payloadBytes.length
            });
        }
        const publicKeyHash = payloadBytes.slice(0, 20);
        const checksum = payloadBytes.slice(20);
        const expectedChecksum = FilecoinAddress.computeChecksum(publicKeyHash, expectedType);
        if (!(0, utils_1.equalBytes)(checksum, expectedChecksum)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToHex)(expectedChecksum), got: (0, utils_1.bytesToHex)(checksum)
            });
        }
        return (0, utils_1.bytesToString)(publicKeyHash);
    }
}
exports.FilecoinAddress = FilecoinAddress;
//# sourceMappingURL=filecoin.js.map