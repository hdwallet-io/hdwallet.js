"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Nist256p1Point = void 0;
const p256_1 = require("@noble/curves/p256");
const utils_1 = require("@noble/curves/abstract/utils");
const point_1 = require("../../point");
const consts_1 = require("../../../consts");
const utils_2 = require("../../../utils");
/**
 * Represents a point on the SLIP10 NIST P-256 elliptic curve.
 * @extends Point
 */
class SLIP10Nist256p1Point extends point_1.Point {
    /**
     * Returns the name of the curve point.
     * @returns {string} Curve point name.
     */
    getName() {
        return 'SLIP10-Nist256p1';
    }
    /**
     * Creates a point from raw bytes.
     * @param {Uint8Array} point - The byte array representing the point.
     * @returns {SLIP10Nist256p1Point} The curve point instance.
     * @throws {Error} If the input bytes are invalid.
     */
    static fromBytes(point) {
        try {
            const pt = p256_1.p256.Point.fromHex((0, utils_2.getBytes)(point));
            return new SLIP10Nist256p1Point(pt);
        }
        catch {
            if (point.length === consts_1.SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH * 2) {
                const x = (0, utils_1.bytesToNumberBE)(point.slice(0, consts_1.SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH));
                const y = (0, utils_1.bytesToNumberBE)(point.slice(consts_1.SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH));
                return SLIP10Nist256p1Point.fromCoordinates(BigInt(x), BigInt(y));
            }
            throw new Error('Invalid point bytes');
        }
    }
    /**
     * Creates a point from x and y coordinates.
     * @param {bigint} x - X coordinate.
     * @param {bigint} y - Y coordinate.
     * @returns {SLIP10Nist256p1Point} The curve point instance.
     */
    static fromCoordinates(x, y) {
        const pt = new p256_1.p256.Point(BigInt(x), BigInt(y), 1n);
        return new SLIP10Nist256p1Point(pt);
    }
    /**
     * Returns the underlying curve point object.
     * @returns {any} Underlying point object.
     */
    getUnderlyingObject() {
        return this.point;
    }
    /**
     * Returns the X coordinate of the point.
     * @returns {bigint} X coordinate.
     */
    getX() {
        return this.point.toAffine().x;
    }
    /**
     * Returns the Y coordinate of the point.
     * @returns {bigint} Y coordinate.
     */
    getY() {
        return this.point.toAffine().y;
    }
    /**
     * Returns the point encoded as a compressed byte array.
     * @returns {Uint8Array} Compressed point bytes.
     */
    getRawEncoded() {
        return this.point.toRawBytes(true);
    }
    /**
     * Returns the point encoded as an uncompressed byte array (without leading 0x04).
     * @returns {Uint8Array} Uncompressed point bytes.
     */
    getRawDecoded() {
        return this.point.toRawBytes(false).slice(1); // strip leading `0x04`
    }
    /**
     * Adds another point to this point.
     * @param {Point} other - The point to add.
     * @returns {SLIP10Nist256p1Point} The resulting point.
     */
    add(other) {
        const p = other.getUnderlyingObject();
        return new SLIP10Nist256p1Point(this.point.add(p));
    }
    /**
     * Multiplies this point by a scalar.
     * @param {bigint} scalar - The scalar to multiply by.
     * @returns {SLIP10Nist256p1Point} The resulting point.
     */
    multiply(scalar) {
        return new SLIP10Nist256p1Point(this.point.multiply(scalar));
    }
}
exports.SLIP10Nist256p1Point = SLIP10Nist256p1Point;
//# sourceMappingURL=point.js.map