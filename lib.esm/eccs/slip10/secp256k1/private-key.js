// SPDX-License-Identifier: MIT
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToNumberBE, numberToBytesBE } from '@noble/curves/abstract/utils';
import { PrivateKey } from '../../private-key';
import { SLIP10Secp256k1PublicKey } from './public-key';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';
/**
 * Represents a SLIP10 Secp256k1 private key.
 * @extends PrivateKey
 */
export class SLIP10Secp256k1PrivateKey extends PrivateKey {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Secp256k1';
    }
    /**
     * Creates a private key from raw bytes.
     * @param {Uint8Array} privateKey - Raw private key bytes.
     * @returns {SLIP10Secp256k1PrivateKey} Private key instance.
     * @throws {Error} If the bytes are invalid or wrong length.
     */
    static fromBytes(privateKey) {
        if (privateKey.length !== SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH) {
            throw new Error('Invalid private key bytes length');
        }
        try {
            const priv = bytesToNumberBE(getBytes(privateKey));
            const point = secp256k1.Point.BASE.multiply(priv);
            return new SLIP10Secp256k1PrivateKey({ priv, point });
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
        return SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH;
    }
    /**
     * Returns the raw bytes of the private key.
     * @returns {Uint8Array} Raw private key bytes.
     */
    getRaw() {
        return numberToBytesBE(this.privateKey.priv, SLIP10_SECP256K1_CONST.PRIVATE_KEY_BYTE_LENGTH);
    }
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying private key object.
     */
    getUnderlyingObject() {
        return this.privateKey;
    }
    /**
     * Returns the corresponding public key for this private key.
     * @returns {PublicKey} Public key instance.
     */
    getPublicKey() {
        return new SLIP10Secp256k1PublicKey(this.privateKey.point);
    }
}
//# sourceMappingURL=private-key.js.map