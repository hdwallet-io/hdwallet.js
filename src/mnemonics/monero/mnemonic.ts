// SPDX-License-Identifier: MIT

import { Mnemonic } from '../mnemonic';
import { Entropy, MoneroEntropy, MONERO_ENTROPY_STRENGTHS } from '../../entropies';
import {
  MnemonicOptionsInterface, MoneroMnemonicLanguagesInterface, MoneroMnemonicWordsInterface
} from '../../interfaces';
import { crc32 } from '../../crypto';
import {
  hexToBytes, bytesToHex, bytesToInteger, bytesChunkToWords, wordsToBytesChunk, getBytes, concatBytes
} from '../../utils';
import { MnemonicError, EntropyError, ChecksumError } from '../../exceptions';
import {
  MONERO_CHINESE_SIMPLIFIED_WORDLIST,
  MONERO_DUTCH_WORDLIST,
  MONERO_ENGLISH_WORDLIST,
  MONERO_FRENCH_WORDLIST,
  MONERO_GERMAN_WORDLIST,
  MONERO_ITALIAN_WORDLIST,
  MONERO_JAPANESE_WORDLIST,
  MONERO_PORTUGUESE_WORDLIST,
  MONERO_RUSSIAN_WORDLIST,
  MONERO_SPANISH_WORDLIST
} from './wordlists';

export const MONERO_MNEMONIC_WORDS: MoneroMnemonicWordsInterface = {
  TWELVE: 12,
  THIRTEEN: 13,
  TWENTY_FOUR: 24,
  TWENTY_FIVE: 25,
} as const;

export const MONERO_MNEMONIC_LANGUAGES: MoneroMnemonicLanguagesInterface = {
  CHINESE_SIMPLIFIED: 'chinese-simplified',
  DUTCH: 'dutch',
  ENGLISH: 'english',
  FRENCH: 'french',
  GERMAN: 'german',
  ITALIAN: 'italian',
  JAPANESE: 'japanese',
  PORTUGUESE: 'portuguese',
  RUSSIAN: 'russian',
  SPANISH: 'spanish',
} as const;

/**
 * MoneroMnemonic
 *
 * Implements the Monero-specific mnemonic system which supports multiple languages
 * and variable word counts (12, 13, 24, or 25 words). Provides encoding and decoding
 * between entropy and mnemonic phrases with optional checksum validation.
 */
export class MoneroMnemonic extends Mnemonic {

  static wordBitLength: number = 11;

  static wordsList: number[] = [
    MONERO_MNEMONIC_WORDS.TWELVE,
    MONERO_MNEMONIC_WORDS.THIRTEEN,
    MONERO_MNEMONIC_WORDS.TWENTY_FOUR,
    MONERO_MNEMONIC_WORDS.TWENTY_FIVE
  ];

  static wordsToStrength: Record<number, number> = {
    12: MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
    13: MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
    24: MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX,
    25: MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
  };

  static checksumWordCounts: number[] = [
    MONERO_MNEMONIC_WORDS.THIRTEEN,
    MONERO_MNEMONIC_WORDS.TWENTY_FIVE
  ];

  static languages: string[] = Object.values(
    MONERO_MNEMONIC_LANGUAGES
  );

