// SPDX-License-Identifier: MIT

import { Point } from '../../../point';
import { SLIP10Ed25519MoneroPoint } from './point';
import { SLIP10Ed25519PublicKey } from '../../ed25519';
import { SLIP10_ED25519_CONST } from '../../../../consts';

/**
 * Represents a public key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PublicKey
 */
export class SLIP10Ed25519MoneroPublicKey extends SLIP10Ed25519PublicKey {

  /**
   * Get the name of the curve.
   * @returns {string} Curve name
   */
  getName(): string {
    return 'SLIP10-Ed25519-Monero';
  }

  /**
   * Get the compressed raw bytes of the public key.
   * @returns {Uint8Array} Compressed public key bytes
   */
  getRawCompressed(): Uint8Array {
    return this.publicKey.toRawBytes();
  }

  /**
   * Get the expected length of the compressed public key.
   * @returns {number} Length in bytes
   */
  static getCompressedLength(): number {
    return SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH;
  }

  /**
   * Get the underlying point representation of the public key.
   * @returns {Point} The point corresponding to this public key
   */
  getPoint(): Point {
    return new SLIP10Ed25519MoneroPoint(this.publicKey);
  }
}
