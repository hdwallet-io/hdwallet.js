"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.KholawEd25519PublicKey = void 0;
const slip10_1 = require("../../slip10");
const point_1 = require("./point");
/**
 * Represents a Kholaw Ed25519 public key implementation.
 * @extends SLIP10Ed25519PublicKey
 */
class KholawEd25519PublicKey extends slip10_1.SLIP10Ed25519PublicKey {
    /**
     * Returns the name of the public key curve.
     * @returns {string} The curve name "Kholaw-Ed25519".
     */
    getName() {
        return 'Kholaw-Ed25519';
    }
    /**
     * Returns the point representation of this public key.
     * @returns {Point} A KholawEd25519Point instance representing the public key.
     */
    getPoint() {
        return new point_1.KholawEd25519Point(this.publicKey);
    }
}
exports.KholawEd25519PublicKey = KholawEd25519PublicKey;
//# sourceMappingURL=public-key.js.map