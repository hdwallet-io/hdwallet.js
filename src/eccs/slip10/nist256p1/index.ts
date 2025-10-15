// SPDX-License-Identifier: MIT

import { p256 } from '@noble/curves/p256';

import {
  EllipticCurveCryptography, Point, PublicKey, PrivateKey
} from '../../ecc';
import { SLIP10Nist256p1Point as _SLIP10Nist256p1Point } from './point';
import { SLIP10Nist256p1PublicKey as _SLIP10Nist256p1PublicKey } from './public-key';
import { SLIP10Nist256p1PrivateKey as _SLIP10Nist256p1PrivateKey } from './private-key';

/**
 * Represents the SLIP10 NIST P-256 elliptic curve cryptography implementation.
 * @extends EllipticCurveCryptography
 */
export class SLIP10Nist256p1ECC extends EllipticCurveCryptography {

  static NAME: string = 'SLIP10-Nist256p1';
  static ORDER: bigint = p256.CURVE.n;
  static GENERATOR: Point = _SLIP10Nist256p1Point.fromCoordinates(
    p256.CURVE.Gx, p256.CURVE.Gy
  );
  static POINT: typeof Point = _SLIP10Nist256p1Point;
  static PUBLIC_KEY: typeof PublicKey = _SLIP10Nist256p1PublicKey;
  static PRIVATE_KEY: typeof PrivateKey = _SLIP10Nist256p1PrivateKey;
}

export {
  _SLIP10Nist256p1Point as SLIP10Nist256p1Point,
  _SLIP10Nist256p1PublicKey as SLIP10Nist256p1PublicKey,
  _SLIP10Nist256p1PrivateKey as SLIP10Nist256p1PrivateKey
};
