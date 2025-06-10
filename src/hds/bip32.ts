// SPDX-License-Identifier: MIT

import { HD } from './hd';
import { Bitcoin } from '../cryptocurrencies';
import { Derivation, CustomDerivation } from '../derivations';
import {
  EllipticCurveCryptography, PublicKey, PrivateKey, KholawEd25519PrivateKey
} from '../eccs';
import { Seed } from '../seeds';
import {
  P2PKHAddress, P2SHAddress, P2TRAddress, P2WPKHAddress, P2WPKHInP2SHAddress, P2WSHAddress, P2WSHInP2SHAddress
} from '../addresses';
import { PUBLIC_KEY_TYPES, WIF_TYPES } from '../consts';
import { hmacSha256, hmacSha512, ripemd160, sha256 } from '../crypto';
import { privateKeyToWIF, wifToPrivateKey, getWIFType } from '../wif';
import { serialize, deserialize, isValidKey, isRootKey } from '../keys';
import {
  getBytes, getHmac, bytesToInteger, integerToBytes, bytesToString, resetBits, setBits,
  concatBytes, ensureTypeMatch, hexToBytes
} from '../utils';
import {
  AddressError, DerivationError, BaseError, PrivateKeyError, PublicKeyError, SeedError,
  WIFError, XPrivateKeyError, XPublicKeyError, ECCError
} from '../exceptions';
import { checkDecode } from '../libs/base58';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';

export class BIP32HD extends HD {

  protected ecc: EllipticCurveCryptography;
  protected seed?: Uint8Array;
  protected rootPrivateKey?: PrivateKey;
  protected rootChainCode?: Uint8Array;
  protected rootPublicKey?: PublicKey;
  protected privateKey?: PrivateKey;
  protected chainCode?: Uint8Array;
  protected publicKey?: PublicKey;
  protected publicKeyType: string = PUBLIC_KEY_TYPES.COMPRESSED;
  protected wifType: string = WIF_TYPES.WIF_COMPRESSED;
  protected wifPrefix?: number;
  protected fingerprint?: Uint8Array;
  protected parentFingerprint?: Uint8Array;
  protected strict?: boolean | null;
  protected rootDepth: number = 0;
  protected rootIndex: number = 0;
  protected depth: number = 0;
  protected index: number = 0;

  constructor(options: HDOptionsInterface = {
    publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
  }) {
    super(options);

    if(!options.ecc) {
      throw new ECCError('Elliptic Curve Cryptography (ECC) is required');
    }
    this.ecc = options.ecc;
    this.publicKeyType = options.publicKeyType ?? PUBLIC_KEY_TYPES.COMPRESSED;
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
    this.derivation = new CustomDerivation({
      path: options.path, indexes: options.indexes
    });
  }

  static getName(): string {
    return 'BIP32';
  }

