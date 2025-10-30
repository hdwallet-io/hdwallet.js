import { PrivateKey } from '../../private-key';
import { PublicKey } from '../../public-key';
/**
 * Represents a private key for the SLIP10-Ed25519 elliptic curve.
 * Provides encoding, raw access, and public key derivation.
 * @extends PrivateKey
 */
export declare class SLIP10Ed25519PrivateKey extends PrivateKey {
    /** @returns {string} The name of the elliptic curve. */
    getName(): string;
    /**
     * Create a private key from raw bytes.
     * @param {Uint8Array} privateKey - Encoded private key bytes.
     * @returns {PrivateKey} The constructed private key.
     * @throws {Error} If the byte length is invalid or data is invalid.
     */
    static fromBytes(privateKey: Uint8Array): PrivateKey;
    /** @returns {number} The expected length of the private key in bytes. */
    static getLength(): number;
    /** @returns {Uint8Array} Raw private key bytes. */
    getRaw(): Uint8Array;
    /** @returns {any} The underlying private key object. */
    getUnderlyingObject(): any;
    /**
     * Derive the corresponding public key from this private key.
     * @returns {PublicKey} The derived public key.
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map