// SPDX-License-Identifier: MIT
import { p256 } from '@noble/curves/p256';
import { EllipticCurveCryptography } from '../../ecc';
import { SLIP10Nist256p1Point as _SLIP10Nist256p1Point } from './point';
import { SLIP10Nist256p1PublicKey as _SLIP10Nist256p1PublicKey } from './public-key';
import { SLIP10Nist256p1PrivateKey as _SLIP10Nist256p1PrivateKey } from './private-key';
export class SLIP10Nist256p1ECC extends EllipticCurveCryptography {
    static NAME = 'SLIP10-Nist256p1';
    static ORDER = p256.CURVE.n;
    static GENERATOR = _SLIP10Nist256p1Point.fromCoordinates(p256.CURVE.Gx, p256.CURVE.Gy);
    static POINT = _SLIP10Nist256p1Point;
    static PUBLIC_KEY = _SLIP10Nist256p1PublicKey;
    static PRIVATE_KEY = _SLIP10Nist256p1PrivateKey;
}
export { _SLIP10Nist256p1Point as SLIP10Nist256p1Point, _SLIP10Nist256p1PublicKey as SLIP10Nist256p1PublicKey, _SLIP10Nist256p1PrivateKey as SLIP10Nist256p1PrivateKey };
//# sourceMappingURL=index.js.map