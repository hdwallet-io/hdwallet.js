"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroMnemonic = exports.MONERO_MNEMONIC_LANGUAGES = exports.MONERO_MNEMONIC_WORDS = void 0;
const mnemonic_1 = require("../mnemonic");
const entropies_1 = require("../../entropies");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
const wordlists_1 = require("./wordlists");
exports.MONERO_MNEMONIC_WORDS = {
    TWELVE: 12,
    THIRTEEN: 13,
    TWENTY_FOUR: 24,
    TWENTY_FIVE: 25,
};
exports.MONERO_MNEMONIC_LANGUAGES = {
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
};
/**
 * MoneroMnemonic
 *
 * Implements the Monero-specific mnemonic system which supports multiple languages
 * and variable word counts (12, 13, 24, or 25 words). Provides encoding and decoding
 * between entropy and mnemonic phrases with optional checksum validation.
 */
class MoneroMnemonic extends mnemonic_1.Mnemonic {
    static wordBitLength = 11;
    static wordsList = [
        exports.MONERO_MNEMONIC_WORDS.TWELVE,
        exports.MONERO_MNEMONIC_WORDS.THIRTEEN,
        exports.MONERO_MNEMONIC_WORDS.TWENTY_FOUR,
        exports.MONERO_MNEMONIC_WORDS.TWENTY_FIVE
    ];
    static wordsToStrength = {
        12: entropies_1.MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        13: entropies_1.MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        24: entropies_1.MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX,
        25: entropies_1.MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    };
    static checksumWordCounts = [
        exports.MONERO_MNEMONIC_WORDS.THIRTEEN,
        exports.MONERO_MNEMONIC_WORDS.TWENTY_FIVE
    ];
    static languages = Object.values(exports.MONERO_MNEMONIC_LANGUAGES);
    static languageUniquePrefixLengths = {
        [exports.MONERO_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: 1,
        [exports.MONERO_MNEMONIC_LANGUAGES.DUTCH]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.ENGLISH]: 3,
        [exports.MONERO_MNEMONIC_LANGUAGES.FRENCH]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.GERMAN]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.ITALIAN]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.JAPANESE]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.PORTUGUESE]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.RUSSIAN]: 4,
        [exports.MONERO_MNEMONIC_LANGUAGES.SPANISH]: 4,
    };
    static wordLists = {
        [exports.MONERO_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: wordlists_1.MONERO_CHINESE_SIMPLIFIED_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.DUTCH]: wordlists_1.MONERO_DUTCH_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.ENGLISH]: wordlists_1.MONERO_ENGLISH_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.FRENCH]: wordlists_1.MONERO_FRENCH_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.GERMAN]: wordlists_1.MONERO_GERMAN_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.ITALIAN]: wordlists_1.MONERO_ITALIAN_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.JAPANESE]: wordlists_1.MONERO_JAPANESE_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.PORTUGUESE]: wordlists_1.MONERO_PORTUGUESE_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.RUSSIAN]: wordlists_1.MONERO_RUSSIAN_WORDLIST,
        [exports.MONERO_MNEMONIC_LANGUAGES.SPANISH]: wordlists_1.MONERO_SPANISH_WORDLIST
    };
    /**
     * Returns the name of this mnemonic type.
     * @returns {string} `"Monero"`
     */
    static getName() {
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
    static fromWords(count, language) {
        if (!this.wordsList.includes(count)) {
            throw new exceptions_1.MnemonicError('Invalid word count', { expected: this.wordsList, got: count });
        }
        let options = {};
        if (this.checksumWordCounts.includes(count)) {
            options = { checksum: true };
        }
        const strength = this.wordsToStrength[count];
        const entropyBytes = entropies_1.MoneroEntropy.generate(strength);
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
    static fromEntropy(entropy, language, options = {}) {
        let raw;
        if (typeof entropy === 'string') {
            raw = (0, utils_1.hexToBytes)(entropy);
        }
        else if (entropy instanceof Uint8Array) {
            raw = entropy;
        }
        else {
            raw = (0, utils_1.hexToBytes)(entropy.getEntropy());
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
    static encode(entropy, language, options = {}) {
        const entropyBytes = (0, utils_1.getBytes)(entropy);
        if (!entropies_1.MoneroEntropy.isValidBytesStrength(entropyBytes.length)) {
            throw new exceptions_1.EntropyError('Wrong entropy strength', { expected: entropies_1.MoneroEntropy.strengths, got: entropyBytes.length * 8 });
        }
        const rawList = this.getWordsListByLanguage(language, this.wordLists);
        const wordList = this.normalize(rawList);
        if (wordList.length !== 1626) {
            throw new Error(`Expected 1626 words in list for '${language}', got ${wordList.length}`);
        }
        const mnemonic = [];
        for (let i = 0; i < entropyBytes.length; i += 4) {
            const chunk = entropyBytes.slice(i, i + 4);
            mnemonic.push(...(0, utils_1.bytesChunkToWords)(chunk, wordList, 'little'));
        }
        if (options.checksum) {
            const prefixLen = this.languageUniquePrefixLengths[language];
            const prefixes = mnemonic.map(w => w.slice(0, prefixLen)).join('');
            const lenBig = BigInt(mnemonic.length);
            const idxBig = (0, utils_1.bytesToInteger)((0, crypto_1.crc32)(prefixes)) % lenBig;
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
    static decode(input, options = {}) {
        const words = this.normalize(input);
        const count = words.length;
        if (!this.wordsList.includes(count)) {
            throw new exceptions_1.MnemonicError('Invalid word count', { expected: this.wordsList, got: count });
        }
        const [wordsList, language] = this.findLanguage(words, this.wordLists);
        if (wordsList.length !== 1626) {
            throw new Error(`Expected 1626 words in list for '${language}', got ${wordsList.length}`);
        }
        const phraseWords = [...words];
        if (this.checksumWordCounts.includes(count)) {
            const last = phraseWords.pop();
            const prefixLen = this.languageUniquePrefixLengths[language];
            const prefixes = phraseWords.map(w => w.slice(0, prefixLen)).join('');
            const lenBig = BigInt(phraseWords.length);
            const idxBig = (0, utils_1.bytesToInteger)((0, crypto_1.crc32)(prefixes)) % lenBig;
            const idx = Number(idxBig);
            const expected = phraseWords[idx];
            if (last !== expected) {
                throw new exceptions_1.ChecksumError('Invalid checksum', { expected, got: last });
            }
        }
        const buffers = [];
        for (let i = 0; i < phraseWords.length; i += 3) {
            const [w1, w2, w3] = phraseWords.slice(i, i + 3);
            const chunk = (0, utils_1.wordsToBytesChunk)(w1, w2, w3, wordsList, 'little');
            buffers.push((0, utils_1.getBytes)(chunk));
        }
        return (0, utils_1.bytesToHex)((0, utils_1.concatBytes)(...buffers), false);
    }
    /**
     * Normalizes mnemonic input into a lowercase word array.
     *
     * @param {string | string[]} input - Mnemonic phrase (string or array).
     * @returns {string[]} Normalized words.
     */
    static normalize(input) {
        const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
        return arr.map(w => w.normalize('NFKD').toLowerCase());
    }
}
exports.MoneroMnemonic = MoneroMnemonic;
//# sourceMappingURL=mnemonic.js.map