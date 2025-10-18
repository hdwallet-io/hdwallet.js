// SPDX-License-Identifier: MIT

import { hmac } from '@noble/hashes/hmac';
// @ts-ignore: no declaration file for '@taichunmin/crc/crc32'
import numCrc32 from '@taichunmin/crc/crc32';
// @ts-ignore: no declaration file for '@taichunmin/crc/crc16xmodem'
import numCrc16xmodem from '@taichunmin/crc/crc16xmodem';
import {
  sha256 as nobleSha256, sha512 as nobleSha512, sha512_256 as nobleSha512_256
} from '@noble/hashes/sha2';
import { sha3_256 as nobleSha3_256, keccak_256 as nobleKeccak256 } from '@noble/hashes/sha3';
import { blake2b as nobleBlake2b } from '@noble/hashes/blake2';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/legacy';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';

import { getBytes, integerToBytes, concatBytes, toBuffer } from './utils';
import { SLIP10_SECP256K1_CONST } from './consts';

/**
 * Computes HMAC-SHA256 of the given data using the provided key.
 * @param key - Secret key as a Uint8Array or string.
 * @param data - Data to hash as a Uint8Array or string.
 * @returns HMAC-SHA256 digest as Uint8Array.
 */
export function hmacSha256(
  key: Uint8Array | string,
  data: Uint8Array | string
): Uint8Array {
  const mac = hmac(nobleSha256, toBuffer(key), toBuffer(data)); // ← key first!
  return getBytes(mac);
}

/**
 * Computes HMAC-SHA512 of the given data using the provided key.
 * @param key - Secret key as a Uint8Array or string.
 * @param data - Data to hash as a Uint8Array or string.
 * @returns HMAC-SHA512 digest as Uint8Array.
 */
export function hmacSha512(
  key: Uint8Array | string,
  data: Uint8Array | string
): Uint8Array {
  const mac = hmac(nobleSha512, toBuffer(key), toBuffer(data)); // ← key first!
  return getBytes(mac);
}


/**
 * Computes Blake2b hash of the input data.
 * @param data - Data to hash.
 * @param digestSize - Desired output length in bytes.
 * @param key - Optional secret key.
 * @param salt - Optional salt.
 * @param personalize - Optional personalization string.
 * @returns Blake2b digest as Uint8Array.
 */
export function blake2b(
  data: Uint8Array | string,
  digestSize: number,
  key: Uint8Array | string = new Uint8Array(0),
  salt: Uint8Array | string = new Uint8Array(0),
  personalize?: Uint8Array | string
): Uint8Array {
  const msg = getBytes(data);
  const k   = getBytes(key);
  const s   = getBytes(salt);
  const p   = personalize ? getBytes(personalize) : undefined;

  const hashBytes = nobleBlake2b(msg, {
    dkLen: digestSize,
    key: k.length > 0 ? k : undefined,
    salt: s.length > 0 ? s : undefined,
    personalize: p,
  });
  return getBytes(hashBytes);
}

export const blake2b32  = (d: any, k?: any, s?: any) => blake2b(d,  4, k, s);
export const blake2b40  = (d: any, k?: any, s?: any) => blake2b(d,  5, k, s);
export const blake2b160 = (d: any, k?: any, s?: any) => blake2b(d, 20, k, s);
export const blake2b224 = (d: any, k?: any, s?: any) => blake2b(d, 28, k, s);
export const blake2b256 = (d: any, k?: any, s?: any) => blake2b(d, 32, k, s);
export const blake2b512 = (d: any, k?: any, s?: any) => blake2b(d, 64, k, s);

/**
 * Encrypts plaintext using ChaCha20-Poly1305.
 * @param key - 32-byte secret key.
 * @param nonce - Nonce for encryption.
 * @param aad - Additional authenticated data.
 * @param plaintext - Data to encrypt.
 * @returns Object containing cipherText and authentication tag.
 */
