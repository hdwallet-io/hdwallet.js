// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("BIP84.fromWIF", () => {
  it("compressed", () => {
    const compressed = data.BIP84['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      publicKeyType: compressed['public-key-type']
    }).fromWIF(compressed['derivations'][compressed['derivations'].length - 1]['wif']);

    expect(hdwallet.getDumps()).toBeNull();

    const dump = { ...compressed };
    delete (dump as any)['derivations'];
    const last = compressed['derivations'][compressed['derivations'].length - 1];
    (dump as any)['derivation'] = { ...last };

    Object.assign(dump, {
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      ['root-xprivate-key']: null,
      ['root-xpublic-key']: null,
      ['root-private-key']: null,
      ['root-wif']: null,
      ['root-chain-code']: null,
      ['root-public-key']: null,
      strict: null
    });

    Object.assign(dump['derivation'], {
      ['xprivate-key']: null,
      ['xpublic-key']: null,
      ['chain-code']: null,
      ['parent-fingerprint']: null
    });

    delete (dump['derivation'] as any)['at'];

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBe(dump['entropy']);
    expect(hdwallet.getStrength()).toBe(dump['strength']);
    expect(hdwallet.getMnemonic()).toBe(dump['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(dump['language']);
    expect(hdwallet.getSeed()).toBe(dump['seed']);
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(dump['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(dump['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(dump['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(dump['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(dump['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(dump['root-public-key']);
    expect(hdwallet.getStrict()).toBe(dump['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getXPrivateKey()).toBe(dump['derivation']['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(dump['derivation']['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getChainCode()).toBe(dump['derivation']['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(dump['derivation']['parent-fingerprint']);

    expect(hdwallet.getAddress({
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(dump['derivation']['address']);
  });

  it("uncompressed", () => {
    const uncompressed = data.BIP84['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      publicKeyType: uncompressed['public-key-type']
    }).fromWIF(uncompressed['derivations'][uncompressed['derivations'].length - 1]['wif']);

    expect(hdwallet.getDumps()).toBeNull();

    const dump = { ...uncompressed };
    delete (dump as any)['derivations'];
    const last = uncompressed['derivations'][uncompressed['derivations'].length - 1];
    (dump as any)['derivation'] = { ...last };

    Object.assign(dump, {
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      ['root-xprivate-key']: null,
      ['root-xpublic-key']: null,
      ['root-private-key']: null,
      ['root-wif']: null,
      ['root-chain-code']: null,
      ['root-public-key']: null,
      strict: null
    });

    Object.assign(dump['derivation'], {
      ['xprivate-key']: null,
      ['xpublic-key']: null,
      ['chain-code']: null,
      ['parent-fingerprint']: null
    });

    delete (dump['derivation'] as any)['at'];

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBe(dump['entropy']);
    expect(hdwallet.getStrength()).toBe(dump['strength']);
    expect(hdwallet.getMnemonic()).toBe(dump['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(dump['language']);
    expect(hdwallet.getSeed()).toBe(dump['seed']);
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(dump['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(dump['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(dump['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(dump['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(dump['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(dump['root-public-key']);
    expect(hdwallet.getStrict()).toBe(dump['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getXPrivateKey()).toBe(dump['derivation']['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(dump['derivation']['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getChainCode()).toBe(dump['derivation']['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(dump['derivation']['parent-fingerprint']);

    expect(hdwallet.getAddress({
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(dump['derivation']['address']);
  });
});
