// SPDX-License-Identifier: MIT

import { MoneroSeed } from '../../src/seeds';
import { MnemonicError } from '../../src/exceptions';

import jsonData from '../data/json/seeds.json';

describe('MoneroSeed.fromMnemonic', () => {
  const allVectors = (jsonData as any).Monero as Record<
    string,
    Record<string, { mnemonic: string; 'non-passphrase-seed': string; passphrases: any }>
  >;

  it('generates the correct seed for every test-vector in every language', () => {
    for (const [wordCount, langMap] of Object.entries(allVectors)) {
      for (const [language, vec] of Object.entries(langMap)) {
        const { mnemonic, 'non-passphrase-seed': expected } = vec;
        expect(MoneroSeed.fromMnemonic(mnemonic)).toBe(expected);
      }
    }
  });

  it('throws on invalid mnemonic', () => {
    expect(() => MoneroSeed.fromMnemonic('foo bar baz')).toThrow(MnemonicError);
  });
});