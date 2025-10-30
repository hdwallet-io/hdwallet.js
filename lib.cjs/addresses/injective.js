"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectiveAddress = void 0;
const ethereum_1 = require("./ethereum");
const bech32_1 = require("../libs/bech32");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing an Injective blockchain address.
 * Inherits from the base Address class.
 * Uses Bech32 encoding with Ethereum-style public key hashing.
 */
class InjectiveAddress extends address_1.Address {
    static hrp = cryptocurrencies_1.Injective.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName() {
        return 'Injective';
    }
    /**
    * Encodes a public key into a Bech32 Injective address.
    * Uses Ethereum-style encoding of the public key, then converts to Bech32.
    *
    * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
    * @param {AddressOptionsInterface} [options] - Optional parameters.
    * @param {string} [options.hrp=this.hrp] - Human-readable prefix for Bech32.
    * @returns {string} Bech32-encoded Injective address.
    * @throws {AddressError} If encoding fails.
    */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const ethEncoded = ethereum_1.EthereumAddress.encode(pk, {
            skipChecksumEncode: true
        });
        const rawBytes = (0, utils_1.getBytes)(ethEncoded.slice(2)); // remove "0x"
        const hrp = options.hrp ?? this.hrp;
        const encoded = (0, bech32_1.bech32Encode)(hrp, rawBytes);
        if (!encoded) {
            throw new exceptions_1.AddressError('Failed to encode Bech32 Injective address');
        }
        return encoded;
    }
    /**
     * Decodes a Bech32 Injective address back into its raw public key bytes.
     *
     * @param {string} address - Bech32-encoded Injective address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Expected human-readable prefix for Bech32.
     * @returns {string} Raw public key bytes as a string.
     * @throws {AddressError} If decoding fails, the HRP does not match, or length is invalid.
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [gotHrp, data] = (0, bech32_1.bech32Decode)(hrp, address);
        if (!gotHrp || !data) {
            throw new exceptions_1.AddressError('Failed to decode Bech32 Injective address');
        }
        if (data.length !== 20) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: 20, got: data.length
            });
        }
        return (0, utils_1.bytesToString)(data);
    }
}
exports.InjectiveAddress = InjectiveAddress;
//# sourceMappingURL=injective.js.map