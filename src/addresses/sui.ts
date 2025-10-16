// SPDX-License-Identifier: MIT

import { Sui } from '../cryptocurrencies';
import { blake2b256 } from '../crypto';
import { SLIP10Ed25519PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, integerToBytes, getBytes } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';

/**
 * Class representing a Sui blockchain address.
 * Provides encoding and decoding functionality for Sui addresses based on Ed25519 public keys.
 */
export class SuiAddress extends Address {

  static keyType: Uint8Array = integerToBytes(Sui.PARAMS.KEY_TYPE);
  static addressPrefix: string = Sui.PARAMS.ADDRESS_PREFIX;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("Sui").
   */
  static getName(): string {
    return 'Sui';
  }

  /**
   * Encodes a public key into a Sui blockchain address.
   * The address is derived by hashing the key type prefix and the raw public key bytes with Blake2b-256.
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @returns {string} The Sui address string with the appropriate prefix.
   */
  static encode(publicKey: Uint8Array | string | PublicKey): string {
    const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
    const raw = pk.getRawCompressed().subarray(1);
    const hash = blake2b256(getBytes(new Uint8Array([...this.keyType, ...raw])));
    return this.addressPrefix + bytesToString(hash);
  }

  /**
   * Decodes a Sui address string into its raw address body (without prefix).
   * Performs basic validation on the address prefix and length.
   * @param {string} address - The Sui address to decode.
   * @returns {string} The raw address body as a hexadecimal string.
   * @throws {AddressError} If the address has an invalid prefix or length.
   */
  static decode(address: string): string {
    const prefix = address.slice(0, this.addressPrefix.length);
    if (prefix !== this.addressPrefix) {
      throw new AddressError('Invalid address prefix', {
        expected: this.addressPrefix, got: prefix
      });
    }

    const body = address.slice(this.addressPrefix.length);
    if (body.length !== 64) {
      throw new AddressError('Invalid address length', {
        expected: 64, got: body.length
      });
    }
    return body;
  }
}
