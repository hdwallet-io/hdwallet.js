// SPDX-License-Identifier: MIT

import { encode } from 'cbor2';

import { BIP32HD } from './bip32';
import { Cardano } from '../cryptocurrencies';
import { EllipticCurveCryptography, KholawEd25519ECC, KholawEd25519PrivateKey } from '../eccs';
import { pbkdf2HmacSha512, hmacSha512, hmacSha256, sha512 } from '../crypto';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import {
  getBytes, bytesToString, resetBits, setBits, getHmac, areBitsSet, concatBytes, toBuffer,
  multiplyScalarNoCarry, integerToBytes, bytesToInteger, addNoCarry
} from '../utils';
import { CardanoAddress } from '../addresses';
import { Seed } from '../seeds';
import {
  BaseError, AddressError, SeedError, PrivateKeyError, PublicKeyError, DerivationError
} from '../exceptions';
import { PUBLIC_KEY_TYPES } from '../consts';

/**
 * Implements hierarchical deterministic (HD) wallet logic for Cardano.
 * Supports multiple Cardano derivation types including Byron Legacy, Icarus, Shelley, and Ledger.
 * Provides methods to derive keys, addresses, and extended keys according to Cardano standards.
 *
 */
export class CardanoHD extends BIP32HD {

  protected cardanoType!: string;

