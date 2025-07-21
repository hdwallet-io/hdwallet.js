import { Entropy } from '../entropies';
import { MnemonicOptionsInterface } from '../interfaces';
export declare class Mnemonic {
    protected mnemonic: string[];
    protected words: number;
    protected language: string;
    protected options: MnemonicOptionsInterface;
    static wordsList: number[];
    static languages: string[];
    static wordLists: Record<string, string[]>;
    constructor(mnemonic: string | string[], options?: MnemonicOptionsInterface);
    static getName(): string;
    getName(): string;
    getMnemonic(): string;
    getMnemonicType(): string;
    getWords(): number;
    getLanguage(): string;
    static fromWords(words: number, language: string, options?: MnemonicOptionsInterface): string;
    static fromEntropy(entropy: string | Uint8Array | Entropy, language: string, options?: MnemonicOptionsInterface): string;
    static encode(entropy: string | Uint8Array, language: string, options?: MnemonicOptionsInterface): string;
    static decode(mnemonic: string | string[], options?: MnemonicOptionsInterface): string;
    static getWordsListByLanguage(language: string, wordLists?: Record<string, string[]>): string[];
    static findLanguage(mnemonic: string[], wordLists?: Record<string, string[]>): [string[], string];
    static isValid(mnemonic: string | string[], options?: MnemonicOptionsInterface): boolean;
    static isValidLanguage(language: string): boolean;
    static isValidWords(words: number): boolean;
    static normalize(mnemonic: string | string[]): string[];
}
//# sourceMappingURL=mnemonic.d.ts.map