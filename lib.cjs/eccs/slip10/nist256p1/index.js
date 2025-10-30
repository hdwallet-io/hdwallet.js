"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Nist256p1PrivateKey = exports.SLIP10Nist256p1PublicKey = exports.SLIP10Nist256p1Point = exports.SLIP10Nist256p1ECC = void 0;
const p256_1 = require("@noble/curves/p256");
const ecc_1 = require("../../ecc");
const point_1 = require("./point");
Object.defineProperty(exports, "SLIP10Nist256p1Point", { enumerable: true, get: function () { return point_1.SLIP10Nist256p1Point; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "SLIP10Nist256p1PublicKey", { enumerable: true, get: function () { return public_key_1.SLIP10Nist256p1PublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "SLIP10Nist256p1PrivateKey", { enumerable: true, get: function () { return private_key_1.SLIP10Nist256p1PrivateKey; } });
/**
 * Represents the SLIP10 NIST P-256 elliptic curve cryptography implementation.
 * @extends EllipticCurveCryptography
 */
class SLIP10Nist256p1ECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'SLIP10-Nist256p1';
    static ORDER = p256_1.p256.CURVE.n;
    static GENERATOR = point_1.SLIP10Nist256p1Point.fromCoordinates(p256_1.p256.CURVE.Gx, p256_1.p256.CURVE.Gy);
    static POINT = point_1.SLIP10Nist256p1Point;
    static PUBLIC_KEY = public_key_1.SLIP10Nist256p1PublicKey;
    static PRIVATE_KEY = private_key_1.SLIP10Nist256p1PrivateKey;
}
exports.SLIP10Nist256p1ECC = SLIP10Nist256p1ECC;
//# sourceMappingURL=index.js.map