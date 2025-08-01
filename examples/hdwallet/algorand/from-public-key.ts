// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { Algorand as Cryptocurrency } from '../../../src/cryptocurrencies';
import { AlgorandHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: AlgorandHD,
    network: Cryptocurrency.NETWORKS.TESTNET
  }
).fromPublicKey(
  '00c76d02311731bdca7afe7907f2f3b53383d43f278d8c22abb73c17d417d37cf1'
);

console.log(JSON.stringify(hdwallet.getDump(), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('ECC:', hdwallet.getECC());
// console.log('HD:', hdwallet.getHD());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Address:', hdwallet.getAddress());
