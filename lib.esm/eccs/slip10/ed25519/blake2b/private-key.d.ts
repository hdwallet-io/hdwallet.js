import { PrivateKey } from '../../../private-key';
import { PublicKey } from '../../../public-key';
/**
 * Represents a SLIP10 Ed25519 Blake2b private key.
 * @extends PrivateKey
 */
export declare class SLIP10Ed25519Blake2bPrivateKey extends PrivateKey {
    /**
     * Returns the name of the private key curve.
     * @returns {string} Curve name.
     */
    getName(): string;
    /**
     * Creates a private key instance from raw bytes.
     * @param {Uint8Array} privateKey - The private key bytes.
     * @returns {SLIP10Ed25519Blake2bPrivateKey} The private key instance.
     * @throws {Error} If the bytes are invalid or length is incorrect.
     */
    static fromBytes(privateKey: Uint8Array): PrivateKey;
    /**
     * Returns the length of the private key in bytes.
     * @returns {number} Private key byte length.
     */
    static getLength(): number;
    /**
     * Returns the raw private key bytes.
     * @returns {Uint8Array} Private key bytes.
     */
    getRaw(): Uint8Array;
    /**
     * Returns the underlying private key object.
     * @returns {any} Underlying key object.
     */
    getUnderlyingObject(): any;
    /**
     * Returns the corresponding public key.
     * @returns {SLIP10Ed25519Blake2bPublicKey} The public key instance.
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map