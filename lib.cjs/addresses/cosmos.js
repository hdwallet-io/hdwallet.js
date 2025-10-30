"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosAddress = void 0;
const bech32_1 = require("../libs/bech32");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing Cosmos blockchain addresses.
 * Provides encoding and decoding of public keys using Bech32 format.
 * Extends the abstract Address class.
 */
class CosmosAddress extends address_1.Address {
    static hrp = cryptocurrencies_1.Cosmos.NETWORKS.MAINNET.HRP;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Cosmos'
     */
    static getName() {
        return 'Cosmos';
    }
    /**
     * Encodes a public key into a Cosmos address.
     * The public key is first hashed using SHA256, then RIPEMD160, and finally encoded in Bech32 format.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey object)
     * @param options Address options including HRP prefix
     * @throws {AddressError} If Bech32 encoding fails
     * @returns {string} Encoded Cosmos address
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const hash = (0, crypto_1.ripemd160)((0, crypto_1.sha256)(pk.getRawCompressed()));
        const hrp = options.hrp ?? this.hrp;
        const encoded = (0, bech32_1.bech32Encode)(hrp, hash);
        if (encoded === null) {
            throw new exceptions_1.AddressError('Failed to encode Bech32 address');
        }
        return encoded;
    }
    /**
     * Decodes a Cosmos address into its raw public key bytes.
     * Validates that the HRP prefix matches the expected network prefix.
     *
     * @param address Cosmos address to decode
     * @param options Address options including HRP prefix
     * @throws {AddressError} If HRP prefix is invalid or decoding fails
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [gotHrp, decoded] = (0, bech32_1.bech32Decode)(hrp, address);
        if (typeof gotHrp !== 'string' || gotHrp !== hrp) {
            throw new exceptions_1.AddressError('Invalid HRP prefix or decode failure', {
                expected: hrp, got: gotHrp
            });
        }
        return (0, utils_1.bytesToString)(decoded);
    }
}
exports.CosmosAddress = CosmosAddress;
//# sourceMappingURL=cosmos.js.map