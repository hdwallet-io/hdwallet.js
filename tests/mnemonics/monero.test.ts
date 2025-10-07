// SPDX-License-Identifier: MIT

import { MnemonicError, EntropyError } from '../../src/exceptions';
import {
  MNEMONICS, MoneroMnemonic, MONERO_MNEMONIC_LANGUAGES
} from '../../src/mnemonics';
import { readFileSync } from 'fs';
import { join }         from 'path';

const raw = readFileSync(
  join(__dirname, '../data/json/mnemonics.json'), 'utf8'
).normalize('NFC');

interface MoneroCase {
  name:     string;
  entropy:  string;
  words:    number;
  checksum: boolean;
  languages: Record<string, string>;
}

const vectors = (JSON.parse(raw) as { Monero: MoneroCase[] }).Monero;

describe('MoneroMnemonic (data-driven)', () => {
  it('is registered under MNEMONICS by name', () => {
    expect(MNEMONICS.getMnemonicClass('Monero')).toBe(MoneroMnemonic);
  });

  for (const { name, entropy, words, checksum, languages } of vectors) {
    for (const [langKey, mnemonic] of Object.entries(languages)) {
      const enumKey = langKey
        .toUpperCase()
        .replace(/-/g, '_') as keyof typeof MONERO_MNEMONIC_LANGUAGES;
      const language = MONERO_MNEMONIC_LANGUAGES[enumKey];

      describe(`${words}-word Monero mnemonic in ${langKey}`, () => {
        let instFromRegistry: MoneroMnemonic;
        let directInst:       MoneroMnemonic;
        let fromWordsStr:     string;
        let fromEntropyStr:   string;
        let staticEncoded:    string;

        beforeAll(() => {
          const Registry = MNEMONICS.getMnemonicClass(name) as typeof MoneroMnemonic;

          instFromRegistry = new Registry(mnemonic);
          directInst       = new MoneroMnemonic(mnemonic);

          fromWordsStr    = MoneroMnemonic.fromWords(words, language);
          fromEntropyStr  = MoneroMnemonic.fromEntropy(entropy, language, { checksum });
          staticEncoded   = MoneroMnemonic.encode(entropy, language, { checksum });
        });

        it('round-trips encode → decode (static)', () => {
          expect(staticEncoded.normalize('NFC')).toBe(mnemonic);
          expect(
            MoneroMnemonic.decode(staticEncoded, { checksum })
          ).toBe(entropy);
        });

        it('decodes the original mnemonic', () => {
          expect(
            MoneroMnemonic.decode(mnemonic, { checksum })
          ).toBe(entropy);
        });

        it('constructor preserves the mnemonic', () => {
          expect(instFromRegistry.getMnemonic().normalize('NFC')).toBe(mnemonic);
          expect(directInst.getMnemonic().normalize('NFC')).toBe(mnemonic);
        });

        it('reports correct language & word count', () => {
          [instFromRegistry, directInst].forEach(inst => {
            expect(inst.getLanguage()).toBe(language);
            expect(inst.getWords()).toBe(words);
          });

          const wrapWords   = new MoneroMnemonic(fromWordsStr);
          const wrapEntropy = new MoneroMnemonic(fromEntropyStr);

          expect(wrapWords.getLanguage()).toBe(language);
          expect(wrapWords.getWords()).toBe(words);

          expect(wrapEntropy.getLanguage()).toBe(language);
          expect(wrapEntropy.getWords()).toBe(words);
        });

        it('validates consistently', () => {
          expect(MoneroMnemonic.isValid(mnemonic, { checksum })).toBe(true);
          expect(MoneroMnemonic.isValidLanguage(language)).toBe(true);
          expect(MoneroMnemonic.isValidWords(words)).toBe(true);
        });

        it('fromWords() yields a valid instance', () => {
          const inst = new MoneroMnemonic(fromWordsStr);
          expect(inst.getWords()).toBe(words);
          expect(inst.getLanguage()).toBe(language);
          expect(inst.getMnemonic().split(' ')).toHaveLength(words);
        });

        it('fromEntropy() yields a valid instance', () => {
          const inst = new MoneroMnemonic(fromEntropyStr);
          expect(inst.getWords()).toBe(words);
          expect(inst.getLanguage()).toBe(language);
          expect(inst.getMnemonic().split(' ')).toHaveLength(words);
        });

        if (checksum) {
          it('throws on a valid-length but bad-checksum mnemonic', () => {
            const bad = mnemonic
              .split(' ')
              .map((w, i) => (i === words - 1 ? 'invalidword' : w))
              .join(' ');
            expect(() =>
              MoneroMnemonic.decode(bad, { checksum })
            ).toThrowError(MnemonicError);
          });
        }
        it('encode() throws on unsupported entropy length', () => {
          const badHex = '00'.repeat(100 / 4);
          expect(() =>
            MoneroMnemonic.encode(badHex, language, { checksum })
          ).toThrowError(EntropyError);
        });
      });
    }
  }
});
