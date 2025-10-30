"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiversXAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const bech32_1 = require("../libs/bech32");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a MultiversX (formerly Elrond) blockchain address.
 * Supports Bech32 encoding with configurable human-readable part (HRP) for different networks.
 */
class MultiversXAddress extends address_1.Address {
    static hrp = cryptocurrencies_1.MultiversX.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName() {
        return 'MultiversX';
    }
    /**
     * Encodes a public key into a MultiversX address.
     * Uses Bech32 encoding, omitting the first byte of the compressed public key.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Human-readable part for Bech32 encoding.
     * @returns {string} The encoded MultiversX address.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        return (0, bech32_1.bech32Encode)(options.hrp ?? this.hrp, (0, utils_1.getBytes)(raw));
    }
    /**
     * Decodes a MultiversX address back into the public key bytes.
     * Verifies Bech32 decoding with the specified HRP.
     *
     * @param {string} address - The MultiversX address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.hrp=this.hrp] - Expected human-readable part.
     * @returns {string} The public key bytes as a string.
     * @throws {AddressError} If the address is invalid or Bech32 decoding fails.
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const [hrpGot, data] = (0, bech32_1.bech32Decode)(options.hrp ?? this.hrp, address);
        if (!data) {
            throw new exceptions_1.AddressError('Invalid Bech32 decoding result');
        }
        return (0, utils_1.bytesToString)(data);
    }
}
exports.MultiversXAddress = MultiversXAddress;
//# sourceMappingURL=multiversx.js.map