// SPDX-License-Identifier: MIT

import { Point } from '../../../point';
import { SLIP10Ed25519PublicKey } from '../public-key';
import { SLIP10Ed25519Blake2bPoint } from './point';

/**
 * Represents a SLIP10 Ed25519 Blake2b public key.
 * @extends SLIP10Ed25519PublicKey
 */
export class SLIP10Ed25519Blake2bPublicKey extends SLIP10Ed25519PublicKey {

  /**
   * Returns the name of the public key curve.
   * @returns {string} Curve name.
   */
  getName(): string {
    return 'SLIP10-Ed25519-Blake2b';
  }

  /**
   * Returns the point associated with this public key.
   * @returns {SLIP10Ed25519Blake2bPoint} Point instance.
   */
  getPoint(): Point {
    return new SLIP10Ed25519Blake2bPoint(this.publicKey);
  }
}