// SPDX-License-Identifier: MIT

import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';

/**
 * Abstract base class for all cryptocurrency address implementations.
 * Provides a standardized interface for encoding and decoding addresses.
 */
export abstract class Address {

  /**
   * Returns the name of the address implementation.
   * Must be overridden by subclasses.
   *
   * @throws {Error} If not implemented in a subclass
   * @returns {string} Name of the address type
   */
  static getName(): string {
    throw new Error('Address.getName() not implemented');
  }

  /**
   * Encodes a public key (or other required data) into a blockchain address.
   * Must be overridden by subclasses.
   *
   * @param publicKey The public key or object to encode
   * @param options Optional encoding parameters
   * @throws {Error} If not implemented in a subclass
   * @returns {string} Encoded address
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey | Object, options?: AddressOptionsInterface
  ): string {
    throw new Error('Address.encode() not implemented');
  }

  /**
   * Decodes a blockchain address into its underlying public key(s) or data.
   * Must be overridden by subclasses.
   *
   * @param address Address string to decode
   * @param options Optional decoding parameters
   * @throws {Error} If not implemented in a subclass
   * @returns {string | [string, string]} Decoded public key(s) or data
   */
  public static decode(
    address: string, options?: AddressOptionsInterface
  ): string | [string, string] {
    throw new Error('Address.decode() not implemented');
  }
}
