// SPDX-License-Identifier: MIT
import { hmac } from '@noble/hashes/hmac';
// @ts-ignore: no declaration file for '@taichunmin/crc/crc32'
import numCrc32 from '@taichunmin/crc/crc32';
// @ts-ignore: no declaration file for '@taichunmin/crc/crc16xmodem'
import numCrc16xmodem from '@taichunmin/crc/crc16xmodem';
import { sha256 as nobleSha256, sha512 as nobleSha512, sha512_256 as nobleSha512_256 } from '@noble/hashes/sha2';
import { sha3_256 as nobleSha3_256, keccak_256 as nobleKeccak256 } from '@noble/hashes/sha3';
import { blake2b as nobleBlake2b } from '@noble/hashes/blake2';
import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { ripemd160 as nobleRipemd160 } from '@noble/hashes/legacy';
import { ChaCha20Poly1305 } from '@stablelib/chacha20poly1305';
import { getBytes, integerToBytes, concatBytes, toBuffer } from './utils';
import { SLIP10_SECP256K1_CONST } from './consts';
export function hmacSha256(key, data) {
    const mac = hmac(nobleSha256, toBuffer(key), toBuffer(data)); // ← key first!
    return getBytes(mac);
}
export function hmacSha512(key, data) {
    const mac = hmac(nobleSha512, toBuffer(key), toBuffer(data)); // ← key first!
    return getBytes(mac);
}
export function blake2b(data, digestSize, key = new Uint8Array(0), salt = new Uint8Array(0), personalize) {
    const msg = getBytes(data);
    const k = getBytes(key);
    const s = getBytes(salt);
    const p = personalize ? getBytes(personalize) : undefined;
    const hashBytes = nobleBlake2b(msg, {
        dkLen: digestSize,
        key: k.length > 0 ? k : undefined,
        salt: s.length > 0 ? s : undefined,
        personalize: p,
    });
    return getBytes(hashBytes);
}
export const blake2b32 = (d, k, s) => blake2b(d, 4, k, s);
export const blake2b40 = (d, k, s) => blake2b(d, 5, k, s);
export const blake2b160 = (d, k, s) => blake2b(d, 20, k, s);
export const blake2b224 = (d, k, s) => blake2b(d, 28, k, s);
export const blake2b256 = (d, k, s) => blake2b(d, 32, k, s);
export const blake2b512 = (d, k, s) => blake2b(d, 64, k, s);
export function chacha20Poly1305Encrypt(key, nonce, aad, plaintext) {
    const aead = new ChaCha20Poly1305(getBytes(key)); // key must be 32 bytes
    const ciphertextWithTag = aead.seal(getBytes(nonce), getBytes(plaintext), getBytes(aad));
    // split cipher & tag (last 16 bytes)
    const ct = ciphertextWithTag.slice(0, -16);
    const tag = ciphertextWithTag.slice(-16);
    return { cipherText: getBytes(ct), tag: getBytes(tag) };
}
export function chacha20Poly1305Decrypt(key, nonce, aad, ciphertext, tag) {
    const aead = new ChaCha20Poly1305(getBytes(key));
    const combined = concatBytes(getBytes(ciphertext), getBytes(tag));
    const pt = aead.open(getBytes(nonce), combined, getBytes(aad));
    if (!pt)
        throw new Error('ChaCha20-Poly1305: authentication failed');
    return getBytes(pt);
}
export function sha256(data) {
    const bytes = getBytes(data);
    const digestBytes = nobleSha256(bytes);
    return getBytes(digestBytes);
}
export const doubleSha256 = (d) => sha256(sha256(d));
export function sha512(data) {
    const bytes = getBytes(data);
    const digestBytes = nobleSha512(bytes);
    return getBytes(digestBytes);
}
export function sha512_256(data) {
    const bytes = getBytes(data);
    const digestBytes = nobleSha512_256(bytes);
    return getBytes(digestBytes);
}
export function keccak256(data) {
    const bytes = getBytes(data);
    const digestBytes = nobleKeccak256(bytes);
    return getBytes(digestBytes);
}
export function sha3_256(data) {
    const bytes = getBytes(data);
    const digestBytes = nobleSha3_256(bytes);
    return getBytes(digestBytes);
}
export function ripemd160(data) {
    const bytes = getBytes(data); // whatever util you already use
    return getBytes(nobleRipemd160(bytes));
}
export function hash160(data) {
    const sha = sha256(data);
    return ripemd160(sha);
}
export function crc32(data) {
    const num = numCrc32(toBuffer(data));
    return integerToBytes(num, 4);
}
export function xmodemCrc(data) {
    const num = numCrc16xmodem(toBuffer(data));
    return integerToBytes(num, 2);
}
export function pbkdf2HmacSha512(password, salt, iterations, keyLen = 64) {
    if (iterations <= 0 || !Number.isSafeInteger(iterations))
        throw new RangeError('iterations must be a positive integer');
    if (keyLen <= 0)
        throw new RangeError('keyLen must be > 0');
    const dk = pbkdf2(nobleSha512, toBuffer(password), toBuffer(salt), { c: iterations, dkLen: keyLen });
    return getBytes(dk);
}
export const getChecksum = (d) => doubleSha256(d).slice(0, SLIP10_SECP256K1_CONST.CHECKSUM_BYTE_LENGTH);
//# sourceMappingURL=crypto.js.map