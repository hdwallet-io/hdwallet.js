// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../src';
import { CRYPTOCURRENCIES } from '../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../src/derivations';
import { BIP39Mnemonic } from '../../../src/mnemonics';
import { HDS } from '../../../src/hds';

const data = require('../../data/json/hdwallet.json') as any;

describe("Algorand.fromMnemonic", () => {
  it("matches dumps and last derivation", () => {
    const dumps = data.Algorand.dumps;
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(dumps['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(dumps['hd']),
      network: dumps['network'],
      language: dumps['language']?.toLowerCase()
    })
      .fromMnemonic(new BIP39Mnemonic(dumps['mnemonic']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(data.Algorand.derivation.name))(
        data.Algorand.derivation.args
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
    expect(hdwallet.getSemantic()).toBe(dumps['semantic']);
    expect(hdwallet.getRootXPrivateKey()).toBe(dumps['root-xprivate-key']);
    expect(hdwallet.getRootXPublicKey()).toBe(dumps['root-xpublic-key']);
    expect(hdwallet.getRootPrivateKey()).toBe(dumps['root-private-key']);
    expect(hdwallet.getRootChainCode()).toBe(dumps['root-chain-code']);
    expect(hdwallet.getRootPublicKey()).toBe(dumps['root-public-key']);
    expect(hdwallet.getStrict()).toBe(dumps['strict']);
    expect(hdwallet.getWIFType()).toBeNull();

    const last = dumps['derivations'][dumps['derivations'].length - 1];

    expect(hdwallet.getPath()).toBe(last['at']['path']);
    expect(hdwallet.getIndexes()).toEqual(last['at']['indexes']);
    expect(hdwallet.getDepth()).toBe(last['at']['depth']);
    expect(hdwallet.getIndex()).toBe(last['at']['index']);

    expect(hdwallet.getXPrivateKey()).toBe(last['xprivate-key']);
    expect(hdwallet.getXPublicKey()).toBe(last['xpublic-key']);
    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getChainCode()).toBe(last['chain-code']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getHash()).toBe(last['hash']);
    expect(hdwallet.getFingerprint()).toBe(last['fingerprint']);
    expect(hdwallet.getParentFingerprint()).toBe(last['parent-fingerprint']);
    expect(hdwallet.getAddress()).toBe(last['address']);

    expect(hdwallet.getDumps()).toEqual(dumps);

    const dump = { ...dumps };
    delete (dump as any)['derivations'];
    (dump as any)['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
