"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZilliqaAddress = void 0;
const bech32_1 = require("../libs/bech32");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing a Zilliqa blockchain address.
 * Uses Bech32 encoding for addresses and derives addresses from the compressed public key.
 */
class ZilliqaAddress extends address_1.Address {
    static hrp = cryptocurrencies_1.Zilliqa.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "Zilliqa".
     */
    static getName() {
        return 'Zilliqa';
    }
    /**
     * Encodes a public key into a Bech32 Zilliqa address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} [options] - Optional encoding parameters, such as HRP.
     * @returns {string} The Bech32-encoded Zilliqa address.
     * @throws {AddressError} If encoding fails.
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const hash = (0, crypto_1.sha256)(pk.getRawCompressed()).slice(-20);
        const hrp = options.hrp ?? this.hrp;
        const encoded = (0, bech32_1.bech32Encode)(hrp, hash);
        if (!encoded) {
            throw new exceptions_1.AddressError('Failed to encode Bech32 Zilliqa address');
        }
        return encoded;
    }
    /**
     * Decodes a Bech32 Zilliqa address back into its public key hash.
     * @param {string} address - The Bech32-encoded Zilliqa address to decode.
     * @param {AddressOptionsInterface} [options] - Optional decoding parameters, such as HRP.
     * @returns {string} The public key hash in byte string format.
     * @throws {AddressError} If decoding fails or the address length is invalid.
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [gotHrp, data] = (0, bech32_1.bech32Decode)(hrp, address);
        if (!gotHrp || !data) {
            throw new exceptions_1.AddressError('Failed to decode Bech32 Zilliqa address');
        }
        if (data.length !== 20) {
            throw new exceptions_1.AddressError('Invalid address length', {
                expected: 20, got: data.length
            });
        }
        return (0, utils_1.bytesToString)(data);
    }
}
exports.ZilliqaAddress = ZilliqaAddress;
//# sourceMappingURL=zilliqa.js.map