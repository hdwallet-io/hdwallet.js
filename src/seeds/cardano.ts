// SPDX-License-Identifier: MIT

import { encode } from 'cbor2';

import { Seed } from './seed';
import { BIP39Seed } from './bip39';
import { SeedOptionsInterface } from '../interfaces';
import { Cardano } from '../cryptocurrencies'
import { Mnemonic, BIP39Mnemonic } from '../mnemonics'
import { blake2b256 } from '../crypto'
import { bytesToString, hexToBytes } from '../utils'
import { MnemonicError, SeedError } from '../exceptions'

/**
 * Represents a Cardano seed generator, supporting multiple
 * derivation standards including Byron (Icarus, Ledger, Legacy)
 * and Shelley (Icarus, Ledger).
 */
export class CardanoSeed extends Seed {

  /**
   * Creates a new instance of CardanoSeed.
   * 
   * @param {string} seed - The hexadecimal seed string.
   * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional seed configuration including the Cardano type.
   * @throws {SeedError} If the provided cardanoType is invalid.
   */
  constructor(
    seed: string, options: SeedOptionsInterface = {
      cardanoType: Cardano.TYPES.BYRON_ICARUS
    }
  ) {
    if (options.cardanoType && !Cardano.TYPES.isCardanoType(options.cardanoType)) {
      throw new SeedError(
        'Invalid Cardano type', {
          expected: Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
        }
      )
    }
    super(seed, options);
  }

  /**
   * Returns the name of this seed type.
   * 
   * @returns {string} The string `"Cardano"`.
   */
  static getName(): string {
    return 'Cardano'
  }

  /**
   * Returns the current Cardano type assigned to this seed instance.
   * 
   * @returns {string} The selected Cardano type.
   * @throws {SeedError} If no `cardanoType` is found in the options.
   */
  getCardanoType(): string {
    if (!this.options?.cardanoType) {
      throw new SeedError('cardanoType is not found');
    }
    return this.options?.cardanoType;
  }

  /**
   * Generates a Cardano seed from a mnemonic phrase, supporting multiple Cardano derivation types.
   * 
   * @param {string | Mnemonic} mnemonic - A mnemonic phrase or Mnemonic object.
   * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional parameters including passphrase and cardanoType.
   * @returns {string} A hexadecimal string representing the derived Cardano seed.
   * @throws {MnemonicError} If the mnemonic is invalid.
   * @throws {SeedError} If the Cardano type is invalid.
   */
  static fromMnemonic(
    mnemonic: string | Mnemonic, options: SeedOptionsInterface = {
      cardanoType: Cardano.TYPES.BYRON_ICARUS
    }
  ): string {
    switch (options.cardanoType) {
      case Cardano.TYPES.BYRON_ICARUS:
        return this.generateByronIcarus(mnemonic);
      case Cardano.TYPES.BYRON_LEDGER:
        return this.generateByronLedger(mnemonic, options.passphrase);
      case Cardano.TYPES.BYRON_LEGACY:
        return this.generateByronLegacy(mnemonic);
      case Cardano.TYPES.SHELLEY_ICARUS:
        return this.generateShelleyIcarus(mnemonic);
      case Cardano.TYPES.SHELLEY_LEDGER:
        return this.generateShelleyLedger(mnemonic, options.passphrase)
      default:
        throw new SeedError(
          'Invalid Cardano type', {
            expected: Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
          }
        )
    }
  }

  /**
   * Generates a Byron-Icarus seed from a valid BIP39 mnemonic.
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
   * @returns {string} The derived seed as a hexadecimal string.
   * @throws {MnemonicError} If the mnemonic is invalid.
   */
  private static generateByronIcarus(mnemonic: string | Mnemonic): string {
    const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
    if (!BIP39Mnemonic.isValid(phrase)) {
      throw new MnemonicError(`Invalid Cardano mnemonic words`);
    }
    return BIP39Mnemonic.decode(phrase);
  }

  /**
   * Generates a Byron-Ledger seed using PBKDF2-HMAC-SHA512.
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
   * @param {string | null} [passphrase] - Optional passphrase for additional entropy.
   * @returns {string} The derived seed as a hexadecimal string.
   */
  private static generateByronLedger(mnemonic: string | Mnemonic, passphrase?: string | null): string {
    const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
    return BIP39Seed.fromMnemonic(phrase, { passphrase: passphrase });
  }

  /**
   * Generates a Byron-Legacy seed by CBOR encoding and hashing the decoded mnemonic.
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
   * @returns {string} The derived seed as a hexadecimal string.
   * @throws {MnemonicError} If the mnemonic is invalid.
   */
  private static generateByronLegacy(mnemonic: string | Mnemonic): string {
    const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
    if (!BIP39Mnemonic.isValid(phrase)) {
      throw new MnemonicError(`Invalid Cardano mnemonic words`);
    }
    const decoded = BIP39Mnemonic.decode(phrase);
    const rawBytes = hexToBytes(decoded);
    const cborBytes = encode(rawBytes);
    const hash = blake2b256(cborBytes);
    return bytesToString(hash);
  }

  /**
   * Generates a Shelley-Icarus seed (same as Byron-Icarus).
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
   * @returns {string} The derived seed as a hexadecimal string.
   */
  private static generateShelleyIcarus(mnemonic: string | Mnemonic): string {
    return this.generateByronIcarus(mnemonic);
  }

  /**
   * Generates a Shelley-Ledger seed (same as Byron-Ledger).
   * 
   * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
   * @param {string | null} [passphrase] - Optional passphrase.
   * @returns {string} The derived seed as a hexadecimal string.
   */
  private static generateShelleyLedger(mnemonic: string | Mnemonic, passphrase?: string | null): string {
    return this.generateByronLedger(mnemonic, passphrase);
  }
}
