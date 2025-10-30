import { Mnemonic } from '../mnemonic';
import { Entropy } from '../../entropies';
import { MnemonicOptionsInterface, BIP39MnemonicLanguagesInterface, BIP39MnemonicWordsInterface } from '../../interfaces';
export declare const BIP39_MNEMONIC_WORDS: BIP39MnemonicWordsInterface;
export declare const BIP39_MNEMONIC_LANGUAGES: BIP39MnemonicLanguagesInterface;
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
export declare class BIP39Mnemonic extends Mnemonic {
    static wordBitLength: number;
    static wordsListNumber: number;
    static wordsList: number[];
    static wordsToEntropyStrength: Record<number, number>;
    static languages: string[];
    static wordLists: Record<string, string[]>;
    /**
     * Get the human-readable name of this mnemonic standard.
     * @returns `"BIP39"`
     */
    static getName(): string;
    /**
     * Generate a new mnemonic phrase by word count.
     *
     * @param words Number of words (12, 15, 18, 21, or 24).
     * @param language Language of the wordlist.
     * @param options Additional encoding options.
     * @throws {MnemonicError} If word count is invalid.
     * @returns Mnemonic phrase as a string.
     */
    static fromWords(words: number, language: string, options?: MnemonicOptionsInterface): string;
    /**
     * Generate a mnemonic phrase from entropy.
     *
     * @param entropy Hex string, byte array, or Entropy instance.
     * @param language Language of the wordlist.
     * @param options Additional encoding options.
     * @returns Mnemonic phrase as a string.
     */
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, options?: MnemonicOptionsInterface): string;
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
    static encode(entropyInput: string | Uint8Array, language: string, options?: MnemonicOptionsInterface): string;
    /**
     * Decode a mnemonic phrase back into entropy.
     *
     * @param mnemonic Mnemonic phrase as string or array of words.
     * @param options Options for checksum verification and custom wordlists.
     * @throws {MnemonicError} If word count or words are invalid.
     * @throws {ChecksumError} If checksum does not match.
     * @returns Hex string of entropy.
     */
    static decode(mnemonic: string | string[], options?: MnemonicOptionsInterface): string;
    /**
     * Normalize a mnemonic phrase into lowercase NFKD words.
     *
     * @param input Mnemonic as string or array of words.
     * @returns Array of normalized words.
     */
    static normalize(input: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map