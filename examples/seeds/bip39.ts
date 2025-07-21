// SPDX-License-Identifier: MIT

import { SEEDS, Seed, BIP39Seed } from '../../src/seeds';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'BIP39',
  mnemonic: '跡 靈 訟 勾 慌 吞 前 願 詩 奇 希 綱',
  seeds: [
    {
      seed: '95ec2455c470704c2a8081324dfecfea53fe4dabac114ad7958b1f4942cd83e10f5f8f1c43ad026a07f3142eeb29dcc72a3b08c6a964904852e6dd3d6945d3b5',
      passphrase: null
    },
    {
      seed: '55af5d879d868bdff000e9f9828ac5d5fa95af1552cd0366727acef1e195c870603a336ea3fd502ceb0013617a8fbb3ce99b5a8c0179ec70ce7cbe019245520e',
      passphrase: 'talonlab'
    }
  ]
}

const BIP39SeedClass: typeof Seed = SEEDS.getSeedClass(data.name);

for (const seed of data.seeds) {

  const bip39SeedClass = new BIP39SeedClass(seed.seed);
  const bip39Seed = new BIP39Seed(seed.seed);

  console.log(
    isAllEqual(
      bip39SeedClass.getSeed(),
      bip39Seed.getSeed(),
      BIP39SeedClass.fromMnemonic(data.mnemonic, { passphrase: seed.passphrase }),
      BIP39Seed.fromMnemonic(data.mnemonic, { passphrase: seed.passphrase }),
      seed.seed
    ), '\n'
  );

  console.log('Client:', data.name);
  console.log('Mnemonic:', data.mnemonic);
  console.log('Seed:', BIP39Seed.fromMnemonic(data.mnemonic, { passphrase: seed.passphrase }));
  console.log('Passphrase:', seed.passphrase, '\n');
}
