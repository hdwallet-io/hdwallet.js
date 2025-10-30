import { PublicKey } from '../../public-key';
import { Point } from '../../point';
/**
 * Represents a SLIP10 Secp256k1 public key.
 * @extends PublicKey
 */
export declare class SLIP10Secp256k1PublicKey extends PublicKey {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a public key from raw bytes.
     * @param {Uint8Array} publicKey - Raw public key bytes.
     * @returns {SLIP10Secp256k1PublicKey} Public key instance.
     * @throws {Error} If the bytes are invalid.
     */
    static fromBytes(publicKey: Uint8Array): PublicKey;
    /**
     * Creates a public key from a Point instance.
     * @param {Point} point - Elliptic curve point.
     * @returns {SLIP10Secp256k1PublicKey} Public key instance.
     */
    static fromPoint(point: Point): PublicKey;
    /**
     * Returns the length of a compressed public key in bytes.
     * @returns {number} Compressed key length.
     */
    static getCompressedLength(): number;
    /**
     * Returns the length of an uncompressed public key in bytes.
     * @returns {number} Uncompressed key length.
     */
    static getUncompressedLength(): number;
    /**
     * Returns the underlying public key object.
     * @returns {any} Underlying public key object.
     */
    getUnderlyingObject(): any;
    /**
     * Returns the compressed raw bytes of the public key.
     * @returns {Uint8Array} Compressed public key bytes.
     */
    getRawCompressed(): Uint8Array;
    /**
     * Returns the uncompressed raw bytes of the public key.
     * @returns {Uint8Array} Uncompressed public key bytes.
     */
    getRawUncompressed(): Uint8Array;
    /**
     * Returns the default raw bytes (compressed) of the public key.
     * @returns {Uint8Array} Raw public key bytes.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the corresponding Point instance of this public key.
     * @returns {Point} Elliptic curve point.
     */
    getPoint(): Point;
}
//# sourceMappingURL=public-key.d.ts.map