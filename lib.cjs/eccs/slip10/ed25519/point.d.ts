import { Point } from '../../point';
/**
 * Represents a point on the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, arithmetic, and coordinate access methods.
 * @extends Point
 */
export declare class SLIP10Ed25519Point extends Point {
    /** @returns {string} The name of the elliptic curve point. */
    getName(): string;
    /**
     * Create a point from raw bytes.
     * @param {Uint8Array} point - Encoded point bytes.
     * @returns {Point} The constructed point.
     * @throws {Error} If the byte length is invalid or data is invalid.
     */
    static fromBytes(point: Uint8Array): Point;
    /**
     * Create a point from affine coordinates.
     * @param {bigint} x - X coordinate.
     * @param {bigint} y - Y coordinate.
     * @returns {Point} The constructed point.
     * @throws {Error} If coordinates are invalid.
     */
    static fromCoordinates(x: bigint, y: bigint): Point;
    /** @returns {any} The underlying curve point object. */
    getUnderlyingObject(): any;
    /** @returns {bigint} The X coordinate of the point. */
    getX(): bigint;
    /** @returns {bigint} The Y coordinate of the point. */
    getY(): bigint;
    /** @returns {Uint8Array} Raw encoded point bytes. */
    getRawEncoded(): Uint8Array;
    /** @returns {Uint8Array} Raw decoded point bytes (X||Y). */
    getRawDecoded(): Uint8Array;
    /**
     * Add another point to this point.
     * @param {Point} point - The point to add.
     * @returns {Point} The sum of the two points.
     */
    add(point: Point): Point;
    /**
     * Multiply this point by a scalar.
     * @param {bigint} scalar - The multiplier.
     * @returns {Point} The resulting point.
     */
    multiply(scalar: bigint): Point;
}
//# sourceMappingURL=point.d.ts.map