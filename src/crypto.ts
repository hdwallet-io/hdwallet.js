// SPDX-License-Identifier: MIT

import { hmac } from '@noble/hashes/hmac';
import numCrc32 from '@taichunmin/crc/crc32';
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

export function hmacSha256(
  key: Uint8Array | string,
  data: Uint8Array | string
): Uint8Array {
  const mac = hmac(nobleSha256, toBuffer(key), toBuffer(data)); // ← key first!
  return getBytes(mac);
}

export function hmacSha512(
  key: Uint8Array | string,
  data: Uint8Array | string
): Uint8Array {
  const mac = hmac(nobleSha512, toBuffer(key), toBuffer(data)); // ← key first!
  return getBytes(mac);
}

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

export function sha256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha256(bytes);
  return getBytes(digestBytes);
}

export const doubleSha256 = (d: any) => sha256(sha256(d));

export function sha512(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha512(bytes);
  return getBytes(digestBytes);
}

export function sha512_256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha512_256(bytes);
  return getBytes(digestBytes);
}

export function keccak256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleKeccak256(bytes);
  return getBytes(digestBytes);
}

export function sha3_256(data: Uint8Array | string): Uint8Array {
  const bytes       = getBytes(data);
  const digestBytes = nobleSha3_256(bytes);
  return getBytes(digestBytes);
}

export function ripemd160(data: Uint8Array | string): Uint8Array {
  const bytes = getBytes(data);          // whatever util you already use
  return getBytes(nobleRipemd160(bytes));
}

export function hash160(data: Uint8Array | string): Uint8Array {
  const sha = sha256(data);
  return ripemd160(sha);
}

export function crc32(data: Uint8Array | string): Uint8Array {
  const num = numCrc32(toBuffer(data));
  return integerToBytes(num, 4);
}

export function xmodemCrc(data: Uint8Array | string): Uint8Array {
  const num = numCrc16xmodem(toBuffer(data));
  return integerToBytes(num, 2);
}

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

export const getChecksum = (d: any): Uint8Array =>
  doubleSha256(d).slice(0, SLIP10_SECP256K1_CONST.CHECKSUM_BYTE_LENGTH);
