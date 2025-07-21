// SPDX-License-Identifier: MIT

import {
  MNEMONICS, Mnemonic, ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_LANGUAGES, ELECTRUM_V1_MNEMONIC_WORDS
} from '../../../src/mnemonics';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V1',
  entropy: '6304c6da30c9509955cad59983fa8c1e',
  mnemonic: 'bomb physical final feed usually eat mutter stick group shoulder soothe knee',
  language: ELECTRUM_V1_MNEMONIC_LANGUAGES.ENGLISH,
  words: ELECTRUM_V1_MNEMONIC_WORDS.TWELVE
}

const ElectrumV1MnemonicClass: typeof Mnemonic = MNEMONICS.getMnemonicClass(data.name);

const electrumV1MnemonicClass = new ElectrumV1MnemonicClass(data.mnemonic);
const electrumV1Mnemonic = new ElectrumV1Mnemonic(data.mnemonic);

console.log(
  isAllEqual(
    electrumV1MnemonicClass.getMnemonic(),
    electrumV1Mnemonic.getMnemonic(),
    ElectrumV1MnemonicClass.fromEntropy(data.entropy, data.language),
    ElectrumV1Mnemonic.fromEntropy(data.entropy, data.language),
    data.mnemonic
  ),
  isAllEqual(
    electrumV1MnemonicClass.getLanguage(),
    electrumV1Mnemonic.getLanguage(),
    data.language),
  isAllEqual(
    electrumV1MnemonicClass.getWords(),
    electrumV1Mnemonic.getWords(),
    data.words
  ),
  isAllEqual(ElectrumV1MnemonicClass.isValid(data.mnemonic), ElectrumV1Mnemonic.isValid(data.mnemonic)),
  isAllEqual(ElectrumV1MnemonicClass.isValidLanguage(data.language), ElectrumV1Mnemonic.isValidLanguage(data.language)),
  isAllEqual(ElectrumV1MnemonicClass.isValidWords(data.words), ElectrumV1Mnemonic.isValidWords(data.words)),
  isAllEqual(
    ElectrumV1MnemonicClass.fromWords(data.words, data.language).split(' ').length,
    ElectrumV1Mnemonic.fromWords(data.words, data.language).split(' ').length
  ), '\n'
);

console.log('Client:', data.mnemonic);
console.log('Mnemonic:', data.mnemonic);
console.log('Language:', data.language);
console.log('Words:', data.words);
