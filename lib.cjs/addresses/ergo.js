"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErgoAddress = void 0;
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
const cryptocurrency_1 = require("../cryptocurrencies/cryptocurrency");
/**
 * Class representing Ergo blockchain addresses.
 * Provides encoding and decoding of public keys into Ergo addresses using Base58 with a checksum.
 * Supports different address types (p2pkh, p2sh) and networks (mainnet, testnet).
 * Extends the abstract Address class.
 */
class ErgoAddress extends address_1.Address {
    static checksumLength = cryptocurrencies_1.Ergo.PARAMS.CHECKSUM_LENGTH;
    static addressType = cryptocurrencies_1.Ergo.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        'p2pkh': cryptocurrencies_1.Ergo.PARAMS.ADDRESS_TYPES.P2PKH,
        'p2sh': cryptocurrencies_1.Ergo.PARAMS.ADDRESS_TYPES.P2SH
    };
    static networkType = cryptocurrencies_1.Ergo.DEFAULT_NETWORK;
    static networkTypes = {
        'mainnet': cryptocurrencies_1.Ergo.NETWORKS.MAINNET.TYPE,
        'testnet': cryptocurrencies_1.Ergo.NETWORKS.TESTNET.TYPE
    };
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Ergo'
     */
    static getName() {
        return 'Ergo';
    }
    /**
     * Computes the checksum for Ergo address encoding.
     * Uses Blake2b256 hash and takes the first `checksumLength` bytes.
     *
     * @param data Bytes to compute checksum from
     * @returns {Uint8Array} Computed checksum
     */
    static computeChecksum(data) {
        return (0, crypto_1.blake2b256)(data).slice(0, this.checksumLength);
    }
    /**
     * Encodes a public key into an Ergo address.
     * Combines network type, address type, and compressed public key bytes with a checksum,
     * then encodes the result in Base58.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including addressType and networkType
     * @throws {NetworkError} If the network type is invalid
     * @throws {AddressError} If the address type is invalid
     * @returns {string} Encoded Ergo address
     */
    static encode(publicKey, options = {
        addressType: this.addressType,
        networkType: this.networkType
    }) {
        const network = options.networkType ?? this.networkType;
        const resolvedNetwork = (0, utils_1.ensureTypeMatch)(network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const networkType = this.networkTypes[networkName];
        if (networkType === undefined) {
            throw new exceptions_1.NetworkError('Invalid Ergo network type', {
                expected: Object.keys(this.networkTypes), got: network
            });
        }
        const addressType = this.addressTypes[options.addressType ?? this.addressType];
        if (addressType === undefined) {
            throw new exceptions_1.AddressError('Invalid Ergo address type', {
                expected: Object.keys(this.addressTypes), got: options.addressType
            });
        }
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const prefix = (0, utils_1.integerToBytes)(addressType + networkType);
        const addressPayload = (0, utils_1.concatBytes)(prefix, pk.getRawCompressed());
        const checksum = this.computeChecksum(addressPayload);
        return (0, utils_1.ensureString)((0, base58_1.encode)((0, utils_1.concatBytes)(addressPayload, checksum)));
    }
    /**
     * Decodes an Ergo address back to the raw public key bytes.
     * Validates prefix, length, checksum, and public key bytes.
     *
     * @param address Ergo address to decode
     * @param options Address options including addressType and networkType
     * @throws {NetworkError} If the network type is invalid
     * @throws {AddressError} If the address type, prefix, length, checksum, or public key is invalid
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address, options = {
        addressType: this.addressType,
        networkType: this.networkType
    }) {
        const network = options.networkType ?? this.networkType;
        const resolvedNetwork = (0, utils_1.ensureTypeMatch)(network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const networkType = this.networkTypes[networkName];
        if (networkType === undefined) {
            throw new exceptions_1.NetworkError('Invalid Ergo network type', {
                expected: Object.keys(this.networkTypes), got: options.networkType
            });
        }
        const addressType = this.addressTypes[options.addressType ?? this.addressType];
        if (addressType === undefined) {
            throw new exceptions_1.AddressError('Invalid Ergo address type', {
                expected: Object.keys(this.addressTypes), got: options.addressType
            });
        }
        const prefix = (0, utils_1.getBytes)((0, utils_1.integerToBytes)(addressType + networkType));
        const decoded = (0, base58_1.decode)(address);
        const expectedLength = eccs_1.SLIP10Secp256k1PublicKey.getCompressedLength() + this.checksumLength + prefix.length;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const checksum = decoded.slice(-this.checksumLength);
        const payload = decoded.slice(0, -this.checksumLength);
        const checksumExpected = this.computeChecksum(payload);
        if (!(0, utils_1.equalBytes)(checksum, checksumExpected)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToHex)(checksumExpected), got: (0, utils_1.bytesToHex)(checksum)
            });
        }
        const prefixGot = payload.slice(0, prefix.length);
        if (!(0, utils_1.equalBytes)(prefix, prefixGot)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: (0, utils_1.bytesToHex)(prefix), got: (0, utils_1.bytesToHex)(prefixGot)
            });
        }
        const pubKey = payload.slice(prefix.length);
        if (!eccs_1.SLIP10Secp256k1PublicKey.isValidBytes(pubKey)) {
            throw new exceptions_1.AddressError('Invalid public key', {
                got: (0, utils_1.bytesToHex)(pubKey)
            });
        }
        return (0, utils_1.bytesToString)(pubKey);
    }
}
exports.ErgoAddress = ErgoAddress;
//# sourceMappingURL=ergo.js.map