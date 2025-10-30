"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP39Mnemonic = exports.BIP39_MNEMONIC_LANGUAGES = exports.BIP39_MNEMONIC_WORDS = void 0;
const mnemonic_1 = require("../mnemonic");
const entropies_1 = require("../../entropies");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
const wordlists_1 = require("./wordlists");
exports.BIP39_MNEMONIC_WORDS = {
    TWELVE: 12,
    FIFTEEN: 15,
    EIGHTEEN: 18,
    TWENTY_ONE: 21,
    TWENTY_FOUR: 24
};
exports.BIP39_MNEMONIC_LANGUAGES = {
    CHINESE_SIMPLIFIED: 'chinese-simplified',
    CHINESE_TRADITIONAL: 'chinese-traditional',
    CZECH: 'czech',
    ENGLISH: 'english',
    FRENCH: 'french',
    ITALIAN: 'italian',
    JAPANESE: 'japanese',
    KOREAN: 'korean',
    PORTUGUESE: 'portuguese',
    RUSSIAN: 'russian',
    SPANISH: 'spanish',
    TURKISH: 'turkish'
};
/**
 * Implements the BIP-39 mnemonic standard.
 *
 * BIP-39 mnemonics are human-readable sequences of words that encode entropy
 * with a checksum, making it easier to back up and restore HD wallets.
 *
 * Supported word counts: 12, 15, 18, 21, 24
 * Supported languages: Chinese (Simplified/Traditional), Czech, English, French,
 * Italian, Japanese, Korean, Portuguese, Russian, Spanish, Turkish.
 *
 * Features:
 * - Generate mnemonics from entropy or word count.
 * - Encode entropy into mnemonic phrases.
 * - Decode mnemonic phrases back to entropy.
 * - Verify and normalize mnemonics across languages.
 */
