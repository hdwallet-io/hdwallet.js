// SPDX-License-Identifier: MIT

import { Derivation } from './derivation';
import { normalizeIndex, normalizeDerivation, indexTupleToString } from '../utils';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType, DerivationsType } from '../types';

/**
 * Implements Electrum-style derivation for hierarchical deterministic wallets.
 *
 * Electrum derivation paths are simplified as:
 * `m / change / address_index`
 */
export class ElectrumDerivation extends Derivation {

  private change: DerivationsType;
  private address: DerivationsType;

  /**
   * Creates a new Electrum derivation path.
   * 
   * @param {DerivationOptionsInterface} [options] - Configuration options.
   * @param {number} [options.change=0] - Change index.
   * @param {number} [options.address=0] - Address index.
   */
  constructor(options: DerivationOptionsInterface = {
    change: 0, address: 0
  }) {
    super(options);
    this.change = normalizeIndex(options.change ?? 0, false);
    this.address = normalizeIndex(options.address ?? 0, false);
    this.updateDerivation();
  }

  /**
   * Returns the derivation standard name.
   * @returns {string} `'Electrum'`
   */
  static getName(): string {
    return 'Electrum';
  }

  private updateDerivation(): void {
    const [path, indexes, derivations] = normalizeDerivation(
      `m/${indexTupleToString(this.change)}/` +
      `${indexTupleToString(this.address)}`
    );
    this.derivations = derivations;
    this.indexes = indexes;
    this.path = path;
  }

  /**
   * Updates the change index and regenerates the derivation path.
   * @param {IndexType} change - Change index.
   * @returns {this} Current instance for chaining.
   */
  fromChange(change: IndexType): this {
    this.change = normalizeIndex(change, false);
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
   * Resets the derivation to change 0 and address 0.
   * @returns {this} Current instance for chaining.
   */
  clean(): this {
    this.change = normalizeIndex(0, false);
    this.address = normalizeIndex(0, false);
    this.updateDerivation();
    return this;
  }

  /**
   * Gets the current change index.
   * @returns {number} Change index.
   */
  getChange(): number {
    return this.change.length === 3 ? this.change[1] : this.change[0];
  }

  /**
   * Gets the current address index.
   * @returns {number} Address index.
   */
  getAddress(): number {
    return this.address.length === 3 ? this.address[1] : this.address[0];
  }
}
