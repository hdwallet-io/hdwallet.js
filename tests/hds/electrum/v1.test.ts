// SPDX-License-Identifier: MIT

import { ElectrumV1HD, HDS } from '../../../src/hds';
import { ElectrumDerivation } from '../../../src/derivations';
import { Bitcoin as Cryptocurrency } from '../../../src/cryptocurrencies';
import { PUBLIC_KEY_TYPES } from '../../../src/consts';

const data = require('../../data/json/hds.json') as any;

describe('ElectrumV1HD', () => {
  const root = data['Electrum-V1'];
  const drv = data['Electrum-V1']['derivation'];

  it('initializes from seed and exposes master values', () => {
    const hd = new ElectrumV1HD({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(ElectrumV1HD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(hd.getMasterPrivateKey()).toBe(root['master-private-key']);
    expect(hd.getMasterWIF()).toBe(root['master-wif']);
    expect(hd.getMasterPublicKey()).toBe(root['master-public-key']);
    expect(hd.getPublicKeyType()).toBe(root['public-key-type']);
    expect(hd.getWIFType()).toBe(root['wif-type']);
  });

  it('derives via ElectrumDerivation and exposes child values', () => {
    const hd = new ElectrumV1HD({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    hd.fromSeed(root['seed']);

    const der = new ElectrumDerivation({ change: 0, address: 0 });
    hd.fromDerivation(der);

    expect(hd.getPrivateKey()).toBe(drv['private-key']);
    expect(hd.getPublicKey()).toBe(drv['public-key']);
    expect(hd.getWIF()).toBe(drv['wif']);
    expect(hd.getUncompressed()).toBe(drv['uncompressed']);
    expect(hd.getCompressed()).toBe(drv['compressed']);
    expect(hd.getAddress()).toBe(drv['address']);
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(ElectrumV1HD);
  });

  it('registry-created and direct instances expose the same master values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new ElectrumV1HD({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getMasterPrivateKey()).toBe(root['master-private-key']);
    expect(instDirect.getMasterPrivateKey()).toBe(root['master-private-key']);

    expect(instFromRegistry.getMasterPublicKey()).toBe(root['master-public-key']);
    expect(instDirect.getMasterPublicKey()).toBe(root['master-public-key']);

    expect(instFromRegistry.getMasterWIF()).toBe(root['master-wif']);
    expect(instDirect.getMasterWIF()).toBe(root['master-wif']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new ElectrumV1HD({
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    const d1 = new ElectrumDerivation({ change: 0, address: 0 });
    const d2 = new ElectrumDerivation({ change: 0, address: 0 });

    instFromRegistry.fromDerivation(d1);
    instDirect.fromDerivation(d2);

    expect(instFromRegistry.getPrivateKey()).toBe(drv['private-key']);
    expect(instDirect.getPrivateKey()).toBe(drv['private-key']);

    expect(instFromRegistry.getPublicKey()).toBe(drv['public-key']);
    expect(instDirect.getPublicKey()).toBe(drv['public-key']);

    expect(instFromRegistry.getAddress()).toBe(drv['address']);
    expect(instDirect.getAddress()).toBe(drv['address']);
  });
});
