import { Point } from '../../point';
/**
 * Represents a point on the SLIP10 Secp256k1 elliptic curve.
 * @extends Point
 */
export declare class SLIP10Secp256k1Point extends Point {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a point from raw bytes.
     * @param {Uint8Array} point - Raw point bytes.
     * @returns {SLIP10Secp256k1Point} Point instance.
     * @throws {Error} If the bytes are invalid.
     */
    static fromBytes(point: Uint8Array): Point;
    /**
     * Creates a point from coordinates.
     * @param {bigint} x - X coordinate.
     * @param {bigint} y - Y coordinate.
     * @returns {SLIP10Secp256k1Point} Point instance.
     */
    static fromCoordinates(x: bigint, y: bigint): Point;
    /**
     * Returns the underlying point object.
     * @returns {any} Underlying point object.
     */
    getUnderlyingObject(): any;
    /**
     * Returns the X coordinate of the point.
     * @returns {bigint} X coordinate.
     */
    getX(): bigint;
    /**
     * Returns the Y coordinate of the point.
     * @returns {bigint} Y coordinate.
     */
    getY(): bigint;
    /**
     * Returns the encoded raw bytes of the point (compressed).
     * @returns {Uint8Array} Compressed point bytes.
     */
    getRawEncoded(): Uint8Array;
    /**
     * Returns the decoded raw bytes of the point (uncompressed, without prefix).
     * @returns {Uint8Array} Uncompressed point bytes.
     */
    getRawDecoded(): Uint8Array;
    /**
     * Adds another point to this point.
     * @param {Point} point - Point to add.
     * @returns {SLIP10Secp256k1Point} Resulting point.
     */
    add(point: Point): Point;
    /**
     * Multiplies this point by a scalar.
     * @param {bigint} scalar - Scalar value.
     * @returns {SLIP10Secp256k1Point} Resulting point.
     */
    multiply(scalar: bigint): Point;
}
//# sourceMappingURL=point.d.ts.map