  /**
   * Creates a new CardanoHD instance.
   * @param options Configuration options for Cardano HD wallet
   * @param options.publicKeyType Type of public key (default: compressed)
   * @param options.cardanoType Cardano derivation type (required)
   * @throws {BaseError} If an invalid Cardano type is provided
   */
  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
  }) {
    options.ecc = KholawEd25519ECC;
    super(options);

    if (!options.cardanoType || !Cardano.TYPES.getCardanoTypes().includes(options.cardanoType)) {
      throw new BaseError('Invalid Cardano type', {
        expected: Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
      });
    }
    this.cardanoType = options.cardanoType;
  }

  /**
   * Returns the name of this HD implementation.
   * @returns {string} 'Cardano'
   */
  static getName(): string {
    return 'Cardano';
  }

  /**
   * Initializes the HD wallet from a seed.
   * Handles different derivation types and Cardano-specific tweaks.
   *
   * @param seed Seed value as string or Seed instance
   * @param passphrase Optional passphrase for certain derivation types
   * @returns {this} Current CardanoHD instance
   * @throws {SeedError|BaseError} If seed data or length is invalid
   */
  fromSeed(seed: string | Seed, passphrase?: string): this {
    try {
      this.seed = getBytes(
        seed instanceof Seed ? seed.getSeed() : seed
      );
    } catch {
      throw new SeedError('Invalid seed data');
    }

    const digestSize = 64;
    const hmacHalfLength = digestSize / 2;

    const tweakMasterKeyBits = (data: Uint8Array): Uint8Array => {
      const d = new Uint8Array(data);
      d[0] = resetBits(d[0], 0x07);
      d[31] = resetBits(d[31], this.cardanoType === Cardano.TYPES.BYRON_ICARUS || this.cardanoType === Cardano.TYPES.SHELLEY_ICARUS ? 0xE0 : 0x80);
      d[31] = setBits(d[31], 0x40);
      return d;
    };

    if (this.cardanoType === Cardano.TYPES.BYRON_LEGACY) {
      if (this.seed.length !== 32) {
        throw new BaseError('Invalid seed length', {
          expected: 32, got: this.seed.length
        });
      }

      const digestSize = 64;
      const data = encode(this.seed);
      let iteration = 1;

      while (true) {
        const label = toBuffer(`Root Seed Chain ${iteration}`);
        const i = hmacSha512(data, label);

        let il = sha512(i.slice(0, digestSize / 2));
        const ir = i.slice(digestSize / 2);
        il = toBuffer(tweakMasterKeyBits(il));

        if (!areBitsSet(il[31], 0x20)) {
          this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(il);
          this.rootChainCode = ir;
          break;
        }
        iteration++;
      }

    } else if ([Cardano.TYPES.BYRON_ICARUS, Cardano.TYPES.SHELLEY_ICARUS].includes(this.cardanoType)) {
      if (this.seed.length < 16) {
        throw new BaseError('Invalid seed length', { expected: '>= 16', got: this.seed.length });
      }

      const k = tweakMasterKeyBits(pbkdf2HmacSha512(passphrase ?? '', this.seed, 4096, 96));
      this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(k.slice(0, KholawEd25519PrivateKey.getLength()));
      this.rootChainCode = k.slice(KholawEd25519PrivateKey.getLength());

    } else if ([Cardano.TYPES.BYRON_LEDGER, Cardano.TYPES.SHELLEY_LEDGER].includes(this.cardanoType)) {
      if (this.seed.length < 16) {
        throw new BaseError('Invalid seed length', { expected: '>= 16', got: this.seed.length });
      }

      let hmacData = this.seed;
      let hmac: Uint8Array;

      while (true) {
        hmac = hmacSha512(getHmac((this.ecc as typeof EllipticCurveCryptography).NAME), hmacData);
        if ((hmac[31] & 0x20) === 0) break;
        hmacData = hmac;
      }

      let kl = tweakMasterKeyBits(hmac.slice(0, hmacHalfLength));
      const kr = hmac.slice(hmacHalfLength);

      const chainCode = hmacSha256(getHmac((this.ecc as typeof EllipticCurveCryptography).NAME), concatBytes(toBuffer([0x01]), this.seed));

      this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(concatBytes(kl, kr));
      this.rootChainCode = chainCode;
    }

    this.rootPublicKey = this.rootPrivateKey!.getPublicKey();
    this.privateKey = this.rootPrivateKey;
    this.chainCode = this.rootChainCode;
    this.parentFingerprint = new Uint8Array(4);
    this.publicKey = this.privateKey!.getPublicKey();
    this.strict = true;
    return this;
  }

  /**
   * Sets the HD wallet from a private key (only supported for Shelley types).
   * @param privateKey Private key as string
   * @returns {this} Current CardanoHD instance
   * @throws {BaseError|PrivateKeyError} If private key is unsupported or invalid
   */
  fromPrivateKey(privateKey: string): this {
    if ([Cardano.TYPES.BYRON_ICARUS, Cardano.TYPES.BYRON_LEGACY, Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
      throw new BaseError(`From private key not supported for ${this.cardanoType}`);
    }
    try {
      this.privateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(getBytes(privateKey));
      this.publicKey = this.privateKey.getPublicKey();
      this.strict = null;
      return this;
    } catch {
      throw new PrivateKeyError('Invalid private key data');
    }
  }

  /**
   * Sets the HD wallet from a public key (only supported for Shelley types).
   * @param publicKey Public key as string
   * @returns {this} Current CardanoHD instance
   * @throws {BaseError|PublicKeyError} If public key is unsupported or invalid
   */
  fromPublicKey(publicKey: string): this {
    if ([Cardano.TYPES.BYRON_ICARUS, Cardano.TYPES.BYRON_LEGACY, Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
      throw new BaseError(`From public key not supported for ${this.cardanoType}`);
    }
    try {
      this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromBytes(getBytes(publicKey));
      this.strict = null;
      return this;
    } catch {
      throw new PublicKeyError('Invalid public key data');
    }
  }

  /**
   * Derives a child key at the given index according to Cardano derivation rules.
   * Supports hardened and non-hardened derivation.
   *
   * @param index Child index to derive
   * @returns {this} Current CardanoHD instance with updated keys
   * @throws {BaseError|DerivationError} If derivation fails
   */
  drive(index: number): this {

    const digestHalf = 32; // sha512().digest_size / 2
    const isLegacy = this.cardanoType === Cardano.TYPES.BYRON_LEGACY;
    const indexBytes = integerToBytes(index, 4, isLegacy ? 'big' : 'little');

    if (this.privateKey) {
      let zHmac: Uint8Array, hmac: Uint8Array;
      if (index & 0x80000000) {
        zHmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x00]), this.privateKey.getRaw(), indexBytes));
        hmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x01]), this.privateKey.getRaw(), indexBytes));
      } else {
        const pubRaw = this.publicKey!.getRawCompressed().slice(1);
        zHmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x02]), pubRaw, indexBytes));
        hmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x03]), pubRaw, indexBytes));
      }

      const zl = zHmac.slice(0, digestHalf);
      const zr = zHmac.slice(digestHalf);
      const kl = this.privateKey.getRaw().slice(0, digestHalf);
      const kr = this.privateKey.getRaw().slice(digestHalf);
      const _hmacr = hmac.slice(digestHalf);

      const left = isLegacy
        ? integerToBytes(
            (bytesToInteger(multiplyScalarNoCarry(toBuffer(zl), 8), true) + bytesToInteger(kl, true)) % (this.ecc as typeof EllipticCurveCryptography).ORDER,
            32,
            'little'
          )
        : (() => {
            const zlInt = bytesToInteger(zl.slice(0, 28), true);
            const klInt = bytesToInteger(kl, true);
            const leftInt = zlInt * BigInt(8) + klInt;
            if (leftInt % (this.ecc as typeof EllipticCurveCryptography).ORDER === BigInt(0)) throw new BaseError('Invalid child private key');
            return integerToBytes(leftInt, KholawEd25519PrivateKey.getLength() / 2, 'little');
          })();

      const right = isLegacy
        ? addNoCarry(toBuffer(zr), toBuffer(kr))
        : (() => {
            const zrInt = bytesToInteger(zr, true);
            const krInt = bytesToInteger(kr, true);
            const sum = (zrInt + krInt) % (BigInt(1) << BigInt(256));
            return integerToBytes(sum, KholawEd25519PrivateKey.getLength() / 2, 'little');
          })();

      this.parentFingerprint = getBytes(this.getFingerprint());
      const newPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(concatBytes(left, right));
      this.privateKey = newPrivateKey;
      this.chainCode = _hmacr;
      this.publicKey = newPrivateKey.getPublicKey();
    } else {
      if (index & 0x80000000) {
        throw new DerivationError('Hardened derivation path is invalid for xpublic key');
      }

      const pubRaw = this.publicKey!.getRawCompressed().slice(1);
      const zHmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x02]), pubRaw, indexBytes));
      const hmac = hmacSha512(this.chainCode!, concatBytes(toBuffer([0x03]), pubRaw, indexBytes));

      const zl = zHmac.slice(0, digestHalf);
      const tweak = isLegacy
        ? bytesToInteger(multiplyScalarNoCarry(zl, 8), true)
        : bytesToInteger(zl.slice(0, 28), true) * BigInt(8);

      const newPoint = this.publicKey!.getPoint().add((this.ecc as typeof EllipticCurveCryptography).GENERATOR.multiply(tweak));
      if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
        throw new BaseError('Computed public child key is not valid, very unlucky index');
      }

      this.parentFingerprint = getBytes(this.getFingerprint());
      this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromPoint(newPoint);
      this.chainCode = hmac.slice(digestHalf);
    }

    this.depth += 1;
    this.index = index;
    this.fingerprint = getBytes(this.getFingerprint());
    return this;
  }

  /**
   * Returns the root extended private key (xprv) for the current derivation.
   * Delegates to BIP32HD serialization logic.
   *
   * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string|null} Serialized root extended private key
   */
  getRootXPrivateKey(
    version: Uint8Array | number = Cardano.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH,
    encoded: boolean = true
  ): string | null {
    return super.getRootXPrivateKey(version, encoded);
  }

  /**
   * Returns the extended private key (xprv) for the current path.
   * Delegates to BIP32HD serialization logic.
   *
   * @param version Optional version bytes or number (default: Cardano mainnet P2PKH)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string|null} Serialized extended private key
   */
  getXPrivateKey(
    version: Uint8Array | number = Cardano.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH,
    encoded: boolean = true
  ): string | null {
    return super.getXPrivateKey(version, encoded);
  }

  /**
   * Computes the Byron Legacy path key used for address generation.
   * @returns {string|null} Computed path key or null for non-Legacy types
   */
  getPathKey(): string | null {
    if (this.cardanoType === Cardano.TYPES.BYRON_LEGACY) {
      return bytesToString(pbkdf2HmacSha512(concatBytes(
        this.rootPublicKey!.getRawCompressed().slice(1), this.rootChainCode!
        ), 'address-hashing', 500, 32
      ));
    }
    return null;
  }

  /**
   * Generates a Cardano address for the current public key and derivation path.
   * Handles Byron Legacy, Icarus, Ledger, and Shelley address types.
   *
   * @param options Address generation options
   * @param options.network Network string ('mainnet' or 'testnet', default: 'mainnet')
   * @param options.addressType Type of address (Payment, Staking, Reward, Public Key)
   * @param options.stakingPublicKey Required for Shelley Payment addresses
   * @returns {string} Encoded Cardano address
   * @throws {BaseError|AddressError} If address type is invalid or staking key is missing
   */
  getAddress(options: HDAddressOptionsInterface = {
    network: 'mainnet'
  }): string {

    if (this.cardanoType === Cardano.TYPES.BYRON_LEGACY) {
      return CardanoAddress.encodeByronLegacy(
        this.publicKey!,
        this.getPath(),
        this.getPathKey()!,
        this.chainCode!,
        options.addressType ?? Cardano.ADDRESS_TYPES.PUBLIC_KEY
      );
    } else if ([Cardano.TYPES.BYRON_ICARUS, Cardano.TYPES.BYRON_LEDGER].includes(this.cardanoType)) {
      return CardanoAddress.encodeByronIcarus(
        this.publicKey!, this.chainCode!, options.addressType ?? Cardano.ADDRESS_TYPES.PUBLIC_KEY
      );
    } else if ([Cardano.TYPES.SHELLEY_ICARUS, Cardano.TYPES.SHELLEY_LEDGER].includes(this.cardanoType)) {
      const addressType = options.addressType ?? Cardano.ADDRESS_TYPES.PAYMENT;
      if (addressType === Cardano.ADDRESS_TYPES.PAYMENT) {
        if (!options.stakingPublicKey) {
          throw new BaseError('stakingPublicKey is required for Payment address type');
        }
        return CardanoAddress.encodeShelley(
          this.publicKey!, options.stakingPublicKey, options.network ?? 'mainnet'
        );
      } else if (
        [Cardano.ADDRESS_TYPES.STAKING, Cardano.ADDRESS_TYPES.REWARD].includes(addressType)
      ) {
        return CardanoAddress.encodeShelleyStaking(
          this.publicKey!, options.network ?? 'mainnet'
        );
      }
      throw new AddressError(`Invalid ${this.cardanoType} address type`, {
        expected: [
          Cardano.ADDRESS_TYPES.PAYMENT,
          Cardano.ADDRESS_TYPES.STAKING,
          Cardano.ADDRESS_TYPES.REWARD
        ],
        got: addressType
      });
    }
    throw new AddressError(`Invalid Cardano type`, {
      expected: Cardano.TYPES.getCardanoTypes(), got: this.cardanoType
    });
  }
}