  static languageUniquePrefixLengths: Record<string, number> = {
    [MONERO_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: 1,
    [MONERO_MNEMONIC_LANGUAGES.DUTCH]: 4,
    [MONERO_MNEMONIC_LANGUAGES.ENGLISH]: 3,
    [MONERO_MNEMONIC_LANGUAGES.FRENCH]: 4,
    [MONERO_MNEMONIC_LANGUAGES.GERMAN]: 4,
    [MONERO_MNEMONIC_LANGUAGES.ITALIAN]: 4,
    [MONERO_MNEMONIC_LANGUAGES.JAPANESE]: 4,
    [MONERO_MNEMONIC_LANGUAGES.PORTUGUESE]: 4,
    [MONERO_MNEMONIC_LANGUAGES.RUSSIAN]: 4,
    [MONERO_MNEMONIC_LANGUAGES.SPANISH]: 4,
  };

  static wordLists: Record<string, string[]> = {
    [MONERO_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: MONERO_CHINESE_SIMPLIFIED_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.DUTCH]: MONERO_DUTCH_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.ENGLISH]: MONERO_ENGLISH_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.FRENCH]: MONERO_FRENCH_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.GERMAN]: MONERO_GERMAN_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.ITALIAN]: MONERO_ITALIAN_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.JAPANESE]: MONERO_JAPANESE_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.PORTUGUESE]: MONERO_PORTUGUESE_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.RUSSIAN]: MONERO_RUSSIAN_WORDLIST,
    [MONERO_MNEMONIC_LANGUAGES.SPANISH]: MONERO_SPANISH_WORDLIST
  };

  /**
   * Returns the name of this mnemonic type.
   * @returns {string} `"Monero"`
   */
  static getName(): string {
    return 'Monero';
  }

  /**
   * Generates a mnemonic phrase from a given word count.
   *
   * @param {number} count - The number of words (12, 13, 24, or 25).
   * @param {string} language - The language of the mnemonic (must be one of `MONERO_MNEMONIC_LANGUAGES`).
   * @returns {string} Mnemonic phrase.
   * @throws {MnemonicError} If the word count is invalid.
   */
  static fromWords(
    count: number, language: string
  ): string {

    if (!this.wordsList.includes(count)) {
      throw new MnemonicError(
        'Invalid word count', { expected: this.wordsList, got: count }
      );
    }
    let options = { };
    if (this.checksumWordCounts.includes(count)) {
      options = { checksum: true };
    }
    const strength = this.wordsToStrength[count];
    const entropyBytes = MoneroEntropy.generate(strength);
    return this.encode(entropyBytes, language, options);
  }

  /**
   * Generates a mnemonic phrase from entropy.
   *
   * @param {string | Uint8Array | Entropy} entropy - Entropy in hex, bytes, or Entropy object.
   * @param {string} language - Target language for words.
   * @param {MnemonicOptionsInterface} [options={}] - Options (e.g., checksum).
   * @returns {string} Mnemonic phrase.
   */
  static fromEntropy(
    entropy: string | Uint8Array | Entropy, language: string, options: MnemonicOptionsInterface = { }
  ): string {
    let raw: Uint8Array;
    if (typeof entropy === 'string') {
      raw = hexToBytes(entropy);
    } else if (entropy instanceof Uint8Array) {
      raw = entropy;
    } else {
      raw = hexToBytes(entropy.getEntropy());
    }
    return this.encode(raw, language, options);
  }

  /**
   * Encodes raw entropy bytes into a Monero mnemonic phrase.
   *
   * @param {string | Uint8Array} entropy - Raw entropy.
   * @param {string} language - Language for the mnemonic.
   * @param {MnemonicOptionsInterface} [options={}] - Options, supports `{ checksum: true }`.
   * @returns {string} Encoded mnemonic phrase.
   * @throws {EntropyError} If entropy length is invalid.
   * @throws {Error} If the wordlist length is incorrect.
   */
  static encode(
    entropy: string | Uint8Array, language: string, options: MnemonicOptionsInterface = { }
  ): string {

    const entropyBytes = getBytes(entropy);
    if (!MoneroEntropy.isValidBytesStrength(entropyBytes.length)) {
      throw new EntropyError(
        'Wrong entropy strength', { expected: MoneroEntropy.strengths, got: entropyBytes.length * 8 }
      );
    }

    const rawList = this.getWordsListByLanguage(language, this.wordLists);
    const wordList = this.normalize(rawList);
    if (wordList.length !== 1626) {
      throw new Error(
        `Expected 1626 words in list for '${language}', got ${wordList.length}`
      );
    }

    const mnemonic: string[] = [];
    for (let i = 0; i < entropyBytes.length; i += 4) {
      const chunk = entropyBytes.slice(i, i + 4);
      mnemonic.push(...bytesChunkToWords(chunk, wordList, 'little'));
    }

    if (options.checksum) {
      const prefixLen = this.languageUniquePrefixLengths[language];
      const prefixes = mnemonic.map(w => w.slice(0, prefixLen)).join('');
      const lenBig = BigInt(mnemonic.length);
      const idxBig = bytesToInteger(crc32(prefixes)) % lenBig;
      const idx = Number(idxBig);
      mnemonic.push(mnemonic[idx]);
    }

    return this.normalize(mnemonic).join(' ');
  }

  /**
   * Decodes a Monero mnemonic phrase into entropy.
   *
   * @param {string | string[]} input - Mnemonic phrase as string or array of words.
   * @param {MnemonicOptionsInterface} [options={}] - Options (checksum validation).
   * @returns {string} Hex string of entropy.
   * @throws {MnemonicError} If mnemonic length is invalid.
   * @throws {ChecksumError} If checksum is invalid.
   */
  static decode(
    input: string | string[], options: MnemonicOptionsInterface = { }
  ): string {
    const words = this.normalize(input);
    const count = words.length;
    if (!this.wordsList.includes(count)) {
      throw new MnemonicError(
        'Invalid word count', { expected: this.wordsList, got: count }
      );
    }

    const [wordsList, language] = this.findLanguage(words, this.wordLists);
    if (wordsList.length !== 1626) {
      throw new Error(
        `Expected 1626 words in list for '${language}', got ${wordsList.length}`
      );
    }

    const phraseWords = [...words];

    if (this.checksumWordCounts.includes(count as number)) {
      const last = phraseWords.pop()!;
      const prefixLen = this.languageUniquePrefixLengths[language];
      const prefixes = phraseWords.map(w => w.slice(0, prefixLen)).join('');
      const lenBig  = BigInt(phraseWords.length);
      const idxBig  = bytesToInteger(crc32(prefixes)) % lenBig;
      const idx     = Number(idxBig);
      const expected = phraseWords[idx];
      if (last !== expected) {
        throw new ChecksumError('Invalid checksum', { expected, got: last });
      }
    }

    const buffers: Uint8Array[] = [];
    for (let i = 0; i < phraseWords.length; i += 3) {
      const [w1, w2, w3] = phraseWords.slice(i, i + 3);
      const chunk = wordsToBytesChunk(w1, w2, w3, wordsList, 'little');
      buffers.push(getBytes(chunk));
    }
    return bytesToHex(concatBytes(...buffers), false);
  }

  /**
   * Normalizes mnemonic input into a lowercase word array.
   *
   * @param {string | string[]} input - Mnemonic phrase (string or array).
   * @returns {string[]} Normalized words.
   */
  static normalize(input: string | string[]): string[] {
    const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
    return arr.map(w => w.normalize('NFKD').toLowerCase());
  }
}
