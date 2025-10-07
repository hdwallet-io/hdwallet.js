// SPDX-License-Identifier: MIT

import { MNEMONICS } from '../../src/mnemonics';
import {
  BIP39_MNEMONIC_LANGUAGES, BIP39_MNEMONIC_WORDS, BIP39Mnemonic
} from '../../src/mnemonics';
import { BIP39Entropy, BIP39_ENTROPY_STRENGTHS } from '../../src/entropies';
import { MnemonicError, ChecksumError, EntropyError } from '../../src/exceptions';
import { getBytes } from '../../src/utils';
import { readFileSync } from 'fs';
import * as path from 'node:path';

const raw = readFileSync(
  path.join(__dirname, '../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');
const vectors = JSON.parse(raw) as { BIP39: BIP39Case[] };

type BIP39Case = {
  name: string;
  entropy: string;
  words: number;
  languages: { [langKey: string]: string };
};

describe('BIP39Mnemonic (data-driven)', () => {
  it('exposes the correct client identifier and validates languages & word counts', () => {
    expect(BIP39Mnemonic.getName()).toBe('BIP39');
    expect(BIP39Mnemonic.isValidLanguage(BIP39_MNEMONIC_LANGUAGES.ENGLISH)).toBe(true);
    expect(BIP39Mnemonic.isValidLanguage('klingon' as any)).toBe(false);
    expect(BIP39Mnemonic.isValidWords(BIP39_MNEMONIC_WORDS.TWELVE)).toBe(true);
    expect(BIP39Mnemonic.isValidWords(13 as any)).toBe(false);
  });

  it('is registered under MNEMONICS by name', () => {
    const RegistryClass = MNEMONICS.getMnemonicClass('BIP39');
    expect(RegistryClass).toBe(BIP39Mnemonic);
  });

  it('normalizes a string into an array of words', () => {
    const raw = '  foo   bar\tbaz\nqux  ';
    expect(BIP39Mnemonic.normalize(raw)).toEqual(['foo', 'bar', 'baz', 'qux']);
    const arr = ['alpha', 'beta'];
    expect(BIP39Mnemonic.normalize(arr)).toEqual(arr);
  });

  it('encodes and decodes a 128-bit entropy round-trip in all supported languages', () => {
    for (const words of BIP39Mnemonic.wordsList) {
      for (const language of BIP39Mnemonic.languages) {
        const entropy = BIP39Entropy.generate(
          BIP39Mnemonic.wordsToEntropyStrength[words]
        );
        const mnemonic = BIP39Mnemonic.encode(entropy, language);
        expect(typeof mnemonic).toBe('string');
        expect(mnemonic.split(' ')).toHaveLength(words);
        expect(BIP39Mnemonic.isValid(mnemonic)).toBe(true);
        const decoded = BIP39Mnemonic.decode(mnemonic);
        expect(decoded).toBe(entropy);
      }
    }
  });

  vectors.BIP39.forEach(({ name, entropy, words, languages }) => {
    Object.entries(languages).forEach(([langKey, mnemonic]) => {
      const enumKey = langKey.toUpperCase().replace(/-/g, '_') as keyof typeof BIP39_MNEMONIC_LANGUAGES;
      const language = BIP39_MNEMONIC_LANGUAGES[enumKey];

      describe(`example: ${words}-word mnemonic in ${language}`, () => {
        let fromRegistry: BIP39Mnemonic;
        let direct: BIP39Mnemonic;
        let roundViaRegistry: String;
        let roundDirect: String;

        beforeAll(() => {
          const RegistryClass = MNEMONICS.getMnemonicClass(name) as typeof BIP39Mnemonic;
          fromRegistry    = new RegistryClass(mnemonic);
          direct          = new BIP39Mnemonic(mnemonic);
          roundViaRegistry = RegistryClass.fromEntropy(entropy, language);
          roundDirect     = BIP39Mnemonic.fromEntropy(entropy, language);
        });

        it('round-trips entropy → mnemonic → entropy', () => {
          expect(roundViaRegistry.normalize('NFC')).toBe(mnemonic);
          expect(roundDirect.normalize('NFC')).toBe(mnemonic);
          expect(BIP39Mnemonic.decode(mnemonic)).toBe(entropy);
        });

        it('preserves the original mnemonic string', () => {
          expect(fromRegistry.getMnemonic().normalize('NFC')).toBe(mnemonic);
          expect(direct.getMnemonic().normalize('NFC')).toBe(mnemonic);
        });

        it('reports the correct language and word count', () => {
          [fromRegistry, direct].forEach(inst => {
             expect(inst.getLanguage()).toBe(language);
             expect(inst.getWords()).toBe(words);
          });
        });

        it('validates consistently', () => {
          expect(BIP39Mnemonic.isValid(mnemonic)).toBe(true);
          expect(BIP39Mnemonic.isValidLanguage(language)).toBe(true);
          expect(BIP39Mnemonic.isValidWords(words)).toBe(true);
        });

        it('throws a MnemonicError for a mnemonic containing an unknown word', () => {
          const bad = mnemonic
            .split(' ')
            .map((w, i) => (i === words - 1 ? 'invalidword' : w))
            .join(' ');
          expect(() => BIP39Mnemonic.decode(bad)).toThrowError(MnemonicError);
        });


        it('supports fromWords()', () => {
           const m = BIP39Mnemonic.fromWords(words, language);
           expect(typeof m).toBe('string');
           expect(m.split(' ')).toHaveLength(words);

           const inst = new BIP39Mnemonic(m);
           expect(inst.getWords()).toBe(words);
           expect(inst.getLanguage()).toBe(language);
        });

        it('throws on an unsupported word count in fromWords()', () => {
          expect(() =>
            BIP39Mnemonic.fromWords(13 as any, language)
          ).toThrowError(MnemonicError);
        });

        it('accepts hex, Uint8Array or BIP39Entropy in fromEntropy()', () => {
          const e     = BIP39Entropy.generate(BIP39Mnemonic.wordsToEntropyStrength[words]);
          const bytes = getBytes(e);
          const ent   = new BIP39Entropy(e);

          [e, bytes, ent].forEach(input => {
            const m = BIP39Mnemonic.fromEntropy(input, language);
            expect(BIP39Mnemonic.decode(m)).toBe(e);
          });
        });

        it('encode() throws on unsupported entropy lengths', () => {
          const badHex = '00'.repeat(100 / 4);
          expect(() =>
            BIP39Mnemonic.encode(badHex, language)
          ).toThrowError(EntropyError);
        });
      });
    });
  });

  it('fromEntropy() should accept hex, Uint8Array, or BIP39Entropy and round-trip correctly', () => {
    const entropy = BIP39Entropy.generate(BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT);
    const bytes   = getBytes(entropy);
    const ent     = new BIP39Entropy(entropy);

    [entropy, bytes, ent].forEach(input => {
      const m = BIP39Mnemonic.fromEntropy(input, BIP39_MNEMONIC_LANGUAGES.ENGLISH);
      expect(BIP39Mnemonic.decode(m)).toBe(entropy);
    });
  });
});
