// SPDX-License-Identifier: MIT

import { Mnemonic } from '../mnemonic';
import { Entropy, AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS } from '../../entropies';
import {
  MnemonicOptionsInterface, AlgorandMnemonicLanguagesInterface, AlgorandMnemonicWordsInterface
} from '../../interfaces';
import { sha512_256 } from '../../crypto';
import { getBytes, bytesToString, convertBits } from '../../utils';
import { MnemonicError, EntropyError, ChecksumError } from '../../exceptions';
import { ALGORAND_ENGLISH_WORDLIST } from './wordlists';

export const ALGORAND_MNEMONIC_WORDS: AlgorandMnemonicWordsInterface = {
  TWENTY_FIVE: 25
} as const;

export const ALGORAND_MNEMONIC_LANGUAGES: AlgorandMnemonicLanguagesInterface = {
  ENGLISH: 'english'
} as const;

/**
 * Represents an Algorand mnemonic implementation.
 *
 * This class provides functionality to generate, encode, decode,
 * and validate mnemonics based on Algorand's specification.
 *
 * - Uses 25-word mnemonics
 * - Uses a checksum mechanism (2 bytes, 11-bit words)
 * - Supported languages: English
 */
export class AlgorandMnemonic extends Mnemonic {

  static checksumLength: number = 2;
  static wordBitLength: number = 11;

  static wordsList: number[] = [
    ALGORAND_MNEMONIC_WORDS.TWENTY_FIVE
  ];

  static wordsToEntropyStrength: Record<number, number> = {
    25: ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
  };

  static languages: string[] = Object.values(
    ALGORAND_MNEMONIC_LANGUAGES
  );

  static wordLists: Record<string,string[]> = {
    [ALGORAND_MNEMONIC_LANGUAGES.ENGLISH]: ALGORAND_ENGLISH_WORDLIST
  };

  /**
   * Returns the name of this mnemonic type.
   *
   * @returns The string `"Algorand"`.
   */
  static getName(): string {
    return 'Algorand';
  }

  /**
   * Generate a new mnemonic from word count and language.
   *
   * @param words - Number of words (must be 25).
   * @param language - Language of the wordlist.
   * @param options - Optional mnemonic generation options.
   * @returns A space-separated mnemonic string.
   * @throws {MnemonicError} If word count is invalid.
   */
  static fromWords(
    words: number, language: string, options: MnemonicOptionsInterface = { }
  ): string {

    if (!this.wordsList.includes(words)) {
      throw new MnemonicError(
        `Invalid words count`, { expected: this.wordsList, got: words }
      );
    }
    const strength = this.wordsToEntropyStrength[words];
    const entropyHex = AlgorandEntropy.generate(strength);
    return this.encode(entropyHex, language, options);
  }

  /**
   * Generate a mnemonic from entropy input.
   *
   * @param entropy - Entropy (hex string, Uint8Array, or Entropy object).
   * @param language - Target language.
   * @param options - Optional mnemonic options.
   * @returns A mnemonic phrase.
   */
  static fromEntropy(
    entropy: string | Uint8Array | Entropy, language: string, options: MnemonicOptionsInterface = { }
  ): string {

    const entropyBytes = typeof entropy === 'string'
      ? getBytes(entropy) : entropy instanceof Uint8Array
        ? entropy : getBytes((entropy as Entropy).getEntropy());
    return this.encode(entropyBytes, language, options);
  }

  /**
   * Encode entropy bytes into an Algorand mnemonic phrase.
   *
   * @param entropyInput - Entropy (hex string or bytes).
   * @param language - Language for wordlist.
   * @param options - Optional encode options.
   * @returns A space-separated mnemonic.
   * @throws {EntropyError} If entropy length is invalid.
   * @throws {Error} If conversion to checksum/data words fails.
   */
  static encode(
    entropyInput: string | Uint8Array, language: string, options: MnemonicOptionsInterface = { }
  ): string {

    const entropyBytes = getBytes(entropyInput);
    if (!AlgorandEntropy.isValidBytesStrength(entropyBytes.length)) {
      throw new EntropyError(
        'Wrong entropy strength', { expected: AlgorandEntropy.strengths, got: entropyBytes.length * 8 }
      );
    }

    const fullHash = sha512_256(entropyBytes);
    const checksum = fullHash.slice(0, this.checksumLength);
    const checksumWords = convertBits(checksum, 8, this.wordBitLength);
    if (!checksumWords) throw new Error('Checksum conversion failed');

    const dataWords = convertBits(entropyBytes, 8, this.wordBitLength);
    if (!dataWords) throw new Error('Entropy conversion failed');

    const wordList = this.getWordsListByLanguage(language, this.wordLists);
    const indexes = [...dataWords, checksumWords[0]];
    return indexes.map(i => wordList[i]).join(' ');
  }

  /**
   * Decode an Algorand mnemonic back into entropy.
   *
   * @param mnemonic - Mnemonic string or array of words.
   * @param options - Optional decode options.
   * @returns Hex string representing entropy.
   * @throws {MnemonicError} If mnemonic length or words are invalid.
   * @throws {ChecksumError} If checksum does not match.
   */
  static decode(
      mnemonic: string | string[], options: MnemonicOptionsInterface = { }
  ): string {

    const words = this.normalize(mnemonic);
    if (!this.wordsList.includes(words.length)) {
      throw new MnemonicError(
        'Invalid mnemonic length',
        { expected: this.wordsList, got: words.length }
      );
    }

    const [wordList] = this.findLanguage(words, this.wordLists);
    const idxMap = Object.fromEntries(wordList.map((w, i) => [w, i]));

    const indexes = words.map(w => {
      const idx = idxMap[w];
      if (idx === undefined) {
        throw new MnemonicError(`Unknown word '${w}'`);
      }
      return idx;
    });

    const allBytes = convertBits(indexes.slice(0, -1), this.wordBitLength, 8);
    if (!allBytes) throw new Error('Bit conversion failed');
    const entropyBytesArr = allBytes.slice(0, -1);
    const entropyBytes = getBytes(entropyBytesArr);

    const expectedIdx = (convertBits(
      sha512_256(entropyBytes).slice(0, this.checksumLength), 8, this.wordBitLength
    ) || [])[0];
    const actualIdx = indexes[indexes.length - 1];

    if (expectedIdx !== actualIdx) {
      throw new ChecksumError(
        'Invalid checksum',
        {
          expected: wordList[expectedIdx],
          got: wordList[actualIdx]
        }
      );
    }
    return bytesToString(entropyBytes);
  }

  /**
   * Normalize input mnemonic into lowercase array of words.
   *
   * @param input - Mnemonic string or array.
   * @returns Normalized array of words.
   */
  static normalize(input: string | string[]): string[] {
    const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
    return arr.map(w => w.normalize('NFKD').toLowerCase());
  }
}
