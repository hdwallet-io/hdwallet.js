// SPDX-License-Identifier: MIT
/**
 * Abstract base class representing a public key in elliptic curve cryptography (ECC).
 *
 * This class defines the common structure and interface for public key implementations.
 * Subclasses for specific curves must implement all abstract and static methods.
 */
export class PublicKey {
    publicKey;
    /**
     * Constructs a new PublicKey instance.
     *
     * @param publicKey - The underlying curve-specific public key object.
     */
    constructor(publicKey) {
        this.publicKey = publicKey;
    }
    /**
     * Returns the name of the cryptographic curve or public key type.
     *
     * @returns The name of the public key (e.g., "secp256k1", "ed25519").
     * @throws Error if not implemented by subclass.
     */
    getName() {
        throw new Error('Must override getName()');
    }
    /**
     * Creates a PublicKey instance from its byte representation.
     *
     * @param publicKey - The public key as a byte array.
     * @returns A new PublicKey instance.
     * @throws Error if not implemented by subclass.
     */
    static fromBytes(publicKey) {
        throw new Error('Must override fromBytes()');
    }
    /**
     * Creates a PublicKey instance from a given Point.
     *
     * @param point - The elliptic curve point representing the public key.
     * @returns A new PublicKey instance.
     * @throws Error if not implemented by subclass.
     */
    static fromPoint(point) {
        throw new Error('Must override fromPoint()');
    }
    /**
     * Returns the length (in bytes) of a compressed public key.
     *
     * @returns The compressed key size in bytes.
     * @throws Error if not implemented by subclass.
     */
    static getCompressedLength() {
        throw new Error('Must override compressedLength()');
    }
    /**
     * Returns the length (in bytes) of an uncompressed public key.
     *
     * @returns The uncompressed key size in bytes.
     * @throws Error if not implemented by subclass.
     */
    static getUncompressedLength() {
        throw new Error('Must override uncompressedLength()');
    }
    /**
     * Validates whether the provided byte array represents a valid public key.
     *
     * @param bytes - The public key bytes to validate.
     * @returns `true` if valid, otherwise `false`.
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
    /**
     * Validates whether the given elliptic curve point represents a valid public key.
     *
     * @param point - The point to validate.
     * @returns `true` if valid, otherwise `false`.
     */
    static isValidPoint(point) {
        try {
            this.fromPoint(point);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=public-key.js.map