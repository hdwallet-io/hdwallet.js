// SPDX-License-Identifier: MIT

import { checkEncode, checkDecode } from './libs/base58';
import {
  getBytes, bytesToString, integerToBytes, concatBytes, equalBytes
} from './utils';
import { ExtendedKeyError } from './exceptions';

export function serialize(
  version: string | Uint8Array | number,
  depth: number,
  parentFingerprint: string | Uint8Array,
  index: number,
  chainCode: string | Uint8Array,
  key: string | Uint8Array,
  encoded = false
): string | null {
  try {
    const versionBytes: Uint8Array =
      typeof version === 'number'
        ? integerToBytes(version, 4)
        : getBytes(version);

    if (depth < 0 || depth > 0xff) {
      throw new ExtendedKeyError(`Depth must be 0–255; got ${depth}`);
    }
    const depthByte = integerToBytes(depth, 1);

    const parentBytes = getBytes(parentFingerprint);
    if (parentBytes.length !== 4) {
      throw new ExtendedKeyError(
        `Parent fingerprint must be 4 bytes; got ${parentBytes.length}`
      );
    }

    if (!Number.isInteger(index) || index < 0 || index > 0xffffffff) {
      throw new ExtendedKeyError(`Index must be 0–2^32-1; got ${index}`);
    }
    const indexBytes = integerToBytes(index, 4);

    const chainBytes = getBytes(chainCode);
    if (chainBytes.length !== 32) {
      throw new ExtendedKeyError(
        `Chain code must be 32 bytes; got ${chainBytes.length}`
      );
    }

    const raw = concatBytes(
      versionBytes, depthByte, parentBytes, indexBytes, chainBytes, getBytes(key)
    );
    return encoded ? checkEncode(raw) : bytesToString(raw);
  } catch (err) {
    return null;
  }
}

export function deserialize(
  key: string,
  encoded = true
): [Uint8Array, number, Uint8Array, number, Uint8Array, Uint8Array] {

  const rawBytes = encoded ? checkDecode(key) : getBytes(key);
  if (![78, 110].includes(rawBytes.length)) {
    throw new ExtendedKeyError(
      'Invalid extended key length', { expected: [78, 110], got: rawBytes.length }
    );
  }

  const version = rawBytes.slice(0, 4);
  const depth = rawBytes[4];

  const parentFingerprint = rawBytes.slice(5, 9);
  const indexView = new DataView(
    rawBytes.buffer,
    rawBytes.byteOffset + 9,
    4
  );
  const index = indexView.getUint32(0, false);

  const chainCode = rawBytes.slice(13, 45);
  const keyData = rawBytes.slice(45);

  return [version, depth, parentFingerprint, index, chainCode, keyData];
}

export function isValidKey(key: string, encoded = true): boolean {
  try {
    deserialize(key, encoded);
    return true;
  } catch {
    return false;
  }
}

export function isRootKey(key: string, encoded = true): boolean {
  if (!isValidKey(key, encoded)) {
    throw new ExtendedKeyError('Invalid extended(x) key');
  }

  const [_, depth, parentFingerprint, index] = deserialize(key, encoded);

  // Check that depth === 0, parentFingerprint is all zero bytes, and index === 0
  const zeroFingerprint = new Uint8Array(4); // [0,0,0,0]
  return depth === 0 && equalBytes(parentFingerprint, zeroFingerprint) && index === 0;
}
