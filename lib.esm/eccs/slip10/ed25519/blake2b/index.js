// SPDX-License-Identifier: MIT
import { EllipticCurveCryptography } from '../../../ecc';
import { SLIP10Ed25519ECC } from '../index';
import { SLIP10Ed25519Blake2bPoint as _SLIP10Ed25519Blake2bPoint } from './point';
import { SLIP10Ed25519Blake2bPublicKey as _SLIP10Ed25519Blake2bPublicKey } from './public-key';
import { SLIP10Ed25519Blake2bPrivateKey as _SLIP10Ed25519Blake2bPrivateKey } from './private-key';
/**
 * Represents the SLIP10-Ed25519-Blake2b elliptic curve cryptography class.
 * Provides access to generator, order, points, public and private key classes.
 * @extends EllipticCurveCryptography
 */
export class SLIP10Ed25519Blake2bECC extends EllipticCurveCryptography {
    static NAME = 'SLIP10-Ed25519-Blake2b';
    static ORDER = SLIP10Ed25519ECC.ORDER;
    static GENERATOR = SLIP10Ed25519ECC.GENERATOR;
    static POINT = _SLIP10Ed25519Blake2bPoint;
    static PUBLIC_KEY = _SLIP10Ed25519Blake2bPublicKey;
    static PRIVATE_KEY = _SLIP10Ed25519Blake2bPrivateKey;
}
export { _SLIP10Ed25519Blake2bPoint as SLIP10Ed25519Blake2bPoint, _SLIP10Ed25519Blake2bPublicKey as SLIP10Ed25519Blake2bPublicKey, _SLIP10Ed25519Blake2bPrivateKey as SLIP10Ed25519Blake2bPrivateKey };
//# sourceMappingURL=index.js.map