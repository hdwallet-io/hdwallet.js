// SPDX-License-Identifier: MIT

import { ElectrumV2Entropy } from '../../../../src/entropies';
import {
  MNEMONICS, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES
} from '../../../../src/mnemonics';
import { EntropyError, MnemonicError } from '../../../../src/exceptions';
import { getBytes } from '../../../../src/utils';
import { readFileSync } from 'fs';
import { join }         from 'path';

const raw = readFileSync(
  join(__dirname, '../../../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');
const jsonData = JSON.parse(raw) as Record<string, any[]>;

describe('ElectrumV2Mnemonic (Standard-2FA)', () => {
  const mnemonicType = ELECTRUM_V2_MNEMONIC_TYPES.STANDARD_2FA;

  it('is registered under MNEMONICS by name', () => {
    expect(MNEMONICS.getMnemonicClass('Electrum-V2')).toBe(ElectrumV2Mnemonic);
  });

  it('exposes correct client ID and validates languages & word counts', () => {
    expect(ElectrumV2Mnemonic.getName()).toBe('Electrum-V2');
    expect(
      ElectrumV2Mnemonic.isValidLanguage(
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
      )
    ).toBe(true);
    expect(ElectrumV2Mnemonic.isValidLanguage('klingon')).toBe(false);

    expect(
      ElectrumV2Mnemonic.isValidWords(
        ELECTRUM_V2_MNEMONIC_WORDS.TWELVE
      )
    ).toBe(true);
    expect(
      ElectrumV2Mnemonic.isValidWords(
        ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR
      )
    ).toBe(true);
    expect(ElectrumV2Mnemonic.isValidWords(13)).toBe(false);
  });

  it('normalizes whitespace correctly', () => {
    const rawInput = '  foo   bar\tbaz\nqux  ';
    expect(ElectrumV2Mnemonic.normalize(rawInput)).toEqual([
      'foo', 'bar', 'baz', 'qux'
    ]);
    const arr = ['alpha', 'beta'];
    expect(ElectrumV2Mnemonic.normalize(arr)).toStrictEqual(arr);
  });

  it('encodes & decodes each supported entropy → mnemonic → entropy', () => {
    type Vector = {
      words: number;
      'mnemonic-types': Record<
        string,
        Record<string, { mnemonic: string; 'entropy-suitable': string }>
      >;
    };
    const vectors = (jsonData['Electrum-V2'] as Vector[])
      .filter(v => v['mnemonic-types']['standard-2fa']);

    for (const { words, 'mnemonic-types': m } of vectors) {
      const byLang = m['standard-2fa'];
      for (const lang of ElectrumV2Mnemonic.languages) {
        const entropySuitable = byLang[lang]['entropy-suitable'];

        const mnemStr = ElectrumV2Mnemonic.encode(
          entropySuitable,
          lang,
          { mnemonicType }
        );
        expect(typeof mnemStr).toBe('string');
        expect(mnemStr.split(' ')).toHaveLength(words);
        expect(
          ElectrumV2Mnemonic.isValid(mnemStr, { mnemonicType })
        ).toBe(true);

        const decoded = ElectrumV2Mnemonic.decode(mnemStr, { mnemonicType });
        expect(decoded).toBe(entropySuitable);
      }
    }
  });

  it('fromWords() generates valid instances of each supported length', () => {
    for (const words of ElectrumV2Mnemonic.wordsList) {
      // static → mnemonic string
      const mnemStr = ElectrumV2Mnemonic.fromWords(
        words,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      );
      const inst = new ElectrumV2Mnemonic(mnemStr, { mnemonicType });

      expect(inst).toBeInstanceOf(ElectrumV2Mnemonic);
      expect(inst.getWords()).toBe(words);
      expect(inst.getLanguage()).toBe(
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
      );
      expect(inst.getMnemonic().split(' ')).toHaveLength(words);
      expect(
        ElectrumV2Mnemonic.isValid(inst.getMnemonic(), { mnemonicType })
      ).toBe(true);
    }
  });

  it('fromWords() throws on unsupported word counts', () => {
    expect(() =>
      ElectrumV2Mnemonic.fromWords(
        13,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      )
    ).toThrowError(MnemonicError);
  });

  it('fromEntropy() accepts hex, Uint8Array or ElectrumV2Entropy and round-trips', () => {
    const vec12 = (jsonData['Electrum-V2'] as any[])
      .find(v => v.words === 12)!;
    const entropyHex =
      vec12['mnemonic-types']['standard-2fa'][
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
      ]['entropy-suitable'];
    const entropyBytes = getBytes(entropyHex);
    const entropyObj   = new ElectrumV2Entropy(entropyHex);

    for (const input of [entropyHex, entropyBytes, entropyObj]) {
      const mnemStr = ElectrumV2Mnemonic.fromEntropy(
        input,
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      );
      const inst = new ElectrumV2Mnemonic(mnemStr, { mnemonicType });

      const decoded = ElectrumV2Mnemonic.decode(
        inst.getMnemonic(),
        { mnemonicType }
      );
      expect(decoded).toBe(entropyHex);
    }
  });

  it('encode() throws on unsupported entropy lengths', () => {
    expect(() =>
      ElectrumV2Mnemonic.encode(
        '00'.repeat(100 / 4),
        ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
        { mnemonicType }
      )
    ).toThrowError(EntropyError);
  });
});
