// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { Cardano as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CustomDerivation } from '../../../src/derivations';
import { CardanoHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: CardanoHD,
    cardanoType: Cryptocurrency.TYPES.BYRON_LEDGER  // Note: XPublic Key is not supported for BYRON_LEGACY
  }
).fromXPublicKey(
  'xpub661MyMwAqRbcEiUJew81QNEAr6jYLVSksDzdQUtWbSWLRdA8ouX1bqK1WxS4qdF4gu8VwSxDVX7n216daK1735md81Z1L7uFUAAT4eSN1xr', true
).fromDerivation(new CustomDerivation({
  path: 'm/0/0-2' // Note: Hardened (') is not allowed for XPublic Key
}));

// console.log(JSON.stringify(hdwallet.getDump(['indexes']), null, 4));
console.log(JSON.stringify(hdwallet.getDumps(['indexes']), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('ECC:', hdwallet.getECC());
// console.log('HD:', hdwallet.getHD());
// console.log('Cardano Type:', hdwallet.getCardanoType());
// console.log('Semantic:', hdwallet.getSemantic());
// console.log('Root XPublic Key:', hdwallet.getRootXPublicKey());
// console.log('Root Chain Code:', hdwallet.getRootChainCode());
// console.log('Root Public Key:', hdwallet.getRootPublicKey());
// console.log('Strict:', hdwallet.getStrict());
// console.log('Public Key Type:', hdwallet.getPublicKeyType());
// console.log('Path:', hdwallet.getPath());
// console.log('Depth:', hdwallet.getDepth());
// console.log('Indexes:', hdwallet.getIndexes());
// console.log('Index:', hdwallet.getIndex());
// console.log('XPublic Key:', hdwallet.getXPublicKey());
// console.log('Chain Code:', hdwallet.getChainCode());
// console.log('Public Key:', hdwallet.getPublicKey());
// console.log('Uncompressed:', hdwallet.getUncompressed());
// console.log('Compressed:', hdwallet.getCompressed());
// console.log('Hash:', hdwallet.getHash());
// console.log('Fingerprint:', hdwallet.getFingerprint());
// console.log('Parent Fingerprint:', hdwallet.getParentFingerprint());
// console.log('Address:', hdwallet.getAddress());
