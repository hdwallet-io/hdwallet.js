// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Monero.fromSpendPrivateKey", () => {
  it("works", () => {
    const dumps = data.Monero.dumps;
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(dumps['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(dumps['hd']),
      network: dumps['network'],
      language: dumps['language'].toLowerCase(),
      paymentID: "ad17dc6e6793d178"
    })
      .fromSpendPrivateKey(dumps['spend-private-key'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Monero.derivation.name))(
        data.Monero.derivation.args
      ));

    const expected = {
      ...dumps,
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null,
      seed: null
    };
    expect(hdwallet.getDumps()).toEqual(expected);

    const dump = { ...expected };
    const last = dumps['derivations'][dumps['derivations'].length - 1];
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };

    expect(hdwallet.getDump()).toEqual(dump);

    expect(hdwallet.getCryptocurrency()).toBe(dump['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dump['symbol']);
    expect(hdwallet.getNetwork()).toBe(dump['network']);
    expect(hdwallet.getCoinType()).toBe(dump['coin-type']);
    expect(hdwallet.getEntropy()).toBe(dump['entropy']);
    expect(hdwallet.getStrength()).toBe(dump['strength']);
    expect(hdwallet.getMnemonic()).toBe(dump['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(dump['language']);
    expect(hdwallet.getSeed()).toBe(dump['seed']);
    expect(hdwallet.getECC()).toBe(dump['ecc']);
    expect(hdwallet.getHD()).toBe(dump['hd']);

    expect(hdwallet.getSpendPrivateKey()).toBe(dump['spend-private-key']);
    expect(hdwallet.getViewPrivateKey()).toBe(dump['view-private-key']);
    expect(hdwallet.getSpendPublicKey()).toBe(dump['spend-public-key']);
    expect(hdwallet.getViewPublicKey()).toBe(dump['view-public-key']);

    expect(hdwallet.getPrimaryAddress()).toBe(dump['primary-address']);
    expect(hdwallet.getIntegratedAddress("ad17dc6e6793d178")).toBe(dump['integrated-address']);

    expect(hdwallet.getSubAddress()).toBe(dump['derivation']['sub-address']);
  });
});
