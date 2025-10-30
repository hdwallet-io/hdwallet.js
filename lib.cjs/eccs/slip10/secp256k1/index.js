"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Secp256k1PrivateKey = exports.SLIP10Secp256k1PublicKey = exports.SLIP10Secp256k1Point = exports.SLIP10Secp256k1ECC = void 0;
const ecc_1 = require("../../ecc");
const point_1 = require("./point");
Object.defineProperty(exports, "SLIP10Secp256k1Point", { enumerable: true, get: function () { return point_1.SLIP10Secp256k1Point; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "SLIP10Secp256k1PublicKey", { enumerable: true, get: function () { return public_key_1.SLIP10Secp256k1PublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "SLIP10Secp256k1PrivateKey", { enumerable: true, get: function () { return private_key_1.SLIP10Secp256k1PrivateKey; } });
/**
 * Represents the SLIP10 Secp256k1 elliptic curve cryptography.
 * @extends EllipticCurveCryptography
 */
class SLIP10Secp256k1ECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'SLIP10-Secp256k1';
    static ORDER = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
    static GENERATOR = point_1.SLIP10Secp256k1Point.fromCoordinates(BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'), BigInt('0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8'));
    static POINT = point_1.SLIP10Secp256k1Point;
    static PUBLIC_KEY = public_key_1.SLIP10Secp256k1PublicKey;
    static PRIVATE_KEY = private_key_1.SLIP10Secp256k1PrivateKey;
}
exports.SLIP10Secp256k1ECC = SLIP10Secp256k1ECC;
//# sourceMappingURL=index.js.map