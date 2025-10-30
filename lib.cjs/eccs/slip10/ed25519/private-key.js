"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519PrivateKey = void 0;
const ed25519_1 = require("@noble/curves/ed25519");
const private_key_1 = require("../../private-key");
const public_key_1 = require("./public-key");
const consts_1 = require("../../../consts");
/**
 * Represents a private key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, raw access, and public key derivation.
 * @extends PrivateKey
 */
class SLIP10Ed25519PrivateKey extends private_key_1.PrivateKey {
    /** @returns {string} The name of the elliptic curve. */
    getName() {
        return 'SLIP10-Ed25519';
    }
    /**
     * Create a private key from raw bytes.
     * @param {Uint8Array} privateKey - Encoded private key bytes.
     * @returns {PrivateKey} The constructed private key.
     * @throws {Error} If the byte length is invalid or data is invalid.
     */
    static fromBytes(privateKey) {
        if (privateKey.length !== consts_1.SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            return new this(privateKey);
        }
        catch {
            throw new Error('Invalid private key bytes');
        }
    }
    /** @returns {number} The expected length of the private key in bytes. */
    static getLength() {
        return consts_1.SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH;
    }
    /** @returns {Uint8Array} Raw private key bytes. */
    getRaw() {
        return this.privateKey;
    }
    /** @returns {any} The underlying private key object. */
    getUnderlyingObject() {
        return this.privateKey;
    }
    /**
     * Derive the corresponding public key from this private key.
     * @returns {PublicKey} The derived public key.
     */
    getPublicKey() {
        const pub = ed25519_1.ed25519.getPublicKey(this.getRaw());
        return public_key_1.SLIP10Ed25519PublicKey.fromBytes(pub);
    }
}
exports.SLIP10Ed25519PrivateKey = SLIP10Ed25519PrivateKey;
//# sourceMappingURL=private-key.js.map