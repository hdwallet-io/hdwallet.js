// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../src';
import { CRYPTOCURRENCIES } from '../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../src/derivations';
import { HDS } from '../../../../src/hds';

const data = require('../../../data/json/hdwallet.json') as any;

describe("Electrum-V1.fromWIF", () => {
  it("compressed", () => {
    const root = data['Electrum-V1'];
    const compressed = root['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      publicKeyType: compressed['public-key-type']
    })
      .fromWIF(compressed['master-wif'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(root['derivation']['name']))(
        root['derivation']['args']
      ));

    const expectedDump: any = {
      ...compressed,
      'entropy': null,
      'strength': null,
      'mnemonic': null,
      'passphrase': null,
      'language': null,
      'seed': null
    };

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = compressed['derivations'][compressed['derivations'].length - 1];
    const dump: any = { ...expectedDump };
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
    expect(hdwallet.getMasterPrivateKey()).toBe(dump['master-private-key']);
    expect(hdwallet.getMasterWIF()).toBe(dump['master-wif']);
    expect(hdwallet.getMasterPublicKey()).toBe(dump['master-public-key']);
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);

    expect(hdwallet.getAddress()).toBe(dump['derivation']['address']);
  });

  it("uncompressed", () => {
    const root = data['Electrum-V1'];
    const uncompressed = root['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      publicKeyType: uncompressed['public-key-type']
    })
      .fromWIF(uncompressed['master-wif'])
      .fromDerivation(new (DERIVATIONS.getDerivationClass(root['derivation']['name']))(
        root['derivation']['args']
      ));

    const expectedDump: any = {
      ...uncompressed,
      'entropy': null,
      'strength': null,
      'mnemonic': null,
      'passphrase': null,
      'language': null,
      'seed': null
    };

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = uncompressed['derivations'][uncompressed['derivations'].length - 1];
    const dump: any = { ...expectedDump };
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
    expect(hdwallet.getMasterPrivateKey()).toBe(dump['master-private-key']);
    expect(hdwallet.getMasterWIF()).toBe(dump['master-wif']);
    expect(hdwallet.getMasterPublicKey()).toBe(dump['master-public-key']);
    expect(hdwallet.getPublicKeyType()).toBe(dump['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(dump['wif-type']);

    expect(hdwallet.getPrivateKey()).toBe(dump['derivation']['private-key']);
    expect(hdwallet.getWIF()).toBe(dump['derivation']['wif']);
    expect(hdwallet.getPublicKey()).toBe(dump['derivation']['public-key']);
    expect(hdwallet.getUncompressed()).toBe(dump['derivation']['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(dump['derivation']['compressed']);

    expect(hdwallet.getAddress()).toBe(dump['derivation']['address']);
  });
});
