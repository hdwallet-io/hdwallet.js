// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { Cardano as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CardanoHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: CardanoHD,
    cardanoType: Cryptocurrency.TYPES.SHELLEY_ICARUS,
    addressType: Cryptocurrency.ADDRESS_TYPES.STAKING,
    network: Cryptocurrency.NETWORKS.TESTNET
  }
).fromPrivateKey(
  'a00f697f4eeafd98efb151ea16bd84451a3071eae3427a47d67a3361608b0656724e9a307aab119a07d3175f2a8f61dfcdcfc7f0e2e3138282dca388ea58f3ff'
);

console.log(JSON.stringify(hdwallet.getDump(), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('ECC:', hdwallet.getECC());
// console.log('HD:', hdwallet.getHD());
// console.log('Cardano Type:', hdwallet.getCardanoType());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Private Key:', hdwallet.getPrivateKey());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Address:', hdwallet.getAddress());
