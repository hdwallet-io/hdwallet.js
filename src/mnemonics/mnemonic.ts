// SPDX-License-Identifier: MIT

import { Entropy } from '../entropies';
import { MnemonicOptionsInterface } from '../interfaces';
import { MnemonicError } from '../exceptions';

export class Mnemonic {

  protected mnemonic: string[];
  protected words: number;
  protected language: string;
  protected options: MnemonicOptionsInterface;

  static wordsList: number[] = [];
  static languages: string[] = [];

  static wordLists: Record<string, string[]> = { };

  constructor(
    mnemonic: string | string[], options: MnemonicOptionsInterface = { }
  ) {
    const constructor = this.constructor as typeof Mnemonic;
    const words = constructor.normalize(mnemonic);

    if (!constructor.isValid(words, options)) {
      throw new MnemonicError('Invalid mnemonic words');
    }
    const [_, language] = constructor.findLanguage(
      words, options.wordLists
    );
    this.mnemonic = words;
    this.words = words.length;
    this.language = language;
    this.options = options;
  }

  static getName(): string {
    throw new Error('Must override getName()');
  }

  getName(): string {
    return (this.constructor as typeof Mnemonic).getName();
  }

  getMnemonic(): string {
    return this.mnemonic.join(' ');
  }

  getMnemonicType(): string {
    throw new Error('Not implemented');
  }

  getWords(): number {
    return this.words;
  }

  getLanguage(): string {
    return this.language;
  }

  static fromWords(
    words: number, language: string, options: MnemonicOptionsInterface = { }
  ): string {
    throw new Error('Must override fromWords()');
  }

  static fromEntropy(
    entropy: string | Uint8Array | Entropy, language: string, options: MnemonicOptionsInterface = { }
  ): string {
    throw new Error('Must override fromEntropy()');
  }

  static encode(
    entropy: string | Uint8Array, language: string, options: MnemonicOptionsInterface = { }
  ): string {
    throw new Error('Must override encode()');
  }

  static decode(
    mnemonic: string | string[], options: MnemonicOptionsInterface = { }
  ): string {
    throw new Error('Must override decode()');
  }

  static getWordsListByLanguage(
    language: string, wordLists?: Record<string, string[]>
  ): string[] {
    const wordList = (wordLists ?? this.wordLists)[language];
    if (!wordList) {
      throw new MnemonicError(`No wordlist for language '${language}'`);
    }
    return wordList;
  }

  static findLanguage(
    mnemonic: string[], wordLists?: Record<string, string[]>
  ): [string[], string] {
    for (const language of this.languages) {
      try {
        const list = this.normalize(
          this.getWordsListByLanguage(language, wordLists)
        );
        const map = new Set(list);
        for (const w of mnemonic) {
          if (!map.has(w)) {
            throw new MnemonicError(`Unknown word '${w}'`);
          }
        }
        return [list, language];
      } catch {
        continue;
      }
    }
    throw new MnemonicError(
      `Invalid language for mnemonic: '${mnemonic.join(' ')}'`
    );
  }

  static isValid(
    mnemonic: string | string[], options: MnemonicOptionsInterface = { }
  ): boolean {
    try {
      this.decode(mnemonic, options);
      return true;
    } catch {
      return false;
    }
  }

  static isValidLanguage(language: string): boolean {
    return this.languages.includes(language);
  }

  static isValidWords(words: number): boolean {
    return this.wordsList.includes(words);
  }

  static normalize(mnemonic: string | string[]): string[] {
    return typeof mnemonic === 'string' ? mnemonic.trim().split(/\s+/) : mnemonic;
  }
}
