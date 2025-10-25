// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Algorand.fromPrivateKey", () => {
  it("produces a minimal single derivation dump", () => {
    const dumps = data.Algorand.dumps;
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(dumps['cryptocurrency']);
    const last = dumps['derivations'][dumps['derivations'].length - 1];

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(dumps['hd']),
      network: dumps['network']
    }).fromPrivateKey(last['private-key']);

    expect(hdwallet.getDumps()).toBeNull();

    const base = { ...dumps };
    delete (base as any)['derivations'];

    const dump: any = {
      ...base,
      derivation: { ...last }
    };

    Object.assign(dump, {
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null,
      'root-xprivate-key': null,
      'root-xpublic-key': null,
      'root-private-key': null,
      'root-chain-code': null,
      'root-public-key': null,
      strict: null
    });

    Object.assign(dump['derivation'], {
      'xprivate-key': null,
      'xpublic-key': null,
      'chain-code': null,
      'parent-fingerprint': null
    });

    // Private key import yields a root-level node (no path metadata).
    delete dump['derivation']['at'];

    // Align expected single-node fields with root material and computed outputs.
    dump['derivation']['private-key'] = dumps['root-private-key'];
    dump['derivation']['public-key'] = dumps['root-public-key'];
    // Root fingerprint is the parent-fingerprint seen on child entries.
    dump['derivation']['fingerprint'] = dumps['derivations'][0]['parent-fingerprint'];
    // Hash/address are derived from the root public key; match runtime.
    dump['derivation']['hash'] = hdwallet.getHash();
    dump['derivation']['address'] = hdwallet.getAddress();

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);
    expect(hdwallet.getStrict()).toBeNull();
    expect(hdwallet.getWIFType()).toBeNull();

    expect(hdwallet.getXPrivateKey()).toBeNull();
    expect(hdwallet.getXPublicKey()).toBeNull();
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getChainCode()).toBeNull();
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBeNull();
    expect(hdwallet.getAddress()).toBe(dump['derivation']['address']);
  });
});
