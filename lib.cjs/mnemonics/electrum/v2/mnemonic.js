"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV2Mnemonic = exports.ELECTRUM_V2_MNEMONIC_TYPES = exports.ELECTRUM_V2_MNEMONIC_LANGUAGES = exports.ELECTRUM_V2_MNEMONIC_WORDS = void 0;
const mnemonic_1 = require("../../mnemonic");
const mnemonic_2 = require("../../bip39/mnemonic");
const mnemonic_3 = require("../v1/mnemonic");
const entropies_1 = require("../../../entropies");
const crypto_1 = require("../../../crypto");
const utils_1 = require("../../../utils");
const exceptions_1 = require("../../../exceptions");
const wordlists_1 = require("./wordlists");
exports.ELECTRUM_V2_MNEMONIC_WORDS = {
    TWELVE: 12,
    TWENTY_FOUR: 24
};
exports.ELECTRUM_V2_MNEMONIC_LANGUAGES = {
    CHINESE_SIMPLIFIED: 'chinese-simplified',
    ENGLISH: 'english',
    PORTUGUESE: 'portuguese',
    SPANISH: 'spanish'
};
exports.ELECTRUM_V2_MNEMONIC_TYPES = {
    STANDARD: 'standard',
    SEGWIT: 'segwit',
    STANDARD_2FA: 'standard-2fa',
    SEGWIT_2FA: 'segwit-2fa'
};
/**
 * Electrum V2 Mnemonic implementation.
 *
 * Provides methods for:
 * - Generating mnemonics from entropy or directly from word count.
 * - Encoding and decoding mnemonics.
 * - Validating Electrum V2 mnemonics against BIP39 and Electrum V1.
 * - Supporting multiple languages and mnemonic types (Standard, SegWit, 2FA).
 */
