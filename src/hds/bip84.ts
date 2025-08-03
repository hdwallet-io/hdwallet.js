// SPDX-License-Identifier: MIT

import { BIP84Derivation, CHANGES } from '../derivations';
import { Bitcoin } from '../cryptocurrencies';
import { P2WPKHAddress } from '../addresses';
import { BIP32HD } from './bip32';
import { BIP44HD } from './bip44';
import { PUBLIC_KEY_TYPES } from '../consts';
import { serialize } from '../keys';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { integerToBytes, ensureTypeMatch } from '../utils';
import { DerivationError } from '../exceptions';

export class BIP84HD extends BIP44HD {

  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
  }) {
    super(options);

    this.coinType = options.coinType ?? Bitcoin.COIN_TYPE;
    this.derivation = new BIP84Derivation({
      coinType: this.coinType,
      account: options.account ?? 0,
      change: options.change ?? CHANGES.EXTERNAL_CHAIN,
      address: options.address ?? 0
    });
  }

  static getName(): string {
    return 'BIP84';
  }

  fromDerivation(derivation: BIP84Derivation): this {
    this.derivation = ensureTypeMatch(
      derivation, BIP84Derivation, { errorClass: DerivationError }
    );
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  updateDerivation(derivation: BIP84Derivation): this {
    this.cleanDerivation();
    this.fromDerivation(derivation);
    return this;
  }

  cleanDerivation(): this {
    super.cleanDerivation();
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  getRootXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH, encoded = true
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

  getRootXPublicKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH, encoded = true
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

  getXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH, encoded = true
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

  getXPublicKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH, encoded = true
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

  getAddress(options: HDAddressOptionsInterface = {
    hrp: Bitcoin.NETWORKS.MAINNET.HRP,
    witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
  }): string {
    return P2WPKHAddress.encode(this.publicKey!, {
      hrp: options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP,
      witnessVersion: options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
      publicKeyType: this.publicKeyType
    });
  }
}
