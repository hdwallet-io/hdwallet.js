// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography, Point, PublicKey, PrivateKey
} from '../../ecc';
import { SLIP10Ed25519Point as _SLIP10Ed25519Point } from './point';
import { SLIP10Ed25519PublicKey as _SLIP10Ed25519PublicKey } from './public-key';
import { SLIP10Ed25519PrivateKey as _SLIP10Ed25519PrivateKey } from './private-key';

/**
 * Implements the SLIP10-Ed25519 elliptic curve cryptography scheme.
 * Provides point, public key, and private key definitions for Ed25519 curve operations.
 * @extends EllipticCurveCryptography
 */
export class SLIP10Ed25519ECC extends EllipticCurveCryptography {

  static NAME: string = 'SLIP10-Ed25519';
  static ORDER: bigint = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');
  static GENERATOR: Point = _SLIP10Ed25519Point.fromCoordinates(
    BigInt('15112221349535400772501151409588531511454012693041857206046113283949847762202'),
    BigInt('46316835694926478169428394003475163141307993866256225615783033603165251855960')
  );
  static POINT: typeof Point = _SLIP10Ed25519Point;
  static PUBLIC_KEY: typeof PublicKey = _SLIP10Ed25519PublicKey;
  static PRIVATE_KEY: typeof PrivateKey = _SLIP10Ed25519PrivateKey;
}

export {
  _SLIP10Ed25519Point as SLIP10Ed25519Point,
  _SLIP10Ed25519PublicKey as SLIP10Ed25519PublicKey,
  _SLIP10Ed25519PrivateKey as SLIP10Ed25519PrivateKey
};
