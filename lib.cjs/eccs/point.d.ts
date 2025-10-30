/**
 * Abstract base class representing a point on an elliptic curve.
 *
 * Provides a common interface for point-related operations across different elliptic curve implementations.
 * Must be extended by concrete curve-specific point classes.
 */
export declare abstract class Point {
    point: any;
    /**
     * Constructs a new Point instance.
     *
     * @param point - The underlying point representation (curve-specific object).
     */
    constructor(point: any);
    /**
     * Returns the name of the curve or point type.
     *
     * @returns The name of the point (e.g., "secp256k1", "ed25519").
     */
    abstract getName(): string;
    /**
     * Creates a Point instance from its byte representation.
     *
     * @param point - The encoded point as a Uint8Array.
     * @returns A Point instance for the given bytes.
     * @throws Error if not implemented in subclass.
     */
    static fromBytes(point: Uint8Array): Point;
    /**
     * Creates a Point instance from X and Y coordinates.
     *
     * @param x - The X coordinate of the point.
     * @param y - The Y coordinate of the point.
     * @returns A Point instance representing the given coordinates.
     * @throws Error if not implemented in subclass.
     */
    static fromCoordinates(x: bigint, y: bigint): Point;
    /**
     * Returns the X coordinate of the point.
     *
     * @returns The X coordinate as a bigint.
     */
    abstract getX(): bigint;
    /**
     * Returns the Y coordinate of the point.
     *
     * @returns The Y coordinate as a bigint.
     */
    abstract getY(): bigint;
    /**
     * Returns the raw byte representation of the point.
     *
     * @returns The encoded point as a Uint8Array.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the encoded form of the point.
     *
     * @returns The encoded bytes of the point.
     */
    abstract getRawEncoded(): Uint8Array;
    /**
     * Returns the decoded form of the point.
     *
     * @returns The decoded bytes of the point.
     */
    abstract getRawDecoded(): Uint8Array;
    /**
     * Returns the underlying ECC-specific point object.
     *
     * @returns The underlying curve-specific object.
     */
    abstract getUnderlyingObject(): any;
    /**
     * Adds another point to this point.
     *
     * @param point - The point to add.
     * @returns A new Point instance representing the sum.
     */
    abstract add(point: Point): Point;
    /**
     * Multiplies the point by a scalar.
     *
     * @param scalar - The scalar multiplier.
     * @returns A new Point instance representing the result of scalar multiplication.
     */
    abstract multiply(scalar: bigint): Point;
}
//# sourceMappingURL=point.d.ts.map