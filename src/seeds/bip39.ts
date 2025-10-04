// SPDX-License-Identifier: MIT

import { Seed } from './seed';
import { Mnemonic, BIP39Mnemonic } from '../mnemonics';
import { pbkdf2HmacSha512 } from '../crypto';
import { bytesToString } from '../utils';
import { MnemonicError } from '../exceptions';
import { SeedOptionsInterface } from '../interfaces';

/**
 * BIP39Seed provides functionality for deriving a cryptographic seed
 * from a valid BIP39 mnemonic phrase using PBKDF2 with HMAC-SHA512.
 */
export class BIP39Seed extends Seed {

  static seedSaltModifier = 'mnemonic';
  static seedPbkdf2Rounds = 2048;

  /**
   * Returns the name of this seed type.
   * 
   * @returns {string}
   */
  static getName(): string {
    return 'BIP39';
  }

  /**
   * Derives a cryptographic seed from a BIP39 mnemonic phrase.
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase or Mnemonic instance.
   * @param {SeedOptionsInterface} [options={}] - Optional derivation parameters.
   * @returns {string} The derived seed as a hexadecimal string.
   */
  static fromMnemonic(
    mnemonic: string | Mnemonic, options: SeedOptionsInterface = { }
  ): string {

    const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();

    if (!BIP39Mnemonic.isValid(phrase)) {
      throw new MnemonicError(`Invalid ${this.getName()} mnemonic words`);
    }
    const saltBase = this.seedSaltModifier + (options.passphrase ?? '');
    const salt = saltBase.normalize('NFKD');
    const seedBytes = pbkdf2HmacSha512(
      phrase, salt, this.seedPbkdf2Rounds
    );
    return bytesToString(seedBytes);
  }
}
