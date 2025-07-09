
// SPDX-License-Identifier: MIT

import { Seed } from '../seeds';
import { Monero } from '../cryptocurrencies';
import { scalarReduce, intDecode } from '../libs/ed25519-utils';
import { keccak256 } from '../crypto';
import {
  SLIP10Ed25519MoneroECC,
  SLIP10Ed25519MoneroPrivateKey,
  SLIP10Ed25519MoneroPublicKey,
  PrivateKey,
  PublicKey
} from '../eccs';
import {
  getBytes,
  bytesToString,
  integerToBytes,
  bytesToInteger,
  ensureTypeMatch,
  concatBytes,
  toBuffer
} from '../utils';
import { MoneroDerivation } from '../derivations';
import { DerivationError, AddressError, NetworkError, PrivateKeyError, PublicKeyError, SeedError } from '../exceptions';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
import { Network } from '../cryptocurrencies/cryptocurrency';
import { MoneroAddress } from '../addresses';
import { HD } from './hd';

export class MoneroHD extends HD {

  protected network: Network;
  protected seed?: Uint8Array;
  protected privateKeyRaw?: Uint8Array;
  protected paymentID?: string;

  protected spendPrivateKey?: PrivateKey | null;
  protected viewPrivateKey!: PrivateKey;
  protected spendPublicKey!: PublicKey;
  protected viewPublicKey!: PublicKey;

  constructor(options: HDOptionsInterface = {
    minor: 1, major: 0
  }) {
    super(options);

    const network = ensureTypeMatch(options.network, Network, { otherTypes: ['string'] });
    const networkType = network.isValid ? network.value.NAME : options.network;
    if (!Monero.NETWORKS.isNetwork(networkType)) {
      throw new NetworkError(`Wrong Monero network`, {
        expected: Monero.NETWORKS.getNetworks(), got: options.network
      });
    }
    this.paymentID = options.paymentID;
    this.network = Monero.NETWORKS.getNetwork(networkType);
    this.derivation = new MoneroDerivation({
      minor: options.minor ?? 1,
      major: options.major ?? 0
    });
  }

  static getName(): string {
    return 'Monero';
  }

  fromSeed(seed: Uint8Array | string | Seed): this {
    try {
      this.seed = getBytes(seed instanceof Seed ? seed.getSeed() : seed);
      const spendPrivateKey = this.seed.length === SLIP10Ed25519MoneroPrivateKey.getLength()
        ? this.seed : keccak256(this.seed);

      return this.fromSpendPrivateKey(scalarReduce(spendPrivateKey));
    } catch {
      throw new SeedError('Invalid seed data');
    }
  }

  fromPrivateKey(privateKey: string): this {
    try {
      this.privateKeyRaw = getBytes(privateKey);
      return this.fromSpendPrivateKey(
        scalarReduce(keccak256(this.privateKeyRaw))
      );
    } catch {
      throw new PrivateKeyError('Invalid private key data');
    }
  }

  fromDerivation(derivation: MoneroDerivation): this {
    this.derivation = ensureTypeMatch(
      derivation, MoneroDerivation, { errorClass: DerivationError }
    );
    return this;
  }

  updateDerivation(derivation: MoneroDerivation): this {
    return this.fromDerivation(derivation);
  }

  cleanDerivation(): this {
    this.derivation.clean();
    return this.fromDerivation(this.derivation);
  }

  fromSpendPrivateKey(spendPrivateKey: string | Uint8Array): this {
    const spendKey: PrivateKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(
      getBytes(spendPrivateKey)
    );
    const viewKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(
      scalarReduce(keccak256(spendKey.getRaw()))
    );

    this.spendPrivateKey = spendKey;
    this.viewPrivateKey = viewKey;
    this.spendPublicKey = spendKey.getPublicKey();
    this.viewPublicKey = viewKey.getPublicKey();
    return this;
  }

  fromWatchOnly(
    viewPrivateKey: string, spendPublicKey: string
  ): this {
    let viewKey: PrivateKey;
    let spendKey: PublicKey;

    try {
      viewKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(getBytes(viewPrivateKey));
    } catch {
      throw new PrivateKeyError('Invalid view private key data');
    }

    try {
      spendKey = SLIP10Ed25519MoneroPublicKey.fromBytes(getBytes(spendPublicKey));
    } catch {
      throw new PublicKeyError('Invalid spend public key data');
    }

    this.spendPrivateKey = null;
    this.viewPrivateKey = viewKey;
    this.spendPublicKey = spendKey;
    this.viewPublicKey = viewKey.getPublicKey();
    return this;
  }