  fromSeed(seed: Uint8Array | string | Seed): this {
    try {
      this.seed = getBytes(
        seed instanceof Seed ? seed.getSeed() : seed
      );
    } catch {
      throw new SeedError('Invalid seed data');
    }

    if (this.seed.length < 16) {
      throw new BaseError('Invalid seed length', {
        expected: '< 16',
        got: this.seed.length,
      });
    }

    const hmacHalfLength = 64 / 2;
    let hmacData = this.seed;
    let success = false;
    let hmacResult: Uint8Array = new Uint8Array(64);

    while (!success) {
      hmacResult = hmacSha512(getHmac((this.ecc as typeof EllipticCurveCryptography).NAME), hmacData);
      if ((this.ecc as typeof EllipticCurveCryptography).NAME === 'Kholaw-Ed25519') {
        success = (hmacResult[31] & 0x20) === 0;
        if (!success) hmacData = hmacResult;
      } else {
        const privClass = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY;
        success = privClass.isValidBytes(hmacResult.slice(0, hmacHalfLength));
        if (!success) hmacData = hmacResult;
      }
    }

    const tweakMasterKeyBits = (input: Uint8Array): Uint8Array => {
      const data = new Uint8Array(input);
      data[0] = resetBits(data[0], 0x07);
      data[31] = resetBits(data[31], 0x80);
      data[31] = setBits(data[31], 0x40);
      return data;
    };

    if ((this.ecc as typeof EllipticCurveCryptography).NAME === 'Kholaw-Ed25519') {
      let kl = hmacResult.slice(0, hmacHalfLength);
      const kr = hmacResult.slice(hmacHalfLength);
      kl = tweakMasterKeyBits(kl);

      const chainCode = hmacSha256(
        getHmac((this.ecc as typeof EllipticCurveCryptography).NAME),
        concatBytes(integerToBytes(0x01), this.seed)
      );

      this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(
        concatBytes(kl, kr)
      );
      this.rootChainCode = getBytes(chainCode);
    } else {
      const privBytes = hmacResult.slice(0, hmacHalfLength);
      const chainBytes = hmacResult.slice(hmacHalfLength);

      this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(privBytes);
      this.rootChainCode = chainBytes;
    }

    this.privateKey = this.rootPrivateKey;
    this.chainCode = this.rootChainCode;
    this.parentFingerprint = integerToBytes(0x00, 4);
    this.rootPublicKey = this.rootPrivateKey.getPublicKey();
    this.publicKey = this.rootPublicKey;
    this.strict = true;

    this.fromDerivation(this.derivation);
    return this;
  }

  fromXPrivateKey(xprv: string, encoded = true, strict = false): this {
    if (!isValidKey(xprv, encoded)) {
      throw new XPrivateKeyError('Invalid extended(x) private key');
    }

    const raw = encoded ? checkDecode(xprv) : hexToBytes(xprv);
    if (![78, 110].includes(raw.length)) {
      throw new XPrivateKeyError('Invalid extended(x) private key');
    }

    if (strict && !isRootKey(xprv, encoded)) {
      throw new XPrivateKeyError('Invalid root extended(x) private key');
    }

    const [
      version, depth, parentFingerprint, index, chainCode, key
    ] = deserialize(xprv, encoded);
    this.rootChainCode = chainCode;
    this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(key.slice(1));
    this.rootPublicKey = this.rootPrivateKey.getPublicKey();
    this.rootDepth = depth;
    this.parentFingerprint = parentFingerprint;
    this.rootIndex = index;
    this.chainCode = this.rootChainCode;
    this.privateKey = this.rootPrivateKey;
    this.publicKey = this.rootPublicKey;
    this.depth = this.rootDepth;
    this.index = this.rootIndex;
    this.strict = isRootKey(xprv, encoded);

    this.fromDerivation(this.derivation);
    return this;
  }

  fromXPublicKey(xpub: string, encoded = true, strict = false): this {
    if (!isValidKey(xpub, encoded)) {
      throw new XPublicKeyError('Invalid extended(x) public key');
    }

    const raw = encoded ? checkDecode(xpub) : hexToBytes(xpub);
    if (raw.length !== 78) {
      throw new XPublicKeyError('Invalid extended(x) public key');
    }

    if (strict && !isRootKey(xpub, encoded)) {
      throw new XPublicKeyError('Invalid root extended(x) public key');
    }

    const [
      version, depth, parentFingerprint, index, chainCode, key
    ] = deserialize(xpub, encoded);
    this.rootChainCode = chainCode;
    this.rootPublicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromBytes(key);
    this.rootDepth = depth;
    this.parentFingerprint = parentFingerprint;
    this.rootIndex = index;
    this.chainCode = this.rootChainCode;
    this.publicKey = this.rootPublicKey;
    this.depth = this.rootDepth;
    this.index = this.rootIndex;
    this.strict = isRootKey(xpub, encoded);

    this.fromDerivation(this.derivation);
    return this;
  }

