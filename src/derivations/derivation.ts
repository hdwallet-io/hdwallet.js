// SPDX-License-Identifier: MIT

import { normalizeDerivation } from '../utils';
import { DerivationOptionsInterface } from '../interfaces';
import { DerivationsType, DerivationType } from '../types';

/**
 * Base abstract class for all hierarchical deterministic derivations.
 *
 * Provides common functionality such as normalization, path management,
 * and standard interface definitions for BIP-based and custom derivations.
 *
 * Subclasses (like BIP44Derivation, CIP1852Derivation, etc.) must override
 * abstract methods like `getName()`, `clean()`, `getPurpose()`, `getCoinType()`, etc.
 */
export class Derivation {

  path: string;
  indexes: number[];
  derivations: DerivationsType[];

  protected purpose: DerivationType = [ 0, true ];

  /**
   * Creates a new derivation instance.
   *
   * @param {DerivationOptionsInterface} [options] - Optional derivation configuration.
   * @param {string} [options.path] - Derivation path (e.g., `'m/44'/0'/0'/0/0'`).
   * @param {number[]} [options.indexes] - Array of derivation indexes.
   */
  constructor(
    options: DerivationOptionsInterface = { }
  ) {
    const [path, indexes, derivations] = normalizeDerivation(
      options?.path, options?.indexes
    );
    this.derivations = derivations;
    this.indexes = indexes;
    this.path = path;
  }

  /**
   * Returns the name of the derivation standard (e.g., `'BIP44'`).
   * Must be overridden in subclasses.
   * @returns {string}
   * @throws {Error} Must override in subclass.
   */
  static getName(): string {
    throw new Error('Must override getName()');
  }

  /**
   * Returns the derivation standard name for the current instance.
   * @returns {string} The derivation standard name.
   */
  getName(): string {
    return (this.constructor as typeof Derivation).getName();
  }

  /**
   * Resets the derivation to its default clean state.
   * Must be implemented by subclasses.
   * @returns {this}
   * @throws {Error} Must override in subclass.
   */
  clean(): this {
    throw new Error('Must override clean()');
  }

  /**
   * Returns the full derivation path.
   * @returns {string} The derivation path (e.g., `'m/44'/0'/0'/0/0'`).
   */
  getPath(): string {
    return this.path;
  }

  /**
   * Returns the list of indexes in the derivation path.
   * @returns {number[]} Array of index numbers.
   */
  getIndexes(): number[] {
    return this.indexes;
  }

  /**
   * Returns the structured derivations array.
   * @returns {DerivationsType[]} Array of derivation tuples.
   */
  getDerivations(): DerivationsType[] {
    return this.derivations;
  }

  /**
   * Returns the depth (number of derivation levels).
   * @returns {number} The depth of the derivation path.
   */
  getDepth(): number {
    return this.derivations.length;
  }

  /**
   * Returns the derivation purpose (e.g., `44` for BIP44).
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getPurpose(): number {
    throw new Error('Must override getPurpose()');
  }

  /**
   * Returns the coin type (e.g., `0` for Bitcoin).
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getCoinType(): number {
    throw new Error('Must override getCoinType()');
  }

  /**
   * Returns the account index.
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getAccount(): number {
    throw new Error('Must override getAccount()');
  }

  /**
   * Returns the change chain identifier.
   * Must be implemented by subclasses.
   * @param {...any} args - Optional arguments for change formatting.
   * @returns {string|number}
   */
  getChange(...args: any[]): string | number {
    throw new Error('Must override getChange()');
  }

  /**
   * Returns the role name in role-based derivations (e.g., `'external'`, `'staking'`).
   * Must be implemented by subclasses.
   * @param {...any} args - Optional arguments for role formatting.
   * @returns {string}
   */
  getRole(...args: any[]): string {
    throw new Error('Must override getRole()');
  }

  /**
   * Returns the address index.
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getAddress(): number {
    throw new Error('Must override getAddress()');
  }

  /**
   * Returns the minor index (if applicable in hierarchical standards).
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getMinor(): number {
    throw new Error('Must override getMinor()');
  }

  /**
   * Returns the major index (if applicable in hierarchical standards).
   * Must be implemented by subclasses.
   * @returns {number}
   */
  getMajor(): number {
    throw new Error('Must override getMajor()');
  }
}
