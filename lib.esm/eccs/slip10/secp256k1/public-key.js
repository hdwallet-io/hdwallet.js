// SPDX-License-Identifier: MIT
import { secp256k1 } from '@noble/curves/secp256k1';
import { PublicKey } from '../../public-key';
import { SLIP10Secp256k1Point } from './point';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';
/**
 * Represents a SLIP10 Secp256k1 public key.
 * @extends PublicKey
 */
export class SLIP10Secp256k1PublicKey extends PublicKey {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Secp256k1';
    }
    /**
     * Creates a public key from raw bytes.
     * @param {Uint8Array} publicKey - Raw public key bytes.
     * @returns {SLIP10Secp256k1PublicKey} Public key instance.
     * @throws {Error} If the bytes are invalid.
     */
    static fromBytes(publicKey) {
        try {
            const point = secp256k1.Point.fromHex(getBytes(publicKey));
            return new SLIP10Secp256k1PublicKey(point);
        }
        catch {
            throw new Error('Invalid key bytes');
        }
    }
    /**
     * Creates a public key from a Point instance.
     * @param {Point} point - Elliptic curve point.
     * @returns {SLIP10Secp256k1PublicKey} Public key instance.
     */
    static fromPoint(point) {
        const base = point.getUnderlyingObject();
        return new SLIP10Secp256k1PublicKey(base);
    }
    /**
     * Returns the length of a compressed public key in bytes.
     * @returns {number} Compressed key length.
     */
    static getCompressedLength() {
        return SLIP10_SECP256K1_CONST.PUBLIC_KEY_COMPRESSED_BYTE_LENGTH;
    }
    /**
     * Returns the length of an uncompressed public key in bytes.
     * @returns {number} Uncompressed key length.
     */
    static getUncompressedLength() {
        return SLIP10_SECP256K1_CONST.PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH;
    }
    /**
     * Returns the underlying public key object.
     * @returns {any} Underlying public key object.
     */
    getUnderlyingObject() {
        return this.publicKey;
    }
    /**
     * Returns the compressed raw bytes of the public key.
     * @returns {Uint8Array} Compressed public key bytes.
     */
    getRawCompressed() {
        return this.publicKey.toRawBytes(true);
    }
    /**
     * Returns the uncompressed raw bytes of the public key.
     * @returns {Uint8Array} Uncompressed public key bytes.
     */
    getRawUncompressed() {
        return this.publicKey.toRawBytes(false);
    }
    /**
     * Returns the default raw bytes (compressed) of the public key.
     * @returns {Uint8Array} Raw public key bytes.
     */
    getRaw() {
        return this.getRawCompressed();
    }
    /**
     * Returns the corresponding Point instance of this public key.
     * @returns {Point} Elliptic curve point.
     */
    getPoint() {
        return new SLIP10Secp256k1Point(this.publicKey);
    }
}
//# sourceMappingURL=public-key.js.map