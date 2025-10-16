// SPDX-License-Identifier: MIT

import { encode, decode } from '../libs/base58';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Ergo } from '../cryptocurrencies';
import { blake2b256 } from '../crypto';
import {
  bytesToString, ensureTypeMatch, integerToBytes, getBytes, concatBytes, ensureString, equalBytes, bytesToHex
} from '../utils';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
import { AddressError, NetworkError } from '../exceptions';
import { Network } from '../cryptocurrencies/cryptocurrency';

/**
 * Class representing Ergo blockchain addresses.
 * Provides encoding and decoding of public keys into Ergo addresses using Base58 with a checksum.
 * Supports different address types (p2pkh, p2sh) and networks (mainnet, testnet).
 * Extends the abstract Address class.
 */
export class ErgoAddress extends Address {

  static checksumLength: number = Ergo.PARAMS.CHECKSUM_LENGTH;
  static addressType: string = Ergo.DEFAULT_ADDRESS_TYPE;
  static addressTypes: Record<string, number> = {
    'p2pkh': Ergo.PARAMS.ADDRESS_TYPES.P2PKH,
    'p2sh': Ergo.PARAMS.ADDRESS_TYPES.P2SH
  };
  static networkType: string = Ergo.DEFAULT_NETWORK;
  static networkTypes: Record<string, number> = {
    'mainnet': Ergo.NETWORKS.MAINNET.TYPE,
    'testnet': Ergo.NETWORKS.TESTNET.TYPE
  };

  /**
   * Returns the name of the address implementation.
   * @returns {string} 'Ergo'
   */
  static getName(): string {
    return 'Ergo';
  }

  /**
   * Computes the checksum for Ergo address encoding.
   * Uses Blake2b256 hash and takes the first `checksumLength` bytes.
   *
   * @param data Bytes to compute checksum from
   * @returns {Uint8Array} Computed checksum
   */
  static computeChecksum(data: Uint8Array): Uint8Array {
    return blake2b256(data).slice(0, this.checksumLength);
  }

  /**
   * Encodes a public key into an Ergo address.
   * Combines network type, address type, and compressed public key bytes with a checksum,
   * then encodes the result in Base58.
   *
   * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
   * @param options Address options including addressType and networkType
   * @throws {NetworkError} If the network type is invalid
   * @throws {AddressError} If the address type is invalid
   * @returns {string} Encoded Ergo address
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      addressType: this.addressType,
      networkType: this.networkType
    }
  ): string {

    const network = options.networkType ?? this.networkType;
    const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
    const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
    const networkType = this.networkTypes[networkName];
    if (networkType === undefined) {
      throw new NetworkError('Invalid Ergo network type', {
        expected: Object.keys(this.networkTypes), got: network
      });
    }
    const addressType = this.addressTypes[options.addressType ?? this.addressType];
    if (addressType === undefined) {
      throw new AddressError('Invalid Ergo address type', {
        expected: Object.keys(this.addressTypes), got: options.addressType
      });
    }

    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
    const prefix = integerToBytes(addressType + networkType);
    const addressPayload = concatBytes(prefix, pk.getRawCompressed());
    const checksum = this.computeChecksum(addressPayload);
    return ensureString(encode(concatBytes(addressPayload, checksum)));
  }

  /**
   * Decodes an Ergo address back to the raw public key bytes.
   * Validates prefix, length, checksum, and public key bytes.
   *
   * @param address Ergo address to decode
   * @param options Address options including addressType and networkType
   * @throws {NetworkError} If the network type is invalid
   * @throws {AddressError} If the address type, prefix, length, checksum, or public key is invalid
   * @returns {string} Decoded raw public key bytes as a string
   */
  static decode(
    address: string, options: AddressOptionsInterface = {
      addressType: this.addressType,
      networkType: this.networkType
    }
  ): string {

    const network = options.networkType ?? this.networkType;
    const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
    const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
    const networkType = this.networkTypes[networkName];
    if (networkType === undefined) {
      throw new NetworkError('Invalid Ergo network type', {
        expected: Object.keys(this.networkTypes), got: options.networkType
      });
    }
    const addressType = this.addressTypes[options.addressType ?? this.addressType];
    if (addressType === undefined) {
      throw new AddressError('Invalid Ergo address type', {
        expected: Object.keys(this.addressTypes), got: options.addressType
      });
    }

    const prefix = getBytes(integerToBytes(addressType + networkType));
    const decoded = decode(address);

    const expectedLength =
      SLIP10Secp256k1PublicKey.getCompressedLength() + this.checksumLength + prefix.length;
    if (decoded.length !== expectedLength) {
      throw new AddressError('Invalid length', {
        expected: expectedLength, got: decoded.length
      });
    }

    const checksum = decoded.slice(-this.checksumLength);
    const payload = decoded.slice(0, -this.checksumLength);
    const checksumExpected = this.computeChecksum(payload);

    if (!equalBytes(checksum, checksumExpected)) {
      throw new AddressError('Invalid checksum', {
        expected: bytesToHex(checksumExpected), got: bytesToHex(checksum)
      });
    }

    const prefixGot = payload.slice(0, prefix.length);
    if (!equalBytes(prefix, prefixGot)) {
      throw new AddressError('Invalid prefix', {
        expected: bytesToHex(prefix), got: bytesToHex(prefixGot)
      });
    }

    const pubKey = payload.slice(prefix.length);
    if (!SLIP10Secp256k1PublicKey.isValidBytes(pubKey)) {
      throw new AddressError('Invalid public key', {
        got: bytesToHex(pubKey)
      });
    }
    return bytesToString(pubKey);
  }
}
