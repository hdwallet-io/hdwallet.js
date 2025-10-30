// SPDX-License-Identifier: MIT
import { secp256k1 } from '@noble/curves/secp256k1';
import { Point } from '../../point';
import { getBytes } from '../../../utils';
/**
 * Represents a point on the SLIP10 Secp256k1 elliptic curve.
 * @extends Point
 */
export class SLIP10Secp256k1Point extends Point {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Secp256k1';
    }
    /**
     * Creates a point from raw bytes.
     * @param {Uint8Array} point - Raw point bytes.
     * @returns {SLIP10Secp256k1Point} Point instance.
     * @throws {Error} If the bytes are invalid.
     */
    static fromBytes(point) {
        try {
            const pubPoint = secp256k1.Point.fromHex(getBytes(point));
            return new SLIP10Secp256k1Point(pubPoint);
        }
        catch {
            throw new Error('Invalid point bytes');
        }
    }
    /**
     * Creates a point from coordinates.
     * @param {bigint} x - X coordinate.
     * @param {bigint} y - Y coordinate.
     * @returns {SLIP10Secp256k1Point} Point instance.
     */
    static fromCoordinates(x, y) {
        const pt = new secp256k1.Point(x, y, 1n);
        return new SLIP10Secp256k1Point(pt);
    }
    /**
     * Returns the underlying point object.
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
     * Returns the encoded raw bytes of the point (compressed).
     * @returns {Uint8Array} Compressed point bytes.
     */
    getRawEncoded() {
        return this.point.toRawBytes(true);
    }
    /**
     * Returns the decoded raw bytes of the point (uncompressed, without prefix).
     * @returns {Uint8Array} Uncompressed point bytes.
     */
    getRawDecoded() {
        return this.point.toRawBytes(false).slice(1);
    }
    /**
     * Adds another point to this point.
     * @param {Point} point - Point to add.
     * @returns {SLIP10Secp256k1Point} Resulting point.
     */
    add(point) {
        const other = point.getUnderlyingObject();
        const sum = this.point.add(other);
        return new SLIP10Secp256k1Point(sum);
    }
    /**
     * Multiplies this point by a scalar.
     * @param {bigint} scalar - Scalar value.
     * @returns {SLIP10Secp256k1Point} Resulting point.
     */
    multiply(scalar) {
        const prod = this.point.multiply(scalar);
        return new SLIP10Secp256k1Point(prod);
    }
}
//# sourceMappingURL=point.js.map