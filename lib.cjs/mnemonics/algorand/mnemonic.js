"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorandMnemonic = exports.ALGORAND_MNEMONIC_LANGUAGES = exports.ALGORAND_MNEMONIC_WORDS = void 0;
const mnemonic_1 = require("../mnemonic");
const entropies_1 = require("../../entropies");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
const wordlists_1 = require("./wordlists");
exports.ALGORAND_MNEMONIC_WORDS = {
    TWENTY_FIVE: 25
};
exports.ALGORAND_MNEMONIC_LANGUAGES = {
    ENGLISH: 'english'
};
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
class AlgorandMnemonic extends mnemonic_1.Mnemonic {
    static checksumLength = 2;
    static wordBitLength = 11;
    static wordsList = [
        exports.ALGORAND_MNEMONIC_WORDS.TWENTY_FIVE
    ];
    static wordsToEntropyStrength = {
        25: entropies_1.ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    };
    static languages = Object.values(exports.ALGORAND_MNEMONIC_LANGUAGES);
    static wordLists = {
        [exports.ALGORAND_MNEMONIC_LANGUAGES.ENGLISH]: wordlists_1.ALGORAND_ENGLISH_WORDLIST
    };
    /**
     * Returns the name of this mnemonic type.
     *
     * @returns The string `"Algorand"`.
     */
    static getName() {
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
    static fromWords(words, language, options = {}) {
        if (!this.wordsList.includes(words)) {
            throw new exceptions_1.MnemonicError(`Invalid words count`, { expected: this.wordsList, got: words });
        }
        const strength = this.wordsToEntropyStrength[words];
        const entropyHex = entropies_1.AlgorandEntropy.generate(strength);
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
    static fromEntropy(entropy, language, options = {}) {
        const entropyBytes = typeof entropy === 'string'
            ? (0, utils_1.getBytes)(entropy) : entropy instanceof Uint8Array
            ? entropy : (0, utils_1.getBytes)(entropy.getEntropy());
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
    static encode(entropyInput, language, options = {}) {
        const entropyBytes = (0, utils_1.getBytes)(entropyInput);
        if (!entropies_1.AlgorandEntropy.isValidBytesStrength(entropyBytes.length)) {
            throw new exceptions_1.EntropyError('Wrong entropy strength', { expected: entropies_1.AlgorandEntropy.strengths, got: entropyBytes.length * 8 });
        }
        const fullHash = (0, crypto_1.sha512_256)(entropyBytes);
        const checksum = fullHash.slice(0, this.checksumLength);
        const checksumWords = (0, utils_1.convertBits)(checksum, 8, this.wordBitLength);
        if (!checksumWords)
            throw new Error('Checksum conversion failed');
        const dataWords = (0, utils_1.convertBits)(entropyBytes, 8, this.wordBitLength);
        if (!dataWords)
            throw new Error('Entropy conversion failed');
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
    static decode(mnemonic, options = {}) {
        const words = this.normalize(mnemonic);
        if (!this.wordsList.includes(words.length)) {
            throw new exceptions_1.MnemonicError('Invalid mnemonic length', { expected: this.wordsList, got: words.length });
        }
        const [wordList] = this.findLanguage(words, this.wordLists);
        const idxMap = Object.fromEntries(wordList.map((w, i) => [w, i]));
        const indexes = words.map(w => {
            const idx = idxMap[w];
            if (idx === undefined) {
                throw new exceptions_1.MnemonicError(`Unknown word '${w}'`);
            }
            return idx;
        });
        const allBytes = (0, utils_1.convertBits)(indexes.slice(0, -1), this.wordBitLength, 8);
        if (!allBytes)
            throw new Error('Bit conversion failed');
        const entropyBytesArr = allBytes.slice(0, -1);
        const entropyBytes = (0, utils_1.getBytes)(entropyBytesArr);
        const expectedIdx = ((0, utils_1.convertBits)((0, crypto_1.sha512_256)(entropyBytes).slice(0, this.checksumLength), 8, this.wordBitLength) || [])[0];
        const actualIdx = indexes[indexes.length - 1];
        if (expectedIdx !== actualIdx) {
            throw new exceptions_1.ChecksumError('Invalid checksum', {
                expected: wordList[expectedIdx],
                got: wordList[actualIdx]
            });
        }
        return (0, utils_1.bytesToString)(entropyBytes);
    }
    /**
     * Normalize input mnemonic into lowercase array of words.
     *
     * @param input - Mnemonic string or array.
     * @returns Normalized array of words.
     */
    static normalize(input) {
        const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
        return arr.map(w => w.normalize('NFKD').toLowerCase());
    }
}
exports.AlgorandMnemonic = AlgorandMnemonic;
//# sourceMappingURL=mnemonic.js.map