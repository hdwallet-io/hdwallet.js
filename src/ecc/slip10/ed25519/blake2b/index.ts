// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography, Point, PublicKey, PrivateKey
} from '../../../ecc';
import { SLIP10Ed25519ECC } from '../index';
import { SLIP10Ed25519Blake2bPoint as _SLIP10Ed25519Blake2bPoint } from './point';
import { SLIP10Ed25519Blake2bPublicKey as _SLIP10Ed25519Blake2bPublicKey } from './public-key';
import { SLIP10Ed25519Blake2bPrivateKey as _SLIP10Ed25519Blake2bPrivateKey } from './private-key';

export class SLIP10Ed25519Blake2bECC extends EllipticCurveCryptography {

  static NAME: string = 'SLIP10-Ed25519-Blake2b';
  static ORDER: bigint = SLIP10Ed25519ECC.ORDER;
  static GENERATOR: Point = SLIP10Ed25519ECC.GENERATOR;
  static POINT: typeof Point = _SLIP10Ed25519Blake2bPoint;
  static PUBLIC_KEY: typeof PublicKey = _SLIP10Ed25519Blake2bPublicKey;
  static PRIVATE_KEY: typeof PrivateKey = _SLIP10Ed25519Blake2bPrivateKey;
}

export {
  _SLIP10Ed25519Blake2bPoint as SLIP10Ed25519Blake2bPoint,
  _SLIP10Ed25519Blake2bPublicKey as SLIP10Ed25519Blake2bPublicKey,
  _SLIP10Ed25519Blake2bPrivateKey as SLIP10Ed25519Blake2bPrivateKey
};
