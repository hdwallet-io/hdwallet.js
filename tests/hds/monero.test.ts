// SPDX-License-Identifier: MIT

import { HDS, MoneroHD } from '../../src/hds';
import { Monero } from '../../src/cryptocurrencies';

const data = require('../data/json/hds.json') as any;

describe('MoneroHD', () => {
  const root = data['Monero'];

  it('initializes from seed and exposes root values', () => {
    const hd = new MoneroHD({
      network: Monero.NETWORKS.MAINNET
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(MoneroHD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(hd.getSpendPrivateKey()).toBe(root['spend-private-key']);
    expect(hd.getViewPrivateKey()).toBe(root['view-private-key']);
    expect(hd.getSpendPublicKey()).toBe(root['spend-public-key']);
    expect(hd.getViewPublicKey()).toBe(root['view-public-key']);

    expect(hd.getPrimaryAddress()).toBe(root['primary-address']);
    expect(hd.getIntegratedAddress(root['payment-id'])).toBe(root['integrated-address']);
  });

  it('derives subaddresses for (minor, major) pairs', () => {
    const hd = new MoneroHD({
      network: Monero.NETWORKS.MAINNET
    });

    hd.fromSeed(root['seed']);

    for (const sa of root['sub-addresses']) {
      expect(
        hd.getSubAddress(sa['minor'], sa['major'])
      ).toBe(sa['address']);
    }
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(MoneroHD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({
      network: Monero.NETWORKS.MAINNET
    });
    const instDirect = new MoneroHD({
      network: Monero.NETWORKS.MAINNET
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(instFromRegistry.getSpendPrivateKey()).toBe(root['spend-private-key']);
    expect(instDirect.getSpendPrivateKey()).toBe(root['spend-private-key']);

    expect(instFromRegistry.getViewPrivateKey()).toBe(root['view-private-key']);
    expect(instDirect.getViewPrivateKey()).toBe(root['view-private-key']);

    expect(instFromRegistry.getPrimaryAddress()).toBe(root['primary-address']);
    expect(instDirect.getPrimaryAddress()).toBe(root['primary-address']);
  });

  it('registry-created and direct instances expose the same derived subaddresses', () => {
    const RegistryClass = HDS.getHDClass(root['name']);

    const instFromRegistry = new RegistryClass({
      network: Monero.NETWORKS.MAINNET
    });
    const instDirect = new MoneroHD({
      network: Monero.NETWORKS.MAINNET
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    for (const sa of root['sub-addresses']) {
      expect(
        instFromRegistry.getSubAddress(sa['minor'], sa['major'])
      ).toBe(sa['address']);
      expect(
        instDirect.getSubAddress(sa['minor'], sa['major'])
      ).toBe(sa['address']);
    }
  });
});
