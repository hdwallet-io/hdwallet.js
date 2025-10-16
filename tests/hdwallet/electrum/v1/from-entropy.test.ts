// SPDX-License-Identifier: MIT

import { HDWallet } from '../../../../src';
import { CRYPTOCURRENCIES } from '../../../../src/cryptocurrencies';
import { DERIVATIONS } from '../../../../src/derivations';
import { ElectrumV1Entropy } from '../../../../src/entropies';
import { HDS } from '../../../../src/hds';

const data = require('../../../data/json/hdwallet.json') as any;

describe("Electrum-V1.fromEntropy", () => {
  it("compressed", () => {
    const root = data['Electrum-V1'];
    const compressed = root['compressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(compressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(compressed['hd']),
      network: compressed['network'],
      language: compressed['language'].toLowerCase(),
      publicKeyType: compressed['public-key-type']
    })
      .fromEntropy(new ElectrumV1Entropy(compressed['entropy']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(root['derivation']['name']))(
        root['derivation']['args']
      ));

    expect(hdwallet.getCryptocurrency()).toBe(compressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(compressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(compressed['network']);
    expect(hdwallet.getCoinType()).toBe(compressed['coin-type']);
    expect(hdwallet.getEntropy()).toBe(compressed['entropy']);
    expect(hdwallet.getStrength()).toBe(compressed['strength']);
    expect(hdwallet.getMnemonic()).toBe(compressed['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(compressed['language']);
    expect(hdwallet.getSeed()).toBe(compressed['seed']);
    expect(hdwallet.getECC()).toBe(compressed['ecc']);
    expect(hdwallet.getHD()).toBe(compressed['hd']);
    expect(hdwallet.getMasterPrivateKey()).toBe(compressed['master-private-key']);
    expect(hdwallet.getMasterWIF()).toBe(compressed['master-wif']);
    expect(hdwallet.getMasterPublicKey()).toBe(compressed['master-public-key']);
    expect(hdwallet.getPublicKeyType()).toBe(compressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(compressed['wif-type']);

    const last = compressed['derivations'][compressed['derivations'].length - 1];

    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getWIF()).toBe(last['wif']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);

    expect(hdwallet.getAddress()).toBe(last['address']);
    expect(hdwallet.getDumps()).toEqual(compressed);

    const dump: any = { ...compressed };
    delete dump['derivations'];
    dump['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });

  it("uncompressed", () => {
    const root = data['Electrum-V1'];
    const uncompressed = root['uncompressed'];
    const cryptocurrency = CRYPTOCURRENCIES.getCryptocurrencyClass(uncompressed['cryptocurrency']);

    const hdwallet = new HDWallet(cryptocurrency, {
      hd: HDS.getHDClass(uncompressed['hd']),
      network: uncompressed['network'],
      language: uncompressed['language'].toLowerCase(),
      publicKeyType: uncompressed['public-key-type']
    })
      .fromEntropy(new ElectrumV1Entropy(uncompressed['entropy']))
      .fromDerivation(new (DERIVATIONS.getDerivationClass(root['derivation']['name']))(
        root['derivation']['args']
      ));

    expect(hdwallet.getCryptocurrency()).toBe(uncompressed['cryptocurrency']);
    expect(hdwallet.getSymbol()).toBe(uncompressed['symbol']);
    expect(hdwallet.getNetwork()).toBe(uncompressed['network']);
    expect(hdwallet.getCoinType()).toBe(uncompressed['coin-type']);
    expect(hdwallet.getEntropy()).toBe(uncompressed['entropy']);
    expect(hdwallet.getStrength()).toBe(uncompressed['strength']);
    expect(hdwallet.getMnemonic()).toBe(uncompressed['mnemonic']);
    expect(hdwallet.getLanguage()).toBe(uncompressed['language']);
    expect(hdwallet.getSeed()).toBe(uncompressed['seed']);
    expect(hdwallet.getECC()).toBe(uncompressed['ecc']);
    expect(hdwallet.getHD()).toBe(uncompressed['hd']);
    expect(hdwallet.getMasterPrivateKey()).toBe(uncompressed['master-private-key']);
    expect(hdwallet.getMasterWIF()).toBe(uncompressed['master-wif']);
    expect(hdwallet.getMasterPublicKey()).toBe(uncompressed['master-public-key']);
    expect(hdwallet.getPublicKeyType()).toBe(uncompressed['public-key-type']);
    expect(hdwallet.getWIFType()).toBe(uncompressed['wif-type']);

    const last = uncompressed['derivations'][uncompressed['derivations'].length - 1];

    expect(hdwallet.getPrivateKey()).toBe(last['private-key']);
    expect(hdwallet.getWIF()).toBe(last['wif']);
    expect(hdwallet.getPublicKey()).toBe(last['public-key']);
    expect(hdwallet.getUncompressed()).toBe(last['uncompressed']);
    expect(hdwallet.getCompressed()).toBe(last['compressed']);

    expect(hdwallet.getAddress()).toBe(last['address']);
    expect(hdwallet.getDumps()).toEqual(uncompressed);

    const dump: any = { ...uncompressed };
    delete dump['derivations'];
    dump['derivation'] = { ...last };
    expect(hdwallet.getDump()).toEqual(dump);
  });
});
