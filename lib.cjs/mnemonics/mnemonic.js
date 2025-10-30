"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mnemonic = void 0;
const exceptions_1 = require("../exceptions");
/**
 * Abstract base class for Mnemonic implementations.
 *
 * Provides common functionality for handling mnemonics such as:
 * - Normalizing word arrays
 * - Validating mnemonics against wordlists
 * - Detecting language
 *
 * Specific standards (e.g., BIP39, Electrum V1, Electrum V2, Monero)
 * must extend this class and override methods like `getName`, `fromWords`,
 * `fromEntropy`, `encode`, and `decode`.
 */
class Mnemonic {
    mnemonic;
    words;
    language;
    options;
    static wordsList = [];
    static languages = [];
    static wordLists = {};
    /**
     * Create a new mnemonic instance.
     *
     * @param mnemonic - A string or array of words representing the mnemonic.
     * @param options - Optional settings including custom wordlists.
     * @throws {MnemonicError} If the mnemonic is invalid.
     */
    constructor(mnemonic, options = {}) {
        const constructor = this.constructor;
        const words = constructor.normalize(mnemonic);
        if (!constructor.isValid(words, options)) {
            throw new exceptions_1.MnemonicError('Invalid mnemonic words');
        }
        const [_, language] = constructor.findLanguage(words, options.wordLists);
        this.mnemonic = words;
        this.words = words.length;
        this.language = language;
        this.options = options;
    }
    /**
     * Get the mnemonic scheme name.
     * Must be overridden by subclasses (e.g., "BIP39", "Electrum-V1").
     *
     * @returns {string}
     * @throws {Error} If not implemented in subclass.
     */
    static getName() {
        throw new Error('Must override getName()');
    }
    /**
     * Instance method to get the scheme name.
     *
     * @returns {string} The name of the mnemonic type.
     */
    getName() {
        return this.constructor.getName();
    }
    /**
     * Get the full mnemonic phrase as a string.
     *
     * @returns {string} The mnemonic phrase.
     */
    getMnemonic() {
        return this.mnemonic.join(' ');
    }
    /**
     * Get the mnemonic type (scheme-specific).
     * Must be overridden by subclasses.
     *
     * @returns {string}
     * @throws {Error} If not implemented.
     */
    getMnemonicType() {
        throw new Error('Not implemented');
    }
    /**
     * Get the number of words in the mnemonic.
     *
     * @returns {number} Word count.
     */
    getWords() {
        return this.words;
    }
    /**
     * Get the language of the mnemonic.
     *
     * @returns {string} The detected language.
     */
    getLanguage() {
        return this.language;
    }
    /**
     * Generate a mnemonic from word count and language.
     * Must be overridden by subclasses.
     *
     * @param words - The number of words.
     * @param language - Language code.
     * @param options - Optional settings.
     * @returns {string} Generated mnemonic.
     */
    static fromWords(words, language, options = {}) {
        throw new Error('Must override fromWords()');
    }
    /**
     * Generate a mnemonic from entropy.
     * Must be overridden by subclasses.
     *
     * @param entropy - Entropy as hex, bytes, or Entropy instance.
     * @param language - Language code.
     * @param options - Optional settings.
     * @returns {string} Generated mnemonic.
     */
    static fromEntropy(entropy, language, options = {}) {
        throw new Error('Must override fromEntropy()');
    }
    /**
     * Encode entropy into a mnemonic phrase.
     * Must be overridden by subclasses.
     *
     * @param entropy - Entropy as hex or bytes.
     * @param language - Language code.
     * @param options - Optional settings.
     * @returns {string} Encoded mnemonic.
     */
    static encode(entropy, language, options = {}) {
        throw new Error('Must override encode()');
    }
    /**
     * Decode a mnemonic phrase into entropy.
     * Must be overridden by subclasses.
     *
     * @param mnemonic - Mnemonic as string or array of words.
     * @param options - Optional settings.
     * @returns {string} Decoded entropy in hex.
     */
    static decode(mnemonic, options = {}) {
        throw new Error('Must override decode()');
    }
    /**
     * Get a wordlist by language.
     *
     * @param language - Language code.
     * @param wordLists - Optional custom wordlists.
     * @returns {string[]} The wordlist for the given language.
     * @throws {MnemonicError} If no wordlist is available.
     */
    static getWordsListByLanguage(language, wordLists) {
        const wordList = (wordLists ?? this.wordLists)[language];
        if (!wordList) {
            throw new exceptions_1.MnemonicError(`No wordlist for language '${language}'`);
        }
        return wordList;
    }
    /**
     * Detect the language of a mnemonic by matching words to wordlists.
     *
     * @param mnemonic - Array of words to check.
     * @param wordLists - Optional custom wordlists.
     * @returns {[string[], string]} A tuple containing the matched wordlist and language.
     * @throws {MnemonicError} If no matching language is found.
     */
    static findLanguage(mnemonic, wordLists) {
        for (const language of this.languages) {
            try {
                const list = this.normalize(this.getWordsListByLanguage(language, wordLists));
                const map = new Set(list);
                for (const w of mnemonic) {
                    if (!map.has(w)) {
                        throw new exceptions_1.MnemonicError(`Unknown word '${w}'`);
                    }
                }
                return [list, language];
            }
            catch {
                continue;
            }
        }
        throw new exceptions_1.MnemonicError(`Invalid language for mnemonic: '${mnemonic.join(' ')}'`);
    }
    /**
     * Validate if a mnemonic is correct for its scheme.
     *
     * @param mnemonic - Mnemonic as string or word array.
     * @param options - Optional settings.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValid(mnemonic, options = {}) {
        try {
            this.decode(mnemonic, options);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if a language is supported.
     *
     * @param language - Language code.
     * @returns {boolean} True if valid.
     */
    static isValidLanguage(language) {
        return this.languages.includes(language);
    }
    /**
     * Check if the number of words is supported.
     *
     * @param words - Word count.
     * @returns {boolean} True if supported.
     */
    static isValidWords(words) {
        return this.wordsList.includes(words);
    }
    /**
     * Normalize a mnemonic into a word array.
     *
     * @param mnemonic - Mnemonic as string or word array.
     * @returns {string[]} Normalized word array.
     */
    static normalize(mnemonic) {
        return typeof mnemonic === 'string' ? mnemonic.trim().split(/\s+/) : mnemonic;
    }
}
exports.Mnemonic = Mnemonic;
//# sourceMappingURL=mnemonic.js.map