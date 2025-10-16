// SPDX-License-Identifier: MIT

import { EthereumAddress } from './ethereum';
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Injective } from '../cryptocurrencies';
import { bytesToString, getBytes } from '../utils';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
import { AddressError } from '../exceptions';

/**
 * Class representing an Injective blockchain address.
 * Inherits from the base Address class.
 * Uses Bech32 encoding with Ethereum-style public key hashing.
 */
export class InjectiveAddress extends Address {

  static readonly hrp: string = Injective.NETWORKS.MAINNET.HRP;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type.
   */
  static getName(): string {
    return 'Injective';
  }

   /**
   * Encodes a public key into a Bech32 Injective address.
   * Uses Ethereum-style encoding of the public key, then converts to Bech32.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
   * @param {AddressOptionsInterface} [options] - Optional parameters.
   * @param {string} [options.hrp=this.hrp] - Human-readable prefix for Bech32.
   * @returns {string} Bech32-encoded Injective address.
   * @throws {AddressError} If encoding fails.
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      hrp: this.hrp
    }
  ): string {

    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
    const ethEncoded = EthereumAddress.encode(pk, {
      skipChecksumEncode: true
    });
    const rawBytes = getBytes(ethEncoded.slice(2)); // remove "0x"

    const hrp = options.hrp ?? this.hrp;
    const encoded = bech32Encode(hrp, rawBytes);
    if (!encoded) {
      throw new AddressError('Failed to encode Bech32 Injective address');
    }
    return encoded;
  }

  /**
   * Decodes a Bech32 Injective address back into its raw public key bytes.
   *
   * @param {string} address - Bech32-encoded Injective address to decode.
   * @param {AddressOptionsInterface} [options] - Optional parameters.
   * @param {string} [options.hrp=this.hrp] - Expected human-readable prefix for Bech32.
   * @returns {string} Raw public key bytes as a string.
   * @throws {AddressError} If decoding fails, the HRP does not match, or length is invalid.
   */
  static decode(
    address: string, options: AddressOptionsInterface = {
      hrp: this.hrp
    }
  ): string {

    const hrp = options.hrp ?? this.hrp;
    const [gotHrp, data] = bech32Decode(hrp, address);

    if (!gotHrp || !data) {
      throw new AddressError('Failed to decode Bech32 Injective address');
    }

    if (data.length !== 20) {
      throw new AddressError('Invalid length', {
        expected: 20, got: data.length
      });
    }
    return bytesToString(data);
  }
}
