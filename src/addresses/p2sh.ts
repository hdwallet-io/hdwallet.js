// SPDX-License-Identifier: MIT

import { checkDecode, checkEncode } from '../libs/base58';
import { PUBLIC_KEY_TYPES } from '../consts';
import { PublicKey, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Bitcoin } from '../cryptocurrencies';
import { hash160 } from '../crypto';
import { AddressError } from '../exceptions';
import {
  bytesToString, getBytes, integerToBytes, ensureString, concatBytes, equalBytes, bytesToHex
} from '../utils';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';

/**
 * Class representing a Bitcoin P2SH (Pay-to-Script-Hash) address.
 * Provides methods for encoding public keys to P2SH addresses and decoding P2SH addresses back to the script hash.
 */
export class P2SHAddress extends Address {

  static scriptAddressPrefix: number = Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
  static alphabet: string = Bitcoin.PARAMS.ALPHABET;

  /**
   * Returns the display name of this address type.
   * @returns {string} Name of the address type ("P2SH").
   */
  static getName(): string {
    return 'P2SH';
  }

  /**
   * Encodes a public key into a Bitcoin P2SH address.
   * The method generates a standard P2PKH redeem script, computes its hash, and encodes it with the script address prefix.
   *
   * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
   * @param {AddressOptionsInterface} options - Optional encoding options:
   *   - scriptAddressPrefix: prefix byte for the address
   *   - publicKeyType: whether to use compressed or uncompressed public key
   *   - alphabet: Base58 alphabet
   * @returns {string} Base58-encoded P2SH address.
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

    const rawBytes =
      options.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED
        ? pk.getRawUncompressed() : pk.getRawCompressed();
    const pubKeyHash = hash160(rawBytes);

    const redeemScriptHex = '76a914' + bytesToString(pubKeyHash) + '88ac';
    const redeemScript = getBytes(redeemScriptHex);
    const scriptHash = hash160(redeemScript);

    const payload = concatBytes(prefixBytes, scriptHash);
    const alphabet = options.alphabet ?? this.alphabet;
    return ensureString(checkEncode(payload, alphabet));
  }

  /**
   * Decodes a Bitcoin P2SH address into its script hash.
   *
   * @param {string} address - The P2SH address to decode.
   * @param {AddressOptionsInterface} options - Optional decoding options:
   *   - scriptAddressPrefix: expected prefix byte
   *   - alphabet: Base58 alphabet
   * @returns {string} The script hash extracted from the address.
   * @throws {AddressError} If the address has invalid length or prefix.
   */
  static decode(
    address: string, options: AddressOptionsInterface = {
      scriptAddressPrefix: this.scriptAddressPrefix,
      alphabet: this.alphabet
    }
  ): string {

    const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
    const prefixBytes = getBytes(integerToBytes(prefixValue));

    const alphabet = options.alphabet ?? this.alphabet;
    const decoded = checkDecode(address, alphabet);

    const expectedLen = prefixBytes.length + 20;
    if (decoded.length !== expectedLen) {
      throw new AddressError(
        'Invalid length', { expected: expectedLen, got: decoded.length}
      );
    }

    const gotPrefix = decoded.slice(0, prefixBytes.length);
    if (!equalBytes(prefixBytes, gotPrefix)) {
      throw new AddressError(
        'Invalid prefix', { expected: bytesToHex(prefixBytes), got: bytesToHex(gotPrefix) }
      );
    }

    const scriptHash = decoded.slice(prefixBytes.length);
    return bytesToString(scriptHash);
  }
}
