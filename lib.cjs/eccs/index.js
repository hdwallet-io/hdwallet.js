"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Secp256k1PrivateKey = exports.SLIP10Secp256k1PublicKey = exports.SLIP10Secp256k1Point = exports.SLIP10Nist256p1PrivateKey = exports.SLIP10Nist256p1PublicKey = exports.SLIP10Nist256p1Point = exports.SLIP10Ed25519MoneroPrivateKey = exports.SLIP10Ed25519MoneroPublicKey = exports.SLIP10Ed25519MoneroPoint = exports.SLIP10Ed25519Blake2bPrivateKey = exports.SLIP10Ed25519Blake2bPublicKey = exports.SLIP10Ed25519Blake2bPoint = exports.SLIP10Ed25519PrivateKey = exports.SLIP10Ed25519PublicKey = exports.SLIP10Ed25519Point = exports.KholawEd25519PrivateKey = exports.KholawEd25519PublicKey = exports.KholawEd25519Point = exports.SLIP10Secp256k1ECC = exports.SLIP10Nist256p1ECC = exports.SLIP10Ed25519MoneroECC = exports.SLIP10Ed25519Blake2bECC = exports.SLIP10Ed25519ECC = exports.KholawEd25519ECC = exports.PrivateKey = exports.PublicKey = exports.Point = exports.EllipticCurveCryptography = exports.ECCS = void 0;
exports.validateAndGetPublicKey = validateAndGetPublicKey;
const ecc_1 = require("./ecc");
Object.defineProperty(exports, "EllipticCurveCryptography", { enumerable: true, get: function () { return ecc_1.EllipticCurveCryptography; } });
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return ecc_1.Point; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return ecc_1.PublicKey; } });
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return ecc_1.PrivateKey; } });
const kholaw_1 = require("./kholaw");
Object.defineProperty(exports, "KholawEd25519ECC", { enumerable: true, get: function () { return kholaw_1.KholawEd25519ECC; } });
const slip10_1 = require("./slip10");
Object.defineProperty(exports, "SLIP10Ed25519ECC", { enumerable: true, get: function () { return slip10_1.SLIP10Ed25519ECC; } });
Object.defineProperty(exports, "SLIP10Ed25519Blake2bECC", { enumerable: true, get: function () { return slip10_1.SLIP10Ed25519Blake2bECC; } });
Object.defineProperty(exports, "SLIP10Ed25519MoneroECC", { enumerable: true, get: function () { return slip10_1.SLIP10Ed25519MoneroECC; } });
Object.defineProperty(exports, "SLIP10Nist256p1ECC", { enumerable: true, get: function () { return slip10_1.SLIP10Nist256p1ECC; } });
Object.defineProperty(exports, "SLIP10Secp256k1ECC", { enumerable: true, get: function () { return slip10_1.SLIP10Secp256k1ECC; } });
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * The `ECCS` class manages and provides access to supported
 * Elliptic Curve Cryptography (ECC) implementations.
 *
 * It maintains a dictionary of available ECC algorithm classes,
 * such as Ed25519, Ed25519-Blake2b, Ed25519-Monero, Nist256p1, and Secp256k1.
 * This class allows retrieval, validation, and enumeration of these ECC types.
 */
