"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChecksum = exports.doubleSha256 = exports.blake2b512 = exports.blake2b256 = exports.blake2b224 = exports.blake2b160 = exports.blake2b40 = exports.blake2b32 = void 0;
exports.hmacSha256 = hmacSha256;
exports.hmacSha512 = hmacSha512;
exports.blake2b = blake2b;
exports.chacha20Poly1305Encrypt = chacha20Poly1305Encrypt;
exports.chacha20Poly1305Decrypt = chacha20Poly1305Decrypt;
exports.sha256 = sha256;
exports.sha512 = sha512;
exports.sha512_256 = sha512_256;
exports.keccak256 = keccak256;
exports.sha3_256 = sha3_256;
exports.ripemd160 = ripemd160;
exports.hash160 = hash160;
exports.crc32 = crc32;
exports.xmodemCrc = xmodemCrc;
exports.pbkdf2HmacSha512 = pbkdf2HmacSha512;
const tslib_1 = require("tslib");
const hmac_1 = require("@noble/hashes/hmac");
// @ts-ignore: no declaration file for '@taichunmin/crc/crc32'
const crc32_1 = tslib_1.__importDefault(require("@taichunmin/crc/crc32"));
// @ts-ignore: no declaration file for '@taichunmin/crc/crc16xmodem'
const crc16xmodem_1 = tslib_1.__importDefault(require("@taichunmin/crc/crc16xmodem"));
const sha2_1 = require("@noble/hashes/sha2");
const sha3_1 = require("@noble/hashes/sha3");
const blake2_1 = require("@noble/hashes/blake2");
const pbkdf2_1 = require("@noble/hashes/pbkdf2");
const legacy_1 = require("@noble/hashes/legacy");
const chacha20poly1305_1 = require("@stablelib/chacha20poly1305");
const utils_1 = require("./utils");
const consts_1 = require("./consts");
function hmacSha256(key, data) {
    const mac = (0, hmac_1.hmac)(sha2_1.sha256, (0, utils_1.toBuffer)(key), (0, utils_1.toBuffer)(data)); // ← key first!
    return (0, utils_1.getBytes)(mac);
}
function hmacSha512(key, data) {
    const mac = (0, hmac_1.hmac)(sha2_1.sha512, (0, utils_1.toBuffer)(key), (0, utils_1.toBuffer)(data)); // ← key first!
    return (0, utils_1.getBytes)(mac);
}
function blake2b(data, digestSize, key = new Uint8Array(0), salt = new Uint8Array(0), personalize) {
    const msg = (0, utils_1.getBytes)(data);
    const k = (0, utils_1.getBytes)(key);
    const s = (0, utils_1.getBytes)(salt);
    const p = personalize ? (0, utils_1.getBytes)(personalize) : undefined;
    const hashBytes = (0, blake2_1.blake2b)(msg, {
        dkLen: digestSize,
        key: k.length > 0 ? k : undefined,
        salt: s.length > 0 ? s : undefined,
        personalize: p,
    });
    return (0, utils_1.getBytes)(hashBytes);
}
const blake2b32 = (d, k, s) => blake2b(d, 4, k, s);
exports.blake2b32 = blake2b32;
const blake2b40 = (d, k, s) => blake2b(d, 5, k, s);
exports.blake2b40 = blake2b40;
const blake2b160 = (d, k, s) => blake2b(d, 20, k, s);
exports.blake2b160 = blake2b160;
const blake2b224 = (d, k, s) => blake2b(d, 28, k, s);
exports.blake2b224 = blake2b224;
const blake2b256 = (d, k, s) => blake2b(d, 32, k, s);
exports.blake2b256 = blake2b256;
const blake2b512 = (d, k, s) => blake2b(d, 64, k, s);
exports.blake2b512 = blake2b512;
function chacha20Poly1305Encrypt(key, nonce, aad, plaintext) {
    const aead = new chacha20poly1305_1.ChaCha20Poly1305((0, utils_1.getBytes)(key)); // key must be 32 bytes
    const ciphertextWithTag = aead.seal((0, utils_1.getBytes)(nonce), (0, utils_1.getBytes)(plaintext), (0, utils_1.getBytes)(aad));
    // split cipher & tag (last 16 bytes)
    const ct = ciphertextWithTag.slice(0, -16);
    const tag = ciphertextWithTag.slice(-16);
    return { cipherText: (0, utils_1.getBytes)(ct), tag: (0, utils_1.getBytes)(tag) };
}
function chacha20Poly1305Decrypt(key, nonce, aad, ciphertext, tag) {
    const aead = new chacha20poly1305_1.ChaCha20Poly1305((0, utils_1.getBytes)(key));
    const combined = (0, utils_1.concatBytes)((0, utils_1.getBytes)(ciphertext), (0, utils_1.getBytes)(tag));
    const pt = aead.open((0, utils_1.getBytes)(nonce), combined, (0, utils_1.getBytes)(aad));
    if (!pt)
        throw new Error('ChaCha20-Poly1305: authentication failed');
    return (0, utils_1.getBytes)(pt);
}
function sha256(data) {
    const bytes = (0, utils_1.getBytes)(data);
    const digestBytes = (0, sha2_1.sha256)(bytes);
    return (0, utils_1.getBytes)(digestBytes);
}
const doubleSha256 = (d) => sha256(sha256(d));
exports.doubleSha256 = doubleSha256;
function sha512(data) {
    const bytes = (0, utils_1.getBytes)(data);
    const digestBytes = (0, sha2_1.sha512)(bytes);
    return (0, utils_1.getBytes)(digestBytes);
}
function sha512_256(data) {
    const bytes = (0, utils_1.getBytes)(data);
    const digestBytes = (0, sha2_1.sha512_256)(bytes);
    return (0, utils_1.getBytes)(digestBytes);
}
function keccak256(data) {
    const bytes = (0, utils_1.getBytes)(data);
    const digestBytes = (0, sha3_1.keccak_256)(bytes);
    return (0, utils_1.getBytes)(digestBytes);
}
function sha3_256(data) {
    const bytes = (0, utils_1.getBytes)(data);
    const digestBytes = (0, sha3_1.sha3_256)(bytes);
    return (0, utils_1.getBytes)(digestBytes);
}
function ripemd160(data) {
    const bytes = (0, utils_1.getBytes)(data); // whatever util you already use
    return (0, utils_1.getBytes)((0, legacy_1.ripemd160)(bytes));
}
function hash160(data) {
    const sha = sha256(data);
    return ripemd160(sha);
}
function crc32(data) {
    const num = (0, crc32_1.default)((0, utils_1.toBuffer)(data));
    return (0, utils_1.integerToBytes)(num, 4);
}
function xmodemCrc(data) {
    const num = (0, crc16xmodem_1.default)((0, utils_1.toBuffer)(data));
    return (0, utils_1.integerToBytes)(num, 2);
}
function pbkdf2HmacSha512(password, salt, iterations, keyLen = 64) {
    if (iterations <= 0 || !Number.isSafeInteger(iterations))
        throw new RangeError('iterations must be a positive integer');
    if (keyLen <= 0)
        throw new RangeError('keyLen must be > 0');
    const dk = (0, pbkdf2_1.pbkdf2)(sha2_1.sha512, (0, utils_1.toBuffer)(password), (0, utils_1.toBuffer)(salt), { c: iterations, dkLen: keyLen });
    return (0, utils_1.getBytes)(dk);
}
const getChecksum = (d) => (0, exports.doubleSha256)(d).slice(0, consts_1.SLIP10_SECP256K1_CONST.CHECKSUM_BYTE_LENGTH);
exports.getChecksum = getChecksum;
//# sourceMappingURL=crypto.js.map