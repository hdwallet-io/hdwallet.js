"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519Blake2bPrivateKey = void 0;
const tslib_1 = require("tslib");
const nacl = tslib_1.__importStar(require("tweetnacl-blake2b"));
const private_key_1 = require("../../../private-key");
const public_key_1 = require("./public-key");
const consts_1 = require("../../../../consts");
const utils_1 = require("../../../../utils");
/**
 * Represents a SLIP10 Ed25519 Blake2b private key.
 * @extends PrivateKey
 */
class SLIP10Ed25519Blake2bPrivateKey extends private_key_1.PrivateKey {
    /**
     * Returns the name of the private key curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Ed25519-Blake2b';
    }
    /**
     * Creates a private key instance from raw bytes.
     * @param {Uint8Array} privateKey - The private key bytes.
     * @returns {SLIP10Ed25519Blake2bPrivateKey} The private key instance.
     * @throws {Error} If the bytes are invalid or length is incorrect.
     */
    static fromBytes(privateKey) {
        if (privateKey.length !== consts_1.SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            const kp = nacl.sign.keyPair.fromSeed((0, utils_1.getBytes)(privateKey));
            return new this(kp);
        }
        catch {
            throw new Error('Invalid private key bytes');
        }
    }
    /**
     * Returns the length of the private key in bytes.
     * @returns {number} Private key byte length.
     */
    static getLength() {
        return consts_1.SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH;
    }
    /**
     * Returns the raw private key bytes.
     * @returns {Uint8Array} Private key bytes.
     */
    getRaw() {
        const secret = this.privateKey.secretKey;
        return new Uint8Array(secret.subarray(0, nacl.sign.seedLength));
    }
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying key object.
     */
    getUnderlyingObject() {
        return this.privateKey;
    }
    /**
     * Returns the corresponding public key.
     * @returns {SLIP10Ed25519Blake2bPublicKey} The public key instance.
     */
    getPublicKey() {
        const publicKey = this.privateKey.publicKey;
        return public_key_1.SLIP10Ed25519Blake2bPublicKey.fromBytes(publicKey);
    }
}
exports.SLIP10Ed25519Blake2bPrivateKey = SLIP10Ed25519Blake2bPrivateKey;
//# sourceMappingURL=private-key.js.map