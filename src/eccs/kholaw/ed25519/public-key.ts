// SPDX-License-Identifier: MIT

import { Point } from '../../point';
import { SLIP10Ed25519PublicKey } from '../../slip10';
import { KholawEd25519Point } from './point';

/**
 * Represents a Kholaw Ed25519 public key implementation.
 * @extends SLIP10Ed25519PublicKey
 */
export class KholawEd25519PublicKey extends SLIP10Ed25519PublicKey {

  /**
   * Returns the name of the public key curve.
   * @returns {string} The curve name "Kholaw-Ed25519".
   */
  getName(): string {
    return 'Kholaw-Ed25519';
  }

  /**
   * Returns the point representation of this public key.
   * @returns {Point} A KholawEd25519Point instance representing the public key.
   */
  getPoint(): Point {
    return new KholawEd25519Point(this.publicKey);
  }
}
