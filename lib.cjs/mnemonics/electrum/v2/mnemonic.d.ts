import { Mnemonic } from '../../mnemonic';
import { Entropy } from '../../../entropies';
import { MnemonicOptionsInterface, ElectrumV2MnemonicLanguagesInterface, ElectrumV2MnemonicTypesInterface, ElectrumV2MnemonicWordsInterface } from '../../../interfaces';
export declare const ELECTRUM_V2_MNEMONIC_WORDS: ElectrumV2MnemonicWordsInterface;
export declare const ELECTRUM_V2_MNEMONIC_LANGUAGES: ElectrumV2MnemonicLanguagesInterface;
export declare const ELECTRUM_V2_MNEMONIC_TYPES: ElectrumV2MnemonicTypesInterface;
/**
 * Electrum V2 Mnemonic implementation.
 *
 * Provides methods for:
 * - Generating mnemonics from entropy or directly from word count.
 * - Encoding and decoding mnemonics.
 * - Validating Electrum V2 mnemonics against BIP39 and Electrum V1.
 * - Supporting multiple languages and mnemonic types (Standard, SegWit, 2FA).
 */
export declare class ElectrumV2Mnemonic extends Mnemonic {
    static wordBitLength: number;
    static wordsList: number[];
    static wordsToEntropyStrength: Record<number, number>;
    static languages: string[];
    static wordLists: Record<string, string[]>;
    static mnemonicTypes: Record<string, string>;
    /**
     * Get the identifier name for this mnemonic scheme.
     * @returns `"Electrum-V2"`
     */
    static getName(): string;
    /**
     * Generate a mnemonic from a specified word count.
     *
     * @param count - Number of words (12 or 24)
     * @param language - Wordlist language
     * @param option - Mnemonic options (type + maxAttempts)
     * @returns A valid Electrum-V2 mnemonic string
     * @throws {MnemonicError} If word count is invalid
     */
    static fromWords(count: number, language: string, option?: MnemonicOptionsInterface): string;
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
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, option?: MnemonicOptionsInterface): string;
    /**
     * Encode entropy into an Electrum-V2 mnemonic.
     *
     * @param entropy - Raw entropy (hex, bytes)
     * @param language - Wordlist language
     * @param option - Mnemonic options
     * @returns Mnemonic string
     * @throws {EntropyError} If entropy strength is invalid or clashes with BIP39/ElectrumV1
     */
    static encode(entropy: string | Uint8Array, language: string, option?: MnemonicOptionsInterface): string;
    /**
     * Decode an Electrum-V2 mnemonic back into entropy.
     *
     * @param mnemonic - Mnemonic phrase
     * @param option - Mnemonic options (type required)
     * @returns Entropy as a string
     * @throws {MnemonicError} If mnemonic is invalid or word count is incorrect
     */
    static decode(mnemonic: string | string[], option?: MnemonicOptionsInterface): string;
    /**
     * Validate whether input is a valid Electrum-V2 mnemonic.
     *
     * @param input - Mnemonic words
     * @param option - Mnemonic options
     * @returns True if valid, false otherwise
     */
    static isValid(input: string | string[], option?: MnemonicOptionsInterface): boolean;
    /**
     * Check if a mnemonic belongs to the specified type.
     *
     * @param input - Mnemonic words
     * @param mnemonicType - Target mnemonic type
     * @returns True if mnemonic type matches
     */
    static isType(input: string | string[], mnemonicType: string): boolean;
    /**
     * Get the mnemonic type from instance options.
     *
     * @returns The mnemonic type string
     * @throws {MnemonicError} If mnemonicType is not found
     */
    getMnemonicType(): string;
    /**
     * Normalize input (string or array) into lowercase words (NFKD form).
     *
     * @param input - Mnemonic phrase or word array
     * @returns Normalized word array
     */
    static normalize(input: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map