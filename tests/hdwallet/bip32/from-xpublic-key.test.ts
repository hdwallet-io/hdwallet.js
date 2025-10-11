// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { HDS } from '../../../src/hds';

const rawVectors = require('../../data/json/hdwallet.json') as any;

describe("BIP32.fromXPublicKey", () => {
  it("compressed", () => {
    const compressed = rawVectors.BIP32['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      publicKeyType: compressed['public-key-type']
    })
      .fromXPublicKey(compressed['root-xpublic-key'], compressed['strict'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(rawVectors.BIP32.derivation.name))(
        rawVectors.BIP32.derivation.args
      ));

    const expectedDump: any = {
      ...compressed,
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      'root-xprivate-key': null,
      'root-private-key': null,
      'root-wif': null,
      'wif-type': null
    };

    expectedDump['derivations'] = expectedDump['derivations'].map((d: any) => ({
      ...d,
      'xprivate-key': null,
      'private-key': null,
      'wif': null
    }));

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = expectedDump['derivations'][expectedDump['derivations'].length - 1];
    const dump = { ...expectedDump };
    delete dump['derivations'];
    dump['derivation'] = { ...last };

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(compressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(compressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(compressed['network']);
    expect(hdwallet.getCoinType()).toBe(compressed['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(compressed['ecc']);
    expect(hdwallet.getHD()).toBe(compressed['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBeNull();
    expect(hdwallet.getRootXPublicKey()).toBe(compressed['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBeNull();
    expect(hdwallet.getRootWIF()).toBeNull();
    expect(hdwallet.getRootChainCode()).toBe(compressed['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(compressed['root-public-key']);
    expect(hdwallet.getStrict()).toBe(compressed['strict']);
    expect(hdwallet.getXPrivateKey()).toBeNull();
    expect(hdwallet.getPrivateKey()).toBeNull();
    expect(hdwallet.getWIF()).toBeNull();
    expect(hdwallet.getPublicKeyType()).toBe(compressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBeNull();

    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2PKH,
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2pkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2TR,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
    })).toBe(last['addresses']['p2tr']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    })).toBe(last['addresses']['p2wpkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2wpkh-in-p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
    })).toBe(last['addresses']['p2wsh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2wsh-in-p2sh']);
  });

  it("uncompressed", () => {
    const uncompressed = rawVectors.BIP32['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      publicKeyType: uncompressed['public-key-type']
    })
      .fromXPublicKey(uncompressed['root-xpublic-key'], uncompressed['strict'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(rawVectors.BIP32.derivation.name))(
        rawVectors.BIP32.derivation.args
      ));

    const expectedDump: any = {
      ...uncompressed,
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      'root-xprivate-key': null,
      'root-private-key': null,
      'root-wif': null,
      'wif-type': null
    };

    expectedDump['derivations'] = expectedDump['derivations'].map((d: any) => ({
      ...d,
      'xprivate-key': null,
      'private-key': null,
      'wif': null
    }));

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = expectedDump['derivations'][expectedDump['derivations'].length - 1];
    const dump = { ...expectedDump };
    delete dump['derivations'];
    dump['derivation'] = { ...last };

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(uncompressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(uncompressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(uncompressed['network']);
    expect(hdwallet.getCoinType()).toBe(uncompressed['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(uncompressed['ecc']);
    expect(hdwallet.getHD()).toBe(uncompressed['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBeNull();
    expect(hdwallet.getRootXPublicKey()).toBe(uncompressed['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBeNull();
    expect(hdwallet.getRootWIF()).toBeNull();
    expect(hdwallet.getRootChainCode()).toBe(uncompressed['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(uncompressed['root-public-key']);
    expect(hdwallet.getStrict()).toBe(uncompressed['strict']);
    expect(hdwallet.getXPrivateKey()).toBeNull();
    expect(hdwallet.getPrivateKey()).toBeNull();
    expect(hdwallet.getWIF()).toBeNull();
    expect(hdwallet.getPublicKeyType()).toBe(uncompressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBeNull();

    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2PKH,
      publicKeyAddressPrefix: cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2pkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2TR,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
    })).toBe(last['addresses']['p2tr']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    })).toBe(last['addresses']['p2wpkh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WPKH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2wpkh-in-p2sh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH,
      hrp: cryptocurrency.NETWORKS.MAINNET.HRP,
      witnessVersion: cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
    })).toBe(last['addresses']['p2wsh']);

    expect(hdwallet.getAddress({
      address: cryptocurrency.ADDRESSES.P2WSH_IN_P2SH,
      scriptAddressPrefix: cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    })).toBe(last['addresses']['p2wsh-in-p2sh']);
  });
});
