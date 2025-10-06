// SPDX-License-Identifier: MIT

import { BIP39Seed } from '../../src/seeds';
import { MnemonicError } from '../../src/exceptions';

const jsonData = require('../data/json/seeds.json');

describe('BIP39Seed.fromMnemonic', () => {
  const allVectors = (jsonData as any).BIP39 as Record<string, Record<string, {
    mnemonic: string;
    'non-passphrase-seed': string;
    passphrases: Record<string, string> | null;
  }>>;

  Object.entries(allVectors).forEach(([wordCount, languages]) => {
    describe(`${wordCount}-word`, () => {

      Object.entries(languages).forEach(([lang, vector]) => {
        const { mnemonic, passphrases, 'non-passphrase-seed': noPassSeed } = vector;

        it(`📜 [${wordCount} words · ${lang}] generates correct seed without passphrase`, () => {
          expect(BIP39Seed.fromMnemonic(mnemonic)).toBe(noPassSeed);
        });

        if (passphrases) {
          Object.entries(passphrases).forEach(([pw, expectedSeed]) => {
            it(`🔑 [${wordCount} words · ${lang}] with passphrase '${pw}'`, () => {
              expect(
                BIP39Seed.fromMnemonic(mnemonic, { passphrase: pw })
              ).toBe(expectedSeed);
            });
          });
        }
      });

    });
  });

  it('throws on invalid mnemonic', () => {
    expect(() => BIP39Seed.fromMnemonic('foo bar baz')).toThrow(MnemonicError);
  });
});