// SPDX-License-Identifier: MIT

import { Entropy } from './entropy';
import { AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS } from './algorand';
import { BIP39Entropy, BIP39_ENTROPY_STRENGTHS } from './bip39';
import { ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS } from './electrum/v1';
import { ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS } from './electrum/v2';
import { MoneroEntropy, MONERO_ENTROPY_STRENGTHS } from './monero';
import { EntropyError } from '../exceptions';

/**
 * A class containing all supported entropy types.
 * @class
 */
export class ENTROPIES {

  /**
   * Dictionary of all entropy classes by name.
   * @type {Record<string, typeof Entropy>}
   */
  static dictionary: Record<string, typeof Entropy> = {
    [AlgorandEntropy.getName()]: AlgorandEntropy,
    [BIP39Entropy.getName()]: BIP39Entropy,
    [ElectrumV1Entropy.getName()]: ElectrumV1Entropy,
    [ElectrumV2Entropy.getName()]: ElectrumV2Entropy,
    [MoneroEntropy.getName()]: MoneroEntropy
  };

  /**
   * Return all entropy names.
   * @returns {string[]} Array of entropy names
   */
  static getNames(): string[] {
    return Object.keys(this.dictionary);
  }

  /**
   * Return all entropy classes.
   * @returns {typeof Entropy[]} Array of entropy classes
   */
  static getClasses(): typeof Entropy[] {
    return Object.values(this.dictionary);
  }

  /**
   * Get a specific entropy class by name.
   * @param {string} name - The entropy name
   * @returns {typeof Entropy} The entropy class
   * @throws {EntropyError} If the name is invalid
   */
  static getEntropyClass(name: string): typeof Entropy | any {
    if (!this.isEntropy(name)) {
      throw new EntropyError(
        'Invalid Entropy name', { expected: this.getNames(), got: name }
      );
    }
    return this.dictionary[name];
  }

  /**
   * Check if a name is a valid entropy.
   * @param {string} name - The entropy name
   * @returns {boolean} True if the entropy exists, false otherwise
   */
  static isEntropy(name: string): boolean {
    return this.getNames().includes(name);
  }
}

export {
  Entropy,
  AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS,
  BIP39Entropy, BIP39_ENTROPY_STRENGTHS,
  ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS,
  ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS,
  MoneroEntropy, MONERO_ENTROPY_STRENGTHS
}
