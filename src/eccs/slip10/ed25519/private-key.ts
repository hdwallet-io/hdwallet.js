// SPDX-License-Identifier: MIT

import { ed25519 } from '@noble/curves/ed25519';

import { PrivateKey } from '../../private-key';
import { PublicKey } from '../../public-key';
import { SLIP10Ed25519PublicKey } from './public-key';
import { SLIP10_ED25519_CONST } from '../../../consts';

/**
 * Represents a private key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, raw access, and public key derivation.
 * @extends PrivateKey
 */
export class SLIP10Ed25519PrivateKey extends PrivateKey {

  /** @returns {string} The name of the elliptic curve. */
  getName(): string {
    return 'SLIP10-Ed25519';
  }

  /**
   * Create a private key from raw bytes.
   * @param {Uint8Array} privateKey - Encoded private key bytes.
   * @returns {PrivateKey} The constructed private key.
   * @throws {Error} If the byte length is invalid or data is invalid.
   */
  static fromBytes(privateKey: Uint8Array): PrivateKey {
    if (privateKey.length !== SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH) {
      throw new Error('Invalid private key bytes length');
    }
    try {
      return new this(privateKey);
    } catch {
      throw new Error('Invalid private key bytes');
    }
  }

  /** @returns {number} The expected length of the private key in bytes. */
  static getLength(): number {
    return SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH;
  }

  /** @returns {Uint8Array} Raw private key bytes. */
  getRaw(): Uint8Array {
    return this.privateKey as Uint8Array;
  }

  /** @returns {any} The underlying private key object. */
  getUnderlyingObject(): any {
    return this.privateKey;
  }

  /**
   * Derive the corresponding public key from this private key.
   * @returns {PublicKey} The derived public key.
   */
  getPublicKey(): PublicKey {
    const pub = ed25519.getPublicKey(this.getRaw());
    return SLIP10Ed25519PublicKey.fromBytes(pub);
  }
}
