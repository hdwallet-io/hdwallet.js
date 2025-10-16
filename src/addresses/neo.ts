// SPDX-License-Identifier: MIT

import { Neo } from '../cryptocurrencies';
import { checkEncode, checkDecode } from '../libs/base58';
import { hash160 } from '../crypto';
import { SLIP10Nist256p1PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import {
  integerToBytes, bytesToString, concatBytes, getBytes, ensureString, equalBytes
} from '../utils';
import { AddressOptionsInterface } from '../interfaces';
import { AddressError } from '../exceptions';
import { Address } from './address';

/**
 * Class representing a NEO blockchain address.
 * Handles encoding and decoding of public keys according to NEO's address format.
 */
export class NeoAddress extends Address {

  static addressPrefix = integerToBytes(Neo.PARAMS.ADDRESS_PREFIX);
  static addressSuffix = integerToBytes(Neo.PARAMS.ADDRESS_SUFFIX);
  static addressVersion = integerToBytes(Neo.PARAMS.ADDRESS_VERSION);
  static alphabet = Neo.PARAMS.ALPHABET;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("Neo").
   */
  static getName(): string {
    return 'Neo';
  }

  /**
   * Encodes a given public key into a NEO address string.
   * Applies NEO-specific prefix, suffix, and hashing (hash160) before Base58 encoding.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @param {AddressOptionsInterface} options - Optional encoding options including address version and alphabet.
   * @returns {string} Encoded NEO address string.
   * @throws {AddressError} If the public key is invalid.
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      addressVersion: this.addressVersion, alphabet: this.alphabet
    }
  ): string {
    const pk = validateAndGetPublicKey(publicKey, SLIP10Nist256p1PublicKey);
    const payload = concatBytes(
      this.addressPrefix, pk.getRawCompressed(), this.addressSuffix
    );
    const hashed = hash160(payload);
    const version = getBytes(options.addressVersion ?? this.addressVersion);
    return ensureString(checkEncode(
      getBytes(concatBytes(version, hashed)), options.alphabet ?? this.alphabet
    ));
  }

  /**
   * Decodes a NEO address back into a public key.
   * Verifies version and length, and extracts the original public key bytes.
   *
   * @param {string} address - The NEO address to decode.
   * @param {AddressOptionsInterface} options - Optional decoding options including address version and alphabet.
   * @returns {string} The public key as a string extracted from the address.
   * @throws {AddressError} If the address version or length is invalid.
   */
  static decode(
    address: string,options: AddressOptionsInterface = {
      addressVersion: this.addressVersion, alphabet: this.alphabet
    }
  ): string {
    const decoded = checkDecode(address, options.alphabet ?? this.alphabet);
    const version = getBytes(options.addressVersion ?? this.addressVersion);

    const expectedLength = 20 + version.length;
    if (decoded.length !== expectedLength) {
      throw new AddressError('Invalid length', {
        expected: expectedLength, got: decoded.length
      });
    }

    const versionGot = decoded.subarray(0, version.length);
    if (!equalBytes(version, versionGot)) {
      throw new AddressError('Invalid address version', {
        expected: bytesToString(version), got: bytesToString(versionGot)
      });
    }
    return bytesToString(decoded.subarray(version.length));
  }
}
