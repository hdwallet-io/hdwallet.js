import { PrivateKey } from '../../private-key';
import { PublicKey } from '../../public-key';
/**
 * Represents a SLIP10 Secp256k1 private key.
 * @extends PrivateKey
 */
export declare class SLIP10Secp256k1PrivateKey extends PrivateKey {
    /**
     * Returns the name of the elliptic curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a private key from raw bytes.
     * @param {Uint8Array} privateKey - Raw private key bytes.
     * @returns {SLIP10Secp256k1PrivateKey} Private key instance.
     * @throws {Error} If the bytes are invalid or wrong length.
     */
    static fromBytes(privateKey: Uint8Array): PrivateKey;
    /**
     * Returns the length of the private key in bytes.
     * @returns {number} Private key byte length.
     */
    static getLength(): number;
    /**
     * Returns the raw bytes of the private key.
     * @returns {Uint8Array} Raw private key bytes.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying private key object.
     */
    getUnderlyingObject(): any;
    /**
     * Returns the corresponding public key for this private key.
     * @returns {PublicKey} Public key instance.
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map