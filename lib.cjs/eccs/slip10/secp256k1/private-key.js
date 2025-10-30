"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Secp256k1PrivateKey = void 0;
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/curves/abstract/utils");
const private_key_1 = require("../../private-key");
const public_key_1 = require("./public-key");
const consts_1 = require("../../../consts");
const utils_2 = require("../../../utils");
/**
 * Represents a SLIP10 Secp256k1 private key.
 * @extends PrivateKey
 */
class SLIP10Secp256k1PrivateKey extends private_key_1.PrivateKey {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Secp256k1';
    }
    /**
     * Creates a private key from raw bytes.
     * @param {Uint8Array} privateKey - Raw private key bytes.
     * @returns {SLIP10Secp256k1PrivateKey} Private key instance.
     * @throws {Error} If the bytes are invalid or wrong length.
     */
    static fromBytes(privateKey) {
        if (privateKey.length !== consts_1.SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            const priv = (0, utils_1.bytesToNumberBE)((0, utils_2.getBytes)(privateKey));
            const point = secp256k1_1.secp256k1.Point.BASE.multiply(priv);
            return new SLIP10Secp256k1PrivateKey({ priv, point });
        }
        catch {
            throw new Error('Invalid private key bytes');
        }
    }
    /**
     * Returns the length of the private key in bytes.
     * @returns {number} Private key byte length.
     */
    static getLength() {
        return consts_1.SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH;
    }
    /**
     * Returns the raw bytes of the private key.
     * @returns {Uint8Array} Raw private key bytes.
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
     * Returns the corresponding public key for this private key.
     * @returns {PublicKey} Public key instance.
     */
    getPublicKey() {
        return new public_key_1.SLIP10Secp256k1PublicKey(this.privateKey.point);
    }
}
exports.SLIP10Secp256k1PrivateKey = SLIP10Secp256k1PrivateKey;
//# sourceMappingURL=private-key.js.map