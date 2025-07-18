// SPDX-License-Identifier: MIT

import { HDWallet } from '../src';
import {
  BIP39Mnemonic, BIP39_MNEMONIC_LANGUAGES, BIP39_MNEMONIC_WORDS
} from '../src/mnemonics';
import { Ethereum as Cryptocurrency } from '../src/cryptocurrencies';
import { BIP44Derivation, CHANGES } from '../src/derivations';
import { BIP44HD } from '../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: BIP44HD,
    network: Cryptocurrency.NETWORKS.MAINNET,
    passphrase: null
  }
).fromMnemonic(
  new BIP39Mnemonic(
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
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
