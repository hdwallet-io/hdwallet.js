// SPDX-License-Identifier: MIT

import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Ethereum } from '../cryptocurrencies';
import { keccak256 } from '../crypto';
import { bytesToString } from '../utils';
import { AddressError } from '../exceptions';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';

/**
 * Class representing Ethereum blockchain addresses.
 * Provides encoding and decoding of public keys into Ethereum addresses.
 * Supports optional EIP-55 checksum encoding.
 * Extends the abstract Address class.
 */
export class EthereumAddress extends Address {

  static addressPrefix: string = Ethereum.PARAMS.ADDRESS_PREFIX;

   /**
   * Returns the name of the address implementation.
   * @returns {string} 'Ethereum'
   */
  static getName(): string {
    return 'Ethereum';
  }

  /**
   * Applies EIP-55 checksum encoding to an Ethereum address.
   * Converts specific characters to uppercase based on the Keccak-256 hash of the address.
   *
   * @param address Address string without prefix
   * @returns {string} Checksummed address string
   */
  static checksumEncode(address: string): string {

    let output = '';
    const addressHash = bytesToString(keccak256(
      new TextEncoder().encode(address.toLowerCase())
    ));

    for (let i = 0; i < address.length; i++) {
      output += parseInt(addressHash[i], 16) >= 8
        ? address[i].toUpperCase()
        : address[i];
    }
    return output;
  }

  /**
   * Encodes a public key into an Ethereum address.
   * The address is generated from the last 20 bytes of the Keccak-256 hash of the uncompressed public key.
   * Can optionally skip EIP-55 checksum encoding.
   *
   * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
   * @param options Address options including skipChecksumEncode
   * @throws {AddressError} If public key is invalid
   * @returns {string} Encoded Ethereum address with prefix
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      skipChecksumEncode: false
    }
  ): string {
    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
    const pubKeyHash = bytesToString(keccak256(pk.getRawUncompressed().slice(1))).slice(-40);

    return this.addressPrefix + (
      options.skipChecksumEncode ? pubKeyHash : this.checksumEncode(pubKeyHash)
    );
  }

  /**
   * Decodes an Ethereum address back to its raw lowercase hexadecimal form (without prefix).
   * Validates prefix, length, and optionally EIP-55 checksum encoding.
   *
   * @param address Ethereum address string to decode
   * @param options Address options including skipChecksumEncode
   * @throws {AddressError} If prefix, length, or checksum encoding is invalid
   * @returns {string} Decoded address string in lowercase (without prefix)
   */
  static decode(
    address: string, options: AddressOptionsInterface = {
      skipChecksumEncode: false
    }
  ): string {
    const prefix = address.slice(0, this.addressPrefix.length);
    if (prefix !== this.addressPrefix) {
      throw new AddressError('Invalid address prefix', {
        expected: this.addressPrefix,
        got: prefix
      });
    }

    const addressPart = address.slice(this.addressPrefix.length);

    if (addressPart.length !== 40) {
      throw new AddressError('Invalid length', {
        expected: 40,
        got: addressPart.length
      });
    }

    if (!options.skipChecksumEncode && addressPart !== this.checksumEncode(addressPart)) {
      throw new AddressError('Invalid checksum encode', {
        expected: this.checksumEncode(addressPart),
        got: addressPart
      });
    }
    return addressPart.toLowerCase();
  }
}
