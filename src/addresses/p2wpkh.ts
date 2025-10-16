// SPDX-License-Identifier: MIT

import { segwitEncode, segwitDecode } from '../libs/segwit-bech32';
import { PUBLIC_KEY_TYPES } from '../consts';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Bitcoin } from '../cryptocurrencies';
import { hash160 } from '../crypto';
import { bytesToString, ensureString } from '../utils';
import { Address } from './address';
import { AddressOptionsInterface } from '../interfaces';
import { AddressError } from '../exceptions';

/**
 * Class representing a P2WPKH (Pay-to-Witness-Public-Key-Hash) Bitcoin address.
 * Implements native SegWit address encoding and decoding.
 */
export class P2WPKHAddress extends Address {

  static hrp: string = Bitcoin.NETWORKS.MAINNET.HRP;
  static witnessVersion: number = Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("P2WPKH").
   */
  static getName(): string {
    return 'P2WPKH';
  }

  /**
   * Encodes a public key into a native SegWit P2WPKH address.
   * The public key is hashed (RIPEMD160(SHA256(pubKey))) and then encoded in Bech32 format.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
   * @param {AddressOptionsInterface} options - Optional parameters including HRP, public key type, and witness version.
   * @returns {string} Bech32 encoded P2WPKH address.
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      hrp: this.hrp,
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      witnessVersion: this.witnessVersion
    }
  ): string {

    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);

    const rawPubBytes =
      options.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED
        ? pk.getRawUncompressed() : pk.getRawCompressed();

    const pubKeyHash = hash160(rawPubBytes);

    const hrp = options.hrp ?? this.hrp;
    const witnessVersion = options.witnessVersion ?? this.witnessVersion;
    return ensureString(segwitEncode(hrp, witnessVersion, pubKeyHash));
  }

  /**
   * Decodes a native SegWit P2WPKH address back into the public key hash.
   *
   * @param {string} address - Bech32 encoded P2WPKH address.
   * @param {AddressOptionsInterface} options - Optional HRP for decoding.
   * @returns {string} Public key hash as a string.
   * @throws {AddressError} If the address fails to decode.
   */
  static decode(
    address: string, options: AddressOptionsInterface = { hrp: this.hrp }
  ): string {

    const hrp = options.hrp ?? this.hrp;

    const [witnessVersion, decoded] = segwitDecode(hrp, address);
    if (!decoded) {
      throw new AddressError('Invalid address decoding');
    }
    return bytesToString(decoded);
  }
}
