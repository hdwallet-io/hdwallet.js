// SPDX-License-Identifier: MIT

import { SEEDS, Seed, ElectrumV2Seed } from '../../../src/seeds';
import { ELECTRUM_V2_MNEMONIC_TYPES } from '../../../src/mnemonics';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V2',
  seeds: [
    {
      mnemonic: 'carpet jacket rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      seed: '22e0c334cf22eb3c8a93ade2e0d1c43aa979a4426212e6c4099ff4d49434a0c6eecfd1437a79e11ad08605acc94f0255bd77a0728ed9693ab549c385fe610300',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    },
    {
      mnemonic: 'spring ivory rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      seed: 'cf9d920a1e95f1304ff77d50a15bc06e17eead71947d766780ce9a9ad4efb286e64481542f080c5901a4b3487793a252c5354ab7e6576301a5a08c5b9d771f8a',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT
    },
    {
      mnemonic: 'zoo ivory rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      seed: '4998375473862dcaf5520afc743980952784ef03d9d1fcec64cb39c25ab38a42c30d6712665408014b5d241abc20b506f1a38bf2adadafedabd97968e3fd8377',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD_2FA
    },
    {
      mnemonic: 'crawl jacket rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      seed: '6abf80ccfa5b8333c0add7d60f53eb0b8c367b09e0693e832c059cc20fe6b1a25d893466255c07241d967ddf2f98fbcd2a838ab3e00073935e8c4714d74caf80',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT_2FA
    }
  ]
}

const ElectrumV2SeedClass: typeof Seed = SEEDS.getSeedClass(data.name);

for (const seed of data.seeds) {

  const electrumV2SeedClass = new ElectrumV2SeedClass(seed.seed);
  const electrumV2Seed = new ElectrumV2Seed(seed.seed);

  console.log(
    isAllEqual(
      electrumV2SeedClass.getSeed(),
      electrumV2Seed.getSeed(),
      ElectrumV2SeedClass.fromMnemonic(seed.mnemonic, { mnemonicType: seed.mnemonicType }),
      ElectrumV2Seed.fromMnemonic(seed.mnemonic, { mnemonicType: seed.mnemonicType }),
      seed.seed
    ), '\n'
  );

  console.log('Client:', data.name);
  console.log('Mnemonic:', seed.mnemonic);
  console.log('Seed:', seed.seed);
  console.log('Mnemonic Type:', seed.mnemonicType, '\n');
}
