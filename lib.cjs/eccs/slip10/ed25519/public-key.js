"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519PublicKey = void 0;
const ed25519_1 = require("@noble/curves/ed25519");
const public_key_1 = require("../../public-key");
const consts_1 = require("../../../consts");
const point_1 = require("./point");
const utils_1 = require("../../../utils");
/**
 * Represents a public key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, compressed/uncompressed bytes, and point access.
 * @extends PublicKey
 */
class SLIP10Ed25519PublicKey extends public_key_1.PublicKey {
    /** @returns {string} The name of the elliptic curve. */
    getName() {
        return 'SLIP10-Ed25519';
    }
    /**
     * Create a public key from raw bytes.
     * @param {Uint8Array} publicKey - Encoded public key bytes.
     * @returns {PublicKey} The constructed public key.
     * @throws {Error} If the byte length is invalid or data is invalid.
     */
    static fromBytes(publicKey) {
        let data = publicKey;
        const prefix = consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX;
        if (data.length === prefix.length + consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH &&
            data[0] === prefix[0]) {
            data = data.slice(prefix.length);
        }
        if (data.length !== consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH) {
            throw new Error('Invalid key bytes length');
        }
        try {
            const pt = ed25519_1.ed25519.Point.fromHex(data);
            return new this(pt);
        }
        catch {
            throw new Error('Invalid key bytes');
        }
    }
    /**
     * Create a public key from a point.
     * @param {Point} point - The elliptic curve point.
     * @returns {PublicKey} The constructed public key.
     */
    static fromPoint(point) {
        const raw = point.getRawEncoded();
        return this.fromBytes(raw);
    }
    /** @returns {number} The length of the compressed public key in bytes. */
    static getCompressedLength() {
        return consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH + consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX.length;
    }
    /** @returns {number} The length of the uncompressed public key in bytes. */
    static getUncompressedLength() {
        return this.getCompressedLength();
    }
    /** @returns {any} The underlying public key object. */
    getUnderlyingObject() {
        return this.publicKey;
    }
    /** @returns {Uint8Array} The compressed public key bytes. */
    getRawCompressed() {
        return (0, utils_1.concatBytes)(consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX, this.publicKey.toRawBytes());
    }
    /** @returns {Uint8Array} The uncompressed public key bytes (same as compressed). */
    getRawUncompressed() {
        return this.getRawCompressed();
    }
    /** @returns {Point} The elliptic curve point corresponding to this public key. */
    getPoint() {
        return new point_1.SLIP10Ed25519Point(this.publicKey);
    }
}
exports.SLIP10Ed25519PublicKey = SLIP10Ed25519PublicKey;
//# sourceMappingURL=public-key.js.map