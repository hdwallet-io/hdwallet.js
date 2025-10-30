import { DerivationsType, IndexType } from './types';
import { EnsureTypeMatchOptionsInterface } from './interfaces';
/**
 * Converts input data to a Uint8Array.
 * @param data - Input data as a string, number array, Uint8Array, or null/undefined.
 * @param encoding - Encoding to use if input is a string ('hex', 'utf8', 'base64'). Default is 'hex'.
 * @returns Uint8Array representation of the input data.
 */
export declare function getBytes(data: Uint8Array | Array<number> | string | null | undefined, encoding?: 'hex' | 'utf8' | 'base64'): Uint8Array;
/**
 * Converts input to a Uint8Array (buffer).
 * @param input - Input as a string, ArrayBuffer, or Array-like number array.
 * @param encoding - Encoding for string inputs ('utf8', 'hex', 'base64'). Default is 'utf8'.
 * @returns Uint8Array representation of input.
 */
export declare function toBuffer(input: string | ArrayLike<number> | ArrayBuffer, encoding?: 'utf8' | 'hex' | 'base64'): Uint8Array;
/**
 * Converts a hex string to a Uint8Array.
 * @param hex - Hexadecimal string (optionally prefixed with '0x').
 * @returns Uint8Array representing the hex string.
 * @throws Error if hex string length is not even.
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Converts a Uint8Array to a hex string.
 * @param bytes - Data to convert.
 * @param prefix - Whether to add '0x' prefix. Default is false.
 * @returns Hexadecimal string.
 */
export declare function bytesToHex(bytes: Uint8Array, prefix?: boolean): string;
/**
 * Converts a string or Uint8Array to a hex string.
 * @param data - Input string or Uint8Array.
 * @returns Hexadecimal string representation of input.
 */
export declare function bytesToString(data: Uint8Array | string | null | undefined): string;
/**
 * Generates cryptographically secure random bytes.
 * @param len - Number of random bytes to generate.
 * @returns Uint8Array of random bytes.
 * @throws Error if length is not a positive integer.
 */
export declare function randomBytes(len: number): Uint8Array;
/**
 * Converts a Uint8Array to a bigint.
 * @param bytes - Byte array to convert.
 * @param littleEndian - Whether to interpret bytes in little-endian order. Default is false.
 * @returns bigint representation of bytes.
 */
export declare function bytesToInteger(bytes: Uint8Array, littleEndian?: boolean): bigint;
/**
 * Ensures the input is a string.
 * @param data - Input as a string or Uint8Array.
 * @returns Input converted to string.
 * @throws TypeError if input is neither string nor Uint8Array.
 */
export declare function ensureString(data: Uint8Array | string): string;
/**
 * Converts a string or Uint8Array to a bigint.
 * @param data - Input string (hex) or Uint8Array.
 * @returns bigint representation of input.
 */
export declare function stringToInteger(data: Uint8Array | string): bigint;
/**
 * Compares two Uint8Arrays for equality.
 * @param a - First array.
 * @param b - Second array.
 * @returns true if arrays are equal, false otherwise.
 */
export declare function equalBytes(a: Uint8Array, b: Uint8Array): boolean;
/**
 * Converts a bigint or number to a Uint8Array.
 * @param value - Value to convert.
 * @param length - Optional fixed byte length for output.
 * @param endianness - 'big' or 'little' endian. Default is 'big'.
 * @returns Uint8Array representing the integer.
 */
export declare function integerToBytes(value: bigint | number, length?: number, endianness?: 'big' | 'little'): Uint8Array;
/**
 * Concatenates multiple Uint8Arrays.
 * @param chunks - Arrays to concatenate.
 * @returns Concatenated Uint8Array.
 */
export declare function concatBytes(...chunks: Uint8Array[]): Uint8Array;
/**
 * Converts bytes to a binary string.
 * @param data - Input bytes.
 * @param zeroPadBits - Optional zero-padding to reach a specific bit length.
 * @returns Binary string representation of bytes.
 */
export declare function bytesToBinaryString(data: Uint8Array, zeroPadBits?: number): string;
/**
 * Converts a binary string or bytes to a bigint.
 * @param data - Binary string or Uint8Array.
 * @returns bigint representation.
 */
export declare function binaryStringToInteger(data: Uint8Array | string): bigint;
/**
 * Converts an integer to a binary string.
 * @param data - Input number or bigint.
 * @param zeroPadBits - Optional zero-padding to reach a specific bit length.
 * @returns Binary string.
 */
export declare function integerToBinaryString(data: number | bigint, zeroPadBits?: number): string;
/**
 * Converts a binary string or Uint8Array to bytes.
 * @param data - Input binary string or bytes.
 * @param zeroPadByteLen - Optional zero-padding to reach a specific byte length.
 * @returns Uint8Array representation.
 */
export declare function binaryStringToBytes(data: Uint8Array | string, zeroPadByteLen?: number): Uint8Array;
/**
 * Checks if all inputs are equal.
 * @param inputs - Inputs of various types to compare.
 * @returns true if all inputs are equal, false otherwise.
 */
export declare function isAllEqual(...inputs: (Uint8Array | ArrayBuffer | ArrayBufferView | string | number | boolean | string[] | number[] | boolean[])[]): boolean;
/**
 * Generates a random alphanumeric passphrase.
 * @param length - Length of the passphrase. Default is 32.
 * @param chars - Characters to use. Default is alphanumeric.
 * @returns Randomly generated passphrase string.
 */
export declare function generatePassphrase(length?: number, chars?: string): string;
/**
 * Returns HMAC seed based on ECC name.
 * @param eccName - ECC curve name.
 * @returns Seed as Uint8Array.
 * @throws DerivationError if curve is unknown.
 */
