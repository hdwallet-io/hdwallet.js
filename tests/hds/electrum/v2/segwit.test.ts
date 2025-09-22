// SPDX-License-Identifier: MIT

import { ElectrumV2HD, HDS } from '../../../../src/hds';
import { ElectrumDerivation } from '../../../../src/derivations';
import { Bitcoin as Cryptocurrency } from '../../../../src/cryptocurrencies';
import { PUBLIC_KEY_TYPES, MODES } from '../../../../src/consts';

const rawVectors = require('../../../data/json/hds.json') as {
  'Electrum-V2': {
    'segwit': {
      'name': string;
      'mode': string;
      'seed': string;
      'master-private-key': string;
      'master-wif': string;
      'master-public-key': string;
      'public-key-type': string;
      'wif-type': string;
      'derivation': {
        'private-key': string;
        'wif': string;
        'public-key': string;
        'uncompressed': string;
        'compressed': string;
        'address': string;
      };
    };
  };
};

describe('ElectrumV2HD (segwit)', () => {
  const root = rawVectors['Electrum-V2']['segwit'];
  const drv = rawVectors['Electrum-V2']['segwit']['derivation'];

  it('initializes from seed and exposes master values', () => {
    const hd = new ElectrumV2HD({
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(ElectrumV2HD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);
    expect(hd.getMode()).toBe(root['mode']);

    expect(hd.getMasterPrivateKey()).toBe(root['master-private-key']);
    expect(hd.getMasterWIF()).toBe(root['master-wif']);
    expect(hd.getMasterPublicKey()).toBe(root['master-public-key']);
    expect(hd.getPublicKeyType()).toBe(root['public-key-type']);
    expect(hd.getWIFType()).toBe(root['wif-type']);
  });

  it('derives via ElectrumDerivation and exposes child values', () => {
    const hd = new ElectrumV2HD({
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
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
    expect(RegistryClass).toBe(ElectrumV2HD);
  });

  it('registry-created and direct instances expose the same master values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new ElectrumV2HD({
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
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
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new ElectrumV2HD({
      mode: MODES.SEGWIT,
      publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
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
