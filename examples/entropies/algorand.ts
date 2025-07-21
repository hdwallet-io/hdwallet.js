// SPDX-License-Identifier: MIT

import {
  ENTROPIES, Entropy, AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS
} from '../../src/entropies';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'Algorand',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  strength: ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
}

const AlgorandEntropyClass: typeof Entropy = ENTROPIES.getEntropyClass(data.name);

const algorandEntropyClass = new AlgorandEntropyClass(data.entropy);
const algorandEntropy = new AlgorandEntropy(data.entropy);

console.log(
  isAllEqual(algorandEntropyClass.getStrength(), algorandEntropy.getStrength(), data.strength),
  isAllEqual(algorandEntropyClass.getEntropy(), algorandEntropy.getEntropy(), data.entropy),
  isAllEqual(AlgorandEntropyClass.isValidStrength(data.strength), AlgorandEntropy.isValidStrength(data.strength)),
  isAllEqual(AlgorandEntropyClass.isValid(data.entropy), AlgorandEntropy.isValid(data.entropy)),
  isAllEqual(
    AlgorandEntropyClass.generate(data.strength).length,
    AlgorandEntropy.generate(data.strength).length
  ), '\n'
);

console.log('Client:', data.name);
console.log('Entropy:', data.entropy);
console.log('Strength:', data.strength);
