// SPDX-License-Identifier: MIT

import { AlgorandSeed } from '../../src/seeds';
import { MnemonicError } from '../../src/exceptions';

const jsonData = require('../data/json/seeds.json');


describe('AlgorandSeed.fromMnemonic', () => {
  const allVectors = (jsonData as any).Algorand as Record<string, any>;

  it('generates the correct seed for every English test-vector', () => {
    for (const wordCount of Object.keys(allVectors)) {
      const { mnemonic, 'non-passphrase-seed': expected } = allVectors[wordCount].english;
      expect(AlgorandSeed.fromMnemonic(mnemonic)).toBe(expected);
    }
  });

  it('throws on invalid mnemonic', () => {
    expect(() => AlgorandSeed.fromMnemonic('foo bar baz')).toThrow(MnemonicError);
  });
});