  fromWIF(wif: string): this {
    if (this.wifPrefix === null || this.wifPrefix === null) {
      throw new WIFError('WIF prefix is required');
    }

    const wifType = getWIFType(wif, this.wifPrefix);
    if (wifType === 'wif-compressed') {
      this.publicKeyType = PUBLIC_KEY_TYPES.COMPRESSED;
      this.wifType = WIF_TYPES.WIF_COMPRESSED;
    } else {
      this.publicKeyType = PUBLIC_KEY_TYPES.UNCOMPRESSED;
      this.wifType = WIF_TYPES.WIF;
    }

    const privKey = wifToPrivateKey(wif, this.wifPrefix);
    this.fromPrivateKey(privKey);
    this.strict = null;
    return this;
  }

  fromPrivateKey(privateKey: string): this {
    try {
      const bytes = getBytes(privateKey);
      this.privateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(bytes);
      this.publicKey = this.privateKey.getPublicKey();
      this.strict = null;
      return this;
    } catch {
      throw new PrivateKeyError('Invalid private key data');
    }
  }

  fromPublicKey(publicKey: string): this {
    try {
      const bytes = getBytes(publicKey);
      this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromBytes(bytes);
      this.strict = null;
      return this;
    } catch {
      throw new PublicKeyError('Invalid public key data');
    }
  }

  fromDerivation(derivation: Derivation): this {
    this.derivation = ensureTypeMatch(
      derivation, Derivation, { errorClass: DerivationError }
    );
    for (const index of this.derivation.getIndexes()) {
      this.drive(index);
    }
    return this;
  }

  updateDerivation(derivation: Derivation): this {
    this.cleanDerivation();
    this.fromDerivation(derivation);
    return this;
  }

  cleanDerivation(): this {
    if (this.rootPrivateKey) {
      this.privateKey = this.rootPrivateKey;
      this.chainCode = this.rootChainCode;
      this.parentFingerprint = integerToBytes(0, 4);
      this.publicKey = this.privateKey.getPublicKey();
      this.derivation.clean();
      this.depth = 0;
    } else if (this.rootPublicKey) {
      this.publicKey = this.rootPublicKey;
      this.chainCode = this.rootChainCode;
      this.parentFingerprint = integerToBytes(0, 4);
      this.derivation.clean();
      this.depth = 0;
    }
    return this;
  }

