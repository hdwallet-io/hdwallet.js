// SPDX-License-Identifier: MIT

import { encode, decode, Tag } from 'cbor2';

import { Cardano } from '../cryptocurrencies';
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { encode as base58Encode, decode as base58Decode } from '../libs/base58';
import { KholawEd25519PublicKey, PublicKey, validateAndGetPublicKey } from '../eccs';
import { crc32, blake2b224, sha3_256, chacha20Poly1305Encrypt } from '../crypto';
import {
  getBytes, bytesToInteger, bytesToString, integerToBytes, pathToIndexes, concatBytes, ensureString, equalBytes
} from '../utils';
import { AddressError, BaseError } from '../exceptions';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';

/**
 * Class representing Cardano blockchain addresses.
 * Supports Byron (Legacy & Icarus) and Shelley (Payment & Staking/Reward) address formats.
 * Extends the abstract Address class and provides Cardano-specific encoding and decoding logic.
 */
export class CardanoAddress extends Address {

  static readonly addressTypes: any = {
    'public-key': Cardano.PARAMS.PUBLIC_KEY_ADDRESS,
    'redemption': Cardano.PARAMS.REDEMPTION_ADDRESS
  };
  static readonly networkTypes: any = {
    'mainnet': Cardano.NETWORKS.MAINNET.TYPE,
    'testnet': Cardano.NETWORKS.TESTNET.TYPE
  };
  static readonly prefixTypes: any = {
    'payment': Cardano.PARAMS.PAYMENT_PREFIX,
    'reward': Cardano.PARAMS.REWARD_PREFIX
  };
  static readonly paymentAddressHrp: any = {
    'mainnet': Cardano.NETWORKS.MAINNET.PAYMENT_ADDRESS_HRP,
    'testnet': Cardano.NETWORKS.TESTNET.PAYMENT_ADDRESS_HRP
  };
  static readonly rewardAddressHrp: any = {
    'mainnet': Cardano.NETWORKS.MAINNET.REWARD_ADDRESS_HRP,
    'testnet': Cardano.NETWORKS.TESTNET.REWARD_ADDRESS_HRP
  };
  static readonly chacha20Poly1305AssociatedData = new Uint8Array();
  static readonly chacha20Poly1305Nonce = getBytes('7365726f6b656c6c666f7265');
  static readonly payloadTag = 24;

  /**
   * Returns the name of the address implementation.
   * @returns {string} 'Cardano'
   */
  static getName(): string {
    return 'Cardano';
  }

  /**
   * Encodes a public key into a Cardano address.
   * Supports different types: Byron Legacy, Byron Icarus, Shelley Payment, Shelley Staking/Reward.
   *
   * @param publicKey Public key to encode
   * @param options Address options including encodeType, path, chainCode, network, and staking public key
   * @throws {AddressError} If encode type is invalid
   * @returns {string} Encoded Cardano address
   */
  static encode(
    publicKey: Uint8Array | string | PublicKey, options: AddressOptionsInterface = {
      encodeType: Cardano.ADDRESS_TYPES.PAYMENT
    }
  ): string {

    const encodeType = options.encodeType ?? Cardano.ADDRESS_TYPES.PAYMENT;
    if (encodeType === Cardano.TYPES.BYRON_LEGACY) {
      return this.encodeByronLegacy(
        publicKey,
        options.path!,
        options.pathKey!,
        options.chainCode!,
        options.addressType ?? Cardano.ADDRESS_TYPES.PUBLIC_KEY
      );
    } else if (encodeType === Cardano.TYPES.BYRON_ICARUS) {
      return this.encodeByronIcarus(
        publicKey,
        options.chainCode!,
        options.addressType ?? Cardano.ADDRESS_TYPES.PUBLIC_KEY
      );
    } else if (encodeType === Cardano.ADDRESS_TYPES.PAYMENT) {
      return this.encodeShelley(
        publicKey,
        options.stakingPublicKey!,
        options.network ?? 'mainnet'
      );
    } else if (
      encodeType === Cardano.ADDRESS_TYPES.STAKING ||
      encodeType === Cardano.ADDRESS_TYPES.REWARD
    ) {
      return this.encodeShelleyStaking(
        publicKey,
        options.network ?? 'mainnet'
      );
    }
    throw new AddressError('Invalid encode type');
  }

