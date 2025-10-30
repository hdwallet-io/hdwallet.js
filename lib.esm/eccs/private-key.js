// SPDX-License-Identifier: MIT
/**
 * Abstract base class representing a private key in elliptic curve cryptography (ECC).
 *
 * This class defines the common interface and behavior expected for all private key implementations.
 * Concrete subclasses (e.g., for specific curves) must override all abstract and static methods as needed.
 */
export class PrivateKey {
    privateKey;
    options;
    /**
     * Constructs a new PrivateKey instance.
     *
     * @param privateKey - The underlying curve-specific private key object.
     * @param options - Optional configuration for the private key.
     */
    constructor(privateKey, options = {}) {
        this.privateKey = privateKey;
        this.options = options;
    }
    /**
     * Returns the name of the cryptographic curve or private key type.
     *
     * @returns The name of the private key (e.g., "secp256k1", "ed25519").
     * @throws Error if not implemented by subclass.
     */
    getName() {
        throw new Error('Must override getName()');
    }
    /**
     * Creates a PrivateKey instance from its byte representation.
     *
     * @param privateKey - The private key as a byte array.
     * @returns A new PrivateKey instance.
     * @throws Error if not implemented by subclass.
     */
    static fromBytes(privateKey) {
        throw new Error('Must override fromBytes()');
    }
    /**
     * Returns the length (in bytes) of the private key.
     *
     * @returns The private key size in bytes.
     * @throws Error if not implemented by subclass.
     */
    static getLength() {
        throw new Error('Must override size()');
    }
    /**
     * Validates whether a given byte sequence represents a valid private key.
     *
     * @param bytes - The private key bytes to validate.
     * @returns `true` if the bytes represent a valid private key, otherwise `false`.
     */
    static isValidBytes(bytes) {
        try {
            this.fromBytes(bytes);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=private-key.js.map