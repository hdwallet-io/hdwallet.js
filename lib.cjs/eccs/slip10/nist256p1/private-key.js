"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Nist256p1PrivateKey = void 0;
const p256_1 = require("@noble/curves/p256");
const utils_1 = require("@noble/curves/abstract/utils");
const private_key_1 = require("../../private-key");
const public_key_1 = require("./public-key");
const consts_1 = require("../../../consts");
const utils_2 = require("../../../utils");
/**
 * Represents a private key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PrivateKey
 */
class SLIP10Nist256p1PrivateKey extends private_key_1.PrivateKey {
    /**
     * Returns the name of the private key curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Nist256p1';
    }
    /**
     * Creates a private key from raw bytes.
     * @param {Uint8Array} privateKey - Raw private key bytes.
     * @returns {SLIP10Nist256p1PrivateKey} The private key instance.
     * @throws {Error} If the input bytes are invalid or of incorrect length.
     */
    static fromBytes(privateKey) {
        if (privateKey.length !== consts_1.SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            const priv = (0, utils_1.bytesToNumberBE)((0, utils_2.getBytes)(privateKey));
            const point = p256_1.p256.Point.BASE.multiply(priv);
            return new SLIP10Nist256p1PrivateKey({ priv, point });
        }
        catch {
            throw new Error('Invalid private key bytes');
        }
    }
    /**
     * Returns the byte length of the private key.
     * @returns {number} Length in bytes.
     */
    static getLength() {
        return consts_1.SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH;
    }
    /**
     * Returns the raw private key bytes.
     * @returns {Uint8Array} Private key as bytes.
     */
    getRaw() {
        return (0, utils_1.numberToBytesBE)(this.privateKey.priv, consts_1.SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH);
    }
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying private key object.
     */
    getUnderlyingObject() {
        return this.privateKey;
    }
    /**
     * Derives the public key corresponding to this private key.
     * @returns {PublicKey} The associated public key.
     */
    getPublicKey() {
        return new public_key_1.SLIP10Nist256p1PublicKey(this.privateKey.point);
    }
}
exports.SLIP10Nist256p1PrivateKey = SLIP10Nist256p1PrivateKey;
//# sourceMappingURL=private-key.js.map