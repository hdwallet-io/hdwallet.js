"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
/**
 * Abstract base class representing a point on an elliptic curve.
 *
 * Provides a common interface for point-related operations across different elliptic curve implementations.
 * Must be extended by concrete curve-specific point classes.
 */
class Point {
    point;
    /**
     * Constructs a new Point instance.
     *
     * @param point - The underlying point representation (curve-specific object).
     */
    constructor(point) {
        this.point = point;
    }
    /**
     * Creates a Point instance from its byte representation.
     *
     * @param point - The encoded point as a Uint8Array.
     * @returns A Point instance for the given bytes.
     * @throws Error if not implemented in subclass.
     */
    static fromBytes(point) {
        throw new Error('Must override fromBytes()');
    }
    /**
     * Creates a Point instance from X and Y coordinates.
     *
     * @param x - The X coordinate of the point.
     * @param y - The Y coordinate of the point.
     * @returns A Point instance representing the given coordinates.
     * @throws Error if not implemented in subclass.
     */
    static fromCoordinates(x, y) {
        throw new Error('Must override fromCoordinates()');
    }
    /**
     * Returns the raw byte representation of the point.
     *
     * @returns The encoded point as a Uint8Array.
     */
    getRaw() {
        return this.getRawEncoded();
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map