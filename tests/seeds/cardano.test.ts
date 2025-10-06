// SPDX-License-Identifier: MIT

import { CardanoSeed } from '../../src/seeds';
import { MnemonicError, SeedError } from '../../src/exceptions';
import { Mnemonic } from '../../src/mnemonics';
import { Cardano } from '../../src/cryptocurrencies';

import seedVectors from '../data/json/seeds.json';

describe('CardanoSeed', () => {
  const byronIcarusVec = seedVectors.Cardano['12']['byron-icarus']['english'];
  const { mnemonic: englishPhrase, 'non-passphrase-seed': expectedByronIcarus } = byronIcarusVec;

  it('client() should return Cardano', () => {
    expect(CardanoSeed.getName()).toBe('Cardano');
  });

  it('should derive correct BYRON_ICARUS seed', () => {
    const seed = CardanoSeed.fromMnemonic(englishPhrase);
    expect(seed).toBe(expectedByronIcarus);
  });

  it('should derive correct BYRON_LEDGER seed (no passphrase)', () => {
    const vec = seedVectors.Cardano['12']['byron-ledger']['english'];
    const seed = CardanoSeed.fromMnemonic(
      vec.mnemonic, { cardanoType: Cardano.TYPES.BYRON_LEDGER }
    );
    expect(seed).toBe(vec['non-passphrase-seed']);
  });

  it('should derive correct BYRON_LEGACY seed', () => {
     const vec = seedVectors.Cardano['12']['byron-legacy']['czech'];
     const seed = CardanoSeed.fromMnemonic(
       vec.mnemonic, { cardanoType: Cardano.TYPES.BYRON_LEGACY }
     );
     expect(seed).toBe(vec['non-passphrase-seed']);
   });



  it('should derive correct SHELLEY_ICARUS seed (alias of BYRON_ICARUS)', () => {
    const seed = CardanoSeed.fromMnemonic(
      englishPhrase, { cardanoType: Cardano.TYPES.SHELLEY_ICARUS }
    );
    expect(seed).toBe(expectedByronIcarus);
  });

  it('should derive correct SHELLEY_LEDGER seed (alias of BYRON_LEDGER)', () => {
    const vec = seedVectors.Cardano['12']['byron-ledger']['english'];
    const seed = CardanoSeed.fromMnemonic(
      vec.mnemonic, { cardanoType: Cardano.TYPES.SHELLEY_LEDGER }
    );
    expect(seed).toBe(vec['non-passphrase-seed']);
  });

  it('should throw MnemonicError on invalid BIP39 mnemonic for BYRON_ICARUS', () => {
    expect(() =>
      CardanoSeed.fromMnemonic(
        'this is definitely not a valid BIP39 phrase', { cardanoType: Cardano.TYPES.BYRON_ICARUS }
      )
    ).toThrowError(MnemonicError);
  });

  it('should throw SeedError on invalid Cardano type', () => {
    expect(() =>
      CardanoSeed.fromMnemonic(
          englishPhrase, { cardanoType: 'not-a-type' }
      )
    ).toThrowError(SeedError);
  });

  it('should throw SeedError in constructor when given invalid cardanoType option', () => {
    expect(
      () => new CardanoSeed(expectedByronIcarus, { cardanoType: 'foo' })
    ).toThrowError(SeedError);
  });

  it('should expose cardanoType() and seed() on the instance', () => {
    const seedStr = CardanoSeed.fromMnemonic(
      englishPhrase, { cardanoType: Cardano.TYPES.BYRON_LEDGER }
    );
    const inst = new CardanoSeed(seedStr, { cardanoType: Cardano.TYPES.BYRON_LEDGER });
    expect(inst.getSeed()).toBe(seedStr);
    expect(inst.getCardanoType()).toBe(Cardano.TYPES.BYRON_LEDGER);
  });

  it('should accept an Mnemonic stub', () => {
    const stub = { getMnemonic: () => englishPhrase } as unknown as Mnemonic;
    const seed = CardanoSeed.fromMnemonic(stub);
    expect(seed).toBe(expectedByronIcarus);
    expect(Cardano.TYPES.isCardanoType('byron-legacy')).toBe(true)
    expect(Cardano.TYPES.isCardanoType('byron-leg')).toBe(false)
  });
});
