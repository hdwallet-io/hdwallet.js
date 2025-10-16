// SPDX-License-Identifier: MIT

import { Seed } from '../seeds';
import { hmacSha512, sha256, sha512 } from '../crypto';
import { bytesToInteger, getBytes, integerToBytes } from '../utils';
import { EllipticCurveCryptography, KholawEd25519ECC } from '../eccs';
import { DerivationError, SeedError } from '../exceptions';
import { AlgorandAddress } from '../addresses';
import { Algorand } from '../cryptocurrencies';
import { BIP32HD } from './bip32';

/**
 * Hierarchical Deterministic (HD) wallet implementation for the **Algorand** blockchain.
 *
 * Extends the base class but uses the **KholawEd25519ECC** curve and Algorand-specific
 * key derivation logic. Implements a variant of SLIP-0010 style derivation with additional clamping
 * and key validation for the Ed25519 curve used by Algorand.
 *
 */
export class AlgorandHD extends BIP32HD {

  constructor() {
    super({ ecc: KholawEd25519ECC });
  }

  /**
   * Returns the human-readable name of this HD scheme.
   *
   * @returns {string} The name `"Algorand"`.
   */
  static getName(): string {
    return 'Algorand';
  }

  /**
   * Initializes this HD wallet instance from a given seed.
   *
   * @param {string | Uint8Array | Seed} seed - The input seed (hex string, byte array, or Seed instance).
   * @throws {SeedError} If the seed length is less than 16 bytes.
   * @returns {this} The initialized AlgorandHD instance.
   */
  fromSeed(seed: string | Uint8Array | Seed): this {
    const rawSeed = getBytes((seed as Seed).getSeed?.() ?? seed);
    if (rawSeed.length < 16) {
      throw new SeedError('Invalid seed length: expected >= 16 bytes');
    }

    const k = sha512(rawSeed);
    let kL = new Uint8Array(k.slice(0, 32));
    let kR = k.slice(32, 64);

    const clampKL = (kL: Uint8Array): Uint8Array => {
      kL[0] &= 0b11111000;
      kL[31] &= 0b01111111;
      kL[31] |= 0b01000000;
      return kL;
    };

    while ((kL[31] & 0b00100000) !== 0) {
      const updated = hmacSha512(kL, kR);
      kL = new Uint8Array(updated.slice(0, 32));
      kR = updated.slice(32, 64);
    }

    kL = clampKL(kL);
    const chainCode = sha256(Uint8Array.from([0x01, ...rawSeed]));

    this.seed = rawSeed;
    this.rootPrivateKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(
      new Uint8Array([...kL, ...kR])
    );
    this.rootChainCode = chainCode;

    this.privateKey = this.rootPrivateKey;
    this.chainCode = chainCode;
    this.parentFingerprint = new Uint8Array(4); // 0x00000000
    this.rootPublicKey = this.privateKey.getPublicKey();
    this.publicKey = this.rootPublicKey;
    this.strict = true;

    return this;
  }

  /**
   * Derives a child key at the given index according to Algorand's modified SLIP-0010 algorithm.
   *
   * Supports both hardened and non-hardened derivation.
   *
   * @param {number} index - The index of the child key to derive.
   * @throws {DerivationError} If the chain code or required keys are not set or derivation fails.
   * @returns {this} The derived child HD instance.
   */
  drive(index: number): this {
    const G = 9;
    const indexBytes = integerToBytes(index, 4, 'little');
    const cc = this.chainCode;

    if (!cc) throw new DerivationError('Chain code is not set');

    const trunc256MinusGBits = (buf: Uint8Array, g: number): Uint8Array => {
      const out = buf.slice();
      let remaining = g;
      for (let i = out.length - 1; i >= 0 && remaining > 0; i--) {
        if (remaining >= 8) {
          out[i] = 0;
          remaining -= 8;
        } else {
          out[i] &= 0xff >> remaining;
          break;
        }
      }
      return out;
    };

    let childCC: Uint8Array;

    // Hardened
    if (index & 0x80000000) {
      if (!this.privateKey) throw new DerivationError('Private key required for hardened derivation');

      const rawKey = this.privateKey.getRaw();
      const kL = rawKey.slice(0, 32);
      const kR = rawKey.slice(32);

      const z = hmacSha512(cc, Uint8Array.from([0x00, ...kL, ...kR, ...indexBytes]));
      const zL = trunc256MinusGBits(z.slice(0, 32), G);
      const zR = z.slice(32);
      childCC = hmacSha512(cc, Uint8Array.from([0x01, ...kL, ...kR, ...indexBytes])).slice(32);

      const kLInt = bytesToInteger(kL, true);
      const zLInt = bytesToInteger(zL, true);
      const newKL = integerToBytes(kLInt + BigInt(8) * zLInt, 32, 'little');
      const newKR = integerToBytes(
        (bytesToInteger(kR, true) + bytesToInteger(zR, true)) % BigInt(2 ** 256), 32, 'little'
      );

      if (bytesToInteger(newKL, true) >= 2 ** 255) {
        throw new DerivationError('zL * 8 + kL exceeds Ed25519 scalar limit');
      }

      const childKey = (this.ecc as typeof EllipticCurveCryptography).PRIVATE_KEY.fromBytes(
        new Uint8Array([...newKL, ...newKR])
      );
      this.privateKey = childKey;
      this.parentFingerprint = getBytes(this.getFingerprint());
      this.publicKey = childKey.getPublicKey();
    } else {
      if (!this.publicKey) throw new DerivationError('Public key required for non-hardened derivation');

      const A = this.publicKey.getRawCompressed().slice(1);
      const z = hmacSha512(cc, Uint8Array.from([0x02, ...A, ...indexBytes]));
      const zL = trunc256MinusGBits(z.slice(0, 32), G);
      childCC = hmacSha512(cc, Uint8Array.from([0x03, ...A, ...indexBytes])).slice(32);

      const scalar = BigInt(8) * bytesToInteger(zL, true);
      const point = this.publicKey.getPoint().add(
        (this.ecc as typeof EllipticCurveCryptography).GENERATOR.multiply(scalar)
      );
      this.parentFingerprint = getBytes(this.getFingerprint());
      this.publicKey = (this.ecc as typeof EllipticCurveCryptography).PUBLIC_KEY.fromPoint(point);
    }

    this.chainCode = childCC;
    this.depth += 1;
    this.index = index;
    this.fingerprint = getBytes(this.getFingerprint());

    return this;
  }

  /**
   * Returns the root extended private key (xprv) encoded using Algorand's version bytes.
   *
   * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
   *   The version prefix to use for encoding.
   * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
   * @returns {string | null} The root xprv or `null` if unavailable.
   */
  getRootXPrivateKey(
    version: number | Uint8Array = Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true
  ): string | null {
    return super.getRootXPrivateKey(version, encoded);
  }

  /**
   * Returns the current extended private key (xprv) of the HD node.
   *
   * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
   *   The version prefix to use for encoding.
   * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
   * @returns {string | null} The xprv string or `null` if not set.
   */
  getXPrivateKey(
    version: number | Uint8Array = Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true
  ): string | null {
    return super.getXPrivateKey(version, encoded);
  }

  /**
   * Derives and returns the Algorand address associated with the current public key.
   *
   * @returns {string} The encoded Algorand address.
   */
  getAddress(): string {
    return AlgorandAddress.encode(this.publicKey!);
  }
}
