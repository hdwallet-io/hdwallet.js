// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { HDS } from '../../../src/hds';
import { BIP39Seed } from '../../../src/seeds';

const rawVectors = require('../../data/json/hdwallet.json') as any;

describe("BIP44.fromSeed", () => {
  it("compressed", () => {
    const compressed = rawVectors.BIP44['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);
    const DerivationClass = DERIVATIONS.getDerivationClass(rawVectors.BIP44.derivation.name);

    const derivation = new DerivationClass({
      coinType: rawVectors.BIP44.derivation.args['coin-type'],
      account: rawVectors.BIP44.derivation.args['account'],
      change: rawVectors.BIP44.derivation.args['change'] as any,
      address: rawVectors.BIP44.derivation.args['address']
    });

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      language: compressed['language'].toLowerCase(),
      publicKeyType: compressed['public-key-type']
    })
      .fromSeed(new BIP39Seed(compressed['seed']))
      .fromDerivation(derivation);

    const full = { ...compressed };
    full['entropy'] = null;
    full['strength'] = null;
    full['mnemonic'] = null;
    full['passphrase'] = null;
    full['language'] = null;

    expect(hdwallet.getDumps()).toEqual(full);

    const dump = { ...full };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...compressed['derivations'][compressed['derivations'].length - 1] };
    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(full['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(full['symbol']);
    expect(hdwallet.getNetwork()).toBe(full['network']);
    expect(hdwallet.getCoinType()).toBe(full['coin-type']);
    expect(hdwallet.getEntropy()).toBe(full['entropy']);
    expect(hdwallet.getStrength()).toBe(full['strength']);
    expect(hdwallet.getMnemonic()).toBe(full['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(full['language']);
    expect(hdwallet.getSeed()).toBe(full['seed']);
    expect(hdwallet.getECC()).toBe(full['ecc']);
    expect(hdwallet.getHD()).toBe(full['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(full['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(full['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(full['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(full['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(full['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(full['root-public-key']);
    expect(hdwallet.getStrict()).toBe(full['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(full['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(full['wif-type']);

    const last = compressed['derivations'][compressed['derivations'].length - 1];

    expect(hdwallet.getXPrivateKey()).toBe(last['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getWIF()).toBe(last['wif']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);

    expect(hdwallet.getAddress({
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(last['address']);
  });

  it("uncompressed", () => {
    const uncompressed = rawVectors.BIP44['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);
    const DerivationClass = DERIVATIONS.getDerivationClass(rawVectors.BIP44.derivation.name);

    const derivation = new DerivationClass({
      coinType: rawVectors.BIP44.derivation.args['coin-type'],
      account: rawVectors.BIP44.derivation.args['account'],
      change: rawVectors.BIP44.derivation.args['change'] as any,
      address: rawVectors.BIP44.derivation.args['address']
    });

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      language: uncompressed['language'].toLowerCase(),
      publicKeyType: uncompressed['public-key-type']
    })
      .fromSeed(new BIP39Seed(uncompressed['seed']))
      .fromDerivation(derivation);

    const full = { ...uncompressed };
    full['entropy'] = null;
    full['strength'] = null;
    full['mnemonic'] = null;
    full['passphrase'] = null;
    full['language'] = null;

    expect(hdwallet.getDumps()).toEqual(full);

    const dump = { ...full };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...uncompressed['derivations'][uncompressed['derivations'].length - 1] };
    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(full['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(full['symbol']);
    expect(hdwallet.getNetwork()).toBe(full['network']);
    expect(hdwallet.getCoinType()).toBe(full['coin-type']);
    expect(hdwallet.getEntropy()).toBe(full['entropy']);
    expect(hdwallet.getStrength()).toBe(full['strength']);
    expect(hdwallet.getMnemonic()).toBe(full['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(full['language']);
    expect(hdwallet.getSeed()).toBe(full['seed']);
    expect(hdwallet.getECC()).toBe(full['ecc']);
    expect(hdwallet.getHD()).toBe(full['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(full['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(full['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(full['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(full['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(full['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(full['root-public-key']);
    expect(hdwallet.getStrict()).toBe(full['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(full['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(full['wif-type']);

    const last = uncompressed['derivations'][uncompressed['derivations'].length - 1];

    expect(hdwallet.getXPrivateKey()).toBe(last['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getWIF()).toBe(last['wif']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);

    expect(hdwallet.getAddress({
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(last['address']);
  });
});
