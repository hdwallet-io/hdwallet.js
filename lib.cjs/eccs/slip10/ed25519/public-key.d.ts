import { PublicKey } from '../../public-key';
import { Point } from '../../point';
/**
 * Represents a public key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, compressed/uncompressed bytes, and point access.
 * @extends PublicKey
 */
export declare class SLIP10Ed25519PublicKey extends PublicKey {
    /** @returns {string} The name of the elliptic curve. */
    getName(): string;
    /**
     * Create a public key from raw bytes.
     * @param {Uint8Array} publicKey - Encoded public key bytes.
     * @returns {PublicKey} The constructed public key.
     * @throws {Error} If the byte length is invalid or data is invalid.
     */
    static fromBytes(publicKey: Uint8Array): PublicKey;
    /**
     * Create a public key from a point.
     * @param {Point} point - The elliptic curve point.
     * @returns {PublicKey} The constructed public key.
     */
    static fromPoint(point: Point): PublicKey;
    /** @returns {number} The length of the compressed public key in bytes. */
    static getCompressedLength(): number;
    /** @returns {number} The length of the uncompressed public key in bytes. */
    static getUncompressedLength(): number;
    /** @returns {any} The underlying public key object. */
    getUnderlyingObject(): any;
    /** @returns {Uint8Array} The compressed public key bytes. */
    getRawCompressed(): Uint8Array;
    /** @returns {Uint8Array} The uncompressed public key bytes (same as compressed). */
    getRawUncompressed(): Uint8Array;
    /** @returns {Point} The elliptic curve point corresponding to this public key. */
    getPoint(): Point;
}
//# sourceMappingURL=public-key.d.ts.map