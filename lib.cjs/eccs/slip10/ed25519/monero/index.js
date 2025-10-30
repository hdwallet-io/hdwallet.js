"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519MoneroPrivateKey = exports.SLIP10Ed25519MoneroPublicKey = exports.SLIP10Ed25519MoneroPoint = exports.SLIP10Ed25519MoneroECC = void 0;
const ecc_1 = require("../../../ecc");
const index_1 = require("../index");
const point_1 = require("./point");
Object.defineProperty(exports, "SLIP10Ed25519MoneroPoint", { enumerable: true, get: function () { return point_1.SLIP10Ed25519MoneroPoint; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "SLIP10Ed25519MoneroPublicKey", { enumerable: true, get: function () { return public_key_1.SLIP10Ed25519MoneroPublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "SLIP10Ed25519MoneroPrivateKey", { enumerable: true, get: function () { return private_key_1.SLIP10Ed25519MoneroPrivateKey; } });
/**
 * Represents the SLIP10 Ed25519 Monero elliptic curve.
 * @extends EllipticCurveCryptography
 */
class SLIP10Ed25519MoneroECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'SLIP10-Ed25519-Monero';
    static ORDER = index_1.SLIP10Ed25519ECC.ORDER;
    static GENERATOR = index_1.SLIP10Ed25519ECC.GENERATOR;
    static POINT = point_1.SLIP10Ed25519MoneroPoint;
    static PUBLIC_KEY = public_key_1.SLIP10Ed25519MoneroPublicKey;
    static PRIVATE_KEY = private_key_1.SLIP10Ed25519MoneroPrivateKey;
}
exports.SLIP10Ed25519MoneroECC = SLIP10Ed25519MoneroECC;
//# sourceMappingURL=index.js.map