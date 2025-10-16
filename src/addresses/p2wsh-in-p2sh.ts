// SPDX-License-Identifier: MIT

import { checkEncode } from '../libs/base58';
import { PUBLIC_KEY_TYPES } from '../consts';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { hash160, sha256 } from '../crypto';
import { getBytes, integerToBytes, bytesToString, concatBytes, ensureString } from '../utils';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
import { P2SHAddress } from './p2sh';

/**
 * Class representing a P2WSH-in-P2SH (Pay-to-Witness-Script-Hash nested in Pay-to-Script-Hash) Bitcoin address.
 * Implements encoding of a compressed or uncompressed public key into a P2WSH-in-P2SH address.
 */
export class P2WSHInP2SHAddress extends P2SHAddress implements Address {

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("P2WSH-In-P2SH").
   */
  static getName(): string {
    return 'P2WSH-In-P2SH';
  }

  /**
   * Encodes a public key into a P2WSH-in-P2SH Bitcoin address.
   * Constructs the redeem script using a SegWit witness script hash nested in a P2SH structure.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @param {AddressOptionsInterface} options - Optional parameters including P2SH prefix, public key type, and alphabet.
   * @returns {string} Base58Check encoded P2WSH-in-P2SH address.
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      scriptAddressPrefix: this.scriptAddressPrefix,
      publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
      alphabet: this.alphabet
    }
  ): string {

    const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
    const prefixBytes = integerToBytes(prefixValue);

    const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);

    const rawPubBytes =
      options.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED
        ? pk.getRawUncompressed() : pk.getRawCompressed();

    const redeemScript = getBytes(
      '5121' + bytesToString(rawPubBytes) + '51ae'
    );

    const sha = sha256(redeemScript);
    const witnessScript = getBytes('0020' + bytesToString(sha));
    const scriptHash = hash160(witnessScript);

    const alphabet = options.alphabet ?? this.alphabet;
    return ensureString(checkEncode(
      concatBytes(prefixBytes, scriptHash), alphabet
    ));
  }
}
