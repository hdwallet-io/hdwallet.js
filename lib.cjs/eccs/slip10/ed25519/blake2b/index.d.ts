import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../../ecc';
import { SLIP10Ed25519Blake2bPoint as _SLIP10Ed25519Blake2bPoint } from './point';
import { SLIP10Ed25519Blake2bPublicKey as _SLIP10Ed25519Blake2bPublicKey } from './public-key';
import { SLIP10Ed25519Blake2bPrivateKey as _SLIP10Ed25519Blake2bPrivateKey } from './private-key';
/**
 * Represents the SLIP10-Ed25519-Blake2b elliptic curve cryptography class.
 * Provides access to generator, order, points, public and private key classes.
 * @extends EllipticCurveCryptography
 */
export declare class SLIP10Ed25519Blake2bECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _SLIP10Ed25519Blake2bPoint as SLIP10Ed25519Blake2bPoint, _SLIP10Ed25519Blake2bPublicKey as SLIP10Ed25519Blake2bPublicKey, _SLIP10Ed25519Blake2bPrivateKey as SLIP10Ed25519Blake2bPrivateKey };
//# sourceMappingURL=index.d.ts.map