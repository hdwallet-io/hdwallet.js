// SPDX-License-Identifier: MIT

import { BIP86HD, HDS } from '../../src/hds';
import { BIP86Derivation } from '../../src/derivations';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';

const data = require('../data/json/hds.json') as any;

describe('BIP86HD', () => {
  const root = data['BIP86'];
  const drv = data['BIP86']['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new BIP86HD({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(BIP86HD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(hd.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(root['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(root['root-public-key']);
    expect(hd.getRootChainCode()).toBe(root['root-chain-code']);
  });

  it('derives via BIP86Derivation and exposes child values', () => {
    const hd = new BIP86HD({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });
    hd.fromSeed(root['seed']);

    const der = new BIP86Derivation({ coinType: Cryptocurrency.COIN_TYPE });
    der.fromAccount(0);
    der.fromChange('external-chain' as any);
    der.fromAddress(1);

    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(drv['xpublic-key']);

    expect(hd.getPrivateKey()).toBe(drv['private-key']);
    expect(hd.getWIF()).toBe(drv['wif']);
    expect(hd.getChainCode()).toBe(drv['chain-code']);
    expect(hd.getPublicKey()).toBe(drv['public-key']);
    expect(hd.getUncompressed()).toBe(drv['uncompressed']);
    expect(hd.getCompressed()).toBe(drv['compressed']);
    expect(hd.getHash()).toBe(drv['hash']);
    expect(hd.getDepth()).toBe(drv['depth']);
    expect(hd.getPath()).toBe(drv['path']);
    expect(hd.getIndex()).toBe(drv['index']);
    expect(hd.getIndexes()).toEqual(drv['indexes']);
    expect(hd.getFingerprint()).toBe(drv['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(drv['parent-fingerprint']);

    // Address (BIP86 → P2TR; lib selects proper format for BIP86)
    expect(
      hd.getAddress({
        publicKeyAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
      })
    ).toBe(drv['address']);
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(BIP86HD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });
    const instDirect = new BIP86HD({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(root['root-xprivate-key']);

    expect(instFromRegistry.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });
    const instDirect = new BIP86HD({
      ecc: Cryptocurrency.ECC,
      coinType: Cryptocurrency.COIN_TYPE,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      account: 0,
      change: 'external-chain' as any,
      address: 0
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    const d1 = new BIP86Derivation({ coinType: Cryptocurrency.COIN_TYPE });
    d1.fromAccount(0);
    d1.fromChange('external-chain' as any);
    d1.fromAddress(1);

    const d2 = new BIP86Derivation({ coinType: Cryptocurrency.COIN_TYPE });
    d2.fromAccount(0);
    d2.fromChange('external-chain' as any);
    d2.fromAddress(1);

    instFromRegistry.fromDerivation(d1);
    instDirect.fromDerivation(d2);

    expect(instFromRegistry.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(instDirect.getXPrivateKey()).toBe(drv['xprivate-key']);

    expect(instFromRegistry.getXPublicKey()).toBe(drv['xpublic-key']);
    expect(instDirect.getXPublicKey()).toBe(drv['xpublic-key']);

    expect(instFromRegistry.getPath()).toBe(drv['path']);
    expect(instDirect.getPath()).toBe(drv['path']);
  });
});
