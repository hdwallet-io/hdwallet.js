// SPDX-License-Identifier: MIT

import { Derivation } from './derivation';
import { Bitcoin } from '../cryptocurrencies';
import { normalizeIndex, normalizeDerivation, indexTupleToString } from '../utils';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType, DerivationType, DerivationsType } from '../types';
import { DerivationError } from '../exceptions';

export const CHANGES = {
  EXTERNAL_CHAIN: 'external-chain',
  INTERNAL_CHAIN: 'internal-chain'
} as const;

/**
 * Implements the BIP44 hierarchical deterministic derivation standard.
 * 
 * BIP44 defines a path structure:  
 * `m / purpose' / coin_type' / account' / change / address_index`
 */
export class BIP44Derivation extends Derivation {

  protected purpose: DerivationType = [ 44, true ];

  protected coinType: DerivationsType;
  protected account: DerivationsType;
  protected change: DerivationsType;
  protected address: DerivationsType;

  /**
   * Creates a new BIP44 derivation path.
   * 
   * @param {DerivationOptionsInterface} [options] - Derivation configuration.
   * @param {number|string} [options.coinType=Bitcoin.COIN_TYPE] - Cryptocurrency coin type.
   * @param {number} [options.account=0] - Account index.
   * @param {string|number} [options.change='external-chain'] - Change type or index.
   * @param {number} [options.address=0] - Address index.
   * @throws {DerivationError} If the change parameter is invalid.
   */
  constructor(options: DerivationOptionsInterface = {
    coinType: Bitcoin.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
  }) {
    super(options);
    this.coinType = normalizeIndex(options.coinType ?? Bitcoin.COIN_TYPE, true);
    this.account = normalizeIndex(options.account ?? 0, true);
    this.change = normalizeIndex(this.getChangeValue(
      options.change ?? CHANGES.EXTERNAL_CHAIN
    ), false);
    this.address = normalizeIndex(options.address ?? 0, false);
    this.updateDerivation();
  }

  /**
   * Returns the derivation standard name.
   * @returns {string} `'BIP44'`
   */
  static getName(): string {
    return 'BIP44';
  }
  
  /**
   * Maps the given change value to its numeric or name form.
   *
   * @protected
   * @param {IndexType} change - Change value (`0`, `1`, `'external-chain'`, or `'internal-chain'`).
   * @param {boolean} [nameOnly=false] - If true, returns string name; otherwise numeric index.
   * @returns {number|string} Mapped change value.
   * @throws {DerivationError} If the change parameter is invalid.
   */
  protected getChangeValue(
    change: IndexType, nameOnly: boolean = false
  ): any {
    if (Array.isArray(change)) {
      throw new DerivationError('Bad change instance', {
        expected: 'number | string', got: typeof change
      });
    }
    const externalChange = [ CHANGES.EXTERNAL_CHAIN, 0, '0' ];
    const internalChange = [ CHANGES.INTERNAL_CHAIN, 1, '1' ];
    const exceptedChange = [ 
      ...externalChange, ...internalChange 
    ];
    if (!exceptedChange.includes(change)) {
      throw new DerivationError(
        `Bad ${this.getName()} change index`, {
          expected: exceptedChange, got: change
        }
      );
    }
    if (externalChange.includes(change)) return nameOnly ? CHANGES.EXTERNAL_CHAIN : 0;
    if (internalChange.includes(change)) return nameOnly ? CHANGES.INTERNAL_CHAIN : 1;
  }

  /**
   * Updates internal path, derivations, and indexes based on current parameters.
   * @protected
   */
  protected updateDerivation(): void {
    const [path, indexes, derivations] = normalizeDerivation(
      `m/${indexTupleToString(this.purpose)}/` +
      `${indexTupleToString(this.coinType)}/` +
      `${indexTupleToString(this.account)}/` +
      `${indexTupleToString(this.change)}/` +
      `${indexTupleToString(this.address)}`
    );
    this.derivations = derivations;
    this.indexes = indexes;
    this.path = path;
  }

  /**
   * Updates the coin type and regenerates the derivation path.
   * @param {string|number} coinType - Coin type index (e.g., `0` for Bitcoin).
   * @returns {this} Current instance for chaining.
   */
  fromCoinType(coinType: string | number): this {
    this.coinType = normalizeIndex(coinType, true);
    this.updateDerivation();
    return this;
  }

  /**
   * Updates the account index and regenerates the derivation path.
   * @param {IndexType} account - Account index.
   * @returns {this} Current instance for chaining.
   */
  fromAccount(account: IndexType): this {
    this.account = normalizeIndex(account, true);
    this.updateDerivation();
    return this;
  }

  /**
   * Updates the change type and regenerates the derivation path.
   * @param {string|number} change - Change type or index.
   * @returns {this} Current instance for chaining.
   * @throws {DerivationError} If the change value is invalid.
   */
  fromChange(change: string | number): this {
    this.change = normalizeIndex(this.getChangeValue(change), false);
    this.updateDerivation();
    return this;
  }

  /**
   * Updates the address index and regenerates the derivation path.
   * @param {IndexType} address - Address index.
   * @returns {this} Current instance for chaining.
   */
  fromAddress(address: IndexType): this {
    this.address = normalizeIndex(address, false);
    this.updateDerivation();
    return this;
  }

  /**
   * Resets the derivation to account `0`, change `'external-chain'`, and address `0`.
   * @returns {this} Current instance for chaining.
   */
  clean(): this {
    this.account = normalizeIndex(0, true);
    this.change = normalizeIndex(
      this.getChangeValue(CHANGES.EXTERNAL_CHAIN), false
    );
    this.address = normalizeIndex(0, false);
    this.updateDerivation();
    return this;
  }

  /**
   * Gets the BIP purpose (always `44`).
   * @returns {number} The BIP purpose index.
   */
  getPurpose(): number {
    return this.purpose[0];
  }

  /**
   * Gets the current coin type index.
   * @returns {number} Coin type index.
   */
  getCoinType(): number {
    return this.coinType[0];
  }

  /**
   * Gets the current account index.
   * @returns {number} Account index.
   */
  getAccount(): number {
    return this.account.length === 3 ? this.account[1] : this.account[0];
  }

  /**
   * Gets the change name or index value.
   * @param {boolean} [nameOnly=true] - Whether to return `'external-chain'` or `'internal-chain'` instead of `0` or `1`.
   * @returns {string} The change name if `nameOnly=true`; otherwise the index.
   */
  getChange(nameOnly: boolean = true): string {
    return this.getChangeValue(this.change[0], nameOnly);
  }

  /**
   * Gets the address index.
   * @returns {number} Address index.
   */
  getAddress(): number {
    return this.address.length === 3 ? this.address[1] : this.address[0];
  }
}
