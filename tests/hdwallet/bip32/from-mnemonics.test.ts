// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { BIP39Mnemonic } from '../../../src/mnemonics';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("BIP32.fromMnemonic", () => {
  it("compressed", () => {
    const compressed = data.BIP32['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      language: compressed['language'].toLowerCase(),
      publicKeyType: compressed['public-key-type']
    })
      .fromMnemonic(new BIP39Mnemonic(compressed['mnemonic']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.BIP32.derivation.name))(
        data.BIP32.derivation.args
      ));

    expect(hdwallet.getCryptocurrency()).toBe(compressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(compressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(compressed['network']);
    expect(hdwallet.getCoinType()).toBe(compressed['coin-type']);
    expect(hdwallet.getEntropy()).toBe(compressed['entropy']);
    expect(hdwallet.getStrength()).toBe(compressed['strength']);
    expect(hdwallet.getMnemonic()).toBe(compressed['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(compressed['language']);
    expect(hdwallet.getSeed()).toBe(compressed['seed']);
    expect(hdwallet.getECC()).toBe(compressed['ecc']);
    expect(hdwallet.getHD()).toBe(compressed['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(compressed['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(compressed['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(compressed['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(compressed['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(compressed['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(compressed['root-public-key']);
    expect(hdwallet.getStrict()).toBe(compressed['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(compressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(compressed['wif-type']);

    const last = compressed['derivations'][compressed['derivations'].length - 1];

    expect(hdwallet.getPath()).toBe(last['at']['path']);
    expect(hdwallet.getIndexes()).toEqual(last['at']['indexes']);
    expect(hdwallet.getDepth()).toBe(last['at']['depth']);
    expect(hdwallet.getIndex()).toBe(last['at']['index']);

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

    expect(hdwallet.getDumps()).toEqual(compressed);

    const dump = { ...compressed };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });

  it("uncompressed", () => {
    const uncompressed = data.BIP32['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      language: uncompressed['language'].toLowerCase(),
      publicKeyType: uncompressed['public-key-type']
    })
      .fromMnemonic(new BIP39Mnemonic(uncompressed['mnemonic']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.BIP32.derivation.name))(
        data.BIP32.derivation.args
      ));

    expect(hdwallet.getCryptocurrency()).toBe(uncompressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(uncompressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(uncompressed['network']);
    expect(hdwallet.getCoinType()).toBe(uncompressed['coin-type']);
    expect(hdwallet.getEntropy()).toBe(uncompressed['entropy']);
    expect(hdwallet.getStrength()).toBe(uncompressed['strength']);
    expect(hdwallet.getMnemonic()).toBe(uncompressed['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(uncompressed['language']);
    expect(hdwallet.getSeed()).toBe(uncompressed['seed']);
    expect(hdwallet.getECC()).toBe(uncompressed['ecc']);
    expect(hdwallet.getHD()).toBe(uncompressed['hd']);
    expect(hdwallet.getRootXPrivateKey()).toBe(uncompressed['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(uncompressed['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(uncompressed['root-private-key']);
    expect(hdwallet.getRootWIF()).toBe(uncompressed['root-wif']);
    expect(hdwallet.getRootChainCode()).toBe(uncompressed['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(uncompressed['root-public-key']);
    expect(hdwallet.getStrict()).toBe(uncompressed['strict']);
    expect(hdwallet.getPublicKeyType()).toBe(uncompressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(uncompressed['wif-type']);

    const last = uncompressed['derivations'][uncompressed['derivations'].length - 1];

    expect(hdwallet.getPath()).toBe(last['at']['path']);
    expect(hdwallet.getIndexes()).toEqual(last['at']['indexes']);
    expect(hdwallet.getDepth()).toBe(last['at']['depth']);
    expect(hdwallet.getIndex()).toBe(last['at']['index']);

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

    expect(hdwallet.getDumps()).toEqual(uncompressed);

    const dump = { ...uncompressed };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
