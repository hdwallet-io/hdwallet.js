// SPDX-License-Identifier: MIT

import { ElectrumV1Seed } from '../../../src/seeds';
import { Mnemonic } from '../../../src/mnemonics';

import seedVectors from '../../data/json/seeds.json';

describe('ElectrumV1Seed', () => {
  const vector = seedVectors['Electrum-V1']['12']['english'];
  const { mnemonic, 'non-passphrase-seed': expectedSeed } = vector;

  it('client() should return the correct client string', () => {
    expect(ElectrumV1Seed.getName()).toBe('Electrum-V1');
  });

  it('should derive correct seed from a valid mnemonic string', () => {
    const seed = ElectrumV1Seed.fromMnemonic(mnemonic);
    expect(typeof seed).toBe('string');
    expect(seed).toBe(expectedSeed);
  });

  it('should derive correct seed from an Mnemonic instance', () => {
    const mock = { getMnemonic: () => mnemonic } as unknown as Mnemonic;
    const seed = ElectrumV1Seed.fromMnemonic(mock);
    expect(seed).toBe(expectedSeed);
  });

  it('should store and return the seed string via instance', () => {
    const seedString = ElectrumV1Seed.fromMnemonic(mnemonic);
    const seedInstance = new (ElectrumV1Seed as any)(seedString);
    expect(seedInstance.getSeed()).toBe(seedString);
  });
});
