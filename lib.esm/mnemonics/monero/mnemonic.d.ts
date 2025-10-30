import { Mnemonic } from '../mnemonic';
import { Entropy } from '../../entropies';
import { MnemonicOptionsInterface, MoneroMnemonicLanguagesInterface, MoneroMnemonicWordsInterface } from '../../interfaces';
export declare const MONERO_MNEMONIC_WORDS: MoneroMnemonicWordsInterface;
export declare const MONERO_MNEMONIC_LANGUAGES: MoneroMnemonicLanguagesInterface;
/**
 * MoneroMnemonic
 *
 * Implements the Monero-specific mnemonic system which supports multiple languages
 * and variable word counts (12, 13, 24, or 25 words). Provides encoding and decoding
 * between entropy and mnemonic phrases with optional checksum validation.
 */
export declare class MoneroMnemonic extends Mnemonic {
    static wordBitLength: number;
    static wordsList: number[];
    static wordsToStrength: Record<number, number>;
    static checksumWordCounts: number[];
    static languages: string[];
    static languageUniquePrefixLengths: Record<string, number>;
    static wordLists: Record<string, string[]>;
    /**
     * Returns the name of this mnemonic type.
     * @returns {string} `"Monero"`
     */
    static getName(): string;
    /**
     * Generates a mnemonic phrase from a given word count.
     *
     * @param {number} count - The number of words (12, 13, 24, or 25).
     * @param {string} language - The language of the mnemonic (must be one of `MONERO_MNEMONIC_LANGUAGES`).
     * @returns {string} Mnemonic phrase.
     * @throws {MnemonicError} If the word count is invalid.
     */
    static fromWords(count: number, language: string): string;
    /**
     * Generates a mnemonic phrase from entropy.
     *
     * @param {string | Uint8Array | Entropy} entropy - Entropy in hex, bytes, or Entropy object.
     * @param {string} language - Target language for words.
     * @param {MnemonicOptionsInterface} [options={}] - Options (e.g., checksum).
     * @returns {string} Mnemonic phrase.
     */
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, options?: MnemonicOptionsInterface): string;
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
    static encode(entropy: string | Uint8Array, language: string, options?: MnemonicOptionsInterface): string;
    /**
     * Decodes a Monero mnemonic phrase into entropy.
     *
     * @param {string | string[]} input - Mnemonic phrase as string or array of words.
     * @param {MnemonicOptionsInterface} [options={}] - Options (checksum validation).
     * @returns {string} Hex string of entropy.
     * @throws {MnemonicError} If mnemonic length is invalid.
     * @throws {ChecksumError} If checksum is invalid.
     */
    static decode(input: string | string[], options?: MnemonicOptionsInterface): string;
    /**
     * Normalizes mnemonic input into a lowercase word array.
     *
     * @param {string | string[]} input - Mnemonic phrase (string or array).
     * @returns {string[]} Normalized words.
     */
    static normalize(input: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map