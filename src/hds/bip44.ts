// SPDX-License-Identifier: MIT

import { BIP44Derivation, CHANGES } from '../derivations';
import { Bitcoin } from '../cryptocurrencies';
import { P2PKHAddress } from '../addresses';
import { BIP32HD } from './bip32';
import { PUBLIC_KEY_TYPES } from '../consts';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { ensureTypeMatch } from '../utils';
import { DerivationError } from '../exceptions';

export class BIP44HD extends BIP32HD {

  protected coinType: number;

  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
  }) {
    super(options);

    this.coinType = options.coinType ?? Bitcoin.COIN_TYPE;
    this.derivation = new BIP44Derivation({
      coinType: this.coinType,
      account: options.account ?? 0,
      change: options.change ?? CHANGES.EXTERNAL_CHAIN,
      address: options.address ?? 0
    });
  }

  static getName(): string {
    return 'BIP44';
  }

  fromCoinType(coinType: number): this {
    super.cleanDerivation();
    this.derivation.fromCoinType(coinType);
    this.fromDerivation(this.derivation);
    return this;
  }

  fromAccount(account: number | [number, number]): this {
    super.cleanDerivation();
    this.derivation.fromAccount(account);
    this.fromDerivation(this.derivation);
    return this;
  }

  fromChange(change: string | number): this {
    super.cleanDerivation();
    this.derivation.fromChange(change);
    this.fromDerivation(this.derivation);
    return this;
  }

  fromAddress(address: number | [number, number]): this {
    super.cleanDerivation();
    this.derivation.fromAddress(address);
    this.fromDerivation(this.derivation);
    return this;
  }

  fromDerivation(derivation: BIP44Derivation): this {
    this.derivation = ensureTypeMatch(
      derivation, BIP44Derivation, { errorClass: DerivationError }
    );
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  updateDerivation(derivation: BIP44Derivation): this {
    this.cleanDerivation();
    this.fromDerivation(derivation);
    return this;
  }

  cleanDerivation(): this {
    super.cleanDerivation();
    this.derivation.fromCoinType(this.coinType);
    this.derivation.fromAccount(0);
    this.derivation.fromChange(CHANGES.EXTERNAL_CHAIN);
    this.derivation.fromAddress(0);
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  getAddress(options: HDAddressOptionsInterface = {
    publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
  }): string {
    return P2PKHAddress.encode(this.publicKey!, {
      publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
      publicKeyType: this.publicKeyType
    });
  }
}
