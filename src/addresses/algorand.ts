// SPDX-License-Identifier: MIT

import { Algorand } from '../cryptocurrencies';
import { encodeNoPadding, decode as base32Decode } from '../libs/base32';
import { sha512_256 } from '../crypto';
import { SLIP10Ed25519PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, concatBytes, getBytes, equalBytes } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';

/**
 * Class representing Algorand addresses.
 * Extends the abstract Address class to provide Algorand-specific encoding and decoding.
 */
export class AlgorandAddress extends Address {

  static checksumLength: number = Algorand.PARAMS.CHECKSUM_LENGTH;

  /**
   * Returns the name of the address implementation.
   *
   * @returns {string} 'Algorand'
   */
  static getName(): string {
    return 'Algorand';
  }

  /**
   * Computes the checksum for a given public key.
   * Algorand uses the last 4 bytes of sha512_256 hash of the public key as checksum.
   *
   * @param publicKey The public key bytes to compute checksum for
   * @returns {Uint8Array} 4-byte checksum
   */
  static computeChecksum(publicKey: Uint8Array): Uint8Array {
    return sha512_256(publicKey).subarray(-4);
  }

  /**
   * Encodes a public key into an Algorand address.
   *
   * @param publicKey The public key to encode (can be Uint8Array, string, or PublicKey object)
   * @throws {AddressError} If the public key is invalid
   * @returns {string} Encoded Algorand address
   */
  static encode(publicKey: Uint8Array | string | PublicKey): string {

    const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
    const raw = pk.getRawCompressed().subarray(1);
    const checksum = this.computeChecksum(raw);
    return encodeNoPadding(bytesToString(concatBytes(raw, checksum)));
  }

  /**
   * Decodes an Algorand address back into its raw public key.
   *
   * @param address The Algorand address string to decode
   * @throws {AddressError} If the decoded length is invalid, checksum does not match, or public key is invalid
   * @returns {string} Raw public key as a string
   */
  static decode(address: string): string {

    const decoded = getBytes(base32Decode(address));
    const expectedLength = SLIP10Ed25519PublicKey.getCompressedLength() - 1 + this.checksumLength;

    if (decoded.length !== expectedLength) {
      throw new AddressError('Invalid decoded length', {
        expected: expectedLength, got: decoded.length
      });
    }

    const pubkey = decoded.subarray(0, decoded.length - this.checksumLength);
    const checksum = decoded.subarray(-this.checksumLength);
    const gotChecksum = this.computeChecksum(pubkey);

    if (!equalBytes(checksum, gotChecksum)) {
      throw new AddressError('Invalid checksum', {
        expected: bytesToString(checksum), got: bytesToString(gotChecksum)
      });
    }

    if (!SLIP10Ed25519PublicKey.isValidBytes(pubkey)) {
      throw new AddressError('Invalid public key');
    }
    return bytesToString(pubkey);
  }
}
