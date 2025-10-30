import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../ecc';
import { SLIP10Ed25519Point as _SLIP10Ed25519Point } from './point';
import { SLIP10Ed25519PublicKey as _SLIP10Ed25519PublicKey } from './public-key';
import { SLIP10Ed25519PrivateKey as _SLIP10Ed25519PrivateKey } from './private-key';
/**
 * Implements the SLIP10-Ed25519 elliptic curve cryptography scheme.
 * Provides point, public key, and private key definitions for Ed25519 curve operations.
 * @extends EllipticCurveCryptography
 */
export declare class SLIP10Ed25519ECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _SLIP10Ed25519Point as SLIP10Ed25519Point, _SLIP10Ed25519PublicKey as SLIP10Ed25519PublicKey, _SLIP10Ed25519PrivateKey as SLIP10Ed25519PrivateKey };
//# sourceMappingURL=index.d.ts.map