  drive(minorIndex: number, majorIndex: number): [PublicKey, PublicKey] {
    const max = 2 ** 32 - 1;

    if (minorIndex < 0 || minorIndex > max) {
      throw new DerivationError(`Invalid minor index range`, {
        expected: `0-${max}`, got: minorIndex
      });
    }

    if (majorIndex < 0 || majorIndex > max) {
      throw new DerivationError(`Invalid major index range`, {
        expected: `0-${max}`, got: majorIndex
      });
    }

    if (minorIndex === 0 && majorIndex === 0) {
      return [this.spendPublicKey, this.viewPublicKey];
    }

    const m = intDecode(scalarReduce(keccak256(concatBytes(
      toBuffer('SubAddr\x00', 'utf8'),
      this.viewPrivateKey.getRaw(),
      integerToBytes(majorIndex, 4, 'little'),
      integerToBytes(minorIndex, 4, 'little')
    ))));

    const subAddressSpendPoint = this.spendPublicKey.getPoint().add(
      SLIP10Ed25519MoneroECC.GENERATOR.multiply(m)
    );

    const subAddressViewPoint = subAddressSpendPoint.multiply(
      bytesToInteger(this.viewPrivateKey.getRaw(), true)
    );

    return [
      SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressSpendPoint),
      SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressViewPoint)
    ];
  }

  getSeed(): string | null {
    return this.seed ? bytesToString(this.seed) : null;
  }

  getPrivateKey(): string | null {
    return this.privateKeyRaw ? bytesToString(this.privateKeyRaw) : null;
  }

  getSpendPrivateKey(): string | null {
    return this.spendPrivateKey ? bytesToString(this.spendPrivateKey.getRaw()) : null;
  }

  getViewPrivateKey(): string {
    return bytesToString(this.viewPrivateKey.getRaw());
  }

  getSpendPublicKey(): string {
    return bytesToString(this.spendPublicKey.getRawCompressed());
  }

  getViewPublicKey(): string {
    return bytesToString(this.viewPublicKey.getRawCompressed());
  }

  getPrimaryAddress(): string {
    return MoneroAddress.encode(
      {
        spendPublicKey: this.spendPublicKey,
        viewPublicKey: this.viewPublicKey
      }, {
        network: (this.network as typeof Network).NAME,
        addressType: Monero.ADDRESS_TYPES.STANDARD
      }
    );
  }

  getIntegratedAddress(paymentID?: string): string | null {
    if (!paymentID && !this.paymentID) return null;
    return MoneroAddress.encode(
      {
        spendPublicKey: this.spendPublicKey,
        viewPublicKey: this.viewPublicKey
      }, {
        network: (this.network as typeof Network).NAME,
        addressType: Monero.ADDRESS_TYPES.INTEGRATED,
        paymentID: paymentID ?? this.paymentID
      }
    );
  }

  getSubAddress(
    minor: number = this.derivation.getMinor(),
    major: number = this.derivation.getMajor()
  ): string {

    if (minor === 0 && major === 0) {
      return this.getPrimaryAddress();
    }

    const [spendPublicKey, viewPublicKey] = this.drive(minor, major);

    return MoneroAddress.encode(
      {
        spendPublicKey: spendPublicKey,
        viewPublicKey: viewPublicKey
      }, {
        network: (this.network as typeof Network).NAME,
        addressType: Monero.ADDRESS_TYPES.SUB_ADDRESS
      }
    );
  }

  getAddress(options: HDAddressOptionsInterface = {
    addressType: Monero.ADDRESS_TYPES.STANDARD
  }): string | null {

    if (options.addressType === Monero.ADDRESS_TYPES.STANDARD) {
      return this.getPrimaryAddress();
    } else if (options.addressType === Monero.ADDRESS_TYPES.INTEGRATED) {
      return this.getIntegratedAddress(options.paymentID);
    } else if (options.addressType === Monero.ADDRESS_TYPES.SUB_ADDRESS) {
      return this.getSubAddress(
        options.minor ?? this.derivation.getMinor(),
        options.major ?? this.derivation.getMajor()
      );
    }

    throw new AddressError(`Invalid ${this.getName()} address type`, {
      expected: Monero.ADDRESS_TYPES.getAddressTypes(),
      got: options.addressType
    });
  }
}
