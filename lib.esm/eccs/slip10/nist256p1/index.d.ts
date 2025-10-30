import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../ecc';
import { SLIP10Nist256p1Point as _SLIP10Nist256p1Point } from './point';
import { SLIP10Nist256p1PublicKey as _SLIP10Nist256p1PublicKey } from './public-key';
import { SLIP10Nist256p1PrivateKey as _SLIP10Nist256p1PrivateKey } from './private-key';
/**
 * Represents the SLIP10 NIST P-256 elliptic curve cryptography implementation.
 * @extends EllipticCurveCryptography
 */
export declare class SLIP10Nist256p1ECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _SLIP10Nist256p1Point as SLIP10Nist256p1Point, _SLIP10Nist256p1PublicKey as SLIP10Nist256p1PublicKey, _SLIP10Nist256p1PrivateKey as SLIP10Nist256p1PrivateKey };
//# sourceMappingURL=index.d.ts.map