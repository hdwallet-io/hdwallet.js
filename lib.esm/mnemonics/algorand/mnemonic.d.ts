import { Mnemonic } from '../mnemonic';
import { Entropy } from '../../entropies';
import { MnemonicOptionsInterface, AlgorandMnemonicLanguagesInterface, AlgorandMnemonicWordsInterface } from '../../interfaces';
export declare const ALGORAND_MNEMONIC_WORDS: AlgorandMnemonicWordsInterface;
export declare const ALGORAND_MNEMONIC_LANGUAGES: AlgorandMnemonicLanguagesInterface;
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
export declare class AlgorandMnemonic extends Mnemonic {
    static checksumLength: number;
    static wordBitLength: number;
    static wordsList: number[];
    static wordsToEntropyStrength: Record<number, number>;
    static languages: string[];
    static wordLists: Record<string, string[]>;
    /**
     * Returns the name of this mnemonic type.
     *
     * @returns The string `"Algorand"`.
     */
    static getName(): string;
    /**
     * Generate a new mnemonic from word count and language.
     *
     * @param words - Number of words (must be 25).
     * @param language - Language of the wordlist.
     * @param options - Optional mnemonic generation options.
     * @returns A space-separated mnemonic string.
     * @throws {MnemonicError} If word count is invalid.
     */
    static fromWords(words: number, language: string, options?: MnemonicOptionsInterface): string;
    /**
     * Generate a mnemonic from entropy input.
     *
     * @param entropy - Entropy (hex string, Uint8Array, or Entropy object).
     * @param language - Target language.
     * @param options - Optional mnemonic options.
     * @returns A mnemonic phrase.
     */
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, options?: MnemonicOptionsInterface): string;
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
    static encode(entropyInput: string | Uint8Array, language: string, options?: MnemonicOptionsInterface): string;
    /**
     * Decode an Algorand mnemonic back into entropy.
     *
     * @param mnemonic - Mnemonic string or array of words.
     * @param options - Optional decode options.
     * @returns Hex string representing entropy.
     * @throws {MnemonicError} If mnemonic length or words are invalid.
     * @throws {ChecksumError} If checksum does not match.
     */
    static decode(mnemonic: string | string[], options?: MnemonicOptionsInterface): string;
    /**
     * Normalize input mnemonic into lowercase array of words.
     *
     * @param input - Mnemonic string or array.
     * @returns Normalized array of words.
     */
    static normalize(input: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map