// SPDX-License-Identifier: MIT

import {
  ENTROPIES, Entropy, BIP39Entropy, BIP39_ENTROPY_STRENGTHS
} from '../../src/entropies';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'BIP39',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  strength: BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
}

const BIP39EntropyClass: typeof Entropy = ENTROPIES.getEntropyClass(data.name);

const bip39EntropyClass = new BIP39EntropyClass(data.entropy);
const bip39Entropy = new BIP39Entropy(data.entropy);

console.log(
  isAllEqual(bip39EntropyClass.getStrength(), bip39Entropy.getStrength(), data.strength),
  isAllEqual(bip39EntropyClass.getEntropy(), bip39Entropy.getEntropy(), data.entropy),
  isAllEqual(BIP39EntropyClass.isValidStrength(data.strength), BIP39Entropy.isValidStrength(data.strength)),
  isAllEqual(BIP39EntropyClass.isValid(data.entropy), BIP39Entropy.isValid(data.entropy)),
  isAllEqual(
    BIP39EntropyClass.generate(data.strength).length,
    BIP39Entropy.generate(data.strength).length
  ),'\n'
);

console.log('Client:', data.name);
console.log('Entropy:', data.entropy);
console.log('Strength:', data.strength);