export declare function getHmac(eccName: string): Uint8Array;
/**
 * Excludes specific keys from nested objects recursively.
 * @param nested - Input object.
 * @param keys - Keys to exclude.
 * @returns New object excluding specified keys.
 */
export declare function excludeKeys(nested: Record<string, any>, keys: string[]): Record<string, any>;
/**
 * Converts derivation path string to an array of indexes.
 * @param path - Derivation path (e.g., "m/44'/0'/0'").
 * @returns Array of numeric indexes.
 * @throws DerivationError on invalid path.
 */
export declare function pathToIndexes(path: string): number[];
/**
 * Converts array of indexes to a derivation path string.
 * @param indexes - Array of numeric indexes.
 * @returns Derivation path string.
 */
export declare function indexesToPath(indexes: number[]): string;
/**
 * Normalize a BIP32 derivation index to a tuple.
 * @param index - Index as number, string (e.g., "0" or "0-3"), or tuple [from, to].
 * @param hardened - Whether the index is hardened (default: false)
 * @returns Normalized derivation tuple.
 * @throws DerivationError on invalid input.
 */
export declare function normalizeIndex(index: IndexType, hardened?: boolean): DerivationsType;
/**
 * Normalize a derivation path string or numeric indexes.
 * @param path - Optional path string like "m/0'/1-3'"
 * @param indexes - Optional array of numeric indexes
 * @returns Tuple: [normalized path string, indexes array, derivation tuples]
 * @throws DerivationError on invalid input
 */
export declare function normalizeDerivation(path?: string, indexes?: number[]): [string, number[], DerivationsType[]];
/**
 * Convert a derivation tuple to integer representation
 * @param idx - Derivation tuple [index, hardened] or [from, to, hardened]
 * @returns Integer value with hardened bit applied if necessary
 */
export declare function indexTupleToInteger(idx: DerivationsType): number;
/**
 * Convert a derivation tuple to a string representation
 * @param idx - Derivation tuple [index, hardened] or [from, to, hardened]
 * @returns String like "0'" or "0-3'"
 */
export declare function indexTupleToString(idx: DerivationsType): string;
/**
 * Convert a single index string "0'" into tuple [0, true]
 * @param i - Index string
 * @returns Tuple [index number, hardened boolean]
 */
export declare function indexStringToTuple(i: string): [number, boolean];
/**
 * XOR two Uint8Arrays of equal length
 * @param a - First byte array
 * @param b - Second byte array
 * @returns New Uint8Array resulting from XOR
 * @throws DerivationError if lengths mismatch
 */
export declare function xor(a: Uint8Array, b: Uint8Array): Uint8Array;
/**
 * Add two Uint8Arrays element-wise modulo 256
 * @param a - First byte array
 * @param b - Second byte array
 * @returns New Uint8Array result
 * @throws DerivationError if lengths mismatch
 */
export declare function addNoCarry(a: Uint8Array, b: Uint8Array): Uint8Array;
/**
 * Multiply each byte by a scalar modulo 256
 * @param data - Byte array
 * @param scalar - Integer scalar
 * @returns New Uint8Array result
 */
export declare function multiplyScalarNoCarry(data: Uint8Array, scalar: number): Uint8Array;
/** Bit manipulation helpers */
export declare function isBitsSet(value: number, bitNum: number): boolean;
export declare function areBitsSet(value: number, mask: number): boolean;
export declare function setBit(value: number, bitNum: number): number;
export declare function setBits(value: number, mask: number): number;
export declare function resetBit(value: number, bitNum: number): number;
export declare function resetBits(value: number, mask: number): number;
/**
 * Reverse a Uint8Array
 * @param data - Byte array
 * @returns New Uint8Array reversed
 */
export declare function bytesReverse(data: Uint8Array): Uint8Array;
/**
 * Convert bits between different widths
 * @param data - Array of numbers or Uint8Array
 * @param fromBits - Original bit width
 * @param toBits - Target bit width
 * @returns Array of converted bits or null if input invalid
 */
export declare function convertBits(data: number[] | Uint8Array, fromBits: number, toBits: number): number[] | null;
/**
 * Convert a byte chunk to mnemonic words
 * @param bytesChunk - Uint8Array of bytes
 * @param wordsList - Wordlist array
 * @param endianness - "little" or "big"
 * @returns Tuple of 3 mnemonic words
 */
export declare function bytesChunkToWords(bytesChunk: Uint8Array, wordsList: string[], endianness: 'little' | 'big'): [string, string, string];
/**
 * Convert 3 mnemonic words to a byte chunk
 * @param w1 - Word 1
 * @param w2 - Word 2
 * @param w3 - Word 3
 * @param wordsList - Wordlist array
 * @param endianness - "little" or "big"
 * @returns Uint8Array of bytes
 */
export declare function wordsToBytesChunk(w1: string, w2: string, w3: string, wordsList: string[], endianness: 'little' | 'big'): Uint8Array;
/**
 * Convert kebab-case string to camelCase
 * @param input - Input string
 * @returns CamelCase string
 */
export declare function toCamelCase(input: string): string;
/**
 * Ensure a value matches the expected type(s)
 * @param instanceOrClass - Value or class instance
 * @param expectedType - Expected type or constructor
 * @param options - Optional object with otherTypes, strict, errorClass
 * @returns Value or object with {value, isValid}
 * @throws TypeError or custom error if type mismatch
 */
export declare function ensureTypeMatch(instanceOrClass: any, expectedType: any, options?: EnsureTypeMatchOptionsInterface): any;
//# sourceMappingURL=utils.d.ts.map