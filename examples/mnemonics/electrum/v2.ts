// SPDX-License-Identifier: MIT

import {
  MNEMONICS, Mnemonic, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_TYPES
} from '../../../src/mnemonics';
import { isAllEqual } from '../../../src/utils';

const data = {
  name: 'Electrum-V2',
  entropy: 'ccc4c46b09115cf2ae02d6301cf2291374908fd14aaed8f5feac21953f669dbe6c',
  language: ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH,
  words: ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR,
  mnemonics: [
    {
      mnemonic: 'carpet jacket rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    },
    {
      mnemonic: 'spring ivory rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT
    },
    {
      mnemonic: 'zoo ivory rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD_2FA
    },
    {
      mnemonic: 'crawl jacket rebuild fault drip prison quiz suggest fiction early elevator empower cheap medal travel copy food retreat junk beyond banana bracket change smoke',
      mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT_2FA
    }
  ]
}

const ElectrumV2MnemonicClass: typeof Mnemonic = MNEMONICS.getMnemonicClass(data.name);

for (const mnemonic of data.mnemonics) {

  const electrumV2MnemonicClass = new ElectrumV2MnemonicClass(mnemonic.mnemonic, { mnemonicType: mnemonic.mnemonicType });
  const electrumV2Mnemonic = new ElectrumV2Mnemonic(mnemonic.mnemonic, { mnemonicType: mnemonic.mnemonicType });

  console.log(
    isAllEqual(
      electrumV2MnemonicClass.getMnemonic(),
      electrumV2Mnemonic.getMnemonic(),
      ElectrumV2MnemonicClass.fromEntropy(data.entropy, data.language, { mnemonicType: mnemonic.mnemonicType }),
      ElectrumV2Mnemonic.fromEntropy(data.entropy, data.language, { mnemonicType: mnemonic.mnemonicType }),
      mnemonic.mnemonic
    ),
    isAllEqual(
      electrumV2MnemonicClass.getLanguage(),
      electrumV2Mnemonic.getLanguage(),
      data.language),
    isAllEqual(
      electrumV2MnemonicClass.getWords(),
      electrumV2Mnemonic.getWords(),
      data.words
    ),
    isAllEqual(
      electrumV2MnemonicClass.getMnemonicType(),
      electrumV2Mnemonic.getMnemonicType(),
      mnemonic.mnemonicType
    ),
    isAllEqual(
      ElectrumV2MnemonicClass.isValid(mnemonic.mnemonic, { mnemonicType: mnemonic.mnemonicType }),
      ElectrumV2Mnemonic.isValid(mnemonic.mnemonic, { mnemonicType: mnemonic.mnemonicType })
    ),
    isAllEqual(ElectrumV2MnemonicClass.isValidLanguage(data.language), ElectrumV2Mnemonic.isValidLanguage(data.language)),
    isAllEqual(ElectrumV2MnemonicClass.isValidWords(data.words), ElectrumV2Mnemonic.isValidWords(data.words)),
    isAllEqual(
      ElectrumV2MnemonicClass.fromWords(data.words, data.language).split(' ').length,
      ElectrumV2Mnemonic.fromWords(data.words, data.language).split(' ').length
    ), '\n'
  );

  console.log('Client:', data.name);
  console.log('Mnemonic:', mnemonic.mnemonic);
  console.log('Language:', data.language);
  console.log('Words:', data.words);
  console.log('Mnemonic Type:', mnemonic.mnemonicType, '\n');
}
