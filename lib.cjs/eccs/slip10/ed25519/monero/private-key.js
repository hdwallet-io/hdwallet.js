"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519MoneroPrivateKey = void 0;
const ed25519_utils_1 = require("../../../../libs/ed25519-utils");
const public_key_1 = require("./public-key");
const ed25519_1 = require("../../ed25519");
/**
 * Represents a private key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PrivateKey
 */
class SLIP10Ed25519MoneroPrivateKey extends ed25519_1.SLIP10Ed25519PrivateKey {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName() {
        return 'SLIP10-Ed25519-Monero';
    }
    /**
     * Derive the corresponding public key from this private key.
     * @returns {PublicKey} The derived public key
     */
    getPublicKey() {
        return public_key_1.SLIP10Ed25519MoneroPublicKey.fromBytes((0, ed25519_utils_1.pointScalarMulBase)(this.getRaw()));
    }
}
exports.SLIP10Ed25519MoneroPrivateKey = SLIP10Ed25519MoneroPrivateKey;
//# sourceMappingURL=private-key.js.map