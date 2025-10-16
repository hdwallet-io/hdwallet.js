// SPDX-License-Identifier: MIT

import { HD } from '../hd';
import { ElectrumDerivation, CustomDerivation } from '../../derivations';
import { PUBLIC_KEY_TYPES, MODES, WIF_TYPES } from '../../consts';
import { P2PKHAddress, P2WPKHAddress } from '../../addresses';
import { privateKeyToWIF } from '../../wif';
import { Bitcoin } from '../../cryptocurrencies';
import { BIP32HD } from '../bip32';
import { ensureTypeMatch } from '../../utils';
import { Seed } from '../../seeds';
import { BaseError, AddressError, DerivationError } from '../../exceptions';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../../interfaces';
import { SLIP10Secp256k1ECC } from '../../eccs';

/**
 * Electrum V2 hierarchical deterministic (HD) wallet.
 * Supports standard (P2PKH) and SegWit (P2WPKH) modes.
 * Wraps a BIP32HD instance and provides Electrum-specific derivation logic.
 *
 */
export class ElectrumV2HD extends HD {

  protected mode: string;
  protected wifType: string;
  protected publicKeyType: string;
  protected wifPrefix?: number;
  protected bip32HD: BIP32HD;

  /**
   * Constructs a new ElectrumV2HD instance.
   * @param options Configuration options
   * @param options.publicKeyType Type of public key ('compressed' or 'uncompressed')
   * @param options.mode Wallet mode ('standard' or 'segwit')
   * @param options.wifPrefix Optional WIF prefix
   * @param options.change Optional derivation change index
   * @param options.address Optional derivation address index
   * @throws {BaseError} If mode or public key type is invalid
   */
  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
    mode: MODES.STANDARD
  }) {
    super({ ecc: SLIP10Secp256k1ECC, ...options });

    this.mode = options.mode ?? MODES.STANDARD;
    if (!MODES.getTypes().includes(this.mode)) {
      throw new BaseError(`Invalid ${this.getName()} mode`, {
        expected: MODES.getTypes(),
        got: this.mode
      });
    }

    this.publicKeyType = options.publicKeyType ?? PUBLIC_KEY_TYPES.UNCOMPRESSED;
    if (this.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
      this.wifType = WIF_TYPES.WIF;
    } else if (this.publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
      this.wifType = WIF_TYPES.WIF_COMPRESSED;
    } else {
      throw new BaseError('Invalid public key type', {
        expected: PUBLIC_KEY_TYPES.getTypes(), got: this.publicKeyType
      });
    }

    this.wifPrefix = options.wifPrefix ?? Bitcoin.NETWORKS.MAINNET.WIF_PREFIX;
    this.derivation = new ElectrumDerivation({
      change: options.change, address: options.address
    });
    this.bip32HD = new BIP32HD({
      ecc: Bitcoin.ECC, publicKeyType: this.publicKeyType
    });
  }

  /**
   * Returns the name of this HD implementation.
   * @returns {string} 'Electrum-V2'
   */
  static getName(): string {
    return 'Electrum-V2';
  }

  /**
   * Initializes wallet from a seed.
   * @param seed Seed as Uint8Array, string, or Seed instance
   * @returns {this} Current ElectrumV2HD instance
   */
  fromSeed(seed: Uint8Array | string | Seed): this {
    this.bip32HD.fromSeed(seed);
    this.fromDerivation(this.derivation);
    return this;
  }

  /**
   * Sets the derivation path.
   * @param derivation ElectrumDerivation instance
   * @returns {this} Current ElectrumV2HD instance
   * @throws {DerivationError} If derivation is invalid
   */
  fromDerivation(derivation: ElectrumDerivation): this {
    this.derivation = ensureTypeMatch(
      derivation, ElectrumDerivation, { errorClass: DerivationError }
    );
    this.drive(derivation.getChange(), derivation.getAddress());
    return this;
  }

  /**
   * Updates derivation path by cleaning previous derivation state.
   * @param derivation ElectrumDerivation instance
   * @returns {this} Current ElectrumV2HD instance
   */
  updateDerivation(derivation: ElectrumDerivation): this {
    this.cleanDerivation();
    return this.fromDerivation(derivation);
  }

  /**
   * Resets derivation path to initial state.
   * @returns {this} Current ElectrumV2HD instance
   */
  cleanDerivation(): this {
    this.derivation.clean();
    this.fromDerivation(this.derivation);
    return this;
  }

  /**
   * Derives child keys for given change and address indices.
   * Uses custom Electrum V2 derivation logic.
   * @param changeIndex Change index
   * @param addressIndex Address index
   * @returns {this} Current ElectrumV2HD instance
   */
  drive(changeIndex: number, addressIndex: number): this {
    const custom = new CustomDerivation();
    if (this.mode === MODES.SEGWIT) {
      custom.fromIndex(0, true); // Hardened
    }
    custom.fromIndex(changeIndex);
    custom.fromIndex(addressIndex);
    this.bip32HD.updateDerivation(custom);
    return this;
  }

  /**
   * Returns the current wallet mode ('standard' or 'segwit').
   * @returns {string} Mode string
   */
  getMode(): string {
    return this.mode;
  }

  /**
   * Returns the raw seed as string.
   * @returns {string|null} Seed or null if not set
   */
  getSeed(): string | null {
    return this.bip32HD.getSeed();
  }

  /**
   * Returns master private key as string.
   * @returns {string|null} Master private key
   */
  getMasterPrivateKey(): string | null {
    return this.bip32HD.getRootPrivateKey();
  }

  /**
   * Returns master private key in WIF format.
   * @param wifType Optional WIF type override
   * @returns {string|null} WIF string
   */
  getMasterWIF(wifType?: string): string | null {
    if (this.wifPrefix == null) return null;
    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getMasterPrivateKey()!, type, this.wifPrefix);
  }

  /**
   * Returns master public key as string.
   * @param publicKeyType Optional type ('compressed' or 'uncompressed')
   * @returns {string} Master public key
   */
  getMasterPublicKey(publicKeyType?: string): string {
    return this.bip32HD.getRootPublicKey(publicKeyType ?? this.publicKeyType)!;
  }

  /**
   * Returns derived private key as string.
   * @returns {string|null} Derived private key
   */
  getPrivateKey(): string | null {
    return this.bip32HD.getPrivateKey();
  }

  /**
   * Returns derived private key in WIF format.
   * @param wifType Optional WIF type override
   * @returns {string|null} WIF string
   */
  getWIF(wifType?: string): string | null {
    if (this.wifPrefix == null) return null;
    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getPrivateKey()!, type, this.wifPrefix);
  }

  /**
   * Returns the WIF type used by this instance.
   * @returns {string} WIF type
   */
  getWIFType(): string {
    return this.wifType;
  }

  /**
   * Returns derived public key as string.
   * @param publicKeyType Optional type ('compressed' or 'uncompressed')
   * @returns {string} Public key string
   */
  getPublicKey(publicKeyType?: string): string {
    return this.bip32HD.getPublicKey(publicKeyType ?? this.publicKeyType);
  }

  /**
   * Returns public key type used by this instance.
   * @returns {string} Public key type string
   */
  getPublicKeyType(): string {
    return this.publicKeyType;
  }

  /**
   * Returns derived public key in uncompressed format.
   * @returns {string} Uncompressed public key
   */
  getUncompressed(): string {
    return this.bip32HD.getUncompressed();
  }

  /**
   * Returns derived public key in compressed format.
   * @returns {string} Compressed public key
   */
  getCompressed(): string {
    return this.bip32HD.getCompressed();
  }

  /**
   * Generates an address based on the current mode.
   * - Standard mode → P2PKH
   * - SegWit mode → P2WPKH
   *
   * @param options Address generation options
   * @param options.publicKeyAddressPrefix Prefix for P2PKH address (standard mode)
   * @param options.hrp Human-readable part for Bech32 address (SegWit mode)
   * @param options.witnessVersion Witness version for SegWit address
   * @returns {string} Encoded Bitcoin address
   * @throws {AddressError} If mode is invalid
   */
  getAddress(options: HDAddressOptionsInterface = {
    publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
    hrp: Bitcoin.NETWORKS.MAINNET.HRP,
    witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
  }): string {

    if (this.mode === MODES.STANDARD) {
      return P2PKHAddress.encode(this.getPublicKey(), {
        publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
        publicKeyType: this.publicKeyType
      });
    } else if (this.mode === MODES.SEGWIT) {
      return P2WPKHAddress.encode(this.getPublicKey(), {
        hrp: options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
        publicKeyType: this.publicKeyType
      });
    }
    throw new AddressError(`Invalid ${this.getName()} mode`, {
      expected: MODES.getTypes(), got: this.mode
    });
  }
}
