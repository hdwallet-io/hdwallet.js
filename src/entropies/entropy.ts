// SPDX-License-Identifier: MIT

import { getBytes, bytesToHex, bytesToInteger } from '../utils';
import { EntropyError } from '../exceptions';

/**
 * Base class for entropy types.
 * @class
 */
export class Entropy {

  protected entropy: string;
  protected strength: number;

  static strengths: number[];

  /**
   * Construct an entropy instance.
   * @param {string} entropy - Entropy hex string
   * @throws {EntropyError} If entropy is invalid or unsupported
   */
  constructor(entropy: string) {

    const entropyBytes = getBytes(entropy);
    const strength = entropyBytes.length;
    const constructor = this.constructor as typeof Entropy;

    if (constructor.getName() === 'Electrum-V2') {
      if (!constructor.areEntropyBitsEnough(entropyBytes)) {
        throw new EntropyError('Entropy bits are not enough');
      }
      this.strength = BigInt(bytesToInteger(entropyBytes)).toString(2).length;
    } else {
      if (!constructor.isValidBytesStrength(strength))
        throw new EntropyError('Unsupported entropy strength');
      this.strength = strength * 8;
    }
    this.entropy = bytesToHex(entropyBytes);
  }

  /**
   * Get the class name (to be overridden in subclasses)
   * @returns {string}
   * @throws {Error} If not overridden
   */
  static getName(): string {
    throw new Error('Must override getName()');
  }

  /**
   * Get the name of this entropy instance.
   * @returns {string}
   */
  getName(): string {
    return (this.constructor as typeof Entropy).getName();
  }

  /**
   * Get the entropy value as hex.
   * @returns {string} Hex string of entropy
   */
  getEntropy(): string {
    return this.entropy;
  }

  /**
   * Get the entropy strength in bits.
   * @returns {number} Strength in bits
   */
  getStrength(): number {
    return this.strength;
  }

  /**
   * Generate a new entropy string.
   * @param {number} strength - Strength in bits
   * @returns {string} Generated entropy as hex
   * @throws {Error} If strength is invalid
   */
  static generate(strength: number): string {

    if (!this.strengths.includes(strength)) {
      throw new Error(`Invalid strength ${strength}`);
    }
    return bytesToHex(crypto.getRandomValues(
      new Uint8Array(strength / 8)
    ));
  }

  /**
   * Check if a string is a valid entropy.
   * @param {string} entropy - Entropy hex string
   * @returns {boolean} True if valid, false otherwise
   */
  static isValid(entropy: string): boolean {
    return /^[0-9a-fA-F]+$/.test(entropy) && this.isValidStrength(entropy.length * 4);
  }

  /**
   * Check if a strength in bits is valid.
   * @param {number} strength - Strength in bits
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidStrength(strength: number): boolean {
    return this.strengths.includes(strength);
  }

  /**
   * Check if a byte-length strength is valid.
   * @param {number} bytesStrength - Strength in bytes
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidBytesStrength(bytesStrength: number): boolean {
    return this.isValidStrength(bytesStrength * 8);
  }

  /**
   * Check if entropy bits are enough (override in subclasses).
   * @param {Uint8Array | number} entropy - Entropy bytes
   * @returns {boolean}
   * @throws {Error} Not implemented
   */
  static areEntropyBitsEnough(entropy: Uint8Array | number): boolean {
    throw new Error('Not implemented');
  }
}