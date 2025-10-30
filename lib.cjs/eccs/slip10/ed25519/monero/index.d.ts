import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../../ecc';
import { SLIP10Ed25519MoneroPoint as _SLIP10Ed25519MoneroPoint } from './point';
import { SLIP10Ed25519MoneroPublicKey as _SLIP10Ed25519MoneroPublicKey } from './public-key';
import { SLIP10Ed25519MoneroPrivateKey as _SLIP10Ed25519MoneroPrivateKey } from './private-key';
/**
 * Represents the SLIP10 Ed25519 Monero elliptic curve.
 * @extends EllipticCurveCryptography
 */
export declare class SLIP10Ed25519MoneroECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _SLIP10Ed25519MoneroPoint as SLIP10Ed25519MoneroPoint, _SLIP10Ed25519MoneroPublicKey as SLIP10Ed25519MoneroPublicKey, _SLIP10Ed25519MoneroPrivateKey as SLIP10Ed25519MoneroPrivateKey };
//# sourceMappingURL=index.d.ts.map