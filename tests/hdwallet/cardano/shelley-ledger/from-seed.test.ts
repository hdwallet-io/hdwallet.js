// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../src';
import { CRYPTOCURRENCIES } from '../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../src/derivations';
import { CardanoSeed } from '../../../../src/seeds';
import { HDS } from '../../../../src/hds';

const data = require('../../../data/json/hdwallet.json') as any;

describe("Cardano.ShelleyLedger.fromSeed", () => {
  it("works", () => {
    const src = data.Cardano['shelley-ledger'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(src['cryptocurrency'])!;

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(src['hd']),
      network: src['network'],
      cardanoType: src['cardano-type'],
      addressType: (cryptocurrency as any).ADDRESS_TYPES.STAKING
    })
      .fromSeed(new CardanoSeed(src['seed']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Cardano.derivation.name))(
        data.Cardano.derivation.args
      ));

    const expected = {
      ...src,
      entropy: null,
      strength: null,
      mnemonic: null,
      passphrase: null,
      language: null
    };

    expect(hdwallet.getDumps()).toEqual(expected);

    const dump = { ...expected } as any;
    const last = src['derivations'][src['derivations'].length - 1];
    delete dump['derivations'];
    dump['derivation'] = { ...last };

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
    expect(hdwallet.getCardanoType()).toBe(dump['cardano-type']);
    expect(hdwallet.getRootXPrivateKey()).toBe(dump['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(dump['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(dump['root-private-key']);
    expect(hdwallet.getRootChainCode()).toBe(dump['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(dump['root-public-key']);
    expect(hdwallet.getStrict()).toBe(dump['strict']);

    expect(hdwallet.getXPrivateKey()).toBe(dump['derivation']['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(dump['derivation']['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getChainCode()).toBe(dump['derivation']['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getHash()).toBe(dump['derivation']['hash']);
    expect(hdwallet.getFingerprint()).toBe(dump['derivation']['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(dump['derivation']['parent-fingerprint']);

    expect(hdwallet.getAddress({ addressType: (cryptocurrency as any).ADDRESS_TYPES.STAKING }))
      .toBe(dump['derivation']['address']);
  });
});
