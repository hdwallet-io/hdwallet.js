// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography, Point, PublicKey, PrivateKey
} from '../../ecc';
import { SLIP10Ed25519ECC } from '../../slip10';
import { KholawEd25519Point as _KholawEd25519Point } from './point';
import { KholawEd25519PublicKey as _KholawEd25519PublicKey } from './public-key';
import { KholawEd25519PrivateKey as _KholawEd25519PrivateKey } from './private-key';

/**
 * Represents the Kholaw-Ed25519 elliptic curve cryptography implementation.
 * Extends the SLIP10-Ed25519 curve with Kholaw-specific key handling.
 * @extends EllipticCurveCryptography
 */
export class KholawEd25519ECC extends EllipticCurveCryptography {

  static NAME: string = 'Kholaw-Ed25519';
  static ORDER: bigint = SLIP10Ed25519ECC.ORDER;
  static GENERATOR: Point = SLIP10Ed25519ECC.GENERATOR;
  static POINT: typeof Point = _KholawEd25519Point;
  static PUBLIC_KEY: typeof PublicKey = _KholawEd25519PublicKey;
  static PRIVATE_KEY: typeof PrivateKey = _KholawEd25519PrivateKey;
}

export {
  _KholawEd25519Point as KholawEd25519Point,
  _KholawEd25519PublicKey as KholawEd25519PublicKey,
  _KholawEd25519PrivateKey as KholawEd25519PrivateKey
};
