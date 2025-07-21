// SPDX-License-Identifier: MIT

import {
  MNEMONICS, Mnemonic, MoneroMnemonic, MONERO_MNEMONIC_LANGUAGES, MONERO_MNEMONIC_WORDS
} from '../../src/mnemonics';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'Monero',
  entropy: 'b66022fff8b6322f8b8fa444d6d097457b6b9e7bb05add5b75f9c827df7bd3b6',
  language: MONERO_MNEMONIC_LANGUAGES.ENGLISH,
  mnemonics: [
    {
      mnemonic: 'spying stick spout gimmick tell agony suffice idiom poetry dunes tavern bimonthly fuming seismic eldest wizard utmost fall tanks fitting judge jagged nurse foiled',
      words: MONERO_MNEMONIC_WORDS.TWENTY_FOUR,
      checksum: false
    },
    {
      mnemonic: 'spying stick spout gimmick tell agony suffice idiom poetry dunes tavern bimonthly fuming seismic eldest wizard utmost fall tanks fitting judge jagged nurse foiled poetry',
      words: MONERO_MNEMONIC_WORDS.TWENTY_FIVE,
      checksum: true
    }
  ]
}

const MoneroMnemonicClass: typeof Mnemonic = MNEMONICS.getMnemonicClass(data.name);

for (const mnemonic of data.mnemonics) {

  const moneroMnemonicClass = new MoneroMnemonicClass(mnemonic.mnemonic);
  const moneroMnemonic = new MoneroMnemonic(mnemonic.mnemonic);

  console.log(
    isAllEqual(
      moneroMnemonicClass.getMnemonic(),
      moneroMnemonic.getMnemonic(),
      MoneroMnemonicClass.fromEntropy(data.entropy, data.language, { checksum: mnemonic.checksum }),
      MoneroMnemonic.fromEntropy(data.entropy, data.language, { checksum: mnemonic.checksum }),
      mnemonic.mnemonic
    ),
    isAllEqual(
      moneroMnemonicClass.getLanguage(),
      moneroMnemonic.getLanguage(),
      data.language),
    isAllEqual(
      moneroMnemonicClass.getWords(),
      moneroMnemonic.getWords(),
      mnemonic.words
    ),
    isAllEqual(
      MoneroMnemonicClass.isValid(mnemonic.mnemonic, { checksum: mnemonic.checksum }),
      MoneroMnemonic.isValid(mnemonic.mnemonic, { checksum: mnemonic.checksum })
    ),
    isAllEqual(MoneroMnemonicClass.isValidLanguage(data.language), MoneroMnemonic.isValidLanguage(data.language)),
    isAllEqual(MoneroMnemonicClass.isValidWords(mnemonic.words), MoneroMnemonic.isValidWords(mnemonic.words)),
    isAllEqual(
      MoneroMnemonicClass.fromWords(mnemonic.words, data.language).split(' ').length,
      MoneroMnemonic.fromWords(mnemonic.words, data.language).split(' ').length
    ), '\n'
  );

  console.log('Client:', data.name);
  console.log('Mnemonic:', mnemonic.mnemonic);
  console.log('Language:', data.language);
  console.log('Words:', mnemonic.words);
  console.log('Checksum:', mnemonic.checksum, '\n');
}
