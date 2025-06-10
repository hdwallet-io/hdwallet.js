// SPDX-License-Identifier: MIT

import { Monero } from '../cryptocurrencies';
import { decodeMonero, encodeMonero } from '../libs/base58';
import { keccak256 } from '../crypto';
import { SLIP10Ed25519MoneroPublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import {
  bytesToString, concatBytes, ensureTypeMatch, getBytes, integerToBytes, equalBytes
} from '../utils';
import { Network } from '../cryptocurrencies/cryptocurrency';
import { AddressOptionsInterface } from '../interfaces';
import { AddressError, BaseError } from '../exceptions';
import { Address } from './address';

export class MoneroAddress extends Address {

  static checksumLength: number = Monero.PARAMS.CHECKSUM_LENGTH;
  static paymentIDLength: number = Monero.PARAMS.PAYMENT_ID_LENGTH;

  static network: string = Monero.DEFAULT_NETWORK;
  static addressType: string = Monero.DEFAULT_ADDRESS_TYPE;
  static networks: Record<string, { addressTypes: Record<string, number> }> = {
    mainnet: {
      addressTypes: {
        'standard': Monero.NETWORKS.MAINNET.STANDARD,
        'integrated': Monero.NETWORKS.MAINNET.INTEGRATED,
        'sub-address': Monero.NETWORKS.MAINNET.SUB_ADDRESS
      }
    },
    stagenet: {
      addressTypes: {
        'standard': Monero.NETWORKS.STAGENET.STANDARD,
        'integrated': Monero.NETWORKS.STAGENET.INTEGRATED,
        'sub-address': Monero.NETWORKS.STAGENET.SUB_ADDRESS
      }
    },
    testnet: {
      addressTypes: {
        'standard': Monero.NETWORKS.TESTNET.STANDARD,
        'integrated': Monero.NETWORKS.TESTNET.INTEGRATED,
        'sub-address': Monero.NETWORKS.TESTNET.SUB_ADDRESS
      }
    }
  };

  static getName(): string {
    return 'Monero';
  }

  static computeChecksum(data: Uint8Array): Uint8Array {
    return keccak256(data).subarray(0, this.checksumLength);
  }

  static encode(
    publicKeys: {
      spendPublicKey: Uint8Array | string | PublicKey, viewPublicKey: Uint8Array | string | PublicKey
    },
    options: AddressOptionsInterface = {
      network: this.network, addressType: this.addressType
    }
  ): string {
    const { spendPublicKey, viewPublicKey } = publicKeys;

    const addressType = options.addressType ?? this.addressType;
    const paymentID = options.paymentID ? getBytes(options.paymentID) : undefined;

    const spend = validateAndGetPublicKey(spendPublicKey, SLIP10Ed25519MoneroPublicKey);
    const view = validateAndGetPublicKey(viewPublicKey, SLIP10Ed25519MoneroPublicKey);

    if (paymentID && paymentID.length !== this.paymentIDLength) {
      throw new BaseError('Invalid payment ID length', {
        expected: this.paymentIDLength, got: paymentID.length
      });
    }
    const network = options.network ?? this.network;
    const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
    const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.getName() : network;
    const version = integerToBytes(
      this.networks[networkName].addressTypes[addressType]
    );
    const payload = concatBytes(
      version, spend.getRawCompressed(), view.getRawCompressed(), getBytes(paymentID ?? new Uint8Array(0))
    );

    const checksum = this.computeChecksum(getBytes(payload));
    return encodeMonero(getBytes(concatBytes(payload, checksum)));
  }

  static decode(
    address: string, options: AddressOptionsInterface = {
      network: this.network, addressType: this.addressType
    }
  ): [string, string] {

    const addressType = options.addressType ?? this.addressType;
    const paymentID = getBytes(options.paymentID ?? new Uint8Array(0));

    const decoded = decodeMonero(address);
    const checksum = decoded.subarray(-this.checksumLength);
    const payloadWithPrefix = decoded.subarray(0, -this.checksumLength);

    const computedChecksum = this.computeChecksum(payloadWithPrefix);
    if (!equalBytes(checksum, computedChecksum)) {
      throw new AddressError('Invalid checksum', {
        expected: bytesToString(checksum), got: bytesToString(computedChecksum)
      });
    }

    const network = options.network ?? this.network;
    const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
    const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.getName() : network;
    const version = integerToBytes(
      this.networks[networkName].addressTypes[addressType]
    );
    const versionGot = payloadWithPrefix.subarray(0, version.length);
    if (!equalBytes(versionGot, version)) {
      throw new AddressError('Invalid version', { expected: version, got: versionGot });
    }

    const payload = payloadWithPrefix.subarray(version.length);
    const pubkeyLen = SLIP10Ed25519MoneroPublicKey.getCompressedLength();

    let spend: Uint8Array;
    let view: Uint8Array;

    if (payload.length === 2 * pubkeyLen) {
      spend = payload.subarray(0, pubkeyLen);
      view = payload.subarray(pubkeyLen);
    } else if (payload.length === 2 * pubkeyLen + this.paymentIDLength) {
      if (!paymentID || paymentID.length !== this.paymentIDLength) {
        throw new BaseError('Missing or invalid payment ID');
      }

      const paymentIDGot = payload.subarray(-this.paymentIDLength);
      if (!equalBytes(paymentID, paymentIDGot)) {
        throw new BaseError('Payment ID mismatch', {
          expected: bytesToString(paymentIDGot), got: bytesToString(paymentID)
        });
      }

      spend = payload.subarray(0, pubkeyLen);
      view = payload.subarray(pubkeyLen, pubkeyLen * 2);
    } else {
      throw new AddressError('Invalid payload length', {
        expected: 2 * pubkeyLen, got: payload.length
      });
    }

    if (!SLIP10Ed25519MoneroPublicKey.isValidBytes(spend)) {
      throw new BaseError('Invalid spend public key');
    }

    if (!SLIP10Ed25519MoneroPublicKey.isValidBytes(view)) {
      throw new BaseError('Invalid view public key');
    }
    return [bytesToString(spend), bytesToString(view)];
  }
}
