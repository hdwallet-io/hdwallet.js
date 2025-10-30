// SPDX-License-Identifier: MIT
import { EllipticCurveCryptography } from '../../ecc';
import { SLIP10Secp256k1Point as _SLIP10Secp256k1Point } from './point';
import { SLIP10Secp256k1PublicKey as _SLIP10Secp256k1PublicKey } from './public-key';
import { SLIP10Secp256k1PrivateKey as _SLIP10Secp256k1PrivateKey } from './private-key';
/**
 * Represents the SLIP10 Secp256k1 elliptic curve cryptography.
 * @extends EllipticCurveCryptography
 */
export class SLIP10Secp256k1ECC extends EllipticCurveCryptography {
    static NAME = 'SLIP10-Secp256k1';
    static ORDER = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
    static GENERATOR = _SLIP10Secp256k1Point.fromCoordinates(BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'), BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'));
    static POINT = _SLIP10Secp256k1Point;
    static PUBLIC_KEY = _SLIP10Secp256k1PublicKey;
    static PRIVATE_KEY = _SLIP10Secp256k1PrivateKey;
}
export { _SLIP10Secp256k1Point as SLIP10Secp256k1Point, _SLIP10Secp256k1PublicKey as SLIP10Secp256k1PublicKey, _SLIP10Secp256k1PrivateKey as SLIP10Secp256k1PrivateKey };
//# sourceMappingURL=index.js.map