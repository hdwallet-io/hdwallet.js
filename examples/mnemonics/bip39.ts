// SPDX-License-Identifier: MIT

import {
  MNEMONICS, Mnemonic, BIP39Mnemonic, BIP39_MNEMONIC_LANGUAGES, BIP39_MNEMONIC_WORDS
} from '../../src/mnemonics';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'BIP39',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  mnemonic: 'reopen absurd say vapor glimpse blind comfort virus dynamic repair chair memory repeat song uphold area tail sweet lazy motion law sadness excite spawn',
  language: BIP39_MNEMONIC_LANGUAGES.ENGLISH,
  words: BIP39_MNEMONIC_WORDS.TWENTY_FOUR
}

const BIP39MnemonicClass: typeof Mnemonic = MNEMONICS.getMnemonicClass(data.name);

const bip39MnemonicClass = new BIP39MnemonicClass(data.mnemonic);
const bip39Mnemonic = new BIP39Mnemonic(data.mnemonic);

console.log(
  isAllEqual(
    bip39MnemonicClass.getMnemonic(),
    bip39Mnemonic.getMnemonic(),
    BIP39MnemonicClass.fromEntropy(data.entropy, data.language),
    BIP39Mnemonic.fromEntropy(data.entropy, data.language),
    data.mnemonic
  ),
  isAllEqual(
    bip39MnemonicClass.getLanguage(),
    bip39Mnemonic.getLanguage(),
    data.language),
  isAllEqual(
    bip39MnemonicClass.getWords(),
    bip39Mnemonic.getWords(),
    data.words
  ),
  isAllEqual(BIP39MnemonicClass.isValid(data.mnemonic), BIP39Mnemonic.isValid(data.mnemonic)),
  isAllEqual(BIP39MnemonicClass.isValidLanguage(data.language), BIP39Mnemonic.isValidLanguage(data.language)),
  isAllEqual(BIP39MnemonicClass.isValidWords(data.words), BIP39Mnemonic.isValidWords(data.words)),
  isAllEqual(
    BIP39MnemonicClass.fromWords(data.words, data.language).split(' ').length,
    BIP39Mnemonic.fromWords(data.words, data.language).split(' ').length
  ), '\n'
);

console.log('Client:', data.name);
console.log('Mnemonic:', data.mnemonic);
console.log('Language:', data.language);
console.log('Words:', data.words);
