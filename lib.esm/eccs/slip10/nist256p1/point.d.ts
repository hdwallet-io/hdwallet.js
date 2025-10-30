import { Point } from '../../point';
/**
 * Represents a point on the SLIP10 NIST P-256 elliptic curve.
 * @extends Point
 */
export declare class SLIP10Nist256p1Point extends Point {
    /**
     * Returns the name of the curve point.
     * @returns {string} Curve point name.
     */
    getName(): string;
    /**
     * Creates a point from raw bytes.
     * @param {Uint8Array} point - The byte array representing the point.
     * @returns {SLIP10Nist256p1Point} The curve point instance.
     * @throws {Error} If the input bytes are invalid.
     */
    static fromBytes(point: Uint8Array): Point;
    /**
     * Creates a point from x and y coordinates.
     * @param {bigint} x - X coordinate.
     * @param {bigint} y - Y coordinate.
     * @returns {SLIP10Nist256p1Point} The curve point instance.
     */
    static fromCoordinates(x: bigint, y: bigint): Point;
    /**
     * Returns the underlying curve point object.
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
     * Returns the point encoded as a compressed byte array.
     * @returns {Uint8Array} Compressed point bytes.
     */
    getRawEncoded(): Uint8Array;
    /**
     * Returns the point encoded as an uncompressed byte array (without leading 0x04).
     * @returns {Uint8Array} Uncompressed point bytes.
     */
    getRawDecoded(): Uint8Array;
    /**
     * Adds another point to this point.
     * @param {Point} other - The point to add.
     * @returns {SLIP10Nist256p1Point} The resulting point.
     */
    add(other: Point): SLIP10Nist256p1Point;
    /**
     * Multiplies this point by a scalar.
     * @param {bigint} scalar - The scalar to multiply by.
     * @returns {SLIP10Nist256p1Point} The resulting point.
     */
    multiply(scalar: bigint): SLIP10Nist256p1Point;
}
//# sourceMappingURL=point.d.ts.map