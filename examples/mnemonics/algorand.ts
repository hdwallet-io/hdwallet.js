// SPDX-License-Identifier: MIT

import {
  MNEMONICS, Mnemonic, AlgorandMnemonic, ALGORAND_MNEMONIC_LANGUAGES, ALGORAND_MNEMONIC_WORDS
} from '../../src/mnemonics';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'Algorand',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  mnemonic: 'bitter maze legend hurdle grace slim labor pig silk drive slogan reform street travel long follow knife step lake lady salad ten repair absent sunny',
  language: ALGORAND_MNEMONIC_LANGUAGES.ENGLISH,
  words: ALGORAND_MNEMONIC_WORDS.TWENTY_FIVE
}

const AlgorandMnemonicClass: typeof Mnemonic = MNEMONICS.getMnemonicClass(data.name);

const algorandMnemonicClass = new AlgorandMnemonicClass(data.mnemonic);
const algorandMnemonic = new AlgorandMnemonic(data.mnemonic);

console.log(
  isAllEqual(
    algorandMnemonicClass.getMnemonic(),
    algorandMnemonic.getMnemonic(),
    AlgorandMnemonicClass.fromEntropy(data.entropy, data.language),
    AlgorandMnemonic.fromEntropy(data.entropy, data.language),
    data.mnemonic
  ),
  isAllEqual(
    algorandMnemonicClass.getLanguage(),
    algorandMnemonic.getLanguage(),
    data.language),
  isAllEqual(
    algorandMnemonicClass.getWords(),
    algorandMnemonic.getWords(),
    data.words
  ),
  isAllEqual(AlgorandMnemonicClass.isValid(data.mnemonic), AlgorandMnemonic.isValid(data.mnemonic)),
  isAllEqual(AlgorandMnemonicClass.isValidLanguage(data.language), AlgorandMnemonic.isValidLanguage(data.language)),
  isAllEqual(AlgorandMnemonicClass.isValidWords(data.words), AlgorandMnemonic.isValidWords(data.words)),
  isAllEqual(
    AlgorandMnemonicClass.fromWords(data.words, data.language).split(' ').length,
    AlgorandMnemonic.fromWords(data.words, data.language).split(' ').length
  ), '\n'
);

console.log('Client:', data.name);
console.log('Mnemonic:', data.mnemonic);
console.log('Language:', data.language);
console.log('Words:', data.words);
