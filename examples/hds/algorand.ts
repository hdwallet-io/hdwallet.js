// SPDX-License-Identifier: MIT

import { AlgorandHD } from '../../src/hds';
import { Algorand as Cryptocurrency } from '../../src/cryptocurrencies';
import { BIP44Derivation, CHANGES } from '../../src/derivations';

const algorandHD: AlgorandHD = new AlgorandHD();

const seed = '3be138b36c013fc797d9a897dfeb57c82bfa43f32509753140d851bc88be0fbe5a0abe984e0ca0678749952a1b1f99853ce30b0c388a4da38e2a65c5d1f23e9b';
const xPrivateKey = 'xprv9s21ZrQH143K4L18AD5Ko2ELW8bqaGLW4vfASZzo9yEN8fkZPZLdECXWXAMovtonu7DdEFwJuYH31QT96FWJUfkiLUVT8t8e3WNDiwZkuLJ';
const xPublicKey = 'xpub661MyMwAqRbcGp5bGEcLAAB54ASKyj4MS9amExQQiJmM1U5hw6esmzqzNQtquzBRNvLWtPC2kRu2kZR888FSAiZRpvKdjgbmoKRCgGM1YEy';
const privateKey = '7f60ec0fa89064a37e208ade560c098586dd887e2133bee4564af1de52bc7f5c';
const wif = 'L1VKQooPmgVLD35vHMeprus1zFYx58bHGMfTz8QYTEnRCzbjwMoo';
const publicKey = '023e23967b818fb3959f2056b6e6449a65c4982c1267398d8897b921ab53b0be4b';

algorandHD.fromSeed(seed);
// algorandHD.fromXPrivateKey(xPrivateKey);
// algorandHD.fromXPublicKey(xPublicKey);

console.log('Seed:', algorandHD.getSeed());
console.log('Strict:', algorandHD.getStrict());
console.log('Root XPrivate Key:', algorandHD.getRootXPrivateKey());
console.log('Root XPublic Key:', algorandHD.getRootXPublicKey());
console.log('Root Private Key:', algorandHD.getRootPrivateKey());
console.log('Root Chain Code:', algorandHD.getRootChainCode());
console.log('Root Public Key:', algorandHD.getRootPublicKey());

const bip44Derivation: BIP44Derivation = new BIP44Derivation({
  coinType: Cryptocurrency.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
});

algorandHD.fromDerivation(bip44Derivation);

// algorandHD.fromPrivateKey(privateKey);
// algorandHD.fromWIF(wif);
// algorandHD.fromPublicKey(publicKey);

console.log('XPrivate Key:', algorandHD.getXPrivateKey());
console.log('XPublic Key:', algorandHD.getXPublicKey());
console.log('Private Key:', algorandHD.getPrivateKey());
console.log('Chain Code:', algorandHD.getChainCode());
console.log('Public Key:', algorandHD.getPublicKey());
console.log('Hash:', algorandHD.getHash());
console.log('Fingerprint:', algorandHD.getFingerprint());
console.log('Parent Fingerprint:', algorandHD.getParentFingerprint());
console.log('Depth:', algorandHD.getDepth());
console.log('Path:', algorandHD.getPath());
console.log('Index:', algorandHD.getIndex());
console.log('Indexes:', algorandHD.getIndexes());
console.log('getStrict:', algorandHD.getStrict());
console.log('Address:', algorandHD.getAddress());
