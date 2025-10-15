// SPDX-License-Identifier: MIT

import { PrivateKey } from '../../private-key';
import { KHOLAW_ED25519_CONST } from '../../../consts';
import { SLIP10Ed25519PrivateKey } from '../../slip10';
import { KholawEd25519PublicKey } from './public-key';
import { pointScalarMulBase } from '../../../libs/ed25519-utils';
import { OptionsPrivateKey } from '../../../interfaces';
import { PublicKey } from '../../public-key';

/**
 * Represents a Kholaw Ed25519 private key with an extended key.
 * @extends SLIP10Ed25519PrivateKey
 */
export class KholawEd25519PrivateKey extends SLIP10Ed25519PrivateKey {

  /**
   * Creates a new KholawEd25519PrivateKey instance.
   * @param {Uint8Array} privateKey - The private key bytes.
   * @param {OptionsPrivateKey} options - The private key options including the extended key.
   * @throws {Error} If the extended key is missing or has an invalid length.
   */
  constructor(
    privateKey: Uint8Array, options: OptionsPrivateKey
  ) {
    if (!options.extendedKey) {
      throw new Error('Extended key is required');
    }
    if (options.extendedKey.length !== SLIP10Ed25519PrivateKey.getLength()) {
      throw new Error('Invalid extended key length');
    }
    super(privateKey, options);
  }

  /**
   * Returns the curve name identifier.
   * @returns {string} The curve name "Kholaw-Ed25519".
   */
  getName(): string {
    return 'Kholaw-Ed25519';
  }

  /**
   * Creates a private key instance from serialized bytes.
   * @param {Uint8Array} privateKey - The serialized private key bytes.
   * @returns {PrivateKey} A new KholawEd25519PrivateKey instance.
   * @throws {Error} If the private key length is invalid.
   */
  static fromBytes(privateKey: Uint8Array): PrivateKey {
    if (privateKey.length !== KHOLAW_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH) {
      throw new Error('Invalid private key bytes length');
    }
    const privateKeyBytes = privateKey.slice(0, SLIP10Ed25519PrivateKey.getLength());
    const extendedKeyBytes = privateKey.slice(SLIP10Ed25519PrivateKey.getLength());
    return new KholawEd25519PrivateKey(privateKeyBytes, { extendedKey: extendedKeyBytes });
  }

  /**
   * Returns the total byte length of the private key including the extended key.
   * @returns {number} The byte length of the private key.
   */
  static getLength(): number {
    return KHOLAW_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH;
  }

  /**
   * Returns the serialized form of the private key including the extended key.
   * @returns {Uint8Array} The raw serialized private key bytes.
   * @throws {Error} If the extended key is missing.
   */
  getRaw(): Uint8Array {
    const combined = new Uint8Array(KholawEd25519PrivateKey.getLength());
    combined.set(this.privateKey);
    if (!this.options.extendedKey) throw new Error('Extended key is required');
    combined.set(this.options.extendedKey, SLIP10Ed25519PrivateKey.getLength());
    return combined;
  }

  /**
   * Derives and returns the corresponding KholawEd25519 public key.
   * @returns {PublicKey} The derived KholawEd25519PublicKey instance.
   */
  getPublicKey(): PublicKey {
    const point = pointScalarMulBase(this.privateKey);
    return KholawEd25519PublicKey.fromBytes(point);
  }
}
