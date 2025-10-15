// SPDX-License-Identifier: MIT

import { PublicKey } from '../../../public-key';
import { pointScalarMulBase } from '../../../../libs/ed25519-utils';
import { SLIP10Ed25519MoneroPublicKey } from './public-key';
import { SLIP10Ed25519PrivateKey } from '../../ed25519';

/**
 * Represents a private key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PrivateKey
 */
export class SLIP10Ed25519MoneroPrivateKey extends SLIP10Ed25519PrivateKey {

  /**
   * Get the name of the curve.
   * @returns {string} Curve name
   */
  getName(): string {
    return 'SLIP10-Ed25519-Monero';
  }

  /**
   * Derive the corresponding public key from this private key.
   * @returns {PublicKey} The derived public key
   */
  getPublicKey(): PublicKey {
    return SLIP10Ed25519MoneroPublicKey.fromBytes(
      pointScalarMulBase(this.getRaw())
    );
  }
}