  drive(index: number) {
    const hmacHalfLength = 64 / 2; // sha512 output is 64 bytes

    if ((this.ecc as typeof EllipticCurveCryptography).NAME === 'Kholaw-Ed25519') {
      const indexBytes = integerToBytes(index, 4, 'little');
      if (this.privateKey) {
        if (index & 0x80000000) {
          const zHmac = hmacSha512(
            this.chainCode!, concatBytes(integerToBytes(0x00, 1), this.privateKey.getRaw(), indexBytes)
          );
          const hmac = hmacSha512(
            this.chainCode!, concatBytes(integerToBytes(0x01, 1), this.privateKey.getRaw(), indexBytes)
          );

          const zl = zHmac.slice(0, hmacHalfLength);
          const zr = zHmac.slice(hmacHalfLength);
          const kl = this.privateKey.getRaw().slice(0, hmacHalfLength);
          const kr = this.privateKey.getRaw().slice(hmacHalfLength);

          const klInt = bytesToInteger(kl, true);
          const zlInt = bytesToInteger(zl.slice(0, 28), true);
          const left = zlInt * BigInt(8) + klInt;

          if (left % (this.ecc as typeof EllipticCurveCryptography).ORDER === BigInt(0)) {
            throw new BaseError('Computed child key is not valid, very unlucky index');
          }

          const TWO_POW_256 = BigInt(1) << BigInt(256);
          const krInt = (bytesToInteger(zr, true) + bytesToInteger(kr, true)) % TWO_POW_256;

          const newPrivate = KholawEd25519PrivateKey.fromBytes(concatBytes(
            integerToBytes(left, KholawEd25519PrivateKey.getLength() / 2, 'little'),
            integerToBytes(krInt, KholawEd25519PrivateKey.getLength() / 2, 'little')
          ));

          this.privateKey = newPrivate;
          this.chainCode = hmac.slice(hmacHalfLength);
          this.publicKey = newPrivate.getPublicKey();
        } else {
          const zHmac = hmacSha512(
            this.chainCode!, concatBytes(integerToBytes(0x02, 1), this.publicKey!.getRawCompressed().slice(1), indexBytes)
          );
          const hmac = hmacSha512(
            this.chainCode!, concatBytes(integerToBytes(0x03, 1), this.publicKey!.getRawCompressed().slice(1), indexBytes)
          );

          const zlInt = bytesToInteger(zHmac.slice(0, 28), true);
          const tweak = zlInt * BigInt(8);

          const newPoint = this.publicKey!.getPoint().add(
            (this.ecc as typeof EllipticCurveCryptography).GENERATOR.multiply(tweak)
          );
          if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
            throw new BaseError('Computed public child key is not valid, very unlucky index');
          }

          this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromPoint(newPoint);
          this.chainCode = hmac.slice(hmacHalfLength);
        }
      } else {
        if (index & 0x80000000) {
          throw new DerivationError('Hardened derivation path is invalid for xpublic key');
        }

        const zHmac = hmacSha512(
          this.chainCode!, concatBytes(integerToBytes(0x02, 1), this.publicKey!.getRawCompressed().slice(1), indexBytes)
        );
        const hmac = hmacSha512(
          this.chainCode!, concatBytes(integerToBytes(0x03, 1), this.publicKey!.getRawCompressed().slice(1), indexBytes)
        );

        const zlInt = bytesToInteger(zHmac.slice(0, 28), true);
        const tweak = zlInt * BigInt(8);

        const newPoint = this.publicKey!.getPoint().add(
          (this.ecc as typeof EllipticCurveCryptography).GENERATOR.multiply(tweak)
        );
        if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
          throw new BaseError('Computed public child key is not valid, very unlucky index');
        }

        this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromPoint(newPoint);
        this.chainCode = hmac.slice(hmacHalfLength);
      }
      this.parentFingerprint = getBytes(this.getFingerprint());
      this.depth += 1;
      this.index = index;
      this.fingerprint = getBytes(this.getFingerprint());
      return this;
    } else if (['SLIP10-Ed25519', 'SLIP10-Ed25519-Blake2b', 'SLIP10-Ed25519-Monero'].includes(
      (this.ecc as typeof EllipticCurveCryptography).NAME)
    ) {
      if (!this.privateKey) {
        throw new DerivationError(`On ${(this.ecc as typeof EllipticCurveCryptography).NAME} ECC, public key derivation is not supported`);
      }

      const indexBytes = integerToBytes(index, 4, 'big'); // struct.pack(">L", index)
      const data = concatBytes(
        integerToBytes(0x00, 1), this.privateKey.getRaw(), indexBytes
      );

      const hmac = hmacSha512(this.chainCode!, data);
      const hmacL = hmac.slice(0, hmacHalfLength);
      const hmacR = hmac.slice(hmacHalfLength);

      const newPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(hmacL);
      this.privateKey = newPrivateKey;
      this.chainCode = hmacR;
      this.publicKey = newPrivateKey.getPublicKey();

      this.parentFingerprint = getBytes(this.getFingerprint());
      this.depth += 1;
      this.index = index;
      this.fingerprint = getBytes(this.getFingerprint());
      return this;
    } else if (['SLIP10-Nist256p1', 'SLIP10-Secp256k1'].includes(
      (this.ecc as typeof EllipticCurveCryptography).NAME)
    ) {
      const indexBytes = integerToBytes(index, 4, 'big');

      if (!this.rootPrivateKey && !this.rootPublicKey) {
        throw new DerivationError('You can\'t drive this, root/master key are required');
      }
      if (!this.chainCode) {
        throw new DerivationError('You can\'t drive private_key and private_key');
      }

      let data: Uint8Array;
      if (index & 0x80000000) {
        if (!this.privateKey) {
          throw new DerivationError('Hardened derivation path is invalid for xpublic key');
        }
        data = concatBytes(integerToBytes(0x00, 1), this.privateKey.getRaw(), indexBytes);
      } else {
        data = concatBytes(this.publicKey!.getRawCompressed(), indexBytes);
      }

      const hmac = hmacSha512(this.chainCode, data);
      const hmacL = hmac.slice(0, hmacHalfLength);
      const hmacR = hmac.slice(hmacHalfLength);

      const hmacLInt = bytesToInteger(hmacL);
      if (hmacLInt > (this.ecc as typeof EllipticCurveCryptography).ORDER) {
        return null;
      }

      if (this.privateKey) {
        const privInt = bytesToInteger(this.privateKey.getRaw());
        const keyInt = (hmacLInt + privInt) % (this.ecc as typeof EllipticCurveCryptography).ORDER;
        if (keyInt === BigInt(0)) {
          return null;
        }

        const newPriv = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(
          integerToBytes(keyInt, 32)
        );

        this.parentFingerprint = getBytes(this.getFingerprint());
        this.privateKey = newPriv;
        this.chainCode = hmacR;
        this.publicKey = newPriv.getPublicKey();
      } else {
        const tweak = bytesToInteger(hmacL);
        const newPoint = this.publicKey!.getPoint().add(
          (this.ecc as typeof EllipticCurveCryptography).GENERATOR.multiply(tweak)
        );
        const newPub = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromPoint(newPoint);

        this.parentFingerprint = getBytes(this.getFingerprint());
        this.chainCode = hmacR;
        this.publicKey = newPub;
      }

      this.depth += 1;
      this.index = index;
      this.fingerprint = getBytes(this.getFingerprint());
      return this;
    }
  }

  getSeed(): string | null {
    return this.seed ? bytesToString(this.seed) : null;
  }

  getRootXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true
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
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH, encoded = true
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

  getRootPrivateKey(): string | null {
    return this.rootPrivateKey ? bytesToString(this.rootPrivateKey.getRaw()) : null;
  }

  getRootWIF(wifType?: string): string | null {
    if (this.wifPrefix == null || !this.getRootPrivateKey()) return null;

    const type = wifType ?? this.wifType;
    if (!Object.values(WIF_TYPES).includes(type)) {
      throw new BaseError(`Invalid ${this.getName()} WIF type`, {
        expected: Object.values(WIF_TYPES),
        got: type
      });
    }

    return privateKeyToWIF(this.getRootPrivateKey()!, type, this.wifPrefix);
  }

  getRootChainCode(): string | null {
    return this.rootChainCode ? bytesToString(this.rootChainCode) : null;
  }

  getRootPublicKey(publicKeyType: string = this.publicKeyType): string | null {
    if (!this.rootPublicKey) return null;

    if (publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
      return bytesToString(this.rootPublicKey.getRawUncompressed());
    } else if (publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
      return bytesToString(this.rootPublicKey.getRawCompressed());
    }

    throw new BaseError(`Invalid ${this.getName()} public key type`, {
      expected: Object.values(PUBLIC_KEY_TYPES),
      got: publicKeyType
    });
  }

  getXPrivateKey(
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true
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
    version: Uint8Array | number = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH, encoded = true
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

  getPrivateKey(): string | null {
    return this.privateKey ? bytesToString(this.privateKey.getRaw()) : null;
  }

  getWIF(wifType?: string): string | null {
    if (this.wifPrefix == null) return null;

    const type = wifType ?? this.wifType;
    if (!Object.values(WIF_TYPES).includes(type)) {
      throw new BaseError(`Invalid WIF type`, {
        expected: Object.values(WIF_TYPES), got: type
      });
    }

    return this.getPrivateKey()
      ? privateKeyToWIF(this.getPrivateKey()!, type, this.wifPrefix)
      : null;
  }

  getWIFType(): string | null {
    return this.getWIF() ? this.wifType : null;
  }

  getChainCode(): string | null {
    return this.chainCode ? bytesToString(this.chainCode) : null;
  }

  getPublicKey(publicKeyType: string = this.publicKeyType): string {
    const type = publicKeyType ?? this.publicKeyType;

    if (!Object.values(PUBLIC_KEY_TYPES).includes(type)) {
      throw new BaseError(`Invalid public key type`, {
        expected: Object.values(PUBLIC_KEY_TYPES), got: type
      });
    }

    return type === PUBLIC_KEY_TYPES.UNCOMPRESSED
      ? this.getUncompressed() : this.getCompressed();
  }

  getPublicKeyType(): string {
    return this.publicKeyType;
  }

  getCompressed(): string {
    return bytesToString(this.publicKey!.getRawCompressed());
  }

  getUncompressed(): string {
    return bytesToString(this.publicKey!.getRawUncompressed());
  }

  getHash(): string {
    return bytesToString(ripemd160(sha256(this.getPublicKey()!)));
  }

  getFingerprint(): string {
    return this.getHash().slice(0, 8);
  }

  getParentFingerprint(): string | null {
    return this.parentFingerprint ? bytesToString(this.parentFingerprint) : null;
  }

  getDepth(): number {
    return this.depth;
  }

  getPath(): string {
    return this.derivation.getPath();
  }

  getIndex(): number {
    return this.index;
  }

  getIndexes(): number[] {
    return this.derivation.getIndexes();
  }

  getStrict(): boolean | null {
    return this.strict ?? null;
  }

  getAddress(options: HDAddressOptionsInterface = {
    address: Bitcoin.ADDRESSES.P2PKH,
    publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
    scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
    hrp: Bitcoin.NETWORKS.MAINNET.HRP,
    witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
  }): string {

    const address = options.address ?? Bitcoin.ADDRESSES.P2PKH;
    const publicKeyAddressPrefix = options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX;
    const scriptAddressPrefix = options.scriptAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
    const hrp = options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP;
    const witnessVersion = options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH;
    if (address === P2PKHAddress.getName()) {
      return P2PKHAddress.encode(this.publicKey!, {
        publicKeyAddressPrefix: publicKeyAddressPrefix,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2SHAddress.getName()) {
      return P2SHAddress.encode(this.publicKey!, {
        scriptAddressPrefix: scriptAddressPrefix,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2TRAddress.getName()) {
      return P2TRAddress.encode(this.publicKey!, {
        hrp: hrp,
        witnessVersion: witnessVersion,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2WPKHAddress.getName()) {
      return P2WPKHAddress.encode(this.publicKey!, {
        hrp: hrp,
        witnessVersion: witnessVersion,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2WPKHInP2SHAddress.getName()) {
      return P2WPKHInP2SHAddress.encode(this.publicKey!, {
        scriptAddressPrefix: scriptAddressPrefix,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2WSHAddress.getName()) {
      return P2WSHAddress.encode(this.publicKey!, {
        hrp: hrp,
        witnessVersion: witnessVersion,
        publicKeyType: this.publicKeyType
      });
    } else if (address === P2WSHInP2SHAddress.getName()) {
      return P2WSHInP2SHAddress.encode(this.publicKey!, {
        scriptAddressPrefix: scriptAddressPrefix,
        publicKeyType: this.publicKeyType
      });
    }
    throw new AddressError(`Invalid ${this.getName()} address`, {
      expected: [
        P2PKHAddress.getName(),
        P2SHAddress.getName(),
        P2TRAddress.getName(),
        P2WPKHAddress.getName(),
        P2WPKHInP2SHAddress.getName(),
        P2WSHAddress.getName(),
        P2WSHInP2SHAddress.getName()
      ],
      got: address
    });
  }
}
