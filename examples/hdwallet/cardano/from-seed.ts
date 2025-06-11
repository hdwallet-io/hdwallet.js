// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CardanoSeed } from '../../../src/seeds';
import { Cardano as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CIP1852Derivation, ROLES } from '../../../src/derivations';
import { CardanoHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: CardanoHD,
    cardanoType: Cryptocurrency.TYPES.SHELLEY_ICARUS,
    addressType: Cryptocurrency.ADDRESS_TYPES.PAYMENT,
    stakingPublicKey: '00f06973be3a2b8d74086283e18176b6b4b5bd28da78c264cd65ad146126f8240e',
    network: Cryptocurrency.NETWORKS.MAINNET
  }
).fromSeed(new CardanoSeed(
  'fca87b68fdffa968895901c894f678f6'
)).fromDerivation(new CIP1852Derivation({
  coinType: Cryptocurrency.COIN_TYPE,
  account: 0,
  role: ROLES.EXTERNAL_CHAIN,
  address: [6, 8]
}));

// console.log(JSON.stringify(hdwallet.getDump(['indexes']), null, 4));
console.log(JSON.stringify(hdwallet.getDumps(['indexes']), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('Seed:', hdwallet.getSeed());
// console.log('ECC:', hdwallet.getECC());
// console.log('HD:', hdwallet.getHD());
// console.log('Cardano Type:', hdwallet.getCardanoType());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Root XPrivate Key:', hdwallet.getRootXPrivateKey());
// console.log('Root XPublic Key:', hdwallet.getRootXPublicKey());
// console.log('Root Private Key:', hdwallet.getRootPrivateKey());
// console.log('Root Chain Code:', hdwallet.getRootChainCode());
// console.log('Root Public Key:', hdwallet.getRootPublicKey());
// console.log('Strict:', hdwallet.getStrict());
// console.log('Public Key Type:', hdwallet.getPublicKeyType());
// console.log('Path:', hdwallet.getPath());
// console.log('Depth:', hdwallet.getDepth());
// console.log('Indexes:', hdwallet.getIndexes());
// console.log('Index:', hdwallet.getIndex());
// console.log('XPrivate Key:', hdwallet.getXPrivateKey());
// console.log('XPublic Key:', hdwallet.getXPublicKey());
// console.log('Private Key:', hdwallet.getPrivateKey());
// console.log('Chain Code:', hdwallet.getChainCode());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Uncompressed:', hdwallet.getUncompressed());
// console.log('Compressed:', hdwallet.getCompressed());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Parent Fingerprint:', hdwallet.getParentFingerprint());
// console.log('Address:', hdwallet.getAddress());
