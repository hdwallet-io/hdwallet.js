"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519PrivateKey = exports.SLIP10Ed25519PublicKey = exports.SLIP10Ed25519Point = exports.SLIP10Ed25519ECC = void 0;
const ecc_1 = require("../../ecc");
const point_1 = require("./point");
Object.defineProperty(exports, "SLIP10Ed25519Point", { enumerable: true, get: function () { return point_1.SLIP10Ed25519Point; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "SLIP10Ed25519PublicKey", { enumerable: true, get: function () { return public_key_1.SLIP10Ed25519PublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "SLIP10Ed25519PrivateKey", { enumerable: true, get: function () { return private_key_1.SLIP10Ed25519PrivateKey; } });
/**
 * Implements the SLIP10-Ed25519 elliptic curve cryptography scheme.
 * Provides point, public key, and private key definitions for Ed25519 curve operations.
 * @extends EllipticCurveCryptography
 */
class SLIP10Ed25519ECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'SLIP10-Ed25519';
    static ORDER = BigInt('7237005577332262213973186563042994240857116359379907606001950938285454250989');
    static GENERATOR = point_1.SLIP10Ed25519Point.fromCoordinates(BigInt('15112221349535400772501151409588531511454012693041857206046113283949847762202'), BigInt('46316835694926478169428394003475163141307993866256225615783033603165251855960'));
    static POINT = point_1.SLIP10Ed25519Point;
    static PUBLIC_KEY = public_key_1.SLIP10Ed25519PublicKey;
    static PRIVATE_KEY = private_key_1.SLIP10Ed25519PrivateKey;
}
exports.SLIP10Ed25519ECC = SLIP10Ed25519ECC;
//# sourceMappingURL=index.js.map