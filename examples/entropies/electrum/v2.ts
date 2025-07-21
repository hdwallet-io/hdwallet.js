// SPDX-License-Identifier: MIT

import {
  ENTROPIES, Entropy, ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS
} from '../../../src/entropies';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V2',
  entropy: 'eeeb82d2511334ec979c2b90bcf9803ead7cdd38d690bf8f3723013fa58d42fa44',
  strength: ELECTRUM_V2_ENTROPY_STRENGTHS.TWO_HUNDRED_SIXTY_FOUR
}

const ElectrumV2EntropyClass: typeof Entropy = ENTROPIES.getEntropyClass(data.name);

const electrumV2EntropyClass = new ElectrumV2EntropyClass(data.entropy);
const electrumV2Entropy = new ElectrumV2Entropy(data.entropy);

console.log(
  isAllEqual(electrumV2EntropyClass.getStrength(), electrumV2Entropy.getStrength(), data.strength),
  isAllEqual(electrumV2EntropyClass.getEntropy(), electrumV2Entropy.getEntropy(), data.entropy),
  isAllEqual(ElectrumV2EntropyClass.isValidStrength(data.strength), ElectrumV2Entropy.isValidStrength(data.strength)),
  isAllEqual(ElectrumV2EntropyClass.isValid(data.entropy), ElectrumV2Entropy.isValid(data.entropy)),
  isAllEqual(
    ElectrumV2EntropyClass.generate(data.strength).length,
    ElectrumV2Entropy.generate(data.strength).length
  ),'\n'
);

console.log('Client:', data.name);
console.log('Entropy:', data.entropy);
console.log('Strength:', data.strength);
