// SPDX-License-Identifier: MIT

import {
  ENTROPIES, Entropy, ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS
} from '../../../src/entropies';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V1',
  entropy: '129d9b32df4e382c7abb0d059d83b537',
  strength: ELECTRUM_V1_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
}

const ElectrumV1EntropyClass: typeof Entropy = ENTROPIES.getEntropyClass(data.name);

const electrumV1EntropyClass = new ElectrumV1EntropyClass(data.entropy);
const electrumV1Entropy = new ElectrumV1Entropy(data.entropy);

console.log(
  isAllEqual(electrumV1EntropyClass.getStrength(), electrumV1Entropy.getStrength(), data.strength),
  isAllEqual(electrumV1EntropyClass.getEntropy(), electrumV1Entropy.getEntropy(), data.entropy),
  isAllEqual(ElectrumV1EntropyClass.isValidStrength(data.strength), ElectrumV1Entropy.isValidStrength(data.strength)),
  isAllEqual(ElectrumV1EntropyClass.isValid(data.entropy), ElectrumV1Entropy.isValid(data.entropy)),
  isAllEqual(
    ElectrumV1EntropyClass.generate(data.strength).length,
    ElectrumV1Entropy.generate(data.strength).length
  ),'\n'
);

console.log('Client:', data.name);
console.log('Entropy:', data.entropy);
console.log('Strength:', data.strength);
