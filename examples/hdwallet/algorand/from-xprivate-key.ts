// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { Algorand as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CustomDerivation } from '../../../src/derivations';
import { AlgorandHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: AlgorandHD
  }
).fromXPrivateKey(
  'xprv3QESAWYc9vDdZKQAwwfoRBaiWEiTMbMtfPuyREap66sm2yyrV5ipveHVwDccQejWaLqMqLxDYnuNssg4Mf19Mc7EtNuGqLxZPdkaCnR9YEqo3qJpsqBnRi3qkWdWmFZ6xbhNUk799jZqiBwW3ou7jcS', true
).fromDerivation(new CustomDerivation({
  path: "m/0'/0-2"
}));

// console.log(JSON.stringify(hdwallet.getDump(['indexes']), null, 4));
console.log(JSON.stringify(hdwallet.getDumps(['indexes']), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('ECC:', hdwallet.getECC());
// console.log('HD:', hdwallet.getHD());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Root XPrivate Key:', hdwallet.getRootXPrivateKey());
// console.log('Root XPublic Key:', hdwallet.getRootXPublicKey());
// console.log('Root Private Key:', hdwallet.getRootPrivateKey());
// console.log('Root Chain Code:', hdwallet.getRootChainCode());
// console.log('Root Public Key:', hdwallet.getRootPublicKey());
// console.log('Path Key:', hdwallet.getPathKey());
// console.log('Strict:', hdwallet.getStrict());
// console.log('Path:', hdwallet.getPath());
// console.log('Depth:', hdwallet.getDepth());
// console.log('Indexes:', hdwallet.getIndexes());
// console.log('Index:', hdwallet.getIndex());
// console.log('XPrivate Key:', hdwallet.getXPrivateKey());
// console.log('XPublic Key:', hdwallet.getXPublicKey());
// console.log('Private Key:', hdwallet.getPrivateKey());
// console.log('Chain Code:', hdwallet.getChainCode());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Parent Fingerprint:', hdwallet.getParentFingerprint());
// console.log('Address:', hdwallet.getAddress());
