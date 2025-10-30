"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Nist256p1PublicKey = void 0;
const p256_1 = require("@noble/curves/p256");
const public_key_1 = require("../../public-key");
const point_1 = require("./point");
const consts_1 = require("../../../consts");
const utils_1 = require("../../../utils");
/**
 * Represents a public key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PublicKey
 */
class SLIP10Nist256p1PublicKey extends public_key_1.PublicKey {
    /**
     * Returns the name of the public key curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Nist256p1';
    }
    /**
     * Creates a public key from raw bytes.
     * @param {Uint8Array} publicKey - Raw public key bytes.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     * @throws {Error} If the input bytes are invalid.
     */
    static fromBytes(publicKey) {
        try {
            const point = p256_1.p256.Point.fromHex((0, utils_1.getBytes)(publicKey));
            return new SLIP10Nist256p1PublicKey(point);
        }
        catch {
            throw new Error('Invalid key bytes');
        }
    }
    /**
     * Creates a public key from a point.
     * @param {Point} point - Elliptic curve point.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     */
    static fromPoint(point) {
        const base = point.getUnderlyingObject();
        return new SLIP10Nist256p1PublicKey(base);
    }
    /**
     * Returns the length of the compressed public key in bytes.
     * @returns {number} Compressed key length.
     */
    static getCompressedLength() {
        return consts_1.SLIP10_SECP256K1_CONST.PUBLIC_KEY_COMPRESSED_BYTE_LENGTH;
    }
    /**
     * Returns the length of the uncompressed public key in bytes.
     * @returns {number} Uncompressed key length.
     */
    static getUncompressedLength() {
        return consts_1.SLIP10_SECP256K1_CONST.PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH;
    }
    /**
     * Returns the underlying public key object.
     * @returns {any} Underlying public key object.
     */
    getUnderlyingObject() {
        return this.publicKey;
    }
    /**
     * Returns the compressed raw bytes of the public key.
     * @returns {Uint8Array} Compressed key bytes.
     */
    getRawCompressed() {
        return this.publicKey.toRawBytes(true);
    }
    /**
     * Returns the uncompressed raw bytes of the public key.
     * @returns {Uint8Array} Uncompressed key bytes.
     */
    getRawUncompressed() {
        return this.publicKey.toRawBytes(false);
    }
    /**
     * Returns the raw bytes of the public key (default: compressed).
     * @returns {Uint8Array} Raw key bytes.
     */
    getRaw() {
        return this.getRawCompressed();
    }
    /**
     * Returns the elliptic curve point corresponding to the public key.
     * @returns {Point} Elliptic curve point.
     */
    getPoint() {
        return new point_1.SLIP10Nist256p1Point(this.publicKey);
    }
}
exports.SLIP10Nist256p1PublicKey = SLIP10Nist256p1PublicKey;
//# sourceMappingURL=public-key.js.map