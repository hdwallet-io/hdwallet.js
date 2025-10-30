import { PrivateKey } from '../../private-key';
import { SLIP10Ed25519PrivateKey } from '../../slip10';
import { OptionsPrivateKey } from '../../../interfaces';
import { PublicKey } from '../../public-key';
/**
 * Represents a Kholaw Ed25519 private key with an extended key.
 * @extends SLIP10Ed25519PrivateKey
 */
export declare class KholawEd25519PrivateKey extends SLIP10Ed25519PrivateKey {
    /**
     * Creates a new KholawEd25519PrivateKey instance.
     * @param {Uint8Array} privateKey - The private key bytes.
     * @param {OptionsPrivateKey} options - The private key options including the extended key.
     * @throws {Error} If the extended key is missing or has an invalid length.
     */
    constructor(privateKey: Uint8Array, options: OptionsPrivateKey);
    /**
     * Returns the curve name identifier.
     * @returns {string} The curve name "Kholaw-Ed25519".
     */
    getName(): string;
    /**
     * Creates a private key instance from serialized bytes.
     * @param {Uint8Array} privateKey - The serialized private key bytes.
     * @returns {PrivateKey} A new KholawEd25519PrivateKey instance.
     * @throws {Error} If the private key length is invalid.
     */
    static fromBytes(privateKey: Uint8Array): PrivateKey;
    /**
     * Returns the total byte length of the private key including the extended key.
     * @returns {number} The byte length of the private key.
     */
    static getLength(): number;
    /**
     * Returns the serialized form of the private key including the extended key.
     * @returns {Uint8Array} The raw serialized private key bytes.
     * @throws {Error} If the extended key is missing.
     */
    getRaw(): Uint8Array;
    /**
     * Derives and returns the corresponding KholawEd25519 public key.
     * @returns {PublicKey} The derived KholawEd25519PublicKey instance.
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map