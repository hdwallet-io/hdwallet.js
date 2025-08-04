// SPDX-License-Identifier: MIT

import { BIP32HD } from '../../src/hds';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';
import { CustomDerivation } from '../../src/derivations';
import { PUBLIC_KEY_TYPES } from '../../src/consts';

const bip32HD: BIP32HD = new BIP32HD({
  ecc: Cryptocurrency.ECC,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
  wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
});

const seed = '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4';
const xPrivateKey = 'xprv9s21ZrQH143K4L18AD5Ko2ELW8bqaGLW4vfASZzo9yEN8fkZPZLdECXWXAMovtonu7DdEFwJuYH31QT96FWJUfkiLUVT8t8e3WNDiwZkuLJ';
const xPublicKey = 'xpub661MyMwAqRbcGp5bGEcLAAB54ASKyj4MS9amExQQiJmM1U5hw6esmzqzNQtquzBRNvLWtPC2kRu2kZR888FSAiZRpvKdjgbmoKRCgGM1YEy';
const privateKey = '7f60ec0fa89064a37e208ade560c098586dd887e2133bee4564af1de52bc7f5c';
const wif = 'L1VKQooPmgVLD35vHMeprus1zFYx58bHGMfTz8QYTEnRCzbjwMoo';
const publicKey = '023e23967b818fb3959f2056b6e6449a65c4982c1267398d8897b921ab53b0be4b';

bip32HD.fromSeed(seed);
// bip32HD.fromXPrivateKey(xPrivateKey);
// bip32HD.fromXPublicKey(xPublicKey);

console.log('Seed:', bip32HD.getSeed());
console.log('Strict:', bip32HD.getStrict());
console.log('Root XPrivate Key:', bip32HD.getRootXPrivateKey());
console.log('Root XPublic Key:', bip32HD.getRootXPublicKey());
console.log('Root Private Key:', bip32HD.getRootPrivateKey());
console.log('Root WIF:', bip32HD.getRootWIF());
console.log('Root Chain Code:', bip32HD.getRootChainCode());
console.log('Root Public Key:', bip32HD.getRootPublicKey());

const customDerivation: CustomDerivation = new CustomDerivation({
  path: `m/0'/0`
});

bip32HD.fromDerivation(customDerivation);

// bip32HD.fromPrivateKey(privateKey);
// bip32HD.fromWIF(wif);
// bip32HD.fromPublicKey(publicKey);

console.log('XPrivate Key:', bip32HD.getXPrivateKey());
console.log('XPublic Key:', bip32HD.getXPublicKey());
console.log('Private Key:', bip32HD.getPrivateKey());
console.log('WIF:', bip32HD.getWIF());
console.log('WIF Type:', bip32HD.getWIFType());
console.log('Chain Code:', bip32HD.getChainCode());
console.log('Public Key:', bip32HD.getPublicKey());
console.log('Public Key Type:', bip32HD.getPublicKeyType());
console.log('Compressed:', bip32HD.getCompressed());
console.log('Uncompressed:', bip32HD.getUncompressed());
console.log('Hash:', bip32HD.getHash());
console.log('Fingerprint:', bip32HD.getFingerprint());
console.log('Parent Fingerprint:', bip32HD.getParentFingerprint());
console.log('Depth:', bip32HD.getDepth());
console.log('Path:', bip32HD.getPath());
console.log('Index:', bip32HD.getIndex());
console.log('Indexes:', bip32HD.getIndexes());
console.log('Address:', bip32HD.getAddress({
  address: Cryptocurrency.ADDRESSES.P2TR
}));
