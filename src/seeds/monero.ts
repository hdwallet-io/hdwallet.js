// SPDX-License-Identifier: MIT

import { Mnemonic, MoneroMnemonic } from '../mnemonics';
import { MnemonicError } from '../exceptions';
import { Seed } from './seed';

/**
 * Represents the Monero-specific seed derivation implementation.
 *
 * The `MoneroSeed` class provides functionality for validating and
 * decoding Monero mnemonic phrases into their corresponding seed value.
 *
 * Each Monero seed follows the Monero-specific encoding and decoding scheme.
 */
export class MoneroSeed extends Seed {

  /**
   * Returns the name of the seed type.
   *
   * @returns {string} The name `"Monero"`.
   */
  static getName(): string {
    return 'Monero';
  }

  /**
   * Derives a Monero seed from a given mnemonic phrase.
   *
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase or `Mnemonic` instance.
   * @returns {string} The derived Monero seed as a hexadecimal string.
   * @throws {MnemonicError} If the provided mnemonic phrase is invalid.
   */
  static fromMnemonic(mnemonic: string | Mnemonic): string {

    const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();

    if (!MoneroMnemonic.isValid(phrase)) {
      throw new MnemonicError(`Invalid ${this.getName()} mnemonic words`);
    }
    return MoneroMnemonic.decode(phrase);
  }
}
