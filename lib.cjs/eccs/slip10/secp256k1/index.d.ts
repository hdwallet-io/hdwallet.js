import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../ecc';
import { SLIP10Secp256k1Point as _SLIP10Secp256k1Point } from './point';
import { SLIP10Secp256k1PublicKey as _SLIP10Secp256k1PublicKey } from './public-key';
import { SLIP10Secp256k1PrivateKey as _SLIP10Secp256k1PrivateKey } from './private-key';
/**
 * Represents the SLIP10 Secp256k1 elliptic curve cryptography.
 * @extends EllipticCurveCryptography
 */
export declare class SLIP10Secp256k1ECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _SLIP10Secp256k1Point as SLIP10Secp256k1Point, _SLIP10Secp256k1PublicKey as SLIP10Secp256k1PublicKey, _SLIP10Secp256k1PrivateKey as SLIP10Secp256k1PrivateKey };
//# sourceMappingURL=index.d.ts.map