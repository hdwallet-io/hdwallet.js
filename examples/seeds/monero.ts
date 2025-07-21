// SPDX-License-Identifier: MIT

import { SEEDS, Seed, MoneroSeed } from '../../src/seeds';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'Monero',
  mnemonic: 'abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey abbey',
  seed: '0000000000000000000000000000000000000000000000000000000000000000'
}

const MoneroSeedClass: typeof Seed = SEEDS.getSeedClass(data.name);

const moneroSeedClass = new MoneroSeedClass(data.seed);
const moneroSeed = new MoneroSeed(data.seed);

console.log(
  isAllEqual(
    moneroSeedClass.getSeed(),
    moneroSeed.getSeed(),
    MoneroSeedClass.fromMnemonic(data.mnemonic),
    MoneroSeed.fromMnemonic(data.mnemonic),
    data.seed
  ), '\n'
);

console.log('Client:', data.name);
console.log('Mnemonic:', data.mnemonic);
console.log('Seed:', data.seed);