class ElectrumV2Mnemonic extends mnemonic_1.Mnemonic {
    static wordBitLength = 11;
    static wordsList = [
        exports.ELECTRUM_V2_MNEMONIC_WORDS.TWELVE,
        exports.ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR
    ];
    static wordsToEntropyStrength = {
        12: entropies_1.ELECTRUM_V2_ENTROPY_STRENGTHS.ONE_HUNDRED_THIRTY_TWO,
        24: entropies_1.ELECTRUM_V2_ENTROPY_STRENGTHS.TWO_HUNDRED_SIXTY_FOUR
    };
    static languages = Object.values(exports.ELECTRUM_V2_MNEMONIC_LANGUAGES);
    static wordLists = {
        [exports.ELECTRUM_V2_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: wordlists_1.ELECTRUM_V2_CHINESE_SIMPLIFIED_WORDLIST,
        [exports.ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH]: wordlists_1.ELECTRUM_V2_ENGLISH_WORDLIST,
        [exports.ELECTRUM_V2_MNEMONIC_LANGUAGES.PORTUGUESE]: wordlists_1.ELECTRUM_V2_PORTUGUESE_WORDLIST,
        [exports.ELECTRUM_V2_MNEMONIC_LANGUAGES.SPANISH]: wordlists_1.ELECTRUM_V2_SPANISH_WORDLIST
    };
    static mnemonicTypes = {
        [exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD]: '01',
        [exports.ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT]: '100',
        [exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD_2FA]: '101',
        [exports.ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT_2FA]: '102'
    };
    /**
     * Get the identifier name for this mnemonic scheme.
     * @returns `"Electrum-V2"`
     */
    static getName() {
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
    static fromWords(count, language, option = {
        mnemonicType: exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD,
        maxAttempts: BigInt('1' + '0'.repeat(60))
    }) {
        if (!this.wordsList.includes(count)) {
            throw new exceptions_1.MnemonicError('Invalid mnemonic words number', {
                expected: this.wordsList,
                got: count,
            });
        }
        const entropyBytes = entropies_1.ElectrumV2Entropy.generate(this.wordsToEntropyStrength[count]);
        return this.fromEntropy(entropyBytes, language, option);
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
    static fromEntropy(entropy, language, option = {
        mnemonicType: exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD,
        maxAttempts: BigInt('1' + '0'.repeat(60))
    }) {
        if (!option.mnemonicType) {
            throw new exceptions_1.MnemonicError('mnemonicType is required');
        }
        if (!option.maxAttempts) {
            option.maxAttempts = BigInt('1' + '0'.repeat(60));
        }
        let raw;
        if (typeof entropy === 'string') {
            raw = (0, utils_1.getBytes)(entropy);
        }
        else if (entropy instanceof Uint8Array) {
            raw = entropy;
        }
        else {
            raw = (0, utils_1.getBytes)(entropy.getEntropy());
        }
        if (!entropies_1.ElectrumV2Entropy.areEntropyBitsEnough(raw)) {
            throw new exceptions_1.EntropyError('Entropy bit length is not enough for generating a valid mnemonic');
        }
        const wordsList = this.normalize(this.getWordsListByLanguage(language, this.wordLists));
        const bip39List = this.normalize(this.getWordsListByLanguage(language, mnemonic_2.BIP39Mnemonic.wordLists));
        const bip39Index = Object.fromEntries(bip39List.map((w, i) => [w, i]));
        let ev1List = [];
        let ev1Index = {};
        try {
            ev1List = this.normalize(this.getWordsListByLanguage(language, mnemonic_3.ElectrumV1Mnemonic.wordLists));
            ev1Index = Object.fromEntries(ev1List.map((w, i) => [w, i]));
        }
        catch {
        }
        const baseEnt = (0, utils_1.bytesToInteger)(raw, false);
        // try offsets 0,1,2… up to maxAttempts
        for (let offset = BigInt(0); offset < option.maxAttempts; offset++) {
            const candidate = (0, utils_1.integerToBytes)(baseEnt + offset, raw.length, 'big');
            try {
                return this.encode(candidate, language, {
                    mnemonicType: option.mnemonicType,
                    wordsList: wordsList,
                    bip39List: bip39List,
                    bip39Index: bip39Index,
                    ev1List: ev1List,
                    ev1Index: ev1Index
                });
            }
            catch (err) {
                if (err instanceof exceptions_1.EntropyError) {
                    continue;
                }
                throw err;
            }
        }
        throw new exceptions_1.MnemonicError('Unable to generate a valid mnemonic');
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
    static encode(entropy, language, option = {
        mnemonicType: exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }) {
        if (!option.mnemonicType) {
            throw new exceptions_1.MnemonicError('mnemonicType is required');
        }
        const entropyBytes = (0, utils_1.getBytes)(entropy);
        let ent = (0, utils_1.bytesToInteger)(entropyBytes, false);
        if (!entropies_1.ElectrumV2Entropy.areEntropyBitsEnough(entropyBytes)) {
            throw new exceptions_1.EntropyError('Invalid entropy strength for V2');
        }
        const wl = option.wordsList ?? this.normalize(this.getWordsListByLanguage(language, this.wordLists));
        const mnemonic = [];
        // repeatedly mod/divide
        while (ent > BigInt(0)) {
            const idx = Number(ent % BigInt(wl.length));
            ent = ent / BigInt(wl.length);
            mnemonic.push(wl[idx]);
        }
        if (mnemonic_2.BIP39Mnemonic.isValid(mnemonic, { wordsList: option.bip39List, wordsListWithIndex: option.bip39Index }) ||
            mnemonic_3.ElectrumV1Mnemonic.isValid(mnemonic, { wordsList: option.ev1List, wordsListWithIndex: option.ev1Index })) {
            throw new exceptions_1.EntropyError('Entropy bytes are not suitable for generating a valid mnemonic');
        }
        if (!this.isType(mnemonic, option.mnemonicType)) {
            throw new exceptions_1.EntropyError(`Could not generate a '${option.mnemonicType}' mnemonic`);
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
    static decode(mnemonic, option = {
        mnemonicType: exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }) {
        if (!option.mnemonicType) {
            throw new exceptions_1.MnemonicError('mnemonicType is required');
        }
        const words = this.normalize(mnemonic);
        if (!this.wordsList.includes(words.length)) {
            throw new exceptions_1.MnemonicError('Invalid mnemonic words count', {
                expected: this.wordsList, got: words.length,
            });
        }
        if (!this.isValid(words, option)) {
            throw new exceptions_1.MnemonicError(`Invalid ${option.mnemonicType} mnemonic words`);
        }
        const [wordsList] = this.findLanguage(words, this.wordLists);
        const idxMap = Object.fromEntries(wordsList.map((w, i) => [w, i]));
        let ent = BigInt(0);
        // reverse process: from last word to first
        for (const w of words.slice().reverse()) {
            ent = ent * BigInt(wordsList.length) + BigInt(idxMap[w]);
        }
        // convert bigint -> bytes -> hex
        const byteLen = Math.ceil(words.length * this.wordBitLength / 8);
        const buf = (0, utils_1.integerToBytes)(ent, byteLen, 'big');
        return (0, utils_1.bytesToString)(buf);
    }
    /**
     * Validate whether input is a valid Electrum-V2 mnemonic.
     *
     * @param input - Mnemonic words
     * @param option - Mnemonic options
     * @returns True if valid, false otherwise
     */
    static isValid(input, option = {
        mnemonicType: exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }) {
        if (mnemonic_2.BIP39Mnemonic.isValid(input, {
            wordsList: option.bip39List, wordsListWithIndex: option.bip39Index
        }) ||
            mnemonic_3.ElectrumV1Mnemonic.isValid(input, {
                wordsList: option.ev1List, wordsListWithIndex: option.ev1Index
            })) {
            return false;
        }
        return this.isType(input, option.mnemonicType ?? exports.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD);
    }
    /**
     * Check if a mnemonic belongs to the specified type.
     *
     * @param input - Mnemonic words
     * @param mnemonicType - Target mnemonic type
     * @returns True if mnemonic type matches
     */
    static isType(input, mnemonicType) {
        const tag = (0, utils_1.bytesToString)((0, crypto_1.hmacSha512)((0, utils_1.toBuffer)('Seed version'), this.normalize(input).join(' ')));
        return tag.startsWith(this.mnemonicTypes[mnemonicType]);
    }
    /**
     * Get the mnemonic type from instance options.
     *
     * @returns The mnemonic type string
     * @throws {MnemonicError} If mnemonicType is not found
     */
    getMnemonicType() {
        if (!this.options?.mnemonicType) {
            throw new exceptions_1.MnemonicError('mnemonicType is not found');
        }
        return this.options?.mnemonicType;
    }
    /**
     * Normalize input (string or array) into lowercase words (NFKD form).
     *
     * @param input - Mnemonic phrase or word array
     * @returns Normalized word array
     */
    static normalize(input) {
        const arr = typeof input === 'string' ? input.trim().split(/\s+/) : input;
        return arr.map(w => w.normalize('NFKD').toLowerCase());
    }
}
exports.ElectrumV2Mnemonic = ElectrumV2Mnemonic;
//# sourceMappingURL=mnemonic.js.map