  /**
   * Decodes a Cardano address into its raw public key.
   * Supports Byron and Shelley address types.
   *
   * @param address Cardano address to decode
   * @param options Address options including decodeType, network, or addressType
   * @throws {AddressError} If decode type is invalid
   * @returns {string} Decoded raw public key
   */
  static decode(
    address: string, options: AddressOptionsInterface = {
      decodeType: Cardano.ADDRESS_TYPES.PAYMENT
    }
  ): string {
    const decodeType = options.decodeType ?? Cardano.ADDRESS_TYPES.PAYMENT;

    if (
      decodeType === Cardano.TYPES.BYRON_LEGACY ||
      decodeType === Cardano.TYPES.BYRON_ICARUS
    ) {
      return this.decodeByron(address, options.addressType ?? Cardano.ADDRESS_TYPES.PUBLIC_KEY);
    } else if (decodeType === Cardano.ADDRESS_TYPES.PAYMENT) {
      return this.decodeShelley(address, options.network ?? 'mainnet');
    } else if (
      decodeType === Cardano.ADDRESS_TYPES.STAKING ||
      decodeType === Cardano.ADDRESS_TYPES.REWARD
    ) {
      return this.decodeShelleyStaking(address, options.network ?? 'mainnet');
    }
    throw new AddressError('Invalid decode type');
  }

  /**
   * Encodes a Byron address (generic helper for Icarus & Legacy).
   *
   * @param publicKey Public key object
   * @param chainCode Chain code for HD derivation
   * @param addressAttributes Extra address attributes (Map)
   * @param addressType Address type ('public-key' or 'redemption')
   * @throws {AddressError} If address type is invalid
   * @returns {string} Encoded Byron address (Base58)
   */
  static encodeByron(
    publicKey: PublicKey,
    chainCode: Uint8Array,
    addressAttributes: any,
    addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY
  ): string {
    if (!(addressType in this.addressTypes)) {
      throw new AddressError('Invalid address type');
    }

    const serialized = encode([
      this.addressTypes[addressType],
      [this.addressTypes[addressType], concatBytes(publicKey.getRawCompressed().slice(1), chainCode)],
      addressAttributes
    ]);

    const rootHash = blake2b224(sha3_256(serialized));
    const payload = encode([
      rootHash,
      addressAttributes,
      this.addressTypes[addressType]
    ]);


    const full = encode([
      new Tag(this.payloadTag, payload), bytesToInteger(crc32(payload))
    ]);
    return ensureString(base58Encode(full));
  }

  /**
   * Encodes a Byron Icarus address.
   * @param publicKey Public key
   * @param chainCode Chain code
   * @param addressType Address type
   * @returns {string} Encoded Byron Icarus address
   */
  static encodeByronIcarus(
    publicKey: Uint8Array | string | PublicKey,
    chainCode: Uint8Array | string,
    addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY
  ): string {
    const pk = validateAndGetPublicKey(publicKey, KholawEd25519PublicKey);
    return this.encodeByron(pk, getBytes(chainCode), { }, addressType);
  }

  /**
   * Encodes a Byron Legacy address using HD path encryption.
   *
   * @param publicKey Public key
   * @param path HD derivation path
   * @param pathKey HD path key
   * @param chainCode Chain code
   * @param addressType Address type
   * @throws {BaseError} If HD path key length is invalid
   * @returns {string} Encoded Byron Legacy address
   */
  static encodeByronLegacy(
    publicKey: Uint8Array | string | PublicKey,
    path: string,
    pathKey: Uint8Array | string,
    chainCode: Uint8Array | string,
    addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY
  ): string {
    const pathK = getBytes(pathKey);
    if (pathK.length !== 32) {
      throw new BaseError('Invalid HD path key length', { expected: 32, got: pathK.length });
    }
    const pk = validateAndGetPublicKey(publicKey, KholawEd25519PublicKey);
    const indexes = pathToIndexes(path);
    const plain = concatBytes(
      integerToBytes(0x9f),
      ...indexes.map(i => encode(i)),
      integerToBytes(0xff)
    );
    const { cipherText, tag } = chacha20Poly1305Encrypt(
      pathK, this.chacha20Poly1305Nonce, this.chacha20Poly1305AssociatedData, plain
    );

    const attributes = new Map<number, Uint8Array>();
    attributes.set(1, encode(concatBytes(cipherText, tag)));
    return this.encodeByron(pk, getBytes(chainCode), attributes, addressType);
  }

