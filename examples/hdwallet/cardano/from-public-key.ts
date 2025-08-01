// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { Cardano as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CardanoHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: CardanoHD,
    cardanoType: Cryptocurrency.TYPES.SHELLEY_LEDGER,
    addressType: Cryptocurrency.ADDRESS_TYPES.PAYMENT,
    stakingPublicKey: '00f06973be3a2b8d74086283e18176b6b4b5bd28da78c264cd65ad146126f8240e',
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
// console.log('Cardano Type:', hdwallet.getCardanoType());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Address:', hdwallet.getAddress());