class ECCS {
    static dictionary = {
        [kholaw_1.KholawEd25519ECC.NAME]: kholaw_1.KholawEd25519ECC,
        [slip10_1.SLIP10Ed25519ECC.NAME]: slip10_1.SLIP10Ed25519ECC,
        [slip10_1.SLIP10Ed25519Blake2bECC.NAME]: slip10_1.SLIP10Ed25519Blake2bECC,
        [slip10_1.SLIP10Ed25519MoneroECC.NAME]: slip10_1.SLIP10Ed25519MoneroECC,
        [slip10_1.SLIP10Nist256p1ECC.NAME]: slip10_1.SLIP10Nist256p1ECC,
        [slip10_1.SLIP10Secp256k1ECC.NAME]: slip10_1.SLIP10Secp256k1ECC
    };
    /**
     * Get the names of all supported ECC implementations.
     * @returns {string[]} List of ECC class names.
     */
    static getNames() {
        return Object.keys(this.dictionary);
    }
    /**
     * Get all available ECC classes.
     * @returns {typeof _EllipticCurveCryptography[]} Array of ECC classes.
     */
    static getClasses() {
        return Object.values(this.dictionary);
    }
    /**
     * Retrieve an ECC class by its name.
     * @param {string} name - The ECC class name.
     * @returns {typeof _EllipticCurveCryptography} The corresponding ECC class.
     * @throws {ECCError} If the name is invalid.
     */
    static getECCClass(name) {
        if (!this.isECC(name)) {
            throw new exceptions_1.ECCError(`Invalid ECC name`, { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    /**
     * Check if a given name corresponds to a valid ECC implementation.
     * @param {string} name - The ECC name to verify.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isECC(name) {
        return this.getNames().includes(name);
    }
}
exports.ECCS = ECCS;
/**
 * Validate and normalize a public key input.
 * @param {Uint8Array | string | _PublicKey} publicKey - Public key data or object.
 * @param {typeof _PublicKey} publicKeyCls - Expected public key class.
 * @returns {_PublicKey} Validated and instantiated public key.
 * @throws {PublicKeyError} If the public key is invalid or of the wrong type.
 */
function validateAndGetPublicKey(publicKey, publicKeyCls) {
    try {
        if (publicKey instanceof Uint8Array) {
            return publicKeyCls.fromBytes(publicKey);
        }
        if (typeof publicKey === 'string') {
            const bytes = (0, utils_1.getBytes)(publicKey);
            return publicKeyCls.fromBytes(bytes);
        }
        if (!(publicKey instanceof publicKeyCls)) {
            throw new exceptions_1.PublicKeyError(`Invalid public key instance`, {
                expected: publicKeyCls.name,
                got: publicKey.constructor.name
            });
        }
        return publicKey;
    }
    catch (err) {
        if (err instanceof exceptions_1.PublicKeyError)
            throw err;
        throw new exceptions_1.PublicKeyError('Invalid public key data');
    }
}
var kholaw_2 = require("./kholaw");
Object.defineProperty(exports, "KholawEd25519Point", { enumerable: true, get: function () { return kholaw_2.KholawEd25519Point; } });
Object.defineProperty(exports, "KholawEd25519PublicKey", { enumerable: true, get: function () { return kholaw_2.KholawEd25519PublicKey; } });
Object.defineProperty(exports, "KholawEd25519PrivateKey", { enumerable: true, get: function () { return kholaw_2.KholawEd25519PrivateKey; } });
var slip10_2 = require("./slip10");
Object.defineProperty(exports, "SLIP10Ed25519Point", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519Point; } });
Object.defineProperty(exports, "SLIP10Ed25519PublicKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519PublicKey; } });
Object.defineProperty(exports, "SLIP10Ed25519PrivateKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519PrivateKey; } });
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPoint", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519Blake2bPoint; } });
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPublicKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519Blake2bPublicKey; } });
Object.defineProperty(exports, "SLIP10Ed25519Blake2bPrivateKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519Blake2bPrivateKey; } });
Object.defineProperty(exports, "SLIP10Ed25519MoneroPoint", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519MoneroPoint; } });
Object.defineProperty(exports, "SLIP10Ed25519MoneroPublicKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519MoneroPublicKey; } });
Object.defineProperty(exports, "SLIP10Ed25519MoneroPrivateKey", { enumerable: true, get: function () { return slip10_2.SLIP10Ed25519MoneroPrivateKey; } });
Object.defineProperty(exports, "SLIP10Nist256p1Point", { enumerable: true, get: function () { return slip10_2.SLIP10Nist256p1Point; } });
Object.defineProperty(exports, "SLIP10Nist256p1PublicKey", { enumerable: true, get: function () { return slip10_2.SLIP10Nist256p1PublicKey; } });
Object.defineProperty(exports, "SLIP10Nist256p1PrivateKey", { enumerable: true, get: function () { return slip10_2.SLIP10Nist256p1PrivateKey; } });
Object.defineProperty(exports, "SLIP10Secp256k1Point", { enumerable: true, get: function () { return slip10_2.SLIP10Secp256k1Point; } });
Object.defineProperty(exports, "SLIP10Secp256k1PublicKey", { enumerable: true, get: function () { return slip10_2.SLIP10Secp256k1PublicKey; } });
Object.defineProperty(exports, "SLIP10Secp256k1PrivateKey", { enumerable: true, get: function () { return slip10_2.SLIP10Secp256k1PrivateKey; } });
//# sourceMappingURL=index.js.map