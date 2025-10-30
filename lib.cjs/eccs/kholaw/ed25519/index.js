"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.KholawEd25519PrivateKey = exports.KholawEd25519PublicKey = exports.KholawEd25519Point = exports.KholawEd25519ECC = void 0;
const ecc_1 = require("../../ecc");
const slip10_1 = require("../../slip10");
const point_1 = require("./point");
Object.defineProperty(exports, "KholawEd25519Point", { enumerable: true, get: function () { return point_1.KholawEd25519Point; } });
const public_key_1 = require("./public-key");
Object.defineProperty(exports, "KholawEd25519PublicKey", { enumerable: true, get: function () { return public_key_1.KholawEd25519PublicKey; } });
const private_key_1 = require("./private-key");
Object.defineProperty(exports, "KholawEd25519PrivateKey", { enumerable: true, get: function () { return private_key_1.KholawEd25519PrivateKey; } });
/**
 * Represents the Kholaw-Ed25519 elliptic curve cryptography implementation.
 * Extends the SLIP10-Ed25519 curve with Kholaw-specific key handling.
 * @extends EllipticCurveCryptography
 */
class KholawEd25519ECC extends ecc_1.EllipticCurveCryptography {
    static NAME = 'Kholaw-Ed25519';
    static ORDER = slip10_1.SLIP10Ed25519ECC.ORDER;
    static GENERATOR = slip10_1.SLIP10Ed25519ECC.GENERATOR;
    static POINT = point_1.KholawEd25519Point;
    static PUBLIC_KEY = public_key_1.KholawEd25519PublicKey;
    static PRIVATE_KEY = private_key_1.KholawEd25519PrivateKey;
}
exports.KholawEd25519ECC = KholawEd25519ECC;
//# sourceMappingURL=index.js.map