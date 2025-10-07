// SPDX-License-Identifier: MIT

import {
  MNEMONICS, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES
} from '../../../../src/mnemonics';
import { MnemonicError, EntropyError } from '../../../../src/exceptions';
import { readFileSync } from 'fs';
import { join }         from 'path';

const raw = readFileSync(
  join(__dirname, '../../../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');

interface ElectrumV2Case {
  name: string;
  words: number;
  'mnemonic-types': Record<
    string,
    Record<string, { mnemonic: string; 'entropy-suitable': string }>
  >;
}

const vectors = (JSON.parse(raw) as Record<string, ElectrumV2Case[]>)['Electrum-V2'];

describe('ElectrumV2Mnemonic (segwit data-driven)', () => {
  it('is registered under MNEMONICS by name', () => {
    expect(MNEMONICS.getMnemonicClass('Electrum-V2')).toBe(ElectrumV2Mnemonic);
  });

  it('exposes correct client ID and validates languages & word counts', () => {
    expect(ElectrumV2Mnemonic.getName()).toBe('Electrum-V2');
    expect(
      ElectrumV2Mnemonic.isValidLanguage(ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH)
    ).toBe(true);
    expect(ElectrumV2Mnemonic.isValidLanguage('klingon')).toBe(false);

    expect(
      ElectrumV2Mnemonic.isValidWords(ELECTRUM_V2_MNEMONIC_WORDS.TWELVE)
    ).toBe(true);
    expect(ElectrumV2Mnemonic.isValidWords(13)).toBe(false);
  });

  it('normalizes whitespace correctly', () => {
    const raw = '  foo   bar\tbaz\nqux  ';
    expect(ElectrumV2Mnemonic.normalize(raw)).toEqual(['foo','bar','baz','qux']);
    const arr = ['alpha','beta'];
    expect(ElectrumV2Mnemonic.normalize(arr)).toEqual(arr);
  });

  for (const { name, words, 'mnemonic-types': mTypes } of vectors) {
    const langs = mTypes['segwit'];
    const mnemonicType = ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT;
    const expectedMnemonic = langs[ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH].mnemonic;
    const entropySuitable  = langs[ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH]['entropy-suitable'];

    let staticEncoded:   string;
    let fromWordsInst:   ElectrumV2Mnemonic;
    let fromEntropyInst: ElectrumV2Mnemonic;

    beforeAll(() => {
      staticEncoded = ElectrumV2Mnemonic.encode(
        entropySuitable,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      );

      const randomM = ElectrumV2Mnemonic.fromWords(
        words,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      );
      fromWordsInst = new ElectrumV2Mnemonic(randomM, { mnemonicType });

      const exactM = ElectrumV2Mnemonic.fromEntropy(
        entropySuitable,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      );
      fromEntropyInst = new ElectrumV2Mnemonic(exactM, { mnemonicType });
    });

    describe(`${words}-word segwit`, () => {
      it('static encode matches the JSON vector', () => {
        expect(staticEncoded).toBe(expectedMnemonic);
      });

      it('static encode → decode round-trip', () => {
        expect(
          ElectrumV2Mnemonic.decode(staticEncoded, { mnemonicType })
        ).toBe(entropySuitable);
      });

      it('static decode of JSON mnemonic', () => {
        expect(
          ElectrumV2Mnemonic.decode(expectedMnemonic, { mnemonicType })
        ).toBe(entropySuitable);
      });

      it('fromWords() yields an instance with the correct word-count & language', () => {
        expect(fromWordsInst).toBeInstanceOf(ElectrumV2Mnemonic);
        expect(fromWordsInst.getWords()).toBe(words);
        expect(fromWordsInst.getLanguage()).toBe(
          ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
        );
      });

      it('fromWords() throws on unsupported word count', () => {
        expect(() =>
          ElectrumV2Mnemonic.fromWords(
            words + 1,
            ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
            { mnemonicType }
          )
        ).toThrowError(MnemonicError);
      });

      it('fromEntropy() yields an instance preserving the JSON mnemonic', () => {
        expect(fromEntropyInst).toBeInstanceOf(ElectrumV2Mnemonic);
        expect(fromEntropyInst.getMnemonic()).toBe(expectedMnemonic);
        expect(fromEntropyInst.getWords()).toBe(words);
        expect(fromEntropyInst.getLanguage()).toBe(
          ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
        );
      });

      it('encode() throws on unsupported entropy length', () => {
        expect(() =>
          ElectrumV2Mnemonic.encode(
            '00'.repeat(100 / 4),
            ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
            { mnemonicType }
          )
        ).toThrowError(EntropyError);
      });
    });
  }
});
