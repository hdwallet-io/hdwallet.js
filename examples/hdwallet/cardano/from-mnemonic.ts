// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { BIP39Mnemonic, BIP39_MNEMONIC_LANGUAGES, MONERO_MNEMONIC_WORDS } from '../../../src/mnemonics';
import { Cardano as Cryptocurrency } from '../../../src/cryptocurrencies';
import { CIP1852Derivation, ROLES } from '../../../src/derivations';
import { CardanoHD } from '../../../src/hds';

const hdwallet: HDWallet = new HDWallet(
  Cryptocurrency, {
    hd: CardanoHD,
    cardanoType: Cryptocurrency.TYPES.SHELLEY_ICARUS,
    addressType: Cryptocurrency.ADDRESS_TYPES.STAKING,
    network: Cryptocurrency.NETWORKS.MAINNET,
    passphrase: null
  }
).fromMnemonic(new BIP39Mnemonic(
  BIP39Mnemonic.fromWords(
    MONERO_MNEMONIC_WORDS.TWELVE, BIP39_MNEMONIC_LANGUAGES.ITALIAN
  )
)).fromDerivation(new CIP1852Derivation({
  coinType: Cryptocurrency.COIN_TYPE,
  account: 0,
  role: ROLES.STAKING_KEY,
  address: 0
}));

console.log(JSON.stringify(hdwallet.getDump(['indexes']), null, 4));
// console.log(JSON.stringify(hdwallet.getDumps(['indexes']), null, 4));

// console.log('Cryptocurrency:', hdwallet.getCryptocurrency());
// console.log('Symbol:', hdwallet.getSymbol());
// console.log('Network:', hdwallet.getNetwork());
// console.log('Coin Type:', hdwallet.getCoinType());
// console.log('Entropy:', hdwallet.getEntropy());
// console.log('Strength:', hdwallet.getStrength());
// console.log('Mnemonic:', hdwallet.getMnemonic());
// console.log('Passphrase:', hdwallet.getPassphrase());
// console.log('Language:', hdwallet.getLanguage());
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
