import { Point } from '../../../point';
import { SLIP10Ed25519PublicKey } from '../../ed25519';
/**
 * Represents a public key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PublicKey
 */
export declare class SLIP10Ed25519MoneroPublicKey extends SLIP10Ed25519PublicKey {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName(): string;
    /**
     * Get the compressed raw bytes of the public key.
     * @returns {Uint8Array} Compressed public key bytes
     */
    getRawCompressed(): Uint8Array;
    /**
     * Get the expected length of the compressed public key.
     * @returns {number} Length in bytes
     */
    static getCompressedLength(): number;
    /**
     * Get the underlying point representation of the public key.
     * @returns {Point} The point corresponding to this public key
     */
    getPoint(): Point;
}
//# sourceMappingURL=public-key.d.ts.map