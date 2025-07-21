// SPDX-License-Identifier: MIT

import { HDWallet } from '@hdwallet/core';
import {
  BIP39Mnemonic, BIP39_MNEMONIC_LANGUAGES, BIP39_MNEMONIC_WORDS
} from '@hdwallet/core/mnemonics';
import { Ethereum as Cryptocurrency } from '@hdwallet/core/cryptocurrencies';
import { BIP44Derivation, CHANGES } from '@hdwallet/core/derivations';
import { BIP44HD } from '@hdwallet/core/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: BIP44HD,
    network: Cryptocurrency.NETWORKS.MAINNET,
    passphrase: null
  }
).fromMnemonic(
  new BIP39Mnemonic(
    BIP39Mnemonic.fromWords(
      BIP39_MNEMONIC_WORDS.TWELVE,
      BIP39_MNEMONIC_LANGUAGES.ENGLISH
    )
  )
).fromDerivation(
  new BIP44Derivation({
    coinType: Cryptocurrency.COIN_TYPE,
    account: 0,
    change: CHANGES.EXTERNAL_CHAIN,
    address: [0, 10]  // or '0-10'
  })
);

console.log('Mnemonic:', hdwallet.getMnemonic())
console.log('Base HD Path:  m/44\'/60\'/0\'/0/{address}', '\n')

for (const derivation of hdwallet.getDumps(['root', 'indexes'])) {
  console.log(`${derivation['at']['path']} ${derivation['address']} 0x${derivation['private-key']}`)
}
