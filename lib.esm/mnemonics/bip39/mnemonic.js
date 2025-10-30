// SPDX-License-Identifier: MIT
import { Mnemonic } from '../mnemonic';
import { BIP39Entropy, BIP39_ENTROPY_STRENGTHS } from '../../entropies';
import { sha256 } from '../../crypto';
import { hexToBytes, bytesToBinaryString, integerToBinaryString, binaryStringToBytes, bytesToHex } from '../../utils';
import { MnemonicError, EntropyError, ChecksumError } from '../../exceptions';
import { BIP39_CHINESE_SIMPLIFIED_WORDLIST, BIP39_CHINESE_TRADITIONAL_WORDLIST, BIP39_CZECH_WORDLIST, BIP39_ENGLISH_WORDLIST, BIP39_FRENCH_WORDLIST, BIP39_ITALIAN_WORDLIST, BIP39_JAPANESE_WORDLIST, BIP39_KOREAN_WORDLIST, BIP39_PORTUGUESE_WORDLIST, BIP39_RUSSIAN_WORDLIST, BIP39_SPANISH_WORDLIST, BIP39_TURKISH_WORDLIST } from './wordlists';
export const BIP39_MNEMONIC_WORDS = {
    TWELVE: 12,
    FIFTEEN: 15,
    EIGHTEEN: 18,
    TWENTY_ONE: 21,
    TWENTY_FOUR: 24
};
export const BIP39_MNEMONIC_LANGUAGES = {
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
export class BIP39Mnemonic extends Mnemonic {
    static wordBitLength = 11;
    static wordsListNumber = 2048;
    static wordsList = [
        BIP39_MNEMONIC_WORDS.TWELVE,
        BIP39_MNEMONIC_WORDS.FIFTEEN,
        BIP39_MNEMONIC_WORDS.EIGHTEEN,
        BIP39_MNEMONIC_WORDS.TWENTY_ONE,
        BIP39_MNEMONIC_WORDS.TWENTY_FOUR
    ];
    static wordsToEntropyStrength = {
        12: BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        15: BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_SIXTY,
        18: BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_NINETY_TWO,
        21: BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_TWENTY_FOUR,
        24: BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    };
    static languages = Object.values(BIP39_MNEMONIC_LANGUAGES);
    static wordLists = {
        [BIP39_MNEMONIC_LANGUAGES.CHINESE_SIMPLIFIED]: BIP39_CHINESE_SIMPLIFIED_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.CHINESE_TRADITIONAL]: BIP39_CHINESE_TRADITIONAL_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.CZECH]: BIP39_CZECH_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.ENGLISH]: BIP39_ENGLISH_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.FRENCH]: BIP39_FRENCH_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.ITALIAN]: BIP39_ITALIAN_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.JAPANESE]: BIP39_JAPANESE_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.KOREAN]: BIP39_KOREAN_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.PORTUGUESE]: BIP39_PORTUGUESE_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.RUSSIAN]: BIP39_RUSSIAN_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.SPANISH]: BIP39_SPANISH_WORDLIST,
        [BIP39_MNEMONIC_LANGUAGES.TURKISH]: BIP39_TURKISH_WORDLIST
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
            throw new MnemonicError(`Invalid words`, { expected: this.wordsList, got: words });
        }
        const strength = this.wordsToEntropyStrength[words];
        const entropyHex = BIP39Entropy.generate(strength);
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
            hex = bytesToHex(entropy);
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
            hexToBytes(entropyInput) : entropyInput;
        const bitLen = entropyBytes.length * 8;
        if (!Object.values(this.wordsToEntropyStrength).includes(bitLen)) {
            throw new EntropyError(`Unsupported entropy length ${bitLen}`);
        }
        const hash = sha256(entropyBytes);
        const csLen = bitLen / 32;
        const entBits = bytesToBinaryString(entropyBytes, bitLen);
        const hashBits = bytesToBinaryString(hash, 256).slice(0, csLen);
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
            throw new MnemonicError(`Invalid words ${words.length}`, { expected: this.wordsList, got: words.length });
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
                throw new MnemonicError(`Unknown word: ${w}`);
            }
            return integerToBinaryString(idx, this.wordBitLength);
        })
            .join('');
        const checksumLen = bits.length / 33;
        const entropyBits = bits.slice(0, -checksumLen);
        const givenChecksum = bits.slice(-checksumLen);
        const entropyBytes = binaryStringToBytes(entropyBits);
        const hash = sha256(entropyBytes);
        const hashBits = bytesToBinaryString(hash, 256).slice(0, checksumLen);
        if (givenChecksum !== hashBits) {
            throw new ChecksumError('Checksum mismatch', { expected: givenChecksum, got: hashBits });
        }
        if (options.checksum) {
            const totalBits = bits.length;
            const padBits = totalBits % 8 === 0
                ? totalBits
                : totalBits + (8 - (totalBits % 8));
            return bytesToHex(binaryStringToBytes(bits, padBits / 8));
        }
        return bytesToHex(entropyBytes);
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
//# sourceMappingURL=mnemonic.js.map