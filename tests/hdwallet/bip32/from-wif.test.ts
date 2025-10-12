// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("BIP32.fromWIF", () => {
  it("compressed", () => {
    const compressed = data.BIP32['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      publicKeyType: compressed['public-key-type']
    }).fromWIF(compressed['derivations'][compressed['derivations'].length - 1]['wif']);

    expect(hdwallet.getDumps()).toBeNull();

    const base = { ...compressed };
    delete (base as any)['derivations'];
    const last = { ...compressed['derivations'].slice(-1)[0] };

    const dump: any = {
      ...base,
      derivation: { ...last }
    };

    Object.assign(dump, {
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      'root-xprivate-key': null,
      'root-xpublic-key': null,
      'root-private-key': null,
      'root-wif': null,
      'root-chain-code': null,
      'root-public-key': null,
      strict: null
    });

    Object.assign(dump['derivation'], {
      'xprivate-key': null,
      'xpublic-key': null,
      'chain-code': null,
      'parent-fingerprint': null
    });

    delete dump['derivation']['at'];

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBeNull();
    expect(hdwallet.getRootXPublicKey()).toBeNull();
    expect(hdwallet.getRootPrivateKey()).toBeNull();
    expect(hdwallet.getRootWIF()).toBeNull();
    expect(hdwallet.getRootChainCode()).toBeNull();
    expect(hdwallet.getRootPublicKey()).toBeNull();
    expect(hdwallet.getStrict()).toBeNull();
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getXPrivateKey()).toBeNull();
    expect(hdwallet.getXPublicKey()).toBeNull();
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getChainCode()).toBeNull();
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBeNull();

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2PKH,
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2pkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2TR,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
    })).toBe(dump['derivation']['addresses']['p2tr']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    })).toBe(dump['derivation']['addresses']['p2wpkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2wpkh-in-p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
    })).toBe(dump['derivation']['addresses']['p2wsh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2wsh-in-p2sh']);
  });

  it("uncompressed", () => {
    const uncompressed = data.BIP32['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      publicKeyType: uncompressed['public-key-type']
    }).fromWIF(uncompressed['derivations'][uncompressed['derivations'].length - 1]['wif']);

    expect(hdwallet.getDumps()).toBeNull();

    const base = { ...uncompressed };
    delete (base as any)['derivations'];
    const last = { ...uncompressed['derivations'].slice(-1)[0] };

    const dump: any = {
      ...base,
      derivation: { ...last }
    };

    Object.assign(dump, {
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      'root-xprivate-key': null,
      'root-xpublic-key': null,
      'root-private-key': null,
      'root-wif': null,
      'root-chain-code': null,
      'root-public-key': null,
      strict: null
    });

    Object.assign(dump['derivation'], {
      'xprivate-key': null,
      'xpublic-key': null,
      'chain-code': null,
      'parent-fingerprint': null
    });

    delete dump['derivation']['at'];

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBeNull();
    expect(hdwallet.getRootXPublicKey()).toBeNull();
    expect(hdwallet.getRootPrivateKey()).toBeNull();
    expect(hdwallet.getRootWIF()).toBeNull();
    expect(hdwallet.getRootChainCode()).toBeNull();
    expect(hdwallet.getRootPublicKey()).toBeNull();
    expect(hdwallet.getStrict()).toBeNull();
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getXPrivateKey()).toBeNull();
    expect(hdwallet.getXPublicKey()).toBeNull();
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getChainCode()).toBeNull();
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBeNull();

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2PKH,
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2pkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2TR,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
    })).toBe(dump['derivation']['addresses']['p2tr']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    })).toBe(dump['derivation']['addresses']['p2wpkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2wpkh-in-p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
    })).toBe(dump['derivation']['addresses']['p2wsh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(dump['derivation']['addresses']['p2wsh-in-p2sh']);
  });
});
