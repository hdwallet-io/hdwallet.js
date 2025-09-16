// SPDX-License-Identifier: MIT

import { BIP141HD, HDS } from '../../src/hds';
import { CustomDerivation } from '../../src/derivations';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';

const rawVectors = require('../data/json/hds.json') as {
  'BIP141': {
    'name': string;
    'seed': string;
    'root-xprivate-key': string;
    'root-xpublic-key': string;
    'root-private-key': string;
    'root-chain-code': string;
    'root-public-key': string;
    'derivation': {
      'xprivate-key': string;
      'xpublic-key': string;
      'private-key': string;
      'wif': string;
      'chain-code': string;
      'public-key': string;
      'uncompressed': string;
      'compressed': string;
      'hash': string;
      'depth': number;
      'path': string;
      'index': number;
      'indexes': number[];
      'fingerprint': string;
      'parent-fingerprint': string;
      'address': string;
    };
  };
};

describe('BIP141HD', () => {
  const root = rawVectors['BIP141'];
  const drv = rawVectors['BIP141']['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new BIP141HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(BIP141HD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);
    expect(hd.getSemantic()).toBe('p2wpkh');

    expect(hd.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(root['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(root['root-public-key']);
    expect(hd.getRootChainCode()).toBe(root['root-chain-code']);
  });

  it('derives via CustomDerivation and exposes child values', () => {
    const hd = new BIP141HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
    });
    hd.fromSeed(root['seed']);

    hd.fromDerivation(new CustomDerivation({ path: drv['path'] }));

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

    // Address (BIP141 semantic = p2wpkh)
    expect(
      hd.getAddress({
        publicKeyAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
      })
    ).toBe(drv['address']);
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(BIP141HD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
    });
    const instDirect = new BIP141HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
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
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
    });
    const instDirect = new BIP141HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX,
      semantic: 'p2wpkh'
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    instFromRegistry.fromDerivation(new CustomDerivation({ path: drv['path'] }));
    instDirect.fromDerivation(new CustomDerivation({ path: drv['path'] }));

    expect(instFromRegistry.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(instDirect.getXPrivateKey()).toBe(drv['xprivate-key']);

    expect(instFromRegistry.getXPublicKey()).toBe(drv['xpublic-key']);
    expect(instDirect.getXPublicKey()).toBe(drv['xpublic-key']);

    expect(instFromRegistry.getPath()).toBe(drv['path']);
    expect(instDirect.getPath()).toBe(drv['path']);
  });
});
