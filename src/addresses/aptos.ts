// SPDX-License-Identifier: MIT

import { Aptos } from '../cryptocurrencies';
import { sha3_256 } from '../crypto';
import { SLIP10Ed25519PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, integerToBytes } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';

/**
 * Class representing Aptos blockchain addresses.
 * Extends the abstract Address class to provide Aptos-specific encoding and decoding.
 */
export class AptosAddress extends Address {

  static suffix: Uint8Array = integerToBytes(Aptos.PARAMS.SUFFIX);
  static addressPrefix: string = Aptos.PARAMS.ADDRESS_PREFIX;

  /**
   * Returns the name of the address implementation.
   *
   * @returns {string} 'Aptos'
   */
  static getName(): string {
    return 'Aptos';
  }

  /**
   * Encodes a public key into an Aptos address.
   *
   * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
   * @throws {AddressError} If the public key is invalid
   * @returns {string} Encoded Aptos address
   */
  static encode(publicKey: Uint8Array | string | PublicKey): string {

    const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
    const raw = pk.getRawCompressed().subarray(1);
    const payload = new Uint8Array([...raw, ...this.suffix]);
    const hash = sha3_256(payload);
    return this.addressPrefix + bytesToString(hash).replace(/^0+/, '');
  }

  /**
   * Decodes an Aptos address back into its raw public key hash.
   *
   * @param address The Aptos address string to decode
   * @throws {AddressError} If the prefix or length of the address is invalid
   * @returns {string} Raw public key hash as a string
   */
  static decode(address: string): string {
    const prefix = address.slice(0, this.addressPrefix.length);
    if (prefix !== this.addressPrefix) {
      throw new AddressError('Invalid address prefix', {
        expected: this.addressPrefix, got: prefix
      });
    }

    const body = address.slice(this.addressPrefix.length).padStart(64, '0');
    if (body.length !== 64) {
      throw new AddressError('Invalid address length', {
        expected: 64, got: body.length
      });
    }
    return body;
  }
}
