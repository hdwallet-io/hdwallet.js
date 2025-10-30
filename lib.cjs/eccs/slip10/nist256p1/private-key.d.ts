import { PrivateKey } from '../../private-key';
import { PublicKey } from '../../public-key';
/**
 * Represents a private key on the SLIP10 NIST P-256 elliptic curve.
 * @extends PrivateKey
 */
export declare class SLIP10Nist256p1PrivateKey extends PrivateKey {
    /**
     * Returns the name of the private key curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a private key from raw bytes.
     * @param {Uint8Array} privateKey - Raw private key bytes.
     * @returns {SLIP10Nist256p1PrivateKey} The private key instance.
     * @throws {Error} If the input bytes are invalid or of incorrect length.
     */
    static fromBytes(privateKey: Uint8Array): SLIP10Nist256p1PrivateKey;
    /**
     * Returns the byte length of the private key.
     * @returns {number} Length in bytes.
     */
    static getLength(): number;
    /**
     * Returns the raw private key bytes.
     * @returns {Uint8Array} Private key as bytes.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying private key object.
     */
    getUnderlyingObject(): any;
    /**
     * Derives the public key corresponding to this private key.
     * @returns {PublicKey} The associated public key.
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map