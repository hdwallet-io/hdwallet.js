// SPDX-License-Identifier: MIT

import { BIP32HD, HDS } from '../../src/hds';
import { CustomDerivation } from '../../src/derivations';
import { Bitcoin as Cryptocurrency } from '../../src/cryptocurrencies';

const data = require('../data/json/hds.json') as any;

describe('BIP32HD', () => {
  const root = data['BIP32'];
  const drv = data['BIP32']['derivation'];

  it('initializes from seed and exposes root values', () => {
    const hd = new BIP32HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    hd.fromSeed(root['seed']);

    expect(hd).toBeInstanceOf(BIP32HD);
    expect(hd.getName()).toBe(root['name']);
    expect(hd.getSeed()).toBe(root['seed']);

    expect(
      hd.getRootXPrivateKey(Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH)
    ).toBe(root['root-xprivate-key']);
    expect(
      hd.getRootXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(root['root-xpublic-key']);

    expect(hd.getRootPrivateKey()).toBe(root['root-private-key']);
    expect(hd.getRootPublicKey()).toBe(root['root-public-key']);
    expect(hd.getRootChainCode()).toBe(root['root-chain-code']);
  });

  it('derives path via CustomDerivation and exposes child values', () => {
    const hd = new BIP32HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    hd.fromSeed(root['seed']);
    hd.fromDerivation(new CustomDerivation({ path: drv['path'] }));

    expect(
      hd.getXPrivateKey(Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xprivate-key']);
    expect(
      hd.getXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xpublic-key']);

    expect(hd.getPrivateKey()).toBe(drv['private-key']);
    expect(hd.getWIF()).toBe(drv['wif']); // <-- fixed here
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
  });

  it('generates all address formats', () => {
    const hd = new BIP32HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    hd.fromSeed(root['seed']);
    hd.fromDerivation(new CustomDerivation({ path: drv['path'] }));

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2PKH,
        publicKeyAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
      })
    ).toBe(drv['addresses']['p2pkh']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2SH,
        scriptAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
      })
    ).toBe(drv['addresses']['p2sh']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2TR,
        hrp: Cryptocurrency.NETWORKS.MAINNET.HRP,
        witnessVersion: Cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
      })
    ).toBe(drv['addresses']['p2tr']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2WPKH,
        hrp: Cryptocurrency.NETWORKS.MAINNET.HRP,
        witnessVersion: Cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
      })
    ).toBe(drv['addresses']['p2wpkh']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2WPKH_IN_P2SH,
        scriptAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
      })
    ).toBe(drv['addresses']['p2wpkh-in-p2sh']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2WSH,
        hrp: Cryptocurrency.NETWORKS.MAINNET.HRP,
        witnessVersion: Cryptocurrency.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
      })
    ).toBe(drv['addresses']['p2wsh']);

    expect(
      hd.getAddress({
        address: Cryptocurrency.ADDRESSES.P2WSH_IN_P2SH,
        scriptAddressPrefix: Cryptocurrency.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
      })
    ).toBe(drv['addresses']['p2wsh-in-p2sh']);
  });

  // --- registry (getHDClass) ---

  it('registry returns the same class as a direct import', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    expect(RegistryClass).toBe(BIP32HD);
  });

  it('registry-created and direct instances expose the same root values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new BIP32HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    expect(
      instFromRegistry.getRootXPrivateKey(
        Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH
      )
    ).toBe(root['root-xprivate-key']);
    expect(
      instDirect.getRootXPrivateKey(Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH)
    ).toBe(root['root-xprivate-key']);

    expect(
      instFromRegistry.getRootXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(root['root-xpublic-key']);
    expect(
      instDirect.getRootXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(root['root-xpublic-key']);
  });

  it('registry-created and direct instances expose the same derived child values', () => {
    const RegistryClass = HDS.getHDClass(root['name']);
    const instFromRegistry = new RegistryClass({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });
    const instDirect = new BIP32HD({
      ecc: Cryptocurrency.ECC,
      wifPrefix: Cryptocurrency.NETWORKS.MAINNET.WIF_PREFIX
    });

    instFromRegistry.fromSeed(root['seed']);
    instDirect.fromSeed(root['seed']);

    instFromRegistry.fromDerivation(new CustomDerivation({ path: drv['path'] }));
    instDirect.fromDerivation(new CustomDerivation({ path: drv['path'] }));

    expect(
      instFromRegistry.getXPrivateKey(Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xprivate-key']);
    expect(
      instDirect.getXPrivateKey(Cryptocurrency.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xprivate-key']);

    expect(
      instFromRegistry.getXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xpublic-key']);
    expect(
      instDirect.getXPublicKey(Cryptocurrency.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH)
    ).toBe(drv['xpublic-key']);

    expect(instFromRegistry.getPath()).toBe(drv['path']);
    expect(instDirect.getPath()).toBe(drv['path']);
  });
});
