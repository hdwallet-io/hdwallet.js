/**
 * Computes HMAC-SHA256 of the given data using the provided key.
 * @param key - Secret key as a Uint8Array or string.
 * @param data - Data to hash as a Uint8Array or string.
 * @returns HMAC-SHA256 digest as Uint8Array.
 */
export declare function hmacSha256(key: Uint8Array | string, data: Uint8Array | string): Uint8Array;
/**
 * Computes HMAC-SHA512 of the given data using the provided key.
 * @param key - Secret key as a Uint8Array or string.
 * @param data - Data to hash as a Uint8Array or string.
 * @returns HMAC-SHA512 digest as Uint8Array.
 */
export declare function hmacSha512(key: Uint8Array | string, data: Uint8Array | string): Uint8Array;
/**
 * Computes Blake2b hash of the input data.
 * @param data - Data to hash.
 * @param digestSize - Desired output length in bytes.
 * @param key - Optional secret key.
 * @param salt - Optional salt.
 * @param personalize - Optional personalization string.
 * @returns Blake2b digest as Uint8Array.
 */
export declare function blake2b(data: Uint8Array | string, digestSize: number, key?: Uint8Array | string, salt?: Uint8Array | string, personalize?: Uint8Array | string): Uint8Array;
/**
 * Computes a 32-bit (4-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 4-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b32: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes a 40-bit (5-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 5-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b40: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes a 160-bit (20-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 20-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b160: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes a 224-bit (28-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 28-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b224: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes a 256-bit (32-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 32-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b256: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes a 512-bit (64-byte) BLAKE2b hash of the given data.
 * @param d - Data to hash.
 * @param k - Optional secret key.
 * @param s - Optional salt.
 * @returns 64-byte Blake2b digest as Uint8Array.
 */
export declare const blake2b512: (d: any, k?: any, s?: any) => Uint8Array<ArrayBufferLike>;
/**
 * Encrypts plaintext using ChaCha20-Poly1305.
 * @param key - 32-byte secret key.
 * @param nonce - Nonce for encryption.
 * @param aad - Additional authenticated data.
 * @param plaintext - Data to encrypt.
 * @returns Object containing cipherText and authentication tag.
 */
export declare function chacha20Poly1305Encrypt(key: Uint8Array | string, nonce: Uint8Array | string, aad: Uint8Array | string, plaintext: Uint8Array | string): {
    cipherText: Uint8Array;
    tag: Uint8Array;
};
/**
 * Decrypts ciphertext encrypted with ChaCha20-Poly1305.
 * @param key - 32-byte secret key.
 * @param nonce - Nonce used during encryption.
 * @param aad - Additional authenticated data.
 * @param ciphertext - Encrypted data.
 * @param tag - Authentication tag.
 * @returns Decrypted plaintext as Uint8Array.
 * @throws Error if authentication fails.
 */
export declare function chacha20Poly1305Decrypt(key: Uint8Array | string, nonce: Uint8Array | string, aad: Uint8Array | string, ciphertext: Uint8Array | string, tag: Uint8Array | string): Uint8Array;
/**
 * Computes SHA-256 hash.
 * @param data - Data to hash.
 * @returns SHA-256 digest as Uint8Array.
 */
export declare function sha256(data: Uint8Array | string): Uint8Array;
/**
 * Computes double SHA-256 hash (SHA-256 of SHA-256).
 */
export declare const doubleSha256: (d: any) => Uint8Array<ArrayBufferLike>;
/**
 * Computes SHA-512 hash.
 */
export declare function sha512(data: Uint8Array | string): Uint8Array;
/**
 * Computes SHA-512/256 hash.
 */
export declare function sha512_256(data: Uint8Array | string): Uint8Array;
/**
 * Computes Keccak-256 hash.
 */
export declare function keccak256(data: Uint8Array | string): Uint8Array;
/**
 * Computes SHA3-256 hash.
 */
export declare function sha3_256(data: Uint8Array | string): Uint8Array;
/**
 * Computes RIPEMD-160 hash.
 */
export declare function ripemd160(data: Uint8Array | string): Uint8Array;
/**
 * Computes HASH160 (RIPEMD-160 of SHA-256).
 */
export declare function hash160(data: Uint8Array | string): Uint8Array;
/**
 * Computes CRC32 checksum.
 */
export declare function crc32(data: Uint8Array | string): Uint8Array;
/**
 * Computes XMODEM CRC16 checksum.
 */
export declare function xmodemCrc(data: Uint8Array | string): Uint8Array;
/**
 * Computes PBKDF2-HMAC-SHA512 key derivation.
 * @param password - Password.
 * @param salt - Salt.
 * @param iterations - Number of iterations (>0).
 * @param keyLen - Desired key length.
 * @returns Derived key as Uint8Array.
 */
export declare function pbkdf2HmacSha512(password: Uint8Array | string, salt: Uint8Array | string, iterations: number, keyLen?: number): Uint8Array;
/**
 * Returns checksum of data as first 4 bytes of double SHA-256.
 */
export declare const getChecksum: (d: any) => Uint8Array;
//# sourceMappingURL=crypto.d.ts.map