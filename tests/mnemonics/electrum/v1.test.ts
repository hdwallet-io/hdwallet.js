// SPDX-License-Identifier: MIT

import { ElectrumV1Entropy } from '../../../src/entropies';
import {
  MNEMONICS, ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_LANGUAGES, ELECTRUM_V1_MNEMONIC_WORDS
} from '../../../src/mnemonics';
import { MnemonicError, EntropyError } from '../../../src/exceptions';
import { getBytes } from '../../../src/utils';
import { readFileSync } from 'fs';
import { join }         from 'path';

const raw = readFileSync(
  join(__dirname, '../../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');

interface ElectrumV1Case {
  name:      string;
  entropy:   string;
  words:     number;
  languages: Record<string,string>;
}

const vectors = (JSON.parse(raw) as Record<string, ElectrumV1Case[]>)['Electrum-V1'];

describe('ElectrumV1Mnemonic (data-driven)', () => {
  it('exposes correct client identifier and validates languages & word counts', () => {
    expect(ElectrumV1Mnemonic.getName()).toBe('Electrum-V1');
    expect(
      ElectrumV1Mnemonic.isValidLanguage(ELECTRUM_V1_MNEMONIC_LANGUAGES.ENGLISH)
    ).toBe(true);
    expect(ElectrumV1Mnemonic.isValidLanguage('klingon')).toBe(false);
    expect(
      ElectrumV1Mnemonic.isValidWords(ELECTRUM_V1_MNEMONIC_WORDS.TWELVE)
    ).toBe(true);
    expect(ElectrumV1Mnemonic.isValidWords(13)).toBe(false);
  });

  it('normalizes a string into an array of words', () => {
    const raw = '  foo   bar\tbaz\nqux  ';
    expect(ElectrumV1Mnemonic.normalize(raw)).toEqual(['foo','bar','baz','qux']);
    const arr = ['alpha','beta'];
    expect(ElectrumV1Mnemonic.normalize(arr)).toEqual(arr);
  });

  it('is registered under MNEMONICS by name', () => {
    expect(MNEMONICS.getMnemonicClass('Electrum-V1')).toBe(ElectrumV1Mnemonic);
  });

  for (const { name, entropy, words, languages } of vectors) {
    for (const [langKey, expectedMnemonic] of Object.entries(languages)) {
      const enumKey = langKey.toUpperCase().replace(/-/g,'_') as
                      keyof typeof ELECTRUM_V1_MNEMONIC_LANGUAGES;
      const language = ELECTRUM_V1_MNEMONIC_LANGUAGES[enumKey];

      describe(`${words}-word mnemonic in ${langKey}`, () => {
        let staticEncoded: string;
        let fromWordsStr:  string;
        let fromEntropyStr:string;

        beforeAll(() => {
          staticEncoded   = ElectrumV1Mnemonic.encode(entropy, language);
          fromWordsStr    = ElectrumV1Mnemonic.fromWords(words, language);
          fromEntropyStr  = ElectrumV1Mnemonic.fromEntropy(entropy, language);
        });

        it('static encode matches expected', () => {
          expect(staticEncoded).toBe(expectedMnemonic);
        });

        it('static encode → decode round-trip', () => {
          expect(ElectrumV1Mnemonic.decode(staticEncoded)).toBe(entropy);
        });

        it('static decode original mnemonic', () => {
          expect(ElectrumV1Mnemonic.decode(expectedMnemonic)).toBe(entropy);
        });

        it('constructor preserves the mnemonic', () => {
          const inst = new ElectrumV1Mnemonic(expectedMnemonic);
          expect(inst.getMnemonic()).toBe(expectedMnemonic);
        });

        it('reports correct language & word count', () => {
          const inst = new ElectrumV1Mnemonic(expectedMnemonic);
          expect(inst.getLanguage()).toBe(language);
          expect(inst.getWords()).toBe(words);
        });

        it('static isValid works', () => {
          expect(ElectrumV1Mnemonic.isValid(expectedMnemonic)).toBe(true);
        });

        it('fromWords() returns a string and yields a valid instance', () => {
          expect(typeof fromWordsStr).toBe('string');
          expect(fromWordsStr.split(' ')).toHaveLength(words);

          const inst = new ElectrumV1Mnemonic(fromWordsStr);
          expect(inst.getWords()).toBe(words);
          expect(inst.getLanguage()).toBe(language);
          expect(ElectrumV1Mnemonic.isValid(fromWordsStr)).toBe(true);
        });

        it('fromWords() throws on unsupported word count', () => {
          expect(() =>
            ElectrumV1Mnemonic.fromWords(words + 1, language)
          ).toThrowError(MnemonicError);
        });

        it('fromEntropy() returns a string and decodes correctly', () => {
          expect(typeof fromEntropyStr).toBe('string');
          expect(ElectrumV1Mnemonic.decode(fromEntropyStr)).toBe(entropy);
        });

        it('fromEntropy() accepts hex, Uint8Array, or Entropy instance', () => {
          const bytes = getBytes(entropy);
          const entObj = new ElectrumV1Entropy(entropy);
          for (const input of [entropy, bytes, entObj]) {
            const mStr = ElectrumV1Mnemonic.fromEntropy(input, language);
            expect(typeof mStr).toBe('string');
            expect(ElectrumV1Mnemonic.decode(mStr)).toBe(entropy);
          }
        });

        it('encode() throws on unsupported entropy lengths', () => {
          const badHex = '00'.repeat(100/4);
          expect(() =>
            ElectrumV1Mnemonic.encode(badHex, language)
          ).toThrowError(EntropyError);
        });
      });
    }
  }
});
