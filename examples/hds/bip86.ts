// SPDX-License-Identifier: MIT

import { BIP86HD } from '../../src/hds';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';
import { BIP86Derivation, CHANGES } from '../../src/derivations';
import { PUBLIC_KEY_TYPES } from '../../src/consts';

const bip86HD: BIP86HD = new BIP86HD({
  ecc: Cryptocurrency.ECC,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
  wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
});

const seed = '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4';
const xPrivateKey = 'xprv9s21ZrQH143K4L18AD5Ko2ELW8bqaGLW4vfASZzo9yEN8fkZPZLdECXWXAMovtonu7DdEFwJuYH31QT96FWJUfkiLUVT8t8e3WNDiwZkuLJ';
const xPublicKey = 'xpub661MyMwAqRbcGp5bGEcLAAB54ASKyj4MS9amExQQiJmM1U5hw6esmzqzNQtquzBRNvLWtPC2kRu2kZR888FSAiZRpvKdjgbmoKRCgGM1YEy';
const wif = 'L1VKQooPmgVLD35vHMeprus1zFYx58bHGMfTz8QYTEnRCzbjwMoo';
const privateKey = '7f60ec0fa89064a37e208ade560c098586dd887e2133bee4564af1de52bc7f5c';
const publicKey = '023e23967b818fb3959f2056b6e6449a65c4982c1267398d8897b921ab53b0be4b';

bip86HD.fromSeed(seed);
// bip86HD.fromXPrivateKey(xPrivateKey);
// bip86HD.fromXPublicKey(xPublicKey);

console.log('Seed:', bip86HD.getSeed());
console.log('Strict:', bip86HD.getStrict());
console.log('Root XPrivate Key:', bip86HD.getRootXPrivateKey());
console.log('Root XPublic Key:', bip86HD.getRootXPublicKey());
console.log('Root Private Key:', bip86HD.getRootPrivateKey());
console.log('Root WIF:', bip86HD.getRootWIF());
console.log('Root Chain Code:', bip86HD.getRootChainCode());
console.log('Root Public Key:', bip86HD.getRootPublicKey());

// const bip86Derivation: BIP86Derivation = new BIP86Derivation({
//   coinType: Cryptocurrency.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
// });
//
// bip86HD.fromDerivation(bip86Derivation);

bip86HD.fromCoinType(Cryptocurrency.COIN_TYPE);
bip86HD.fromAccount(0);
bip86HD.fromChange(CHANGES.EXTERNAL_CHAIN);
bip86HD.fromAddress(0);

// bip86HD.fromPrivateKey(privateKey);
// bip86HD.fromWIF(wif);
// bip86HD.fromPublicKey(publicKey);

console.log('XPrivate Key:', bip86HD.getXPrivateKey());
console.log('XPublic Key:', bip86HD.getXPublicKey());
console.log('Private Key:', bip86HD.getPrivateKey());
console.log('WIF:', bip86HD.getWIF());
console.log('WIF Type:', bip86HD.getWIFType());
console.log('Chain Code:', bip86HD.getChainCode());
console.log('Public Key:', bip86HD.getPublicKey());
console.log('Public Key Type:', bip86HD.getPublicKeyType());
console.log('Compressed:', bip86HD.getCompressed());
console.log('Uncompressed:', bip86HD.getUncompressed());
console.log('Hash:', bip86HD.getHash());
console.log('Fingerprint:', bip86HD.getFingerprint());
console.log('Parent Fingerprint:', bip86HD.getParentFingerprint());
console.log('Depth:', bip86HD.getDepth());
console.log('Path:', bip86HD.getPath());
console.log('Index:', bip86HD.getIndex());
console.log('Indexes:', bip86HD.getIndexes());
console.log('Address:', bip86HD.getAddress());
