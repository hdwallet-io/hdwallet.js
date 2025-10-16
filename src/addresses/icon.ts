// SPDX-License-Identifier: MIT

import { Icon } from '../cryptocurrencies';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { sha3_256 } from '../crypto';
import { getBytes, bytesToString } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';

/**
 * Class representing Icon blockchain addresses.
 * Handles encoding and decoding of addresses using SHA3-256 hashing of the public key.
 */
export class IconAddress extends Address {

  static addressPrefix: string = Icon.PARAMS.ADDRESS_PREFIX;
  static keyHashLength: number = Icon.PARAMS.KEY_HASH_LENGTH;

  /**
   * Returns the name of the address implementation.
   * @returns {string} 'Icon'
   */
  static getName(): string {
    return 'Icon';
  }

  /**
   * Encodes a public key into an Icon address.
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @returns {string} The encoded Icon address.
   */
  static encode(publicKey: Uint8Array | string | PublicKey): string {

    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
    const raw = pk.getRawUncompressed().slice(1); // Remove prefix byte (0x04)
    const hash = sha3_256(raw).slice(-this.keyHashLength);
    return this.addressPrefix + bytesToString(hash);
  }

  /**
   * Decodes an Icon address back into the key hash.
   * @param {string} address - The Icon address to decode.
   * @returns {string} The decoded key hash.
   * @throws {AddressError} If the address prefix or length is invalid.
   */
  static decode(address: string): string {
    const prefix = this.addressPrefix;
    if (!address.startsWith(prefix)) {
      throw new AddressError('Invalid prefix', {
        expected: prefix, got: address.slice(0, prefix.length)
      });
    }

    const withoutPrefix = address.slice(prefix.length);
    const keyHash = getBytes(withoutPrefix);

    if (keyHash.length !== this.keyHashLength) {
      throw new AddressError('Invalid length', {
        expected: this.keyHashLength, got: keyHash.length
      });
    }
    return bytesToString(keyHash);
  }
}
