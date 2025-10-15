// SPDX-License-Identifier: MIT

import { ed25519 } from '@noble/curves/ed25519';

import { Point } from '../../point';
import { SLIP10_ED25519_CONST } from '../../../consts';
import { toBuffer } from '../../../utils';

/**
 * Represents a point on the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, arithmetic, and coordinate access methods.
 * @extends Point
 */
export class SLIP10Ed25519Point extends Point {

  /** @returns {string} The name of the elliptic curve point. */
  getName(): string {
    return 'SLIP10-Ed25519';
  }

  /**
   * Create a point from raw bytes.
   * @param {Uint8Array} point - Encoded point bytes.
   * @returns {Point} The constructed point.
   * @throws {Error} If the byte length is invalid or data is invalid.
   */
  static fromBytes(point: Uint8Array): Point {
    if (point.length !== SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH) {
      throw new Error('Invalid point bytes length');
    }
    try {
      const pt = ed25519.Point.fromHex(point);
      return new this(pt);
    } catch {
      throw new Error('Invalid point bytes');
    }
  }

  /**
   * Create a point from affine coordinates.
   * @param {bigint} x - X coordinate.
   * @param {bigint} y - Y coordinate.
   * @returns {Point} The constructed point.
   * @throws {Error} If coordinates are invalid.
   */
  static fromCoordinates(x: bigint, y: bigint): Point {
    try {
      const pt = ed25519.Point.fromAffine({ x, y });
      return new this(pt);
    } catch {
      throw new Error('Invalid coordinates for ed25519');
    }
  }

  /** @returns {any} The underlying curve point object. */
  getUnderlyingObject(): any {
    return this.point;
  }

  /** @returns {bigint} The X coordinate of the point. */
  getX(): bigint {
    return this.point.x;
  }

  /** @returns {bigint} The Y coordinate of the point. */
  getY(): bigint {
    return this.point.y;
  }

  /** @returns {Uint8Array} Raw encoded point bytes. */
  getRawEncoded(): Uint8Array {
    return this.point.toRawBytes();
  }

  /** @returns {Uint8Array} Raw decoded point bytes (X||Y). */
  getRawDecoded(): Uint8Array {
    const xBytes = this.point.x.toString(16).padStart(64, '0');
    const yBytes = this.point.y.toString(16).padStart(64, '0');
    return Uint8Array.from(toBuffer(xBytes + yBytes, 'hex'));
  }

  /**
   * Add another point to this point.
   * @param {Point} point - The point to add.
   * @returns {Point} The sum of the two points.
   */
  add(point: Point): Point {
    const other = (point as this).getUnderlyingObject();
    const sum = this.point.add(other);
    return new SLIP10Ed25519Point(sum);
  }

  /**
   * Multiply this point by a scalar.
   * @param {bigint} scalar - The multiplier.
   * @returns {Point} The resulting point.
   */
  multiply(scalar: bigint): Point {
    const prod = this.point.multiply(scalar);
    return new SLIP10Ed25519Point(prod);
  }
}
