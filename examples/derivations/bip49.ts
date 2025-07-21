// SPDX-License-Identifier: MIT

import { Bitcoin, Qtum } from '../../src/cryptocurrencies';
import { DERIVATIONS, BIP49Derivation, CHANGES } from '../../src/derivations';
import { isAllEqual } from '../../src/utils';

const data = {
  name: 'BIP49',
  purpose: 49,
  coinType: Qtum.COIN_TYPE,
  account: 0,
  change: 'external-chain',
  address: 0,
  path: "m/49'/2301'/0'/0/0",
  indexes: [ 2147483697, 2147485949, 2147483648, 0, 0 ],
  depth: 5,
  derivations: [
    {
      coinType: Qtum.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
    },
    {
      coinType: '2301', account: '0', change: 'external-chain', address: '0'
    },
    {
      coinType: 2301, account: '0', change: 0, address: '0'
    }
  ],
  default: {
    purpose: 49,
    coinType: Bitcoin.COIN_TYPE,
    account: 0,
    change: 'external-chain',
    address: 0,
    path: "m/49'/0'/0'/0/0",
    indexes: [ 2147483697, 2147483648, 2147483648, 0, 0 ],
    depth: 5
  }
}

const BIP49DerivationClass: typeof BIP49Derivation = DERIVATIONS.getDerivationClass(data.name);

for (let derivation of data.derivations) {

  const bip49DerivationClass: BIP49Derivation = new BIP49DerivationClass({
    coinType: derivation.coinType, account: derivation.account, change: derivation.change, address: derivation.address
  });
  const bip49Derivation: BIP49Derivation = new BIP49Derivation({
    coinType: derivation.coinType, account: derivation.account, change: derivation.change, address: derivation.address
  });

  console.log(
    isAllEqual(bip49DerivationClass.getPurpose(), bip49Derivation.getPurpose(), data.purpose),
    isAllEqual(bip49DerivationClass.getCoinType(), bip49Derivation.getCoinType(), data.coinType),
    isAllEqual(bip49DerivationClass.getAccount(), bip49Derivation.getAccount(), data.account),
    isAllEqual(bip49DerivationClass.getChange(true), bip49Derivation.getChange(true), data.change),
    isAllEqual(bip49DerivationClass.getAddress(), bip49Derivation.getAddress(), data.address),
    isAllEqual(bip49DerivationClass.getPath(), bip49Derivation.getPath(), data.path),
    isAllEqual(bip49DerivationClass.getIndexes(), bip49Derivation.getIndexes(), data.indexes),
    isAllEqual(bip49DerivationClass.getDepth(), bip49Derivation.getDepth(), data.depth),
  );

  bip49DerivationClass.clean();
  bip49Derivation.clean();

  console.log(
    isAllEqual(bip49DerivationClass.getPurpose(), bip49Derivation.getPurpose(), data.default.purpose),
    isAllEqual(bip49DerivationClass.getCoinType(), bip49Derivation.getCoinType(), data.default.coinType),
    isAllEqual(bip49DerivationClass.getAccount(), bip49Derivation.getAccount(), data.default.account),
    isAllEqual(bip49DerivationClass.getChange(true), bip49Derivation.getChange(true), data.default.change),
    isAllEqual(bip49DerivationClass.getAddress(), bip49Derivation.getAddress(), data.default.address),
    isAllEqual(bip49DerivationClass.getPath(), bip49Derivation.getPath(), data.default.path),
    isAllEqual(bip49DerivationClass.getIndexes(), bip49Derivation.getIndexes(), data.default.indexes),
    isAllEqual(bip49DerivationClass.getDepth(), bip49Derivation.getDepth(), data.default.depth),
  );

  bip49DerivationClass.fromCoinType(derivation.coinType);
  bip49Derivation.fromCoinType(derivation.coinType);
  bip49DerivationClass.fromAccount(derivation.account);
  bip49Derivation.fromAccount(derivation.account);
  bip49DerivationClass.fromChange(derivation.change);
  bip49Derivation.fromChange(derivation.change);
  bip49DerivationClass.fromAddress(derivation.address);
  bip49Derivation.fromAddress(derivation.address);

  console.log(
    isAllEqual(bip49DerivationClass.getPurpose(), bip49Derivation.getPurpose(), data.purpose),
    isAllEqual(bip49DerivationClass.getCoinType(), bip49Derivation.getCoinType(), data.coinType),
    isAllEqual(bip49DerivationClass.getAccount(), bip49Derivation.getAccount(), data.account),
    isAllEqual(bip49DerivationClass.getChange(true), bip49Derivation.getChange(true), data.change),
    isAllEqual(bip49DerivationClass.getAddress(), bip49Derivation.getAddress(), data.address),
    isAllEqual(bip49DerivationClass.getPath(), bip49Derivation.getPath(), data.path),
    isAllEqual(bip49DerivationClass.getIndexes(), bip49Derivation.getIndexes(), data.indexes),
    isAllEqual(bip49DerivationClass.getDepth(), bip49Derivation.getDepth(), data.depth), '\n'
  );
}

console.log('Purpose:', data.purpose);
console.log('Coin Type:', data.coinType);
console.log('Account:', data.account);
console.log('Change:', data.change);
console.log('Address:', data.address, '\n');

console.log('Path:', data.path);
console.log('Indexes:', data.indexes);
console.log('Depth:', data.depth);
