// SPDX-License-Identifier: MIT
import * as nacl from 'tweetnacl-blake2b';
import { PrivateKey } from '../../../private-key';
import { SLIP10Ed25519Blake2bPublicKey } from './public-key';
import { SLIP10_ED25519_CONST } from '../../../../consts';
import { getBytes } from '../../../../utils';
/**
 * Represents a SLIP10 Ed25519 Blake2b private key.
 * @extends PrivateKey
 */
export class SLIP10Ed25519Blake2bPrivateKey extends PrivateKey {
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
        if (privateKey.length !== SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            const kp = nacl.sign.keyPair.fromSeed(getBytes(privateKey));
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
        return SLIP10_ED25519_CONST.PRIVATE_KEY_BYTE_LENGTH;
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
        return SLIP10Ed25519Blake2bPublicKey.fromBytes(publicKey);
    }
}
//# sourceMappingURL=private-key.js.map