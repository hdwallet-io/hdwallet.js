// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Monero.fromPrivateKey", () => {
  it("works", () => {
    const src = data.Monero['from-private-key'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(src['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(src['hd']),
      network: src['network']
    })
      .fromPrivateKey(src['private-key'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Monero.derivation.name))(
        data.Monero.derivation.args
      ));

    expect(hdwallet.getCryptocurrency()).toBe(src['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(src['symbol']);
    expect(hdwallet.getNetwork()).toBe(src['network']);
    expect(hdwallet.getCoinType()).toBe(src['coin-type']);
    expect(hdwallet.getEntropy()).toBe(src['entropy']);
    expect(hdwallet.getStrength()).toBe(src['strength']);
    expect(hdwallet.getMnemonic()).toBe(src['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(src['language']);
    expect(hdwallet.getSeed()).toBe(src['seed']);
    expect(hdwallet.getECC()).toBe(src['ecc']);
    expect(hdwallet.getHD()).toBe(src['hd']);

    expect(hdwallet.getSpendPrivateKey()).toBe(src['spend-private-key']);
    expect(hdwallet.getViewPrivateKey()).toBe(src['view-private-key']);
    expect(hdwallet.getSpendPublicKey()).toBe(src['spend-public-key']);
    expect(hdwallet.getViewPublicKey()).toBe(src['view-public-key']);

    expect(hdwallet.getPrimaryAddress()).toBe(src['primary-address']);

    const last = src['derivations'][src['derivations'].length - 1];
    expect(hdwallet.getSubAddress()).toBe(last['sub-address']);

    const expectedAll = { ...src };
    expect(hdwallet.getDumps()).toEqual(expectedAll);

    const dump = { ...expectedAll };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
