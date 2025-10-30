"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519Blake2bPublicKey = void 0;
const public_key_1 = require("../public-key");
const point_1 = require("./point");
/**
 * Represents a SLIP10 Ed25519 Blake2b public key.
 * @extends SLIP10Ed25519PublicKey
 */
class SLIP10Ed25519Blake2bPublicKey extends public_key_1.SLIP10Ed25519PublicKey {
    /**
     * Returns the name of the public key curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Ed25519-Blake2b';
    }
    /**
     * Returns the point associated with this public key.
     * @returns {SLIP10Ed25519Blake2bPoint} Point instance.
     */
    getPoint() {
        return new point_1.SLIP10Ed25519Blake2bPoint(this.publicKey);
    }
}
exports.SLIP10Ed25519Blake2bPublicKey = SLIP10Ed25519Blake2bPublicKey;
//# sourceMappingURL=public-key.js.map