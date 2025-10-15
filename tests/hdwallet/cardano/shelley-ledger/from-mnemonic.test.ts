// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../src';
import { CRYPTOCURRENCIES } from '../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../src/derivations';
import { BIP39Mnemonic } from '../../../../src/mnemonics';
import { HDS } from '../../../../src/hds';

const data = require('../../../data/json/hdwallet.json') as any;

describe("Cardano.ShelleyLedger.fromMnemonic", () => {
  it("works", () => {
    const src = data.Cardano['shelley-ledger'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(src['cryptocurrency'])!;

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(src['hd']),
      network: src['network'],
      language: src['language'].toLowerCase(),
      cardanoType: src['cardano-type'],
      addressType: (cryptocurrency as any).ADDRESS_TYPES.STAKING
    })
      .fromMnemonic(new BIP39Mnemonic(src['mnemonic']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Cardano.derivation.name))(
        data.Cardano.derivation.args
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
    expect(hdwallet.getCardanoType()).toBe(src['cardano-type']);

    expect(hdwallet.getRootXPrivateKey()).toBe(src['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(src['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(src['root-private-key']);
    expect(hdwallet.getRootChainCode()).toBe(src['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(src['root-public-key']);
    expect(hdwallet.getStrict()).toBe(src['strict']);

    const last = src['derivations'][src['derivations'].length - 1];

    expect(hdwallet.getPath()).toBe(last['at']['path']);
    expect(hdwallet.getIndexes()).toEqual(last['at']['indexes']);
    expect(hdwallet.getDepth()).toBe(last['at']['depth']);

    expect(hdwallet.getXPrivateKey()).toBe(last['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);

    expect(hdwallet.getAddress({ addressType: (cryptocurrency as any).ADDRESS_TYPES.STAKING }))
      .toBe(last['address']);

    expect(hdwallet.getDumps()).toEqual(src);

    const dump = { ...src };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
