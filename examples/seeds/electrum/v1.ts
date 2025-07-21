// SPDX-License-Identifier: MIT

import { SEEDS, Seed, ElectrumV1Seed } from '../../../src/seeds';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V1',
  mnemonic: 'like like like like like like like like like like like like',
  seed: '7c2548ab89ffea8a6579931611969ffc0ed580ccf6048d4230762b981195abe5'
}

const ElectrumV1SeedClass: typeof Seed = SEEDS.getSeedClass(data.name);

const electrumV1SeedClass = new ElectrumV1SeedClass(data.seed);
const electrumV1Seed = new ElectrumV1Seed(data.seed);

console.log(
  isAllEqual(
    electrumV1SeedClass.getSeed(),
    electrumV1Seed.getSeed(),
    ElectrumV1SeedClass.fromMnemonic(data.mnemonic),
    ElectrumV1Seed.fromMnemonic(data.mnemonic),
    data.seed
  ), '\n'
);

console.log('Client:', data.name);
console.log('Mnemonic:', data.mnemonic);
console.log('Seed:', data.seed);
