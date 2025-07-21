// SPDX-License-Identifier: MIT
import { MnemonicError } from '../exceptions';
export class Mnemonic {
    mnemonic;
    words;
    language;
    options;
    static wordsList = [];
    static languages = [];
    static wordLists = {};
    constructor(mnemonic, options = {}) {
        const constructor = this.constructor;
        const words = constructor.normalize(mnemonic);
        if (!constructor.isValid(words, options)) {
            throw new MnemonicError('Invalid mnemonic words');
        }
        const [_, language] = constructor.findLanguage(words, options.wordLists);
        this.mnemonic = words;
        this.words = words.length;
        this.language = language;
        this.options = options;
    }
    static getName() {
        throw new Error('Must override getName()');
    }
    getName() {
        return this.constructor.getName();
    }
    getMnemonic() {
        return this.mnemonic.join(' ');
    }
    getMnemonicType() {
        throw new Error('Not implemented');
    }
    getWords() {
        return this.words;
    }
    getLanguage() {
        return this.language;
    }
    static fromWords(words, language, options = {}) {
        throw new Error('Must override fromWords()');
    }
    static fromEntropy(entropy, language, options = {}) {
        throw new Error('Must override fromEntropy()');
    }
    static encode(entropy, language, options = {}) {
        throw new Error('Must override encode()');
    }
    static decode(mnemonic, options = {}) {
        throw new Error('Must override decode()');
    }
    static getWordsListByLanguage(language, wordLists) {
        const wordList = (wordLists ?? this.wordLists)[language];
        if (!wordList) {
            throw new MnemonicError(`No wordlist for language '${language}'`);
        }
        return wordList;
    }
    static findLanguage(mnemonic, wordLists) {
        for (const language of this.languages) {
            try {
                const list = this.normalize(this.getWordsListByLanguage(language, wordLists));
                const map = new Set(list);
                for (const w of mnemonic) {
                    if (!map.has(w)) {
                        throw new MnemonicError(`Unknown word '${w}'`);
                    }
                }
                return [list, language];
            }
            catch {
                continue;
            }
        }
        throw new MnemonicError(`Invalid language for mnemonic: '${mnemonic.join(' ')}'`);
    }
    static isValid(mnemonic, options = {}) {
        try {
            this.decode(mnemonic, options);
            return true;
        }
        catch {
            return false;
        }
    }
    static isValidLanguage(language) {
        return this.languages.includes(language);
    }
    static isValidWords(words) {
        return this.wordsList.includes(words);
    }
    static normalize(mnemonic) {
        return typeof mnemonic === 'string' ? mnemonic.trim().split(/\s+/) : mnemonic;
    }
}
//# sourceMappingURL=mnemonic.js.map