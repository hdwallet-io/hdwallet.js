import { Mnemonic } from '../mnemonic';
import { Entropy } from '../../entropies';
import { MnemonicOptionsInterface, MoneroMnemonicLanguagesInterface, MoneroMnemonicWordsInterface } from '../../interfaces';
export declare const MONERO_MNEMONIC_WORDS: MoneroMnemonicWordsInterface;
export declare const MONERO_MNEMONIC_LANGUAGES: MoneroMnemonicLanguagesInterface;
export declare class MoneroMnemonic extends Mnemonic {
    static wordBitLength: number;
    static wordsList: number[];
    static wordsToStrength: Record<number, number>;
    static checksumWordCounts: number[];
    static languages: string[];
    static languageUniquePrefixLengths: Record<string, number>;
    static wordLists: Record<string, string[]>;
    static getName(): string;
    static fromWords(count: number, language: string): string;
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, options?: MnemonicOptionsInterface): string;
    static encode(entropy: string | Uint8Array, language: string, options?: MnemonicOptionsInterface): string;
    static decode(input: string | string[], options?: MnemonicOptionsInterface): string;
    static normalize(input: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map