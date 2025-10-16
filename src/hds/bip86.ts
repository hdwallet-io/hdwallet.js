// SPDX-License-Identifier: MIT

import { BIP86Derivation, CHANGES } from '../derivations';
import { Bitcoin } from '../cryptocurrencies';
import { P2TRAddress } from '../addresses';
import { BIP32HD } from './bip32';
import { BIP44HD } from './bip44';
import { PUBLIC_KEY_TYPES } from '../consts';
import { serialize } from '../keys';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { integerToBytes, ensureTypeMatch } from '../utils';
import { DerivationError } from '../exceptions';

/**
 * Implements the BIP86 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support Taproot (P2TR) addresses.
 * Provides methods for key derivation, extended key generation, and Taproot address encoding.
 *
 */
export class BIP86HD extends BIP44HD {

  /**
   * Create a new BIP86HD instance with optional configuration.
   * @param options Configuration options for HD wallet
   * @param options.publicKeyType Type of public key (compressed/uncompressed)
   * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
   * @param options.account Account index (default: 0)
   * @param options.change Change chain (0: external, 1: internal, default: external)
   * @param options.address Address index (default: 0)
   */
  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
  }) {
    super(options);

    this.coinType = options.coinType ?? Bitcoin.COIN_TYPE;
    this.derivation = new BIP86Derivation({
      coinType: this.coinType,
      account: options.account ?? 0,
      change: options.change ?? CHANGES.EXTERNAL_CHAIN,
      address: options.address ?? 0
    });
  }

  /**
   * Returns the name of this HD implementation.
   * @returns {string} 'BIP86'
   */
  static getName(): string {
    return 'BIP86';
  }

  /**
   * Apply a full BIP86 derivation path to the HD instance.
   * @param derivation BIP86Derivation instance
   * @returns {this} Current BIP86HD instance
   * @throws {DerivationError} If the derivation type is invalid
   */
  fromDerivation(derivation: BIP86Derivation): this {
    this.cleanDerivation();
    this.derivation = ensureTypeMatch(
      derivation, BIP86Derivation, { errorClass: DerivationError }
    );
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  /**
   * Get the root extended private key (xprv) for BIP86 with optional version and encoding.
   * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string | null} Serialized root extended private key or null if unavailable
   */
  getRootXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2TR, encoded = true
  ): string | null {
    if (!this.getRootPrivateKey() || !this.getRootChainCode()) return null;

    return serialize(
      typeof version === 'number' ? integerToBytes(version) : version,
      this.rootDepth,
      new Uint8Array(4),
      this.rootIndex,
      this.getRootChainCode()!,
      '00' + this.getRootPrivateKey()!,
      encoded
    );
  }

  /**
   * Get the root extended public key (xpub) for BIP86 with optional version and encoding.
   * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string | null} Serialized root extended public key or null if unavailable
   */
  getRootXPublicKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2TR, encoded = true
  ): string | null {
    if (!this.getRootChainCode()) return null;

    return serialize(
      typeof version === 'number' ? integerToBytes(version) : version,
      this.rootDepth,
      new Uint8Array(4),
      this.rootIndex,
      this.getRootChainCode()!,
      this.getRootPublicKey(PUBLIC_KEY_TYPES.COMPRESSED)!,
      encoded
    );
  }

  /**
   * Get the extended private key (xprv) for the current derivation path.
   * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string | null} Serialized extended private key or null if unavailable
   */
  getXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2TR, encoded = true
  ): string | null {
    if (!this.getPrivateKey() || !this.getChainCode()) return null;

    return serialize(
      typeof version === 'number' ? integerToBytes(version) : version,
      this.depth,
      this.getParentFingerprint()!,
      this.index,
      this.getChainCode()!,
      '00' + this.getPrivateKey()!,
      encoded
    );
  }

  /**
   * Get the extended public key (xpub) for the current derivation path.
   * @param version Version bytes or number (default: Bitcoin mainnet P2TR)
   * @param encoded Whether to return a base58-encoded string (default: true)
   * @returns {string | null} Serialized extended public key or null if unavailable
   */
  getXPublicKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2TR, encoded = true
  ): string | null {
    if (!this.getChainCode()) return null;

    return serialize(
      typeof version === 'number' ? integerToBytes(version) : version,
      this.depth,
      this.getParentFingerprint()!,
      this.index,
      this.getChainCode()!,
      this.getPublicKey(PUBLIC_KEY_TYPES.COMPRESSED)!,
      encoded
    );
  }

  /**
   * Generate a Taproot (P2TR) address from the current public key.
   * @param options Address generation options
   * @param options.hrp Human-readable part of Bech32 address (default: Bitcoin mainnet HRP)
   * @param options.witnessVersion Witness version for Taproot (default: P2TR)
   * @returns {string} Encoded P2TR address
   */
  getAddress(options: HDAddressOptionsInterface = {
    hrp: Bitcoin.NETWORKS.MAINNET.HRP,
    witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
  }): string {
    return P2TRAddress.encode(this.publicKey!, {
      hrp: options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP,
      witnessVersion: options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR,
      publicKeyType: this.publicKeyType
    });
  }
}
