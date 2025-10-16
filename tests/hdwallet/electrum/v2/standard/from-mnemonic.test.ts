// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../../src';
import { CRYPTOCURRENCIES } from '../../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../../src/derivations';
import { HDS } from '../../../../../src/hds';
import { ELECTRUM_V2_MNEMONIC_TYPES, ElectrumV2Mnemonic } from '../../../../../src/mnemonics';

const data = require('../../../../data/json/hdwallet.json') as any;

describe("Electrum-V2.standard.fromMnemonic", () => {
  it("works", () => {
    const v1 = data['Electrum-V1'];
    const v2 = data['Electrum-V2'];
    const root = v2['standard'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(root['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(root['hd']),
      network: root['network'],
      language: root['language'].toLowerCase(),
      mnemonicType: root['mnemonic-type'],
      mode: root['mode'],
      publicKeyType: root['public-key-type']
    })
      .fromMnemonic(
        new ElectrumV2Mnemonic(root['mnemonic'], { 
            mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
          }
        )
      )
      .fromDerivation(new (DERIVATIONS.getDerivationClass(v1['derivation']['name']))(
        v1['derivation']['args']
      ));

    expect(hdwallet.getCryptocurrency()).toBe(root['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(root['symbol']);
    expect(hdwallet.getNetwork()).toBe(root['network']);
    expect(hdwallet.getCoinType()).toBe(root['coin-type']);
    expect(hdwallet.getEntropy()).toBe(root['entropy']);
    expect(hdwallet.getStrength()).toBe(root['strength']);
    expect(hdwallet.getMnemonic()).toBe(root['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(root['language']);
    expect(hdwallet.getSeed()).toBe(root['seed']);
    expect(hdwallet.getECC()).toBe(root['ecc']);
    expect(hdwallet.getHD()).toBe(root['hd']);
    expect(hdwallet.getMasterPrivateKey()).toBe(root['master-private-key']);
    expect(hdwallet.getMasterWIF()).toBe(root['master-wif']);
    expect(hdwallet.getMasterPublicKey()).toBe(root['master-public-key']);
    expect(hdwallet.getPublicKeyType()).toBe(root['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(root['wif-type']);

    const last = root['derivations'][root['derivations'].length - 1];

    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getWIF()).toBe(last['wif']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);

    expect(hdwallet.getAddress()).toBe(last['address']);
    expect(hdwallet.getDumps()).toEqual(root);

    const dump: any = { ...root };
    delete dump['derivations'];
    dump['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
