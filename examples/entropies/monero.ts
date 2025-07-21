// SPDX-License-Identifier: MIT

import {
  ENTROPIES, Entropy, MoneroEntropy, MONERO_ENTROPY_STRENGTHS
} from '../../src/entropies';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'Monero',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  strength: MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
}

const MoneroEntropyClass: typeof Entropy = ENTROPIES.getEntropyClass(data.name);

const moneroEntropyClass = new MoneroEntropyClass(data.entropy);
const moneroEntropy = new MoneroEntropy(data.entropy);

console.log(
  isAllEqual(moneroEntropyClass.getStrength(), moneroEntropy.getStrength(), data.strength),
  isAllEqual(moneroEntropyClass.getEntropy(), moneroEntropy.getEntropy(), data.entropy),
  isAllEqual(MoneroEntropyClass.isValidStrength(data.strength), MoneroEntropy.isValidStrength(data.strength)),
  isAllEqual(MoneroEntropyClass.isValid(data.entropy), MoneroEntropy.isValid(data.entropy)),
  isAllEqual(
    MoneroEntropyClass.generate(data.strength).length,
    MoneroEntropy.generate(data.strength).length
  ),'\n'
);

console.log('Client:', data.name);
console.log('Entropy:', data.entropy);
console.log('Strength:', data.strength);
