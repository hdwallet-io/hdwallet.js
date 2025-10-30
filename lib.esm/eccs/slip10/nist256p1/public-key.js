// SPDX-License-Identifier: MIT
import { p256 } from '@noble/curves/p256';
import { PublicKey } from '../../public-key';
import { SLIP10Nist256p1Point } from './point';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';
/**
 * Represents a public key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PublicKey
 */
export class SLIP10Nist256p1PublicKey extends PublicKey {
    /**
     * Returns the name of the public key curve.
     * @returns {string} Curve name.
     */
    getName() {
        return 'SLIP10-Nist256p1';
    }
    /**
     * Creates a public key from raw bytes.
     * @param {Uint8Array} publicKey - Raw public key bytes.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     * @throws {Error} If the input bytes are invalid.
     */
    static fromBytes(publicKey) {
        try {
            const point = p256.Point.fromHex(getBytes(publicKey));
            return new SLIP10Nist256p1PublicKey(point);
        }
        catch {
            throw new Error('Invalid key bytes');
        }
    }
    /**
     * Creates a public key from a point.
     * @param {Point} point - Elliptic curve point.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     */
    static fromPoint(point) {
        const base = point.getUnderlyingObject();
        return new SLIP10Nist256p1PublicKey(base);
    }
    /**
     * Returns the length of the compressed public key in bytes.
     * @returns {number} Compressed key length.
     */
    static getCompressedLength() {
        return SLIP10_SECP256K1_CONST.PUBLIC_KEY_COMPRESSED_BYTE_LENGTH;
    }
    /**
     * Returns the length of the uncompressed public key in bytes.
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
     * @returns {Uint8Array} Compressed key bytes.
     */
    getRawCompressed() {
        return this.publicKey.toRawBytes(true);
    }
    /**
     * Returns the uncompressed raw bytes of the public key.
     * @returns {Uint8Array} Uncompressed key bytes.
     */
    getRawUncompressed() {
        return this.publicKey.toRawBytes(false);
    }
    /**
     * Returns the raw bytes of the public key (default: compressed).
     * @returns {Uint8Array} Raw key bytes.
     */
    getRaw() {
        return this.getRawCompressed();
    }
    /**
     * Returns the elliptic curve point corresponding to the public key.
     * @returns {Point} Elliptic curve point.
     */
    getPoint() {
        return new SLIP10Nist256p1Point(this.publicKey);
    }
}
//# sourceMappingURL=public-key.js.map