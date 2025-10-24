// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Algorand.fromXPrivateKey", () => {
  it("nulls entropy/mnemonic/seed fields, preserves xpriv semantics", () => {
    const dumps = data.Algorand.dumps;
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(dumps['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(dumps['hd'])
    })
      .fromXPrivateKey(dumps['root-xprivate-key'], dumps['strict'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Algorand.derivation.name))(
        data.Algorand.derivation.args
      ));

    const expectedDump = {
      ...dumps,
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null
    };

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = dumps['derivations'][dumps['derivations'].length - 1];
    const dump = { ...expectedDump };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dumps['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dumps['symbol']);
    expect(hdwallet.getNetwork()).toBe(dumps['network']);
    expect(hdwallet.getCoinType()).toBe(dumps['coin-type']);
    expect(hdwallet.getEntropy()).toBeNull();
    expect(hdwallet.getStrength()).toBeNull();
    expect(hdwallet.getMnemonic()).toBeNull();
    expect(hdwallet.getLanguage()).toBeNull();
    expect(hdwallet.getSeed()).toBeNull();
    expect(hdwallet.getECC()).toBe(dumps['ecc']);
    expect(hdwallet.getHD()).toBe(dumps['hd']);
    expect(hdwallet.getSemantic()).toBe(dumps['semantic']);
    expect(hdwallet.getRootXPrivateKey()).toBe(dumps['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(dumps['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(dumps['root-private-key']);
    expect(hdwallet.getRootChainCode()).toBe(dumps['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(dumps['root-public-key']);
    expect(hdwallet.getStrict()).toBe(dumps['strict']);
    expect(hdwallet.getWIFType()).toBeNull();

    expect(hdwallet.getXPrivateKey()).toBe(last['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);
    expect(hdwallet.getAddress()).toBe(last['address']);
  });
});
