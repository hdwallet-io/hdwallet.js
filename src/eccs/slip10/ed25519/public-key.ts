// SPDX-License-Identifier: MIT

import { ed25519 } from '@noble/curves/ed25519';

import { PublicKey } from '../../public-key';
import { Point } from '../../point';
import { SLIP10_ED25519_CONST } from '../../../consts';
import { SLIP10Ed25519Point } from './point';
import { concatBytes } from '../../../utils';

/**
 * Represents a public key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, compressed/uncompressed bytes, and point access.
 * @extends PublicKey
 */
export class SLIP10Ed25519PublicKey extends PublicKey {

  /** @returns {string} The name of the elliptic curve. */
  getName(): string {
    return 'SLIP10-Ed25519';
  }

  /**
   * Create a public key from raw bytes.
   * @param {Uint8Array} publicKey - Encoded public key bytes.
   * @returns {PublicKey} The constructed public key.
   * @throws {Error} If the byte length is invalid or data is invalid.
   */
  static fromBytes(publicKey: Uint8Array): PublicKey {
    let data = publicKey;
    const prefix = SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX;
    if (
      data.length === prefix.length + SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH &&
      data[0] === prefix[0]
    ) {
      data = data.slice(prefix.length);
    }
    if (data.length !== SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH) {
      throw new Error('Invalid key bytes length');
    }

    try {
      const pt = ed25519.Point.fromHex(data);
      return new this(pt);
    } catch {
      throw new Error('Invalid key bytes');
    }
  }

  /**
   * Create a public key from a point.
   * @param {Point} point - The elliptic curve point.
   * @returns {PublicKey} The constructed public key.
   */
  static fromPoint(point: Point): PublicKey {
    const raw = (point as any).getRawEncoded() as Uint8Array;
    return this.fromBytes(raw);
  }

  /** @returns {number} The length of the compressed public key in bytes. */
  static getCompressedLength(): number {
    return SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH + SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX.length;
  }

  /** @returns {number} The length of the uncompressed public key in bytes. */
  static getUncompressedLength(): number {
    return this.getCompressedLength();
  }

  /** @returns {any} The underlying public key object. */
  getUnderlyingObject(): any {
    return this.publicKey;
  }

  /** @returns {Uint8Array} The compressed public key bytes. */
  getRawCompressed(): Uint8Array {
    return concatBytes(
      SLIP10_ED25519_CONST.PUBLIC_KEY_PREFIX,
      this.publicKey.toRawBytes()
    );
  }

  /** @returns {Uint8Array} The uncompressed public key bytes (same as compressed). */
  getRawUncompressed(): Uint8Array {
    return this.getRawCompressed();
  }

  /** @returns {Point} The elliptic curve point corresponding to this public key. */
  getPoint(): Point {
    return new SLIP10Ed25519Point(this.publicKey);
  }
}
