// SPDX-License-Identifier: MIT

import { HDS, CardanoHD } from '../../../src/hds';
import { CIP1852Derivation, ROLES } from '../../../src/derivations';
import { Cardano } from '../../../src/cryptocurrencies';

const data = require('../../data/json/hds.json') as any;

describe('CardanoHD (Shelley Ledger)', () => {
  const root = data['Cardano']['shelley-ledger'];
  const stake = root['derivation-staking'];
  const pay = root['derivation-payment'];

  it('initializes from seed and exposes root values', () => {
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_LEDGER });

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
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_LEDGER });
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
    const hd = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_LEDGER });
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

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(CardanoHD);
  });

  it('registry-created and direct instances expose the same staking and payment values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const r = new RegistryClass({ cardanoType: Cardano.TYPES.SHELLEY_LEDGER });
    const d = new CardanoHD({ cardanoType: Cardano.TYPES.SHELLEY_LEDGER });

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
});
