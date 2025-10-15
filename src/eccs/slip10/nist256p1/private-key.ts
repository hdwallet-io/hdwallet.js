// SPDX-License-Identifier: MIT

import { p256 } from '@noble/curves/p256';
import { bytesToNumberBE, numberToBytesBE } from '@noble/curves/abstract/utils';

import { PrivateKey } from '../../private-key';
import { PublicKey } from '../../public-key';
import { SLIP10Nist256p1PublicKey } from './public-key';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';

/**
 * Represents a private key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PrivateKey
 */
export class SLIP10Nist256p1PrivateKey extends PrivateKey {

  /**
   * Returns the name of the private key curve.
   * @returns {string} Curve name.
   */
  getName(): string {
    return 'SLIP10-Nist256p1';
  }

  /**
   * Creates a private key from raw bytes.
   * @param {Uint8Array} privateKey - Raw private key bytes.
   * @returns {SLIP10Nist256p1PrivateKey} The private key instance.
   * @throws {Error} If the input bytes are invalid or of incorrect length.
   */
  static fromBytes(privateKey: Uint8Array): SLIP10Nist256p1PrivateKey {
    if (privateKey.length !== SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH) {
      throw new Error('Invalid private key bytes length');
    }
    try {
      const priv = bytesToNumberBE(getBytes(privateKey));
      const point = p256.Point.BASE.multiply(priv);
      return new SLIP10Nist256p1PrivateKey({ priv, point });
    } catch {
      throw new Error('Invalid private key bytes');
    }
  }

  /**
   * Returns the byte length of the private key.
   * @returns {number} Length in bytes.
   */
  static getLength(): number {
    return SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH;
  }

  /**
   * Returns the raw private key bytes.
   * @returns {Uint8Array} Private key as bytes.
   */
  getRaw(): Uint8Array {
    return numberToBytesBE(
      this.privateKey.priv, SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH
    );
  }

  /**
   * Returns the underlying private key object.
   * @returns {any} Underlying private key object.
   */
  getUnderlyingObject(): any {
    return this.privateKey;
  }

  /**
   * Derives the public key corresponding to this private key.
   * @returns {PublicKey} The associated public key.
   */
  getPublicKey(): PublicKey {
    return new SLIP10Nist256p1PublicKey(this.privateKey.point);
  }
}
