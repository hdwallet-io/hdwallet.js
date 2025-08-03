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

export class ElectrumV2HD extends HD {

  protected mode: string;
  protected wifType: string;
  protected publicKeyType: string;
  protected wifPrefix?: number;
  protected bip32HD: BIP32HD;

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

  static getName(): string {
    return 'Electrum-V2';
  }

  fromSeed(seed: Uint8Array | string | Seed): this {
    this.bip32HD.fromSeed(seed);
    this.fromDerivation(this.derivation);
    return this;
  }

  fromDerivation(derivation: ElectrumDerivation): this {
    this.derivation = ensureTypeMatch(
      derivation, ElectrumDerivation, { errorClass: DerivationError }
    );
    this.drive(derivation.getChange(), derivation.getAddress());
    return this;
  }

  updateDerivation(derivation: ElectrumDerivation): this {
    this.cleanDerivation();
    return this.fromDerivation(derivation);
  }

  cleanDerivation(): this {
    this.derivation.clean();
    this.fromDerivation(this.derivation);
    return this;
  }

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

  getMode(): string {
    return this.mode;
  }

  getSeed(): string | null {
    return this.bip32HD.getSeed();
  }

  getMasterPrivateKey(): string | null {
    return this.bip32HD.getRootPrivateKey();
  }

  getMasterWIF(wifType?: string): string | null {
    if (this.wifPrefix == null) return null;
    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getMasterPrivateKey()!, type, this.wifPrefix);
  }

  getMasterPublicKey(publicKeyType?: string): string {
    return this.bip32HD.getRootPublicKey(publicKeyType ?? this.publicKeyType)!;
  }

  getPrivateKey(): string | null {
    return this.bip32HD.getPrivateKey();
  }

  getWIF(wifType?: string): string | null {
    if (this.wifPrefix == null) return null;
    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getPrivateKey()!, type, this.wifPrefix);
  }

  getWIFType(): string {
    return this.wifType;
  }

  getPublicKey(publicKeyType?: string): string {
    return this.bip32HD.getPublicKey(publicKeyType ?? this.publicKeyType);
  }

  getPublicKeyType(): string {
    return this.publicKeyType;
  }

  getUncompressed(): string {
    return this.bip32HD.getUncompressed();
  }

  getCompressed(): string {
    return this.bip32HD.getCompressed();
  }

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
