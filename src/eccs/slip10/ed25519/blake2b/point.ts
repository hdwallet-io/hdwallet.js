// SPDX-License-Identifier: MIT

import { SLIP10Ed25519Point } from '../point';

/**
 * Represents a point on the SLIP10-Ed25519-Blake2b elliptic curve.
 * @extends SLIP10Ed25519Point
 */
export class SLIP10Ed25519Blake2bPoint extends SLIP10Ed25519Point {
  
  /**
   * Returns the name of the elliptic curve point.
   * @returns {string} The curve name.
   */
  getName(): string {
    return 'SLIP10-Ed25519-Blake2b';
  }
}