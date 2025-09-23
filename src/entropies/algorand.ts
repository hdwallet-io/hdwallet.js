// SPDX-License-Identifier: MIT

import { Entropy } from './entropy';


export const ALGORAND_ENTROPY_STRENGTHS = {
  TWO_HUNDRED_FIFTY_SIX: 256
} as const;

/**
 * AlgorandEntropy class.
 *
 * Uses entropy to generate a mnemonic phrase specific to Algorand,
 * ensuring secure account creation with a unique checksum.
 *
 * This class extends `Entropy`, so all base functionality is available.
 *
 * @extends Entropy
 */
export class AlgorandEntropy extends Entropy {

   /**
   * List of supported entropy strengths for Algorand.
   *
   * @type {number[]}
   */
  static strengths = [
      ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
  ];

   /**
   * Get the name of this entropy class.
   *
   * @returns {string} The name of the entropy class.
   */
  static getName(): string {
    return 'Algorand';
  }
}
