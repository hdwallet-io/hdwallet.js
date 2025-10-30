"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base58_1 = require("../libs/base58");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const cryptocurrency_1 = require("../cryptocurrencies/cryptocurrency");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a Monero blockchain address.
 * Supports standard, integrated, and sub-address types across mainnet, stagenet, and testnet.
 */
class MoneroAddress extends address_1.Address {
    static checksumLength = cryptocurrencies_1.Monero.PARAMS.CHECKSUM_LENGTH;
    static paymentIDLength = cryptocurrencies_1.Monero.PARAMS.PAYMENT_ID_LENGTH;
    static network = cryptocurrencies_1.Monero.DEFAULT_NETWORK;
    static addressType = cryptocurrencies_1.Monero.DEFAULT_ADDRESS_TYPE;
    static networks = {
        mainnet: {
            addressTypes: {
                'standard': cryptocurrencies_1.Monero.NETWORKS.MAINNET.STANDARD,
                'integrated': cryptocurrencies_1.Monero.NETWORKS.MAINNET.INTEGRATED,
                'sub-address': cryptocurrencies_1.Monero.NETWORKS.MAINNET.SUB_ADDRESS
            }
        },
        stagenet: {
            addressTypes: {
                'standard': cryptocurrencies_1.Monero.NETWORKS.STAGENET.STANDARD,
                'integrated': cryptocurrencies_1.Monero.NETWORKS.STAGENET.INTEGRATED,
                'sub-address': cryptocurrencies_1.Monero.NETWORKS.STAGENET.SUB_ADDRESS
            }
        },
        testnet: {
            addressTypes: {
                'standard': cryptocurrencies_1.Monero.NETWORKS.TESTNET.STANDARD,
                'integrated': cryptocurrencies_1.Monero.NETWORKS.TESTNET.INTEGRATED,
                'sub-address': cryptocurrencies_1.Monero.NETWORKS.TESTNET.SUB_ADDRESS
            }
        }
    };
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName() {
        return 'Monero';
    }
    /**
     * Computes a Monero address checksum using Keccak256.
     * @param {Uint8Array} data - Data to hash for checksum.
     * @returns {Uint8Array} Checksum bytes.
     */
    static computeChecksum(data) {
        return (0, crypto_1.keccak256)(data).subarray(0, this.checksumLength);
    }
    /**
     * Encodes Monero spend and view public keys into a Monero address.
     * Supports optional payment ID for integrated addresses.
     *
     * @param {object} publicKeys - Spend and view public keys.
     * @param {Uint8Array | string | PublicKey} publicKeys.spendPublicKey - Spend public key.
     * @param {Uint8Array | string | PublicKey} publicKeys.viewPublicKey - View public key.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.network=this.network] - Network type (mainnet, stagenet, testnet).
     * @param {string} [options.addressType=this.addressType] - Address type (standard, integrated, sub-address).
     * @param {Uint8Array | string} [options.paymentID] - Optional payment ID for integrated addresses.
     * @returns {string} Monero address.
     * @throws {BaseError|AddressError} If keys, payment ID, or network/version are invalid.
     */
    static encode(publicKeys, options = {
        network: this.network, addressType: this.addressType
    }) {
        const { spendPublicKey, viewPublicKey } = publicKeys;
        const addressType = options.addressType ?? this.addressType;
        const paymentID = options.paymentID ? (0, utils_1.getBytes)(options.paymentID) : undefined;
        const spend = (0, eccs_1.validateAndGetPublicKey)(spendPublicKey, eccs_1.SLIP10Ed25519MoneroPublicKey);
        const view = (0, eccs_1.validateAndGetPublicKey)(viewPublicKey, eccs_1.SLIP10Ed25519MoneroPublicKey);
        if (paymentID && paymentID.length !== this.paymentIDLength) {
            throw new exceptions_1.BaseError('Invalid payment ID length', {
                expected: this.paymentIDLength, got: paymentID.length
            });
        }
        const network = options.network ?? this.network;
        const resolvedNetwork = (0, utils_1.ensureTypeMatch)(network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const version = (0, utils_1.integerToBytes)(this.networks[networkName].addressTypes[addressType]);
        const payload = (0, utils_1.concatBytes)(version, spend.getRawCompressed(), view.getRawCompressed(), (0, utils_1.getBytes)(paymentID ?? new Uint8Array(0)));
        const checksum = this.computeChecksum((0, utils_1.getBytes)(payload));
        return (0, base58_1.encodeMonero)((0, utils_1.getBytes)((0, utils_1.concatBytes)(payload, checksum)));
    }
    /**
     * Decodes a Monero address into its spend and view public keys.
     * Verifies checksum, network, address type, and optional payment ID.
     *
     * @param {string} address - Monero address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.network=this.network] - Network type (mainnet, stagenet, testnet).
     * @param {string} [options.addressType=this.addressType] - Address type (standard, integrated, sub-address).
     * @param {Uint8Array | string} [options.paymentID] - Optional payment ID for integrated addresses.
     * @returns {[string, string]} Tuple containing spend and view public key bytes as strings.
     * @throws {BaseError|AddressError} If checksum, version, payload length, or keys are invalid.
     */
    static decode(address, options = {
        network: this.network, addressType: this.addressType
    }) {
        const addressType = options.addressType ?? this.addressType;
        const paymentID = (0, utils_1.getBytes)(options.paymentID ?? new Uint8Array(0));
        const decoded = (0, base58_1.decodeMonero)(address);
        const checksum = decoded.subarray(-this.checksumLength);
        const payloadWithPrefix = decoded.subarray(0, -this.checksumLength);
        const computedChecksum = this.computeChecksum(payloadWithPrefix);
        if (!(0, utils_1.equalBytes)(checksum, computedChecksum)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToString)(checksum), got: (0, utils_1.bytesToString)(computedChecksum)
            });
        }
        const network = options.network ?? this.network;
        const resolvedNetwork = (0, utils_1.ensureTypeMatch)(network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const version = (0, utils_1.integerToBytes)(this.networks[networkName].addressTypes[addressType]);
        const versionGot = payloadWithPrefix.subarray(0, version.length);
        if (!(0, utils_1.equalBytes)(versionGot, version)) {
            throw new exceptions_1.AddressError('Invalid version', { expected: version, got: versionGot });
        }
        const payload = payloadWithPrefix.subarray(version.length);
        const pubkeyLen = eccs_1.SLIP10Ed25519MoneroPublicKey.getCompressedLength();
        let spend;
        let view;
        if (payload.length === 2 * pubkeyLen) {
            spend = payload.subarray(0, pubkeyLen);
            view = payload.subarray(pubkeyLen);
        }
        else if (payload.length === 2 * pubkeyLen + this.paymentIDLength) {
            if (!paymentID || paymentID.length !== this.paymentIDLength) {
                throw new exceptions_1.BaseError('Missing or invalid payment ID');
            }
            const paymentIDGot = payload.subarray(-this.paymentIDLength);
            if (!(0, utils_1.equalBytes)(paymentID, paymentIDGot)) {
                throw new exceptions_1.BaseError('Payment ID mismatch', {
                    expected: (0, utils_1.bytesToString)(paymentIDGot), got: (0, utils_1.bytesToString)(paymentID)
                });
            }
            spend = payload.subarray(0, pubkeyLen);
            view = payload.subarray(pubkeyLen, pubkeyLen * 2);
        }
        else {
            throw new exceptions_1.AddressError('Invalid payload length', {
                expected: 2 * pubkeyLen, got: payload.length
            });
        }
        if (!eccs_1.SLIP10Ed25519MoneroPublicKey.isValidBytes(spend)) {
            throw new exceptions_1.BaseError('Invalid spend public key');
        }
        if (!eccs_1.SLIP10Ed25519MoneroPublicKey.isValidBytes(view)) {
            throw new exceptions_1.BaseError('Invalid view public key');
        }
        return [(0, utils_1.bytesToString)(spend), (0, utils_1.bytesToString)(view)];
    }
}
exports.MoneroAddress = MoneroAddress;
//# sourceMappingURL=monero.js.map