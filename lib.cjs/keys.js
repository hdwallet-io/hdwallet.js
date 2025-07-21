"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = serialize;
exports.deserialize = deserialize;
exports.isValidKey = isValidKey;
exports.isRootKey = isRootKey;
const base58_1 = require("./libs/base58");
const utils_1 = require("./utils");
const exceptions_1 = require("./exceptions");
function serialize(version, depth, parentFingerprint, index, chainCode, key, encoded = false) {
    try {
        const versionBytes = typeof version === 'number'
            ? (0, utils_1.integerToBytes)(version, 4)
            : (0, utils_1.getBytes)(version);
        if (depth < 0 || depth > 0xff) {
            throw new exceptions_1.ExtendedKeyError(`Depth must be 0–255; got ${depth}`);
        }
        const depthByte = (0, utils_1.integerToBytes)(depth, 1);
        const parentBytes = (0, utils_1.getBytes)(parentFingerprint);
        if (parentBytes.length !== 4) {
            throw new exceptions_1.ExtendedKeyError(`Parent fingerprint must be 4 bytes; got ${parentBytes.length}`);
        }
        if (!Number.isInteger(index) || index < 0 || index > 0xffffffff) {
            throw new exceptions_1.ExtendedKeyError(`Index must be 0–2^32-1; got ${index}`);
        }
        const indexBytes = (0, utils_1.integerToBytes)(index, 4);
        const chainBytes = (0, utils_1.getBytes)(chainCode);
        if (chainBytes.length !== 32) {
            throw new exceptions_1.ExtendedKeyError(`Chain code must be 32 bytes; got ${chainBytes.length}`);
        }
        const raw = (0, utils_1.concatBytes)(versionBytes, depthByte, parentBytes, indexBytes, chainBytes, (0, utils_1.getBytes)(key));
        return encoded ? (0, base58_1.checkEncode)(raw) : (0, utils_1.bytesToString)(raw);
    }
    catch (err) {
        return null;
    }
}
function deserialize(key, encoded = true) {
    const rawBytes = encoded ? (0, base58_1.checkDecode)(key) : (0, utils_1.getBytes)(key);
    if (![78, 110].includes(rawBytes.length)) {
        throw new exceptions_1.ExtendedKeyError('Invalid extended key length', { expected: [78, 110], got: rawBytes.length });
    }
    const version = rawBytes.slice(0, 4);
    const depth = rawBytes[4];
    const parentFingerprint = rawBytes.slice(5, 9);
    const indexView = new DataView(rawBytes.buffer, rawBytes.byteOffset + 9, 4);
    const index = indexView.getUint32(0, false);
    const chainCode = rawBytes.slice(13, 45);
    const keyData = rawBytes.slice(45);
    return [version, depth, parentFingerprint, index, chainCode, keyData];
}
function isValidKey(key, encoded = true) {
    try {
        deserialize(key, encoded);
        return true;
    }
    catch {
        return false;
    }
}
function isRootKey(key, encoded = true) {
    if (!isValidKey(key, encoded)) {
        throw new exceptions_1.ExtendedKeyError('Invalid extended(x) key');
    }
    const [_, depth, parentFingerprint, index] = deserialize(key, encoded);
    // Check that depth === 0, parentFingerprint is all zero bytes, and index === 0
    const zeroFingerprint = new Uint8Array(4); // [0,0,0,0]
    return depth === 0 && (0, utils_1.equalBytes)(parentFingerprint, zeroFingerprint) && index === 0;
}
//# sourceMappingURL=keys.js.map