// SPDX-License-Identifier: MIT

import { HDS, CardanoHD } from '../../../src/hds';
import { BIP44Derivation } from '../../../src/derivations';
import { Cardano } from '../../../src/cryptocurrencies';

const data = require('../../data/json/hds.json') as any;

describe('CardanoHD (Byron Icarus)', () => {
  const icarus = data['Cardano']['byron-icarus'];
  const drvIcarus = icarus['derivation'];
  const icarusPass = data['Cardano']['byron-icarus-passphrase'];
  const drvIcarusPass = icarusPass['derivation'];

  // -- without passphrase --

  it('initializes from seed (no passphrase) and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    hd.fromSeed(icarus['seed']);

    expect(hd).toBeInstanceOf(CardanoHD);
    expect(hd.getName()).toBe(icarus['name']);
    expect(hd.getSeed()).toBe(icarus['seed']);

    expect(hd.getRootXPrivateKey()).toBe(icarus['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(icarus['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(icarus['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(icarus['root-public-key']);
    expect(hd.getRootChainCode()).toBe(icarus['root-chain-code']);
  });

  it('derives via BIP44Derivation (no passphrase) and exposes child values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    hd.fromSeed(icarus['seed']);

    const der = new BIP44Derivation({ coinType: Cardano.COIN_TYPE });
    der.fromAccount(0);
    der.fromChange('external-chain' as any);
    der.fromAddress(0);

    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(drvIcarus['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(drvIcarus['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(drvIcarus['private-key']);
    expect(hd.getChainCode()).toBe(drvIcarus['chain-code']);
    expect(hd.getPublicKey()).toBe(drvIcarus['public-key']);
    expect(hd.getDepth()).toBe(drvIcarus['depth']);
    expect(hd.getPath()).toBe(drvIcarus['path']);
    expect(hd.getIndex()).toBe(drvIcarus['index']);
    expect(hd.getIndexes()).toEqual(drvIcarus['indexes']);
    expect(hd.getFingerprint()).toBe(drvIcarus['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(drvIcarus['parent-fingerprint']);
    expect(hd.getAddress()).toBe(drvIcarus['address']);
  });

  // --- registry (getHDClass) - no passphrase ---

  it('registry returns the same class as a direct import (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarus['name']);
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same root values (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarus['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    instFromRegistry.fromSeed(icarus['seed']);
    instDirect.fromSeed(icarus['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(icarus['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(icarus['root-xprivate-key']);
    expect(instFromRegistry.getRootXPublicKey()).toBe(icarus['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(icarus['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarus['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    instFromRegistry.fromSeed(icarus['seed']);
    instDirect.fromSeed(icarus['seed']);

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

    expect(instFromRegistry.getXPrivateKey()).toBe(drvIcarus['xprivate-key']);
    expect(instDirect.getXPrivateKey()).toBe(drvIcarus['xprivate-key']);
    expect(instFromRegistry.getXPublicKey()).toBe(drvIcarus['xpublic-key']);
    expect(instDirect.getXPublicKey()).toBe(drvIcarus['xpublic-key']);
    expect(instFromRegistry.getPath()).toBe(drvIcarus['path']);
    expect(instDirect.getPath()).toBe(drvIcarus['path']);
  });

  // -- with passphrase --

  it('initializes from seed + passphrase and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    hd.fromSeed(icarusPass['seed'], icarusPass['passphrase']);

    expect(hd).toBeInstanceOf(CardanoHD);
    expect(hd.getName()).toBe(icarusPass['name']);
    expect(hd.getSeed()).toBe(icarusPass['seed']);

    expect(hd.getRootXPrivateKey()).toBe(icarusPass['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(icarusPass['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(icarusPass['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(icarusPass['root-public-key']);
    expect(hd.getRootChainCode()).toBe(icarusPass['root-chain-code']);
  });

  it('derives via BIP44Derivation (with passphrase) and exposes child values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    hd.fromSeed(icarusPass['seed'], icarusPass['passphrase']);

    const der = new BIP44Derivation({ coinType: Cardano.COIN_TYPE });
    der.fromAccount(0);
    der.fromChange('external-chain' as any);
    der.fromAddress(0);

    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(drvIcarusPass['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(drvIcarusPass['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(drvIcarusPass['private-key']);
    expect(hd.getChainCode()).toBe(drvIcarusPass['chain-code']);
    expect(hd.getPublicKey()).toBe(drvIcarusPass['public-key']);
    expect(hd.getDepth()).toBe(drvIcarusPass['depth']);
    expect(hd.getPath()).toBe(drvIcarusPass['path']);
    expect(hd.getIndex()).toBe(drvIcarusPass['index']);
    expect(hd.getIndexes()).toEqual(drvIcarusPass['indexes']);
    expect(hd.getFingerprint()).toBe(drvIcarusPass['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(drvIcarusPass['parent-fingerprint']);
    expect(hd.getAddress()).toBe(drvIcarusPass['address']);
  });

  // --- registry (getHDClass) - with passphrase ---

  it('registry returns the same class as a direct import (with passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarusPass['name']);
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same root values (with passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarusPass['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    instFromRegistry.fromSeed(icarusPass['seed'], icarusPass['passphrase']);
    instDirect.fromSeed(icarusPass['seed'], icarusPass['passphrase']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(icarusPass['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(icarusPass['root-xprivate-key']);
    expect(instFromRegistry.getRootXPublicKey()).toBe(icarusPass['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(icarusPass['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values (with passphrase)', () => {
    const RegistryClass = HDS.getHDClass(icarusPass['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.BYRON_ICARUS });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.BYRON_ICARUS });

    instFromRegistry.fromSeed(icarusPass['seed'], icarusPass['passphrase']);
    instDirect.fromSeed(icarusPass['seed'], icarusPass['passphrase']);

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

    expect(instFromRegistry.getXPrivateKey()).toBe(drvIcarusPass['xprivate-key']);
    expect(instDirect.getXPrivateKey()).toBe(drvIcarusPass['xprivate-key']);
    expect(instFromRegistry.getXPublicKey()).toBe(drvIcarusPass['xpublic-key']);
    expect(instDirect.getXPublicKey()).toBe(drvIcarusPass['xpublic-key']);
    expect(instFromRegistry.getPath()).toBe(drvIcarusPass['path']);
    expect(instDirect.getPath()).toBe(drvIcarusPass['path']);
  });
});