export function chacha20Poly1305Encrypt(
  key: Uint8Array | string,
  nonce: Uint8Array | string,
  aad: Uint8Array | string,
  plaintext: Uint8Array | string
): { cipherText: Uint8Array; tag: Uint8Array } {
  const aead = new ChaCha20Poly1305(getBytes(key)); // key must be 32 bytes
  const ciphertextWithTag = aead.seal(
    getBytes(nonce),
    getBytes(plaintext),
    getBytes(aad)
  );
  // split cipher & tag (last 16 bytes)
  const ct  = ciphertextWithTag.slice(0, -16);
  const tag = ciphertextWithTag.slice(-16);
  return { cipherText: getBytes(ct), tag: getBytes(tag) };
}

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
export function chacha20Poly1305Decrypt(
  key: Uint8Array | string,
  nonce: Uint8Array | string,
  aad: Uint8Array | string,
  ciphertext: Uint8Array | string,
  tag: Uint8Array | string
): Uint8Array {
  const aead     = new ChaCha20Poly1305(getBytes(key));
  const combined = concatBytes(getBytes(ciphertext), getBytes(tag));
  const pt = aead.open(getBytes(nonce), combined, getBytes(aad));
  if (!pt) throw new Error('ChaCha20-Poly1305: authentication failed');
  return getBytes(pt);
}

/**
 * Computes SHA-256 hash.
 * @param data - Data to hash.
 * @returns SHA-256 digest as Uint8Array.
 */
export function sha256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha256(bytes);
  return getBytes(digestBytes);
}

/**
 * Computes double SHA-256 hash (SHA-256 of SHA-256).
 */
export const doubleSha256 = (d: any) => sha256(sha256(d));

/**
 * Computes SHA-512 hash.
 */
export function sha512(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha512(bytes);
  return getBytes(digestBytes);
}

/**
 * Computes SHA-512/256 hash.
 */
export function sha512_256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha512_256(bytes);
  return getBytes(digestBytes);
}


/**
 * Computes Keccak-256 hash.
 */
export function keccak256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleKeccak256(bytes);
  return getBytes(digestBytes);
}

/**
 * Computes SHA3-256 hash.
 */
export function sha3_256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha3_256(bytes);
  return getBytes(digestBytes);
}

/**
 * Computes RIPEMD-160 hash.
 */
export function ripemd160(data: Uint8Array | string): Uint8Array {
  const bytes = getBytes(data);          // whatever util you already use
  return getBytes(nobleRipemd160(bytes));
}

/**
 * Computes HASH160 (RIPEMD-160 of SHA-256).
 */
export function hash160(data: Uint8Array | string): Uint8Array {
  const sha = sha256(data);
  return ripemd160(sha);
}

/**
 * Computes CRC32 checksum.
 */
export function crc32(data: Uint8Array | string): Uint8Array {
  const num = numCrc32(toBuffer(data));
  return integerToBytes(num, 4);
}

/**
 * Computes XMODEM CRC16 checksum.
 */
export function xmodemCrc(data: Uint8Array | string): Uint8Array {
  const num = numCrc16xmodem(toBuffer(data));
  return integerToBytes(num, 2);
}

/**
 * Computes PBKDF2-HMAC-SHA512 key derivation.
 * @param password - Password.
 * @param salt - Salt.
 * @param iterations - Number of iterations (>0).
 * @param keyLen - Desired key length.
 * @returns Derived key as Uint8Array.
 */
export function pbkdf2HmacSha512(
  password: Uint8Array | string, salt: Uint8Array | string, iterations: number, keyLen = 64
): Uint8Array {
  if (iterations <= 0 || !Number.isSafeInteger(iterations))
    throw new RangeError('iterations must be a positive integer');
  if (keyLen <= 0)
    throw new RangeError('keyLen must be > 0');

  const dk = pbkdf2(
    nobleSha512, toBuffer(password), toBuffer(salt), { c: iterations, dkLen: keyLen }
  );

  return getBytes(dk);
}

/**
 * Returns checksum of data as first 4 bytes of double SHA-256.
 */
export const getChecksum = (d: any): Uint8Array =>
  doubleSha256(d).slice(0, SLIP10_SECP256K1_CONST.CHECKSUM_BYTE_LENGTH);
