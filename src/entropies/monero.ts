// SPDX-License-Identifier: MIT

import { Entropy } from './entropy';

export const MONERO_ENTROPY_STRENGTHS = {
  ONE_HUNDRED_TWENTY_EIGHT: 128,
  TWO_HUNDRED_FIFTY_SIX: 256
} as const;

/**
 * MoneroEntropy class.
 *
 * Uses entropy to generate a mnemonic phrase specific to Monero,
 * ensuring secure account creation with a unique checksum.
 *
 * This class extends `Entropy`, so all base functionality is available.
 *
 * @extends Entropy
 */
export class MoneroEntropy extends Entropy {

  /**
   * List of supported entropy strengths for Monero.
   *
   * @type {number[]}
   */
  static strengths = [
    MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
    MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
  ];

  /**
   * Get the name of this entropy class.
   *
   * @returns {string} The name of the entropy class.
   */
  static getName(): string {
    return 'Monero';
  }
}
