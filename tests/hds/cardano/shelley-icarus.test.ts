// SPDX-License-Identifier: MIT

import { HDS, CardanoHD } from '../../../src/hds';
import { CIP1852Derivation, ROLES } from '../../../src/derivations';
import { Cardano } from '../../../src/cryptocurrencies';

const data = require('../../data/json/hds.json') as any;

describe('CardanoHD (Shelley Icarus)', () => {
  const root = data['Cardano']['shelley-icarus'];
  const stake = root['derivation-staking'];
  const pay = root['derivation-payment'];

  const rootPass = data['Cardano']['shelley-icarus-passphrase'];
  const stakePass = rootPass['derivation-staking'];
  const payPass = rootPass['derivation-payment'];

  // -- without passphrase --

  it('initializes from seed (no passphrase) and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });

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

  it('derives staking via CIP1852 and exposes derived values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    hd.fromSeed(root['seed']);

    const der = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    der.fromAccount(0);
    der.fromAddress(0);

    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(stake['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(stake['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(stake['private-key']);
    expect(hd.getChainCode()).toBe(stake['chain-code']);
    expect(hd.getPublicKey()).toBe(stake['public-key']);
    expect(hd.getDepth()).toBe(stake['depth']);
    expect(hd.getPath()).toBe(stake['path']);
    expect(hd.getIndex()).toBe(stake['index']);
    expect(hd.getIndexes()).toEqual(stake['indexes']);
    expect(hd.getFingerprint()).toBe(stake['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(stake['parent-fingerprint']);
    expect(hd.getAddress({ addressType: 'staking' as any })).toBe(stake['address']);
  });

  it('switches role to external (payment) and exposes updated derived values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    hd.fromSeed(root['seed']);

    const der = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    der.fromAccount(0);
    der.fromAddress(0);
    hd.fromDerivation(der);

    der.fromRole(ROLES.EXTERNAL_CHAIN as any);
    hd.updateDerivation(der);

    expect(hd.getXPrivateKey()).toBe(pay['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(pay['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(pay['private-key']);
    expect(hd.getChainCode()).toBe(pay['chain-code']);
    expect(hd.getPublicKey()).toBe(pay['public-key']);
    expect(hd.getDepth()).toBe(pay['depth']);
    expect(hd.getPath()).toBe(pay['path']);
    expect(hd.getIndex()).toBe(pay['index']);
    expect(hd.getIndexes()).toEqual(pay['indexes']);
    expect(hd.getFingerprint()).toBe(pay['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(pay['parent-fingerprint']);
    expect(
      hd.getAddress({ addressType: 'payment' as any, stakingPublicKey: stake['public-key'] })
    ).toBe(pay['address']);
  });

  // --- registry (getHDClass) - no passphrase ---

  it('registry returns the same class as a direct import (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same root values (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    const instDirect = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instDirect.getRootXPrivateKey()).toBe(root['root-xprivate-key']);
    expect(instFromRegistry.getRootXPublicKey()).toBe(root['root-xpublic-key']);
    expect(instDirect.getRootXPublicKey()).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same staking and payment values (no passphrase)', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const r = new RegistryClass({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    const d = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });

    r.fromSeed(root['seed']);
    d.fromSeed(root['seed']);

    const d1 = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    d1.fromAccount(0);
    d1.fromAddress(0);

    const d2 = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    d2.fromAccount(0);
    d2.fromAddress(0);

    r.fromDerivation(d1);
    d.fromDerivation(d2);

    expect(r.getXPrivateKey()).toBe(stake['xprivate-key']);
    expect(d.getXPrivateKey()).toBe(stake['xprivate-key']);
    expect(r.getXPublicKey()).toBe(stake['xpublic-key']);
    expect(d.getXPublicKey()).toBe(stake['xpublic-key']);
    expect(r.getAddress({ addressType: 'staking' as any })).toBe(stake['address']);
    expect(d.getAddress({ addressType: 'staking' as any })).toBe(stake['address']);

    d1.fromRole(ROLES.EXTERNAL_CHAIN as any);
    d2.fromRole(ROLES.EXTERNAL_CHAIN as any);

    r.updateDerivation(d1);
    d.updateDerivation(d2);

    expect(r.getXPrivateKey()).toBe(pay['xprivate-key']);
    expect(d.getXPrivateKey()).toBe(pay['xprivate-key']);
    expect(r.getXPublicKey()).toBe(pay['xpublic-key']);
    expect(d.getXPublicKey()).toBe(pay['xpublic-key']);
    expect(r.getAddress({ addressType: 'payment' as any, stakingPublicKey: stake['public-key'] })).toBe(pay['address']);
    expect(d.getAddress({ addressType: 'payment' as any, stakingPublicKey: stake['public-key'] })).toBe(pay['address']);
  });

  // -- with passphrase --

  it('initializes from seed + passphrase and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });

    hd.fromSeed(rootPass['seed'], rootPass['passphrase']);

    expect(hd).toBeInstanceOf(CardanoHD);
    expect(hd.getName()).toBe(rootPass['name']);
    expect(hd.getSeed()).toBe(rootPass['seed']);

    expect(hd.getRootXPrivateKey()).toBe(rootPass['root-xprivate-key']);
    expect(hd.getRootXPublicKey()).toBe(rootPass['root-xpublic-key']);
    expect(hd.getRootPrivateKey()).toBe(rootPass['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(rootPass['root-public-key']);
    expect(hd.getRootChainCode()).toBe(rootPass['root-chain-code']);
  });

  it('derives staking via CIP1852 (with passphrase) and exposes derived values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    hd.fromSeed(rootPass['seed'], rootPass['passphrase']);

    const der = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    der.fromAccount(0);
    der.fromAddress(0);

    hd.fromDerivation(der);

    expect(hd.getXPrivateKey()).toBe(stakePass['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(stakePass['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(stakePass['private-key']);
    expect(hd.getChainCode()).toBe(stakePass['chain-code']);
    expect(hd.getPublicKey()).toBe(stakePass['public-key']);
    expect(hd.getDepth()).toBe(stakePass['depth']);
    expect(hd.getPath()).toBe(stakePass['path']);
    expect(hd.getIndex()).toBe(stakePass['index']);
    expect(hd.getIndexes()).toEqual(stakePass['indexes']);
    expect(hd.getFingerprint()).toBe(stakePass['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(stakePass['parent-fingerprint']);
    expect(hd.getAddress({ addressType: 'staking' as any })).toBe(stakePass['address']);
  });

  it('switches role to external (payment, with passphrase) and exposes updated derived values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    hd.fromSeed(rootPass['seed'], rootPass['passphrase']);

    const der = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    der.fromAccount(0);
    der.fromAddress(0);
    hd.fromDerivation(der);

    der.fromRole(ROLES.EXTERNAL_CHAIN as any);
    hd.updateDerivation(der);

    expect(hd.getXPrivateKey()).toBe(payPass['xprivate-key']);
    expect(hd.getXPublicKey()).toBe(payPass['xpublic-key']);
    expect(hd.getPrivateKey()).toBe(payPass['private-key']);
    expect(hd.getChainCode()).toBe(payPass['chain-code']);
    expect(hd.getPublicKey()).toBe(payPass['public-key']);
    expect(hd.getDepth()).toBe(payPass['depth']);
    expect(hd.getPath()).toBe(payPass['path']);
    expect(hd.getIndex()).toBe(payPass['index']);
    expect(hd.getIndexes()).toEqual(payPass['indexes']);
    expect(hd.getFingerprint()).toBe(payPass['fingerprint']);
    expect(hd.getParentFingerprint()).toBe(payPass['parent-fingerprint']);
    expect(
      hd.getAddress({ addressType: 'payment' as any, stakingPublicKey: stakePass['public-key'] })
    ).toBe(payPass['address']);
  });

  // --- registry (getHDClass) - with passphrase ---

  it('registry returns the same class as a direct import (with passphrase)', () => {
    const RegistryClass = HDS.getHDClass(rootPass['name']);
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same staking and payment values (with passphrase)', () => {
    const RegistryClass = HDS.getHDClass(rootPass['name']);
    const r = new RegistryClass({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });
    const d = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_ICARUS });

    r.fromSeed(rootPass['seed'], rootPass['passphrase']);
    d.fromSeed(rootPass['seed'], rootPass['passphrase']);

    const d1 = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    d1.fromAccount(0);
    d1.fromAddress(0);

    const d2 = new CIP1852Derivation({ coinType: Cardano.COIN_TYPE, role: ROLES.STAKING_KEY });
    d2.fromAccount(0);
    d2.fromAddress(0);

    r.fromDerivation(d1);
    d.fromDerivation(d2);

    expect(r.getXPrivateKey()).toBe(stakePass['xprivate-key']);
    expect(d.getXPrivateKey()).toBe(stakePass['xprivate-key']);
    expect(r.getXPublicKey()).toBe(stakePass['xpublic-key']);
    expect(d.getXPublicKey()).toBe(stakePass['xpublic-key']);
    expect(r.getAddress({ addressType: 'staking' as any })).toBe(stakePass['address']);
    expect(d.getAddress({ addressType: 'staking' as any })).toBe(stakePass['address']);

    d1.fromRole(ROLES.EXTERNAL_CHAIN as any);
    d2.fromRole(ROLES.EXTERNAL_CHAIN as any);

    r.updateDerivation(d1);
    d.updateDerivation(d2);

    expect(r.getXPrivateKey()).toBe(payPass['xprivate-key']);
    expect(d.getXPrivateKey()).toBe(payPass['xprivate-key']);
    expect(r.getXPublicKey()).toBe(payPass['xpublic-key']);
    expect(d.getXPublicKey()).toBe(payPass['xpublic-key']);
    expect(r.getAddress({ addressType: 'payment' as any, stakingPublicKey: stakePass['public-key'] })).toBe(payPass['address']);
    expect(d.getAddress({ addressType: 'payment' as any, stakingPublicKey: stakePass['public-key'] })).toBe(payPass['address']);
  });
});
