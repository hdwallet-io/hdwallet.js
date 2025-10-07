// SPDX-License-Identifier: MIT

import { MnemonicError, EntropyError } from '../../src/exceptions';
import { getBytes } from '../../src/utils';
import {
  MNEMONICS, ALGORAND_MNEMONIC_LANGUAGES, AlgorandMnemonic
} from '../../src/mnemonics';
import { ALGORAND_ENTROPY_STRENGTHS, AlgorandEntropy } from '../../src/entropies';
import { readFileSync } from 'fs';
import * as path from 'node:path';

const raw = readFileSync(
  path.join(__dirname, '../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');

const vectors = JSON.parse(raw) as { Algorand: AlgorandCase[] };

type AlgorandCase = {
  name: string;
  entropy: string;
  words: number;
  languages: { english: string };
};


describe('Algorand Mnemonic', () => {
  const cases = vectors.Algorand as Array<{
    name: string;
    entropy: string;
    words: number;
    languages: { english: string };
  }>;

  it('is registered under MNEMONICS by name', () => {
    const RegistryClass = MNEMONICS.getMnemonicClass('Algorand');
    expect(RegistryClass).toBe(AlgorandMnemonic);
  });

  cases.forEach(({ name, entropy, words, languages }) => {
    const english = languages.english;

    let instFromRegistry: AlgorandMnemonic;
    let directInst: AlgorandMnemonic;
    let fromEntropyReg: string;
    let fromEntropyDir: string;

    beforeAll(() => {
      const RegistryClass = MNEMONICS.getMnemonicClass(name);
      instFromRegistry   = new RegistryClass(english);
      directInst         = new AlgorandMnemonic(english);
      fromEntropyReg     = RegistryClass.fromEntropy(
        entropy,
        ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
      );
      fromEntropyDir     = AlgorandMnemonic.fromEntropy(
        entropy,
        ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
      );
    });

    it('round-trips entropy→mnemonic→entropy', () => {
      expect(instFromRegistry.getMnemonic()).toBe(english);
      expect(directInst.getMnemonic()).toBe(english);

      // static methods return strings
      expect(fromEntropyReg).toBe(english);
      expect(fromEntropyDir).toBe(english);

      expect(AlgorandMnemonic.decode(fromEntropyReg)).toBe(entropy);
      expect(AlgorandMnemonic.decode(fromEntropyDir)).toBe(entropy);
    });

    it('preserves the original mnemonic string', () => {
      expect(instFromRegistry.getMnemonic()).toBe(english);
      expect(directInst.getMnemonic()).toBe(english);
    });

    it('reports the correct language and word count', () => {
      [instFromRegistry, directInst].forEach(inst => {
        expect(inst.getLanguage()).toBe(ALGORAND_MNEMONIC_LANGUAGES.ENGLISH);
        expect(inst.getWords()).toBe(words);
      });

      [fromEntropyReg, fromEntropyDir].forEach(mnemonicStr => {
        const inst = new AlgorandMnemonic(mnemonicStr);
        expect(inst.getLanguage()).toBe(ALGORAND_MNEMONIC_LANGUAGES.ENGLISH);
        expect(inst.getWords()).toBe(words);
      });
    });

    it('validates consistently', () => {
      expect(AlgorandMnemonic.isValid(english)).toBe(true);
      expect(
        AlgorandMnemonic.isValidLanguage(ALGORAND_MNEMONIC_LANGUAGES.ENGLISH)
      ).toBe(true);
      expect(AlgorandMnemonic.isValidWords(words)).toBe(true);
    });

    it('throws on bad checksum', () => {
      const bad = english
        .split(' ')
        .map((w, i) => (i === words - 1 ? 'invalidword' : w))
        .join(' ');
      expect(() => AlgorandMnemonic.decode(bad)).toThrowError(MnemonicError);
    });

    it('supports fromWords()', () => {
      const m1 = AlgorandMnemonic.fromWords(
        words,
        ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
      );
      expect(typeof m1).toBe('string');
      expect(m1.split(' ')).toHaveLength(words);

      const inst = new AlgorandMnemonic(m1);
      expect(inst.getWords()).toBe(words);
      expect(inst.getLanguage()).toBe(
        ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
      );
    });

    it('throws on unsupported word counts', () => {
      expect(() =>
        AlgorandMnemonic.fromWords(
          13 as any,
          ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
        )
      ).toThrowError(MnemonicError);
    });

    it('accepts hex, Uint8Array, or AlgorandEntropy in fromEntropy()', () => {
      const e       = AlgorandEntropy.generate(
        ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
      );
      const bytes   = getBytes(e);
      const entInst = new AlgorandEntropy(e);

      [e, bytes, entInst].forEach(input => {
        const m = AlgorandMnemonic.fromEntropy(
          input,
          ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
        );
        expect(typeof m).toBe('string');
        expect(AlgorandMnemonic.decode(m)).toBe(e);
      });
    });

    it('throws on bad-length entropy in encode()', () => {
      const badHex = '00'.repeat(100 / 4);
      expect(() =>
        AlgorandMnemonic.encode(
          badHex,
          ALGORAND_MNEMONIC_LANGUAGES.ENGLISH
        )
      ).toThrowError(EntropyError);
    });
  });
});
