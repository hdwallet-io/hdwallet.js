// SPDX-License-Identifier: MIT

import { Mnemonic } from '../../mnemonic';
import { BIP39Mnemonic } from '../../bip39/mnemonic';
import { ElectrumV1Mnemonic } from '../v1/mnemonic';
import { Entropy, ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS } from '../../../entropies';
import {
  MnemonicOptionsInterface,
  ElectrumV2MnemonicLanguagesInterface,
  ElectrumV2MnemonicTypesInterface,
  ElectrumV2MnemonicWordsInterface
} from '../../../interfaces';
import { hmacSha512 } from '../../../crypto';
import {
  getBytes, integerToBytes, bytesToInteger, bytesToString, toBuffer
} from '../../../utils';
import { EntropyError, MnemonicError } from '../../../exceptions';
import {
  ELECTRUM_V2_CHINESE_SIMPLIFIED_WORDLIST,
  ELECTRUM_V2_ENGLISH_WORDLIST,
  ELECTRUM_V2_PORTUGUESE_WORDLIST,
  ELECTRUM_V2_SPANISH_WORDLIST
} from './wordlists';

export const ELECTRUM_V2_MNEMONIC_WORDS: ElectrumV2MnemonicWordsInterface = {
  TWELVE: 12,
  TWENTY_FOUR: 24
} as const;

export const ELECTRUM_V2_MNEMONIC_LANGUAGES: ElectrumV2MnemonicLanguagesInterface = {
  CHINESE_SIMPLIFIED: 'chinese-simplified',
  ENGLISH: 'english',
  PORTUGUESE: 'portuguese',
  SPANISH: 'spanish'
} as const;

export const ELECTRUM_V2_MNEMONIC_TYPES: ElectrumV2MnemonicTypesInterface = {
  STANDARD: 'standard',
  SEGWIT: 'segwit',
  STANDARD_2FA: 'standard-2fa',
  SEGWIT_2FA: 'segwit-2fa'
} as const;

/**
 * Electrum V2 Mnemonic implementation.
 *
 * Provides methods for:
 * - Generating mnemonics from entropy or directly from word count.
 * - Encoding and decoding mnemonics.
 * - Validating Electrum V2 mnemonics against BIP39 and Electrum V1.
 * - Supporting multiple languages and mnemonic types (Standard, SegWit, 2FA).
 */
export class ElectrumV2Mnemonic extends Mnemonic {

  static wordBitLength = 11;

  static wordsList: number[] = [
    ELECTRUM_V2_MNEMONIC_WORDS.TWELVE,
    ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR
  ];

  static wordsToEntropyStrength: Record<number, number> = {
    12: ELECTRUM_V2_ENTROPY_STRENGTHS.ONE_HUNDRED_THIRTY_TWO,
    24: ELECTRUM_V2_ENTROPY_STRENGTHS.TWO_HUNDRED_SIXTY_FOUR
  };

  static languages: string[] = Object.values(
    ELECTRUM_V2_MNEMONIC_LANGUAGES
  );

