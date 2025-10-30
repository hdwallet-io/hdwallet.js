"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519Blake2bPrivateKey = exports.SLIP10Ed25519Blake2bPublicKey = exports.SLIP10Ed25519Blake2bPoint = exports.SLIP10Ed25519Blake2bECC = void 0;
const ecc_1 = require("../../../ecc");
const index_1 = require("../index");
const point_1 = require("./point");
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPoint", { enumerable: true, get: function () { return point_1.SLIP10Ed25519Blake2bPoint; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPublicKey", { enumerable: true, get: function () { return public_key_1.SLIP10Ed25519Blake2bPublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPrivateKey", { enumerable: true, get: function () { return private_key_1.SLIP10Ed25519Blake2bPrivateKey; } });
/**
 * Represents the SLIP10-Ed25519-Blake2b elliptic curve cryptography class.
 * Provides access to generator, order, points, public and private key classes.
 * @extends EllipticCurveCryptography
 */
class SLIP10Ed25519Blake2bECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'SLIP10-Ed25519-Blake2b';
    static ORDER = index_1.SLIP10Ed25519ECC.ORDER;
    static GENERATOR = index_1.SLIP10Ed25519ECC.GENERATOR;
    static POINT = point_1.SLIP10Ed25519Blake2bPoint;
    static PUBLIC_KEY = public_key_1.SLIP10Ed25519Blake2bPublicKey;
    static PRIVATE_KEY = private_key_1.SLIP10Ed25519Blake2bPrivateKey;
}
exports.SLIP10Ed25519Blake2bECC = SLIP10Ed25519Blake2bECC;
//# sourceMappingURL=index.js.map