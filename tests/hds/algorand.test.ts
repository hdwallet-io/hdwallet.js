// SPDX-License-Identifier: MIT

import { AlgorandHD, HDS } from '../../src/hds';
import { Algorand as Cryptocurrency } from '../../src/cryptocurrencies';
import { BIP44Derivation, CHANGES } from '../../src/derivations';

const data = require('../data/json/hds.json') as any;

describe('AlgorandHD', () => {
  const root = data['Algorand'];
  const drv = root['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new AlgorandHD();

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(AlgorandHD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(hd.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(root['root-xpublic-key']);

    expect(hd.getRootPrivateKey()).toBe(root['root-private-key']);
    expect(hd.getRootChainCode()).toBe(root['root-chain-code']);
    expect(hd.getRootPublicKey()).toBe(root['root-public-key']);
  });

  it('derives path via BIP44Derivation and exposes child values', () => {
    const hd = new AlgorandHD();
    hd.fromSeed(root['seed']);
    hd.fromDerivation(
      new BIP44Derivation({
        coinType: Cryptocurrency.COIN_TYPE,
        account: 0,
        change: CHANGES.EXTERNAL_CHAIN,
        address: 0
      })
    );

    expect(hd.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(drv['xpublic-key']);

    expect(hd.getPrivateKey()).toBe(drv['private-key']);
    expect(hd.getChainCode()).toBe(drv['chain-code']);
    expect(hd.getPublicKey()).toBe(drv['public-key']);
    expect(hd.getHash()).toBe(drv['hash']);
    expect(hd.getDepth()).toBe(drv['depth']);
    expect(hd.getPath()).toBe(drv['path']);
    expect(hd.getIndex()).toBe(drv['index']);
    expect(hd.getIndexes()).toEqual(drv['indexes']);
    expect(hd.getFingerprint()).toBe(drv['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(drv['parent-fingerprint']);
    expect(hd.getAddress()).toBe(drv['address']);
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(AlgorandHD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass();
    const instDirect = new AlgorandHD();

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(root['root-xprivate-key']);

    expect(instFromRegistry.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass();
    const instDirect = new AlgorandHD();

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    const deriv = new BIP44Derivation({
      coinType: Cryptocurrency.COIN_TYPE,
      account: 0,
      change: CHANGES.EXTERNAL_CHAIN,
      address: 0
    });

    instFromRegistry.fromDerivation(deriv);
    instDirect.fromDerivation(deriv);

    expect(instFromRegistry.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(instDirect.getXPrivateKey()).toBe(drv['xprivate-key']);

    expect(instFromRegistry.getXPublicKey()).toBe(drv['xpublic-key']);
    expect(instDirect.getXPublicKey()).toBe(drv['xpublic-key']);

    expect(instFromRegistry.getPath()).toBe(drv['path']);
    expect(instDirect.getPath()).toBe(drv['path']);
  });
});