  /**
   * Decodes a Byron address (generic for Icarus & Legacy).
   *
   * @param address Address string to decode
   * @param addressType Address type
   * @throws {AddressError} If decoding fails or CRC/payload invalid
   * @returns {string} Decoded raw public key
   */
  static decodeByron(address: string, addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY): string {
    const decoded = base58Decode(address);
    const outer = decode(decoded) as [Tag, number];

    if (!Array.isArray(outer) || outer.length !== 2 || !(outer[0] instanceof Tag)) {
      throw new AddressError('Invalid address encoding');
    }

    const tag = outer[0];
    if (tag.tag !== this.payloadTag) {
      throw new AddressError('Invalid CBOR tag');
    }

    const payload = tag.contents as Uint8Array;
    const crcExpected = outer[1];
    const crcActual = bytesToInteger(crc32(payload));

    if (Number(crcExpected) !== Number(crcActual)) {
      throw new AddressError('Invalid CRC', { expected: crcExpected, got: crcActual });
    }

    const inner = decode(payload) as [Uint8Array, Map<number, any>, number];
    const [rootHash, attrs, tagType] = inner;

    if (tagType !== this.addressTypes[addressType]) {
      throw new AddressError('Invalid address type', { expected: this.addressTypes[addressType], got: tagType });
    }

    if (rootHash.length !== 28) {
      throw new AddressError('Invalid root hash length', { expected: 28, got: rootHash.length });
    }

    let extra: any = new Uint8Array(0);
    if (attrs instanceof Map && attrs.has(1)) {
      const attr1 = attrs.get(1);
      const decrypted = decode(attr1);
      extra = typeof decrypted === 'string' ? getBytes(decrypted) : decrypted;
    }
    return bytesToString(concatBytes(rootHash, extra));
  }

  /**
   * Decode Byron Icarus address.
   * @param address Address string
   * @param addressType Address type
   * @returns {string} Decoded raw public key
   */
  static decodeByronIcarus(
    address: string, addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY
  ): string {
    return CardanoAddress.decodeByron(address, addressType);
  }

  /**
   * Decode Byron Legacy address.
   * @param address Address string
   * @param addressType Address type
   * @returns {string} Decoded raw public key
   */
  static decodeByronLegacy(
    address: string, addressType: string = Cardano.ADDRESS_TYPES.PUBLIC_KEY
  ): string {
    return CardanoAddress.decodeByron(address, addressType);
  }

  /**
   * Encode Shelley payment address.
   * @param publicKey Payment public key
   * @param stakingPublicKey Staking public key
   * @param network Network ('mainnet' or 'testnet')
   * @returns {string} Encoded Shelley payment address
   */
  static encodeShelley(
    publicKey: Uint8Array | string | PublicKey,
    stakingPublicKey: Uint8Array | string | PublicKey,
    network: string
  ): string {
    const pk = validateAndGetPublicKey(publicKey, KholawEd25519PublicKey);
    const spk = validateAndGetPublicKey(stakingPublicKey, KholawEd25519PublicKey);
    const prefix = integerToBytes(
      (this.prefixTypes['payment'] << 4) + this.networkTypes[network]
    );
    const hash1 = blake2b224(pk.getRawCompressed().slice(1));
    const hash2 = blake2b224(spk.getRawCompressed().slice(1));
    return bech32Encode(this.paymentAddressHrp[network], concatBytes(prefix, hash1, hash2));
  }

  /**
   * Decode Shelley payment address.
   * @param address Address string
   * @param network Network ('mainnet' or 'testnet')
   * @throws {AddressError} If address length or prefix invalid
   * @returns {string} Decoded raw public key
   */
  static decodeShelley(address: string, network: string): string {
    const [hrp, data] = bech32Decode(this.paymentAddressHrp[network], address);
    if (!data || data.length !== 57) {
      throw new AddressError('Invalid length', { expected: 57, got: data?.length });
    }
    const prefix = integerToBytes(
      (this.prefixTypes['payment'] << 4) + this.networkTypes[network]
    );
    if (!equalBytes(data.slice(0, 1), prefix)) {
      throw new AddressError('Invalid prefix');
    }
    return bytesToString(data.slice(1));
  }

  /**
   * Encode Shelley staking/reward address.
   * @param publicKey Staking public key
   * @param network Network ('mainnet' or 'testnet')
   * @returns {string} Encoded staking/reward address
   */
  static encodeShelleyStaking(
    publicKey: Uint8Array | string | PublicKey, network: string
  ): string {
    const pk = validateAndGetPublicKey(publicKey, KholawEd25519PublicKey);
    const prefix = integerToBytes(
      (this.prefixTypes['reward'] << 4) + this.networkTypes[network]
    );
    const hash = blake2b224(pk.getRawCompressed().slice(1));
    return bech32Encode(this.rewardAddressHrp[network], concatBytes(prefix, hash));
  }

  /**
   * Decode Shelley staking/reward address.
   * @param address Address string
   * @param network Network ('mainnet' or 'testnet')
   * @throws {AddressError} If address length or prefix invalid
   * @returns {string} Decoded raw public key
   */
  static decodeShelleyStaking(address: string, network: string): string {
    const [hrp, data] = bech32Decode(this.rewardAddressHrp[network], address);
    if (!data || data.length !== 29) {
      throw new AddressError('Invalid length', { expected: 29, got: data?.length });
    }
    const prefix = integerToBytes(
      (this.prefixTypes['reward'] << 4) + this.networkTypes[network]
    );
    if (!equalBytes(data.slice(0, 1), prefix)) {
      throw new AddressError('Invalid prefix');
    }
    return bytesToString(data.slice(1));
  }
}
