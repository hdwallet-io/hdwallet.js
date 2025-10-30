// SPDX-License-Identifier: MIT
import { EllipticCurveCryptography } from '../../../ecc';
import { SLIP10Ed25519ECC } from '../index';
import { SLIP10Ed25519MoneroPoint as _SLIP10Ed25519MoneroPoint } from './point';
import { SLIP10Ed25519MoneroPublicKey as _SLIP10Ed25519MoneroPublicKey } from './public-key';
import { SLIP10Ed25519MoneroPrivateKey as _SLIP10Ed25519MoneroPrivateKey } from './private-key';
/**
 * Represents the SLIP10 Ed25519 Monero elliptic curve.
 * @extends EllipticCurveCryptography
 */
export class SLIP10Ed25519MoneroECC extends EllipticCurveCryptography {
    static NAME = 'SLIP10-Ed25519-Monero';
    static ORDER = SLIP10Ed25519ECC.ORDER;
    static GENERATOR = SLIP10Ed25519ECC.GENERATOR;
    static POINT = _SLIP10Ed25519MoneroPoint;
    static PUBLIC_KEY = _SLIP10Ed25519MoneroPublicKey;
    static PRIVATE_KEY = _SLIP10Ed25519MoneroPrivateKey;
}
export { _SLIP10Ed25519MoneroPoint as SLIP10Ed25519MoneroPoint, _SLIP10Ed25519MoneroPublicKey as SLIP10Ed25519MoneroPublicKey, _SLIP10Ed25519MoneroPrivateKey as SLIP10Ed25519MoneroPrivateKey };
//# sourceMappingURL=index.js.map