class BIP39Mnemonic extends mnemonic_1.Mnemonic {
    static wordBitLength = 11;
    static wordsListNumber = 2048;
    static wordsList = [
        exports.BIP39_MNEMONIC_WORDS.TWELVE,
        exports.BIP39_MNEMONIC_WORDS.FIFTEEN,
        exports.BIP39_MNEMONIC_WORDS.EIGHTEEN,
        exports.BIP39_MNEMONIC_WORDS.TWENTY_ONE,
        exports.BIP39_MNEMONIC_WORDS.TWENTY_FOUR
    ];
    static wordsToEntropyStrength = {
        12: entropies_1.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        15: entropies_1.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_SIXTY,
        18: entropies_1.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_NINETY_TWO,
        21: entropies_1.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_TWENTY_FOUR,
        24: entropies_1.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    };
    static languages = Object.values(exports.BIP39_MNEMONIC_LANGUAGES);
    static wordLists = {
        [exports.BIP39_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: wordlists_1.BIP39_CHINESE_SIMPLIFIED_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.CHINESE_TRADITIONAL]: wordlists_1.BIP39_CHINESE_TRADITIONAL_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.CZECH]: wordlists_1.BIP39_CZECH_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.ENGLISH]: wordlists_1.BIP39_ENGLISH_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.FRENCH]: wordlists_1.BIP39_FRENCH_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.ITALIAN]: wordlists_1.BIP39_ITALIAN_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.JAPANESE]: wordlists_1.BIP39_JAPANESE_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.KOREAN]: wordlists_1.BIP39_KOREAN_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.PORTUGUESE]: wordlists_1.BIP39_PORTUGUESE_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.RUSSIAN]: wordlists_1.BIP39_RUSSIAN_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.SPANISH]: wordlists_1.BIP39_SPANISH_WORDLIST,
        [exports.BIP39_MNEMONIC_LANGUAGES.TURKISH]: wordlists_1.BIP39_TURKISH_WORDLIST
    };
    /**
     * Get the human-readable name of this mnemonic standard.
     * @returns `"BIP39"`
     */
    static getName() {
        return 'BIP39';
    }
    /**
     * Generate a new mnemonic phrase by word count.
     *
     * @param words Number of words (12, 15, 18, 21, or 24).
     * @param language Language of the wordlist.
     * @param options Additional encoding options.
     * @throws {MnemonicError} If word count is invalid.
     * @returns Mnemonic phrase as a string.
     */
    static fromWords(words, language, options = {}) {
        if (!this.wordsList.includes(words)) {
            throw new exceptions_1.MnemonicError(`Invalid words`, { expected: this.wordsList, got: words });
        }
        const strength = this.wordsToEntropyStrength[words];
        const entropyHex = entropies_1.BIP39Entropy.generate(strength);
        return this.encode(entropyHex, language, options);
    }
    /**
     * Generate a mnemonic phrase from entropy.
     *
     * @param entropy Hex string, byte array, or Entropy instance.
     * @param language Language of the wordlist.
     * @param options Additional encoding options.
     * @returns Mnemonic phrase as a string.
     */
    static fromEntropy(entropy, language, options = {}) {
        let hex;
        if (typeof entropy === 'string') {
            hex = entropy;
        }
        else if (entropy instanceof Uint8Array) {
            hex = (0, utils_1.bytesToHex)(entropy);
        }
        else {
            hex = entropy.getEntropy();
        }
        return this.encode(hex, language, options);
    }
    /**
     * Encode entropy into a BIP-39 mnemonic phrase.
     *
     * @param entropyInput Hex string or byte array.
     * @param language Wordlist language.
     * @param options Additional options.
     * @throws {EntropyError} If entropy length is invalid.
     * @throws {Error} If wordlist size is not 2048.
     * @returns Mnemonic phrase as a string.
     */
    static encode(entropyInput, language, options = {}) {
        const entropyBytes = typeof entropyInput === 'string' ?
            (0, utils_1.hexToBytes)(entropyInput) : entropyInput;
        const bitLen = entropyBytes.length * 8;
        if (!Object.values(this.wordsToEntropyStrength).includes(bitLen)) {
            throw new exceptions_1.EntropyError(`Unsupported entropy length ${bitLen}`);
        }
        const hash = (0, crypto_1.sha256)(entropyBytes);
        const csLen = bitLen / 32;
        const entBits = (0, utils_1.bytesToBinaryString)(entropyBytes, bitLen);
        const hashBits = (0, utils_1.bytesToBinaryString)(hash, 256).slice(0, csLen);
        const bits = entBits + hashBits;
        const wordList = this.getWordsListByLanguage(language, this.wordLists);
        if (wordList.length !== this.wordsListNumber) {
            throw new Error(`Loaded wordlist length ${wordList.length} !== ${this.wordsListNumber}`);
        }
        const words = [];
        for (let i = 0; i < bits.length / this.wordBitLength; i++) {
            const idx = parseInt(bits.slice(i * this.wordBitLength, (i + 1) * this.wordBitLength), 2);
            words.push(wordList[idx]);
        }
        return words.join(' ');
    }
    /**
     * Decode a mnemonic phrase back into entropy.
     *
     * @param mnemonic Mnemonic phrase as string or array of words.
     * @param options Options for checksum verification and custom wordlists.
     * @throws {MnemonicError} If word count or words are invalid.
     * @throws {ChecksumError} If checksum does not match.
     * @returns Hex string of entropy.
     */
    static decode(mnemonic, options = { checksum: false }) {
        const words = this.normalize(mnemonic);
        if (!this.wordsList.includes(words.length)) {
            throw new exceptions_1.MnemonicError(`Invalid words ${words.length}`, { expected: this.wordsList, got: words.length });
        }
        let wordList;
        let idxMap = {};
        if (options.wordsList && options.wordsListWithIndex) {
            idxMap = options.wordsListWithIndex;
        }
        else {
            [wordList] = this.findLanguage(words, this.wordLists);
            wordList.forEach((w, i) => idxMap[w] = i);
        }
        const bits = words
            .map(w => {
            const idx = idxMap[w];
            if (idx === undefined) {
                throw new exceptions_1.MnemonicError(`Unknown word: ${w}`);
            }
            return (0, utils_1.integerToBinaryString)(idx, this.wordBitLength);
        })
            .join('');
        const checksumLen = bits.length / 33;
        const entropyBits = bits.slice(0, -checksumLen);
        const givenChecksum = bits.slice(-checksumLen);
        const entropyBytes = (0, utils_1.binaryStringToBytes)(entropyBits);
        const hash = (0, crypto_1.sha256)(entropyBytes);
        const hashBits = (0, utils_1.bytesToBinaryString)(hash, 256).slice(0, checksumLen);
        if (givenChecksum !== hashBits) {
            throw new exceptions_1.ChecksumError('Checksum mismatch', { expected: givenChecksum, got: hashBits });
        }
        if (options.checksum) {
            const totalBits = bits.length;
            const padBits = totalBits % 8 === 0
                ? totalBits
                : totalBits + (8 - (totalBits % 8));
            return (0, utils_1.bytesToHex)((0, utils_1.binaryStringToBytes)(bits, padBits / 8));
        }
        return (0, utils_1.bytesToHex)(entropyBytes);
    }
    /**
     * Normalize a mnemonic phrase into lowercase NFKD words.
     *
     * @param input Mnemonic as string or array of words.
     * @returns Array of normalized words.
     */
    static normalize(input) {
        const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
        return arr.map(w => w.normalize('NFKD').toLowerCase());
    }
}
exports.BIP39Mnemonic = BIP39Mnemonic;
//# sourceMappingURL=mnemonic.js.map