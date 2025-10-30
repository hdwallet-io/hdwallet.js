import { Point } from './point';
/**
 * Abstract base class representing a public key in elliptic curve cryptography (ECC).
 *
 * This class defines the common structure and interface for public key implementations.
 * Subclasses for specific curves must implement all abstract and static methods.
 */
export declare abstract class PublicKey {
    publicKey: any;
    /**
     * Constructs a new PublicKey instance.
     *
     * @param publicKey - The underlying curve-specific public key object.
     */
    constructor(publicKey: any);
    /**
     * Returns the name of the cryptographic curve or public key type.
     *
     * @returns The name of the public key (e.g., "secp256k1", "ed25519").
     * @throws Error if not implemented by subclass.
     */
    getName(): string;
    /**
     * Creates a PublicKey instance from its byte representation.
     *
     * @param publicKey - The public key as a byte array.
     * @returns A new PublicKey instance.
     * @throws Error if not implemented by subclass.
     */
    static fromBytes(publicKey: Uint8Array): PublicKey;
    /**
     * Creates a PublicKey instance from a given Point.
     *
     * @param point - The elliptic curve point representing the public key.
     * @returns A new PublicKey instance.
     * @throws Error if not implemented by subclass.
     */
    static fromPoint(point: Point): PublicKey;
    /**
     * Returns the compressed byte representation of the public key.
     *
     * @returns The compressed public key bytes as a Uint8Array.
     */
    abstract getRawCompressed(): Uint8Array;
    /**
     * Returns the uncompressed byte representation of the public key.
     *
     * @returns The uncompressed public key bytes as a Uint8Array.
     */
    abstract getRawUncompressed(): Uint8Array;
    /**
     * Returns the elliptic curve point associated with this public key.
     *
     * @returns The corresponding elliptic curve Point instance.
     */
    abstract getPoint(): Point;
    /**
     * Returns the underlying curve-specific public key object.
     *
     * @returns The internal ECC public key instance.
     */
    abstract getUnderlyingObject(): any;
    /**
     * Returns the length (in bytes) of a compressed public key.
     *
     * @returns The compressed key size in bytes.
     * @throws Error if not implemented by subclass.
     */
    static getCompressedLength(): number;
    /**
     * Returns the length (in bytes) of an uncompressed public key.
     *
     * @returns The uncompressed key size in bytes.
     * @throws Error if not implemented by subclass.
     */
    static getUncompressedLength(): number;
    /**
     * Validates whether the provided byte array represents a valid public key.
     *
     * @param bytes - The public key bytes to validate.
     * @returns `true` if valid, otherwise `false`.
     */
    static isValidBytes(bytes: Uint8Array): boolean;
    /**
     * Validates whether the given elliptic curve point represents a valid public key.
     *
     * @param point - The point to validate.
     * @returns `true` if valid, otherwise `false`.
     */
    static isValidPoint(point: Point): boolean;
}
//# sourceMappingURL=public-key.d.ts.map