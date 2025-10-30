import { PublicKey } from '../../public-key';
import { Point } from '../../point';
/**
 * Represents a public key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PublicKey
 */
export declare class SLIP10Nist256p1PublicKey extends PublicKey {
    /**
     * Returns the name of the public key curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a public key from raw bytes.
     * @param {Uint8Array} publicKey - Raw public key bytes.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     * @throws {Error} If the input bytes are invalid.
     */
    static fromBytes(publicKey: Uint8Array): PublicKey;
    /**
     * Creates a public key from a point.
     * @param {Point} point - Elliptic curve point.
     * @returns {SLIP10Nist256p1PublicKey} Public key instance.
     */
    static fromPoint(point: Point): PublicKey;
    /**
     * Returns the length of the compressed public key in bytes.
     * @returns {number} Compressed key length.
     */
    static getCompressedLength(): number;
    /**
     * Returns the length of the uncompressed public key in bytes.
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
     * @returns {Uint8Array} Compressed key bytes.
     */
    getRawCompressed(): Uint8Array;
    /**
     * Returns the uncompressed raw bytes of the public key.
     * @returns {Uint8Array} Uncompressed key bytes.
     */
    getRawUncompressed(): Uint8Array;
    /**
     * Returns the raw bytes of the public key (default: compressed).
     * @returns {Uint8Array} Raw key bytes.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the elliptic curve point corresponding to the public key.
     * @returns {Point} Elliptic curve point.
     */
    getPoint(): Point;
}
//# sourceMappingURL=public-key.d.ts.map