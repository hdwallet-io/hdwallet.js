// SPDX-License-Identifier: MIT

import { HD } from '../hd';
import { ElectrumDerivation } from '../../derivations';
import { Bitcoin } from '../../cryptocurrencies';
import {
  PublicKey, PrivateKey, SLIP10Secp256k1ECC, SLIP10Secp256k1PrivateKey, SLIP10Secp256k1PublicKey
} from '../../eccs';
import {
  getBytes, bytesToString, bytesToInteger, integerToBytes, ensureTypeMatch, concatBytes
} from '../../utils';
import { doubleSha256 } from '../../crypto';
import { WIF_TYPES, PUBLIC_KEY_TYPES } from '../../consts';
import { privateKeyToWIF, wifToPrivateKey } from '../../wif';
import { P2PKHAddress } from '../../addresses';
import { SeedError, DerivationError, PrivateKeyError, PublicKeyError, WIFError, BaseError } from '../../exceptions';
import { Seed } from '../../seeds';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../../interfaces';

export class ElectrumV1HD extends HD {

  protected seed?: Uint8Array;
  protected masterPrivateKey?: PrivateKey;
  protected masterPublicKey!: PublicKey;
  protected privateKey?: PrivateKey;
  protected publicKey!: PublicKey;
  protected publicKeyType: string;
  protected wifType: string;
  protected wifPrefix?: number;

  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED
  }) {
    super({ ecc: SLIP10Secp256k1ECC, ...options });

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
  }

  static getName(): string {
    return 'Electrum-V1';
  }

  fromSeed(seed: Uint8Array | string | Seed): this {
    try {
      this.seed = getBytes(seed instanceof Seed ? seed.getSeed() : seed);
      return this.fromPrivateKey(this.seed);
    } catch {
      throw new SeedError('Invalid seed data');
    }
  }

  fromPrivateKey(key: Uint8Array | string): this {
    try {
      this.masterPrivateKey = SLIP10Secp256k1PrivateKey.fromBytes(getBytes(key));
      this.masterPublicKey = this.masterPrivateKey.getPublicKey();
      this.fromDerivation(this.derivation);
      return this;
    } catch {
      throw new PrivateKeyError('Invalid private key data');
    }
  }

  fromWIF(wif: string): this {
    if (this.wifPrefix == null) throw new WIFError('WIF prefix is required');
    return this.fromPrivateKey(wifToPrivateKey(wif, this.wifPrefix));
  }

  fromPublicKey(key: Uint8Array | string): this {
    try {
      this.masterPublicKey = SLIP10Secp256k1PublicKey.fromBytes(getBytes(key));
      this.fromDerivation(this.derivation);
      return this;
    } catch {
      throw new PublicKeyError('Invalid public key error');
    }
  }

  fromDerivation(derivation: ElectrumDerivation): this {
    this.derivation = ensureTypeMatch(
      derivation, ElectrumDerivation, { errorClass: DerivationError }
    );
    this.drive(derivation.getChange(), derivation.getAddress());
    return this;
  }

  updateDerivation(derivation: ElectrumDerivation): this {
    return this.fromDerivation(derivation);
  }

  cleanDerivation(): this {
    this.derivation.clean();
    this.fromDerivation(this.derivation);
    return this;
  }

  drive(changeIndex: number, addressIndex: number): this {
    const sequence = doubleSha256(concatBytes(
      new TextEncoder().encode(`${addressIndex}:${changeIndex}:`),
      this.masterPublicKey.getRawUncompressed().slice(1)
    ));

    if (this.masterPrivateKey) {
      const privateKeyInt =
        (bytesToInteger(this.masterPrivateKey.getRaw()) + bytesToInteger(sequence)) % SLIP10Secp256k1ECC.ORDER;
      this.privateKey = SLIP10Secp256k1PrivateKey.fromBytes(
        integerToBytes(privateKeyInt, SLIP10Secp256k1PrivateKey.getLength())
      );
      this.publicKey = this.privateKey.getPublicKey();
    } else {
      this.publicKey = SLIP10Secp256k1PublicKey.fromPoint(
        this.masterPublicKey.getPoint().add(
          SLIP10Secp256k1ECC.GENERATOR.multiply(bytesToInteger(sequence))
        )
      );
    }
    return this;
  }

  getSeed(): string | null {
    return this.seed ? bytesToString(this.seed) : null;
  }

  getMasterPrivateKey(): string | null {
    return this.masterPrivateKey ? bytesToString(this.masterPrivateKey.getRaw()) : null;
  }

  getMasterWIF(wifType?: string): string | null {
    if (!this.masterPrivateKey || this.wifPrefix == null) return null;

    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getMasterPrivateKey()!, type, this.wifPrefix);
  }

  getMasterPublicKey(publicKeyType: string = this.publicKeyType): string {
    if (publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
      return bytesToString(this.masterPublicKey.getRawUncompressed());
    } else if (publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
      return bytesToString(this.masterPublicKey.getRawCompressed());
    }
    throw new BaseError(`Invalid ${this.getName()} public key type`, {
      expected: Object.values(PUBLIC_KEY_TYPES), got: publicKeyType
    });
  }

  getPrivateKey(): string | null {
    return this.privateKey ? bytesToString(this.privateKey.getRaw()) : null;
  }

  getWIF(wifType?: string): string | null {
    if (!this.privateKey || this.wifPrefix == null) return null;

    const type = wifType ?? this.wifType;
    return privateKeyToWIF(this.getPrivateKey()!, type, this.wifPrefix);
  }

  getWIFType(): string {
    return this.wifType;
  }

  getPublicKey(publicKeyType: string = this.publicKeyType): string {
    if (publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
      return bytesToString(this.publicKey.getRawUncompressed());
    } else if (publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
      return bytesToString(this.publicKey.getRawCompressed());
    }
    throw new BaseError(`Invalid ${this.getName()} public key type`, {
      expected: Object.values(PUBLIC_KEY_TYPES), got: publicKeyType
    });
  }

  getPublicKeyType(): string {
    return this.publicKeyType;
  }

  getCompressed(): string {
    return bytesToString(this.publicKey.getRawCompressed());
  }

  getUncompressed(): string {
    return bytesToString(this.publicKey.getRawUncompressed());
  }

  getAddress(options: HDAddressOptionsInterface = {
    publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
  }): string {
    return P2PKHAddress.encode(this.publicKey!, {
      publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
      publicKeyType: this.publicKeyType
    });
  }
}
