// SPDX-License-Identifier: MIT

import { HDS, CardanoHD } from '../../../src/hds';
import { CustomDerivation } from '../../../src/derivations';
import { Cardano } from '../../../src/cryptocurrencies';

const data = require('../../data/json/hds.json') as any;

describe('CardanoHD (Byron Legacy)', () => {
  const root = data['Cardano']['byron-legacy'];
  const drv = root['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEGACY });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(CardanoHD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(hd.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(root['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(root['root-public-key']);
    expect(hd.getRootChainCode()).toBe(root['root-chain-code']);
  });

  it('derives via CustomDerivation(path) and exposes child values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEGACY });
    hd.fromSeed(root['seed']);

    const der = new CustomDerivation({ path: drv['path'] });
    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(drv['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(drv['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(drv['private-key']);
    expect(hd.getChainCode()).toBe(drv['chain-code']);
    expect(hd.getPublicKey()).toBe(drv['public-key']);
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
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_LEGACY });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEGACY });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instFromRegistry.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_LEGACY });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEGACY });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    const d1 = new CustomDerivation({ path: drv['path'] });
    const d2 = new CustomDerivation({ path: drv['path'] });

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
