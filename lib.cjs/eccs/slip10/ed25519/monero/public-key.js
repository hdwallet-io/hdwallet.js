"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519MoneroPublicKey = void 0;
const point_1 = require("./point");
const ed25519_1 = require("../../ed25519");
const consts_1 = require("../../../../consts");
/**
 * Represents a public key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PublicKey
 */
class SLIP10Ed25519MoneroPublicKey extends ed25519_1.SLIP10Ed25519PublicKey {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName() {
        return 'SLIP10-Ed25519-Monero';
    }
    /**
     * Get the compressed raw bytes of the public key.
     * @returns {Uint8Array} Compressed public key bytes
     */
    getRawCompressed() {
        return this.publicKey.toRawBytes();
    }
    /**
     * Get the expected length of the compressed public key.
     * @returns {number} Length in bytes
     */
    static getCompressedLength() {
        return consts_1.SLIP10_ED25519_CONST.PUBLIC_KEY_BYTE_LENGTH;
    }
    /**
     * Get the underlying point representation of the public key.
     * @returns {Point} The point corresponding to this public key
     */
    getPoint() {
        return new point_1.SLIP10Ed25519MoneroPoint(this.publicKey);
    }
}
exports.SLIP10Ed25519MoneroPublicKey = SLIP10Ed25519MoneroPublicKey;
//# sourceMappingURL=public-key.js.map