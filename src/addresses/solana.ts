// SPDX-License-Identifier: MIT

import { Solana } from '../cryptocurrencies';
import { encode as base58Encode, decode as base58Decode } from '../libs/base58';
import { SLIP10Ed25519PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, getBytes, ensureString } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';

/**
 * Class representing a Solana (SOL) address.
 * Provides encoding and decoding methods for Solana public keys using Base58.
 */
export class SolanaAddress extends Address {

  static alphabet: string = Solana.PARAMS.ALPHABET;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("Solana").
   */
  static getName(): string {
    return 'Solana';
  }

  /**
   * Encodes a public key into a Solana Base58 address.
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @returns {string} The Base58-encoded Solana address.
   */
  static encode(publicKey: Uint8Array | string | PublicKey): string {
    const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519PublicKey);
    return ensureString(base58Encode(getBytes(pk.getRawCompressed().subarray(1))));
  }

  /**
   * Decodes a Solana Base58 address into the corresponding public key bytes.
   * @param {string} address - The Base58 Solana address to decode.
   * @returns {string} The decoded public key as a string.
   * @throws {AddressError} If the decoded public key has an invalid length or is invalid.
   */
  static decode(address: string): string {
    const publicKey = base58Decode(address);
    const expectedLength = SLIP10Ed25519PublicKey.getCompressedLength() - 1;

    if (publicKey.length !== expectedLength) {
      throw new AddressError('Invalid public key length', {
        expected: expectedLength, got: publicKey.length
      });
    }

    if (!SLIP10Ed25519PublicKey.isValidBytes(publicKey)) {
      throw new AddressError(`Invalid SLIP10-Ed25519 public key`);
    }
    return bytesToString(publicKey);
  }
}
