// SPDX-License-Identifier: MIT

import { HDWallet } from '@hdwallet/core';
import { BIP39Mnemonic } from '@hdwallet/core/mnemonics';
import { Cryptocurrency, Bitcoin, Ethereum, Solana } from '@hdwallet/core/cryptocurrencies';
import {
  Derivation, CustomDerivation, BIP44Derivation, BIP49Derivation, BIP84Derivation
} from '@hdwallet/core/derivations';
import { HD, BIP32HD, BIP44HD, BIP49HD, BIP84HD } from '@hdwallet/core/hds';
import { PUBLIC_KEY_TYPES } from '@hdwallet/core/consts';
import { encode } from '@hdwallet/core/libs/base58';
import { getBytes } from '@hdwallet/core/utils';

const mnemonic: BIP39Mnemonic = new BIP39Mnemonic(
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
)

const standards: any = {
  'solana': {
    'hd': BIP32HD,
    'derivation': new CustomDerivation({ path: Solana.DEFAULT_PATH })
  },
  'ethereum': {
    'hd': BIP44HD,
    'derivation': new BIP44Derivation({ coinType: Ethereum.COIN_TYPE })
  },
  'bitcoin': {
    'legacy': {
      'hd': BIP44HD,
      'derivation': new BIP44Derivation({ coinType: Bitcoin.COIN_TYPE })
    },
    'nested-segwit': {
      'hd': BIP49HD,
      'derivation': new BIP49Derivation({ coinType: Bitcoin.COIN_TYPE })
    },
    'native-segwit': {
      'hd': BIP84HD,
      'derivation': new BIP84Derivation({ coinType: Bitcoin.COIN_TYPE })
    }
  }
}

function generatePhantomHDWallet(cryptocurrency: typeof Cryptocurrency, hd: typeof HD, network: string, derivation: Derivation, options = { }): HDWallet {
  return new HDWallet(cryptocurrency, { hd: hd, network: network, ...options }).fromMnemonic(mnemonic).fromDerivation(derivation)
}

console.log('Mnemonic:', mnemonic.getMnemonic(), '\n')

const solanaHDWallet: HDWallet = generatePhantomHDWallet(
  Solana, standards['solana']['hd'], Solana.NETWORKS.MAINNET, standards['solana']['derivation']
)
console.log(`${solanaHDWallet.getCryptocurrency()} (${solanaHDWallet.getSymbol()}) wallet:`, JSON.stringify({
  path: solanaHDWallet.getPath(),
  base58: encode(getBytes(
      solanaHDWallet.getPrivateKey() + solanaHDWallet.getPublicKey().slice(2)
  )),
  privateKey: solanaHDWallet.getPrivateKey(),
  publicKey: solanaHDWallet.getPublicKey().slice(2),
  address: solanaHDWallet.getAddress()
}, null, 4))

const ethereumHDWallet: HDWallet = generatePhantomHDWallet(
  Ethereum, standards['ethereum']['hd'], Ethereum.NETWORKS.MAINNET, standards['ethereum']['derivation']
)
console.log(`${ethereumHDWallet.getCryptocurrency()} (${ethereumHDWallet.getSymbol()}) wallet:`, JSON.stringify({
  path: ethereumHDWallet.getPath(),
  privateKey: `0x${ethereumHDWallet.getPrivateKey()}`,
  publicKey: ethereumHDWallet.getPublicKey(),
  address: ethereumHDWallet.getAddress()
}, null, 4))

for (const addressType of ['legacy', 'nested-segwit', 'native-segwit']) {
  let bitcoinHDWallet: HDWallet = generatePhantomHDWallet(
    Bitcoin, standards['bitcoin'][addressType]['hd'], Bitcoin.NETWORKS.MAINNET, standards['bitcoin'][addressType]['derivation'], { publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED }
  )
  console.log(`${bitcoinHDWallet.getCryptocurrency()} (${bitcoinHDWallet.getSymbol()}) ${addressType} wallet:`, JSON.stringify({
    path: bitcoinHDWallet.getPath(),
    wif: bitcoinHDWallet.getWIF(),
    privateKey: bitcoinHDWallet.getPrivateKey(),
    publicKey: bitcoinHDWallet.getPublicKey(),
    address: bitcoinHDWallet.getAddress()
  }, null, 4))
}
