// SPDX-License-Identifier: MIT

import { SEEDS, Seed, CardanoSeed } from '../../src/seeds';
import { isAllEqual } from '../../src/utils';
import { Cardano } from '../../src/cryptocurrencies';

const data = {
  name: 'Cardano',
  mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  seeds: [
    {
      seed: '00000000000000000000000000000000',
      cardanoType: Cardano.TYPES.BYRON_ICARUS
    },
    {
      seed: '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
      cardanoType: Cardano.TYPES.BYRON_LEDGER
    },
    {
      seed: 'bc8279bcc79d3cd026cc662d94e88519a0a5e783cccfdb65b0717bc28164dc360777ef6b5eed44440ee892558f19d1b38f508a9851fac42b02d34e240cc61597',
      cardanoType: Cardano.TYPES.BYRON_LEDGER,
      passphrase: 'talonlab'
    },
    {
      seed: 'dfee64f10fd452c2882951ef64eeb43880aa4304fd11110a2f1b13913f258a9d',
      cardanoType: Cardano.TYPES.BYRON_LEGACY
    },
    {
      seed: '00000000000000000000000000000000',
      cardanoType: Cardano.TYPES.SHELLEY_ICARUS
    },
    {
      seed: '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
      cardanoType: Cardano.TYPES.SHELLEY_LEDGER
    },
    {
      seed: 'bc8279bcc79d3cd026cc662d94e88519a0a5e783cccfdb65b0717bc28164dc360777ef6b5eed44440ee892558f19d1b38f508a9851fac42b02d34e240cc61597',
      cardanoType: Cardano.TYPES.SHELLEY_LEDGER,
      passphrase: 'talonlab'
    },
  ]
}

const CardanoSeedClass: typeof Seed = SEEDS.getSeedClass(data.name);

for (const seed of data.seeds) {

  const cardanoSeedClass = new CardanoSeedClass(seed.seed);
  const cardanoSeed = new CardanoSeed(seed.seed);

  console.log(
    isAllEqual(
      cardanoSeedClass.getSeed(),
      cardanoSeed.getSeed(),
      CardanoSeedClass.fromMnemonic(data.mnemonic, {
        cardanoType: seed.cardanoType, passphrase: seed.passphrase ?? null
      }),
      CardanoSeed.fromMnemonic(data.mnemonic, {
        cardanoType: seed.cardanoType, passphrase: seed.passphrase ?? null
      }),
      seed.seed
    ), '\n'
  );

  console.log('Client:', data.name);
  console.log('Mnemonic:', data.mnemonic);
  console.log('Seed:', seed.seed);
  console.log('Cardano Type:', seed.cardanoType, '\n');
}