  static wordLists: Record<string, string[]> = {
    [ELECTRUM_V2_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: ELECTRUM_V2_CHINESE_SIMPLIFIED_WORDLIST,
    [ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH]: ELECTRUM_V2_ENGLISH_WORDLIST,
    [ELECTRUM_V2_MNEMONIC_LANGUAGES.PORTUGUESE]: ELECTRUM_V2_PORTUGUESE_WORDLIST,
    [ELECTRUM_V2_MNEMONIC_LANGUAGES.SPANISH]: ELECTRUM_V2_SPANISH_WORDLIST
  };

  static mnemonicTypes: Record<string, string> = {
    [ELECTRUM_V2_MNEMONIC_TYPES.STANDARD]: '01',
    [ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT]: '100',
    [ELECTRUM_V2_MNEMONIC_TYPES.STANDARD_2FA]: '101',
    [ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT_2FA]: '102'
  };

  /**
   * Get the identifier name for this mnemonic scheme.
   * @returns `"Electrum-V2"`
   */
  static getName(): string {
    return 'Electrum-V2';
  }

  /**
   * Generate a mnemonic from a specified word count.
   *
   * @param count - Number of words (12 or 24)
   * @param language - Wordlist language
   * @param option - Mnemonic options (type + maxAttempts)
   * @returns A valid Electrum-V2 mnemonic string
   * @throws {MnemonicError} If word count is invalid
   */
  static fromWords(
    count: number, language: string, option: MnemonicOptionsInterface = {
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD,
      maxAttempts: BigInt('1' + '0'.repeat(60))
    }
  ): string {
    if (!this.wordsList.includes(count)) {
      throw new MnemonicError('Invalid mnemonic words number', {
        expected: this.wordsList,
        got: count,
      });
    }
    const entropyBytes = ElectrumV2Entropy.generate(
      this.wordsToEntropyStrength[count]
    );
    return this.fromEntropy(
      entropyBytes, language, option
    );
  }

  /**
   * Generate a mnemonic from entropy.
   *
   * @param entropy - Raw entropy (hex string, byte array, or Entropy object)
   * @param language - Wordlist language
   * @param option - Mnemonic options (type + maxAttempts)
   * @returns A valid Electrum-V2 mnemonic
   * @throws {EntropyError} If entropy bits are insufficient
   * @throws {MnemonicError} If mnemonic type is missing
   */
  static fromEntropy(
    entropy: string | Uint8Array | Entropy, language: string, option: MnemonicOptionsInterface = {
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD,
      maxAttempts: BigInt('1' + '0'.repeat(60))
    }
  ): string {

    if (!option.mnemonicType) {
      throw new MnemonicError('mnemonicType is required');
    }
    if (!option.maxAttempts) {
      option.maxAttempts = BigInt('1' + '0'.repeat(60))
    }

    let raw: Uint8Array;
    if (typeof entropy === 'string') {
      raw = getBytes(entropy);
    } else if (entropy instanceof Uint8Array) {
      raw = entropy;
    } else {
      raw = getBytes(entropy.getEntropy());
    }

    if (!ElectrumV2Entropy.areEntropyBitsEnough(raw)) {
      throw new EntropyError(
        'Entropy bit length is not enough for generating a valid mnemonic'
      );
    }

    const wordsList = this.normalize(
      this.getWordsListByLanguage(language, this.wordLists)
    );
    const bip39List = this.normalize(
      this.getWordsListByLanguage(language, BIP39Mnemonic.wordLists)
    );
    const bip39Index = Object.fromEntries(
      bip39List.map((w, i) => [w, i] as [string, number])
    );

    let ev1List: string[] = [];
    let ev1Index: Record<string, number> = {};
    try {
      ev1List = this.normalize(
        this.getWordsListByLanguage(
          language, ElectrumV1Mnemonic.wordLists
        )
      );
      ev1Index = Object.fromEntries(
        ev1List.map((w, i) => [w, i] as [string, number])
      );
    } catch {
    }

    const baseEnt = bytesToInteger(raw, false);
    // try offsets 0,1,2… up to maxAttempts
    for (let offset = BigInt(0); offset < option.maxAttempts; offset++) {
      const candidate = integerToBytes(baseEnt + offset, raw.length, 'big');
      try {
        return this.encode(candidate, language, {
          mnemonicType: option.mnemonicType,
          wordsList: wordsList,
          bip39List: bip39List,
          bip39Index: bip39Index,
          ev1List: ev1List,
          ev1Index: ev1Index
        });
      } catch (err) {
        if (err instanceof EntropyError) {
          continue;
        }
        throw err;
      }
    }
    throw new MnemonicError('Unable to generate a valid mnemonic');
  }

  /**
   * Encode entropy into an Electrum-V2 mnemonic.
   *
   * @param entropy - Raw entropy (hex, bytes)
   * @param language - Wordlist language
   * @param option - Mnemonic options
   * @returns Mnemonic string
   * @throws {EntropyError} If entropy strength is invalid or clashes with BIP39/ElectrumV1
   */
  static encode(
    entropy: string | Uint8Array, language: string, option: MnemonicOptionsInterface = {
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }
  ): string {

    if (!option.mnemonicType) {
      throw new MnemonicError('mnemonicType is required');
    }

    const entropyBytes = getBytes(entropy);
    let ent = bytesToInteger(entropyBytes, false);

    if (!ElectrumV2Entropy.areEntropyBitsEnough(entropyBytes)) {
      throw new EntropyError('Invalid entropy strength for V2');
    }

    const wl = option.wordsList ?? this.normalize(
      this.getWordsListByLanguage(language, this.wordLists)
    );
    const mnemonic: string[] = [];
    // repeatedly mod/divide
    while (ent > BigInt(0)) {
      const idx = Number(ent % BigInt(wl.length));
      ent = ent / BigInt(wl.length);
      mnemonic.push(wl[idx]);
    }

    if (
      BIP39Mnemonic.isValid(mnemonic, { wordsList: option.bip39List, wordsListWithIndex: option.bip39Index }) ||
      ElectrumV1Mnemonic.isValid(mnemonic, { wordsList: option.ev1List, wordsListWithIndex: option.ev1Index })
    ) {
      throw new EntropyError('Entropy bytes are not suitable for generating a valid mnemonic');
    }

    if (!this.isType(mnemonic, option.mnemonicType)) {
      throw new EntropyError(`Could not generate a '${option.mnemonicType}' mnemonic`);
    }
    return this.normalize(mnemonic).join(' ');
  }

  /**
   * Decode an Electrum-V2 mnemonic back into entropy.
   *
   * @param mnemonic - Mnemonic phrase
   * @param option - Mnemonic options (type required)
   * @returns Entropy as a string
   * @throws {MnemonicError} If mnemonic is invalid or word count is incorrect
   */
  static decode(
    mnemonic: string | string[], option: MnemonicOptionsInterface = {
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }
  ): string {

    if (!option.mnemonicType) {
      throw new MnemonicError('mnemonicType is required');
    }

    const words = this.normalize(mnemonic);
    if (!this.wordsList.includes(words.length)) {
      throw new MnemonicError('Invalid mnemonic words count', {
        expected: this.wordsList, got: words.length,
      });
    }

    if (!this.isValid(words, option)) {
      throw new MnemonicError(`Invalid ${option.mnemonicType} mnemonic words`);
    }

    const [ wordsList ] = this.findLanguage(words, this.wordLists);
    const idxMap = Object.fromEntries(
      wordsList.map((w, i) => [w, i] as [string, number])
    );

    let ent = BigInt(0);
    // reverse process: from last word to first
    for (const w of words.slice().reverse()) {
      ent = ent * BigInt(wordsList.length) + BigInt(idxMap[w]);
    }

    // convert bigint -> bytes -> hex
    const byteLen = Math.ceil(words.length * this.wordBitLength / 8);
    const buf = integerToBytes(ent, byteLen, 'big');
    return bytesToString(buf);
  }

  /**
   * Validate whether input is a valid Electrum-V2 mnemonic.
   *
   * @param input - Mnemonic words
   * @param option - Mnemonic options
   * @returns True if valid, false otherwise
   */
  static isValid(
    input: string | string[], option: MnemonicOptionsInterface = {
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }
  ): boolean {
    if (
      BIP39Mnemonic.isValid(input, {
        wordsList: option.bip39List, wordsListWithIndex: option.bip39Index
      }) ||
      ElectrumV1Mnemonic.isValid(input, {
        wordsList: option.ev1List, wordsListWithIndex: option.ev1Index
      })
    ) {
      return false;
    }
    return this.isType(
      input, option.mnemonicType ?? ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    );
  }

  /**
   * Check if a mnemonic belongs to the specified type.
   *
   * @param input - Mnemonic words
   * @param mnemonicType - Target mnemonic type
   * @returns True if mnemonic type matches
   */
  static isType(
    input: string | string[], mnemonicType: string
  ): boolean {

    const tag = bytesToString(
      hmacSha512(toBuffer('Seed version'), this.normalize(input).join(' '))
    );
    return tag.startsWith(this.mnemonicTypes[mnemonicType]);
  }

  /**
   * Get the mnemonic type from instance options.
   *
   * @returns The mnemonic type string
   * @throws {MnemonicError} If mnemonicType is not found
   */
  getMnemonicType(): string {
    if (!this.options?.mnemonicType) {
      throw new MnemonicError('mnemonicType is not found');
    }
    return this.options?.mnemonicType;
  }

  /**
   * Normalize input (string or array) into lowercase words (NFKD form).
   *
   * @param input - Mnemonic phrase or word array
   * @returns Normalized word array
   */
  static normalize(input: string | string[]): string[] {
    const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
    return arr.map(w => w.normalize('NFKD').toLowerCase());
  }
}
