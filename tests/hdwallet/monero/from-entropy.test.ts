// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { MoneroEntropy } from '../../../src/entropies';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Monero.fromEntropy", () => {
  it("works", () => {
    const dumps = data.Monero.dumps;
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(dumps['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(dumps['hd']),
      network: dumps['network'],
      language: dumps['language'].toLowerCase(),
      paymentID: "ad17dc6e6793d178"
    })
      .fromEntropy(new MoneroEntropy(dumps['entropy']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Monero.derivation.name))(
        data.Monero.derivation.args
      ));

    expect(hdwallet.getCryptocurrency()).toBe(dumps['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(dumps['symbol']);
    expect(hdwallet.getNetwork()).toBe(dumps['network']);
    expect(hdwallet.getCoinType()).toBe(dumps['coin-type']);
    expect(hdwallet.getEntropy()).toBe(dumps['entropy']);
    expect(hdwallet.getStrength()).toBe(dumps['strength']);
    expect(hdwallet.getMnemonic()).toBe(dumps['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(dumps['language']);
    expect(hdwallet.getSeed()).toBe(dumps['seed']);
    expect(hdwallet.getECC()).toBe(dumps['ecc']);
    expect(hdwallet.getHD()).toBe(dumps['hd']);

    expect(hdwallet.getSpendPrivateKey()).toBe(dumps['spend-private-key']);
    expect(hdwallet.getViewPrivateKey()).toBe(dumps['view-private-key']);
    expect(hdwallet.getSpendPublicKey()).toBe(dumps['spend-public-key']);
    expect(hdwallet.getViewPublicKey()).toBe(dumps['view-public-key']);

    expect(hdwallet.getPrimaryAddress()).toBe(dumps['primary-address']);
    expect(hdwallet.getIntegratedAddress("ad17dc6e6793d178")).toBe(dumps['integrated-address']);

    const last = dumps['derivations'][dumps['derivations'].length - 1];
    expect(hdwallet.getSubAddress()).toBe(last['sub-address']);

    const expectedAll = { ...dumps };
    expect(hdwallet.getDumps()).toEqual(expectedAll);

    const dump = { ...expectedAll };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
