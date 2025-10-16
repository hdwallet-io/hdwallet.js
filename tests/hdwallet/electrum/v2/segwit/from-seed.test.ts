// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../../src';
import { CRYPTOCURRENCIES } from '../../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../../src/derivations';
import { HDS } from '../../../../../src/hds';
import { ElectrumV2Seed } from '../../../../../src/seeds';

const data = require('../../../../data/json/hdwallet.json') as any;

describe("Electrum-V2.segwit.fromSeed", () => {
  it("works", () => {
    const v1 = data['Electrum-V1'];
    const v2 = data['Electrum-V2'];
    const root = v2['segwit'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(root['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(root['hd']),
      network: root['network'],
      mnemonicType: root['mnemonic-type'],
      mode: root['mode'],
      publicKeyType: root['public-key-type']
    })
      .fromSeed(new ElectrumV2Seed(root['seed']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(v1['derivation']['name']))(
        v1['derivation']['args']
      ));

    const expectedDump: any = {
      ...root,
      'entropy': null,
      'strength': null,
      'mnemonic': null,
      'passphrase': null,
      'language': null
    };

    expect(hdwallet.getDumps()).toEqual(expectedDump);

    const last = root['derivations'][root['derivations'].length - 1];
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
