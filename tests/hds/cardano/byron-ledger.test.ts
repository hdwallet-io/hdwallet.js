// SPDX-License-Identifier: MIT

import { HDS, CardanoHD } from '../../../src/hds';
import { BIP44Derivation, CustomDerivation } from '../../../src/derivations';
import { Cardano } from '../../../src/cryptocurrencies';

const rawVectors = require('../../data/json/hds.json') as {
  'Cardano': {
    'byron-ledger': {
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
        'chain-code': string;
        'public-key': string;
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
};

describe('CardanoHD (Byron Ledger)', () => {
  const root = rawVectors['Cardano']['byron-ledger'];
  const drv = root['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEDGER });

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

  it('derives via BIP44Derivation and exposes child values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEDGER });
    hd.fromSeed(root['seed']);

    const der = new BIP44Derivation({ coinType: Cardano.COIN_TYPE });
    der.fromAccount(0);
    der.fromChange('external-chain' as any);
    der.fromAddress(0);

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

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_LEDGER });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEDGER });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instFromRegistry.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_LEDGER });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_LEDGER });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    const d1 = new BIP44Derivation({ coinType: Cardano.COIN_TYPE });
    d1.fromAccount(0);
    d1.fromChange('external-chain' as any);
    d1.fromAddress(0);

    const d2 = new BIP44Derivation({ coinType: Cardano.COIN_TYPE });
    d2.fromAccount(0);
    d2.fromChange('external-chain' as any);
    d2.fromAddress(0);

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
