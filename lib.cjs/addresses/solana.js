"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAddress = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const address_1 = require("./address");
/**
 * Class representing a Solana (SOL) address.
 * Provides encoding and decoding methods for Solana public keys using Base58.
 */
class SolanaAddress extends address_1.Address {
    static alphabet = cryptocurrencies_1.Solana.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Solana").
     */
    static getName() {
        return 'Solana';
    }
    /**
     * Encodes a public key into a Solana Base58 address.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The Base58-encoded Solana address.
     */
    static encode(publicKey) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Ed25519PublicKey);
        return (0, utils_1.ensureString)((0, base58_1.encode)((0, utils_1.getBytes)(pk.getRawCompressed().subarray(1))));
    }
    /**
     * Decodes a Solana Base58 address into the corresponding public key bytes.
     * @param {string} address - The Base58 Solana address to decode.
     * @returns {string} The decoded public key as a string.
     * @throws {AddressError} If the decoded public key has an invalid length or is invalid.
     */
    static decode(address) {
        const publicKey = (0, base58_1.decode)(address);
        const expectedLength = eccs_1.SLIP10Ed25519PublicKey.getCompressedLength() - 1;
        if (publicKey.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid public key length', {
                expected: expectedLength, got: publicKey.length
            });
        }
        if (!eccs_1.SLIP10Ed25519PublicKey.isValidBytes(publicKey)) {
            throw new exceptions_1.AddressError(`Invalid SLIP10-Ed25519 public key`);
        }
        return (0, utils_1.bytesToString)(publicKey);
    }
}
exports.SolanaAddress = SolanaAddress;
//# sourceMappingURL=solana.js.map