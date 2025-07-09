// SPDX-License-Identifier: MIT

import { BIP141HD } from '../../src/hds';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';
import { CustomDerivation } from '../../src/derivations';
import { PUBLIC_KEY_TYPES, SEMANTICS } from '../../src/consts';

const bip141HD: BIP141HD = new BIP141HD({
  ecc: Cryptocurrency.ECC,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
  wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
  semantic: SEMANTICS.P2WSH_IN_P2SH
});

// bip141HD.fromSemantic(SEMANTICS.P2WSH_IN_P2SH)

const seed = '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4';
const xPrivateKey = 'xprv9s21ZrQH143K4L18AD5Ko2ELW8bqaGLW4vfASZzo9yEN8fkZPZLdECXWXAMovtonu7DdEFwJuYH31QT96FWJUfkiLUVT8t8e3WNDiwZkuLJ';
const xPublicKey = 'xpub661MyMwAqRbcGp5bGEcLAAB54ASKyj4MS9amExQQiJmM1U5hw6esmzqzNQtquzBRNvLWtPC2kRu2kZR888FSAiZRpvKdjgbmoKRCgGM1YEy';
const wif = 'L1VKQooPmgVLD35vHMeprus1zFYx58bHGMfTz8QYTEnRCzbjwMoo';
const privateKey = '7f60ec0fa89064a37e208ade560c098586dd887e2133bee4564af1de52bc7f5c';
const publicKey = '023e23967b818fb3959f2056b6e6449a65c4982c1267398d8897b921ab53b0be4b';

bip141HD.fromSeed(seed);
// bip141HD.fromXPrivateKey(xPrivateKey);
// bip141HD.fromXPublicKey(xPublicKey);

console.log('Semantic:', bip141HD.getSemantic());
console.log('Seed:', bip141HD.getSeed());
console.log('Strict:', bip141HD.getStrict());
console.log('Root XPrivate Key:', bip141HD.getRootXPrivateKey());
console.log('Root XPublic Key:', bip141HD.getRootXPublicKey());
console.log('Root Private Key:', bip141HD.getRootPrivateKey());
console.log('Root WIF:', bip141HD.getRootWIF());
console.log('Root Chain Code:', bip141HD.getRootChainCode());
console.log('Root Public Key:', bip141HD.getRootPublicKey());

const customDerivation: CustomDerivation = new CustomDerivation({
  path: "m/0'/0"
});

bip141HD.fromDerivation(customDerivation);

// bip141HD.fromPrivateKey(privateKey);
// bip141HD.fromWIF(wif);
// bip141HD.fromPublicKey(publicKey);

console.log('XPrivate Key:', bip141HD.getXPrivateKey());
console.log('XPublic Key:', bip141HD.getXPublicKey());
console.log('Private Key:', bip141HD.getPrivateKey());
console.log('WIF:', bip141HD.getWIF());
console.log('WIF Type:', bip141HD.getWIFType());
console.log('Chain Code:', bip141HD.getChainCode());
console.log('Public Key:', bip141HD.getPublicKey());
console.log('Public Key Type:', bip141HD.getPublicKeyType());
console.log('Compressed:', bip141HD.getCompressed());
console.log('Uncompressed:', bip141HD.getUncompressed());
console.log('Hash:', bip141HD.getHash());
console.log('Fingerprint:', bip141HD.getFingerprint());
console.log('Parent Fingerprint:', bip141HD.getParentFingerprint());
console.log('Depth:', bip141HD.getDepth());
console.log('Path:', bip141HD.getPath());
console.log('Index:', bip141HD.getIndex());
console.log('Indexes:', bip141HD.getIndexes());
console.log('Address:', bip141HD.getAddress());
