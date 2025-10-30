import { EllipticCurveCryptography, Point, PublicKey, PrivateKey } from '../../ecc';
import { KholawEd25519Point as _KholawEd25519Point } from './point';
import { KholawEd25519PublicKey as _KholawEd25519PublicKey } from './public-key';
import { KholawEd25519PrivateKey as _KholawEd25519PrivateKey } from './private-key';
/**
 * Represents the Kholaw-Ed25519 elliptic curve cryptography implementation.
 * Extends the SLIP10-Ed25519 curve with Kholaw-specific key handling.
 * @extends EllipticCurveCryptography
 */
export declare class KholawEd25519ECC extends EllipticCurveCryptography {
    static NAME: string;
    static ORDER: bigint;
    static GENERATOR: Point;
    static POINT: typeof Point;
    static PUBLIC_KEY: typeof PublicKey;
    static PRIVATE_KEY: typeof PrivateKey;
}
export { _KholawEd25519Point as KholawEd25519Point, _KholawEd25519PublicKey as KholawEd25519PublicKey, _KholawEd25519PrivateKey as KholawEd25519PrivateKey };
//# sourceMappingURL=index.d.ts.map