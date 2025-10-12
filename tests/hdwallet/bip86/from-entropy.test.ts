// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { BIP39Entropy } from '../../../src/entropies';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("BIP86.fromEntropy", () => {
  it("compressed", () => {
    const compressed = data.BIP86['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);
    const DerivationClass = DERIVATIONS.getDerivationClass(data.BIP86.derivation.name);

    const derivation = new DerivationClass({
      coinType: data.BIP86.derivation.args['coin-type'],
      account: data.BIP86.derivation.args['account'],
      change: data.BIP86.derivation.args['change'] as any,
      address: data.BIP86.derivation.args['address']
    });

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      language: compressed['language'].toLowerCase(),
      publicKeyType: compressed['public-key-type']
    })
      .fromEntropy(new BIP39Entropy(compressed['entropy']))
      .fromDerivation(derivation);

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
    expect(hdwallet.getCoinType()).toBe(last['at']['coin-type']);

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

    expect(hdwallet.getDumps()).toEqual(compressed);

    const dump = { ...compressed };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });

  it("uncompressed", () => {
    const uncompressed = data.BIP86['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);
    const DerivationClass = DERIVATIONS.getDerivationClass(data.BIP86.derivation.name);

    const derivation = new DerivationClass({
      coinType: data.BIP86.derivation.args['coin-type'],
      account: data.BIP86.derivation.args['account'],
      change: data.BIP86.derivation.args['change'] as any,
      address: data.BIP86.derivation.args['address']
    });

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      language: uncompressed['language'].toLowerCase(),
      publicKeyType: uncompressed['public-key-type']
    })
      .fromEntropy(new BIP39Entropy(uncompressed['entropy']))
      .fromDerivation(derivation);

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
    expect(hdwallet.getCoinType()).toBe(last['at']['coin-type']);

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

    expect(hdwallet.getDumps()).toEqual(uncompressed);

    const dump = { ...uncompressed };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
