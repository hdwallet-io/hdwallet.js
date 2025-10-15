// SPDX-License-Identifier: MIT

import { secp256k1 } from '@noble/curves/secp256k1';

import { PublicKey } from '../../public-key';
import { Point } from '../../point';
import { SLIP10Secp256k1Point } from './point';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';

/**
 * Represents a SLIP10 Secp256k1 public key.
 * @extends PublicKey
 */
export class SLIP10Secp256k1PublicKey extends PublicKey {

  /**
   * Returns the name of the elliptic curve.
   * @returns {string} Curve name.
   */
  getName(): string {
    return 'SLIP10-Secp256k1';
  }

  /**
   * Creates a public key from raw bytes.
   * @param {Uint8Array} publicKey - Raw public key bytes.
   * @returns {SLIP10Secp256k1PublicKey} Public key instance.
   * @throws {Error} If the bytes are invalid.
   */
  static fromBytes(publicKey: Uint8Array): PublicKey {
    try {
      const point = secp256k1.Point.fromHex(getBytes(publicKey));
      return new SLIP10Secp256k1PublicKey(point);
    } catch {
      throw new Error('Invalid key bytes');
    }
  }

  /**
   * Creates a public key from a Point instance.
   * @param {Point} point - Elliptic curve point.
   * @returns {SLIP10Secp256k1PublicKey} Public key instance.
   */
  static fromPoint(point: Point): PublicKey {
    const base = (point as SLIP10Secp256k1Point).getUnderlyingObject();
    return new SLIP10Secp256k1PublicKey(base);
  }

  /**
   * Returns the length of a compressed public key in bytes.
   * @returns {number} Compressed key length.
   */
  static getCompressedLength(): number {
    return SLIP10_SECP256K1_CONST.PUBLIC_KEY_COMPRESSED_BYTE_LENGTH;
  }

  /**
   * Returns the length of an uncompressed public key in bytes.
   * @returns {number} Uncompressed key length.
   */
  static getUncompressedLength(): number {
    return SLIP10_SECP256K1_CONST.PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH;
  }

  /**
   * Returns the underlying public key object.
   * @returns {any} Underlying public key object.
   */
  getUnderlyingObject(): any {
    return this.publicKey;
  }

  /**
   * Returns the compressed raw bytes of the public key.
   * @returns {Uint8Array} Compressed public key bytes.
   */
  getRawCompressed(): Uint8Array {
    return this.publicKey.toRawBytes(true);
  }

  /**
   * Returns the uncompressed raw bytes of the public key.
   * @returns {Uint8Array} Uncompressed public key bytes.
   */
  getRawUncompressed(): Uint8Array {
    return this.publicKey.toRawBytes(false);
  }

  /**
   * Returns the default raw bytes (compressed) of the public key.
   * @returns {Uint8Array} Raw public key bytes.
   */
  getRaw(): Uint8Array {
    return this.getRawCompressed();
  }

  /**
   * Returns the corresponding Point instance of this public key.
   * @returns {Point} Elliptic curve point.
   */
  getPoint(): Point {
    return new SLIP10Secp256k1Point(this.publicKey);
  }
}
