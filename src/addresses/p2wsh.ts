// SPDX-License-Identifier: MIT

import { segwitEncode } from '../libs/segwit-bech32';
import { PUBLIC_KEY_TYPES } from '../consts';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Bitcoin } from '../cryptocurrencies';
import { sha256 } from '../crypto';
import { bytesToString, getBytes, ensureString } from '../utils';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
import { P2WPKHAddress } from './p2wpkh';

/**
 * Class representing a P2WSH (Pay-to-Witness-Script-Hash) Bitcoin address.
 * Extends the P2WPKHAddress class and implements SegWit P2WSH encoding using compressed/uncompressed public keys.
 */
export class P2WSHAddress extends P2WPKHAddress implements Address {

  static witnessVersion: number = Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("P2WSH").
   */
  static getName(): string {
    return 'P2WSH';
  }

  /**
   * Encodes a public key into a P2WSH SegWit Bitcoin address.
   * The address is constructed by creating a 1-of-1 witness script from the public key,
   * computing its SHA256 hash, and encoding it with the Bech32 SegWit format.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @param {AddressOptionsInterface} options - Optional parameters including HRP, public key type, and witness version.
   * @returns {string} Bech32-encoded P2WSH SegWit address.
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

    const script = '5121' + bytesToString(rawPubBytes) + '51ae';
    const scriptHash = sha256(getBytes(script));

    const hrp = options.hrp ?? this.hrp;
    const version = options.witnessVersion ?? this.witnessVersion;
    return ensureString(segwitEncode(
      hrp, version, scriptHash
    ));
  }
}
