// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography as _EllipticCurveCryptography,
  Point as _Point,
  PublicKey as _PublicKey,
  PrivateKey as _PrivateKey
} from './ecc';
import {
  KholawEd25519ECC as _KholawEd25519ECC
} from './kholaw';
import {
  SLIP10Ed25519ECC as _SLIP10Ed25519ECC,
  SLIP10Ed25519Blake2bECC as _SLIP10Ed25519Blake2bECC,
  SLIP10Ed25519MoneroECC as _SLIP10Ed25519MoneroECC,
  SLIP10Nist256p1ECC as _SLIP10Nist256p1ECC,
  SLIP10Secp256k1ECC as _SLIP10Secp256k1ECC
} from './slip10';
import { getBytes } from '../utils';
import { ECCError, PublicKeyError } from '../exceptions';

/**
 * The `ECCS` class manages and provides access to supported
 * Elliptic Curve Cryptography (ECC) implementations.
 *
 * It maintains a dictionary of available ECC algorithm classes,
 * such as Ed25519, Ed25519-Blake2b, Ed25519-Monero, Nist256p1, and Secp256k1.
 * This class allows retrieval, validation, and enumeration of these ECC types.
 */
export class ECCS {

  private static dictionary: Record<string, typeof _EllipticCurveCryptography> = {
    [_KholawEd25519ECC.NAME]: _KholawEd25519ECC,
    [_SLIP10Ed25519ECC.NAME]: _SLIP10Ed25519ECC,
    [_SLIP10Ed25519Blake2bECC.NAME]: _SLIP10Ed25519Blake2bECC,
    [_SLIP10Ed25519MoneroECC.NAME]: _SLIP10Ed25519MoneroECC,
    [_SLIP10Nist256p1ECC.NAME]: _SLIP10Nist256p1ECC,
    [_SLIP10Secp256k1ECC.NAME]: _SLIP10Secp256k1ECC
  };

  /**
   * Get the names of all supported ECC implementations.
   * @returns {string[]} List of ECC class names.
   */
  static getNames(): string[] {
    return Object.keys(this.dictionary);
  }

  /**
   * Get all available ECC classes.
   * @returns {typeof _EllipticCurveCryptography[]} Array of ECC classes.
   */
  static getClasses(): typeof _EllipticCurveCryptography[] {
    return Object.values(this.dictionary);
  }

  /**
   * Retrieve an ECC class by its name.
   * @param {string} name - The ECC class name.
   * @returns {typeof _EllipticCurveCryptography} The corresponding ECC class.
   * @throws {ECCError} If the name is invalid.
   */
  static getECCClass(name: string): typeof _EllipticCurveCryptography | any {
    if (!this.isECC(name)) {
      throw new ECCError(
        `Invalid ECC name`, { expected: this.getNames(), got: name }
      );
    }
    return this.dictionary[name];
  }

  /**
   * Check if a given name corresponds to a valid ECC implementation.
   * @param {string} name - The ECC name to verify.
   * @returns {boolean} True if valid, false otherwise.
   */
  static isECC(name: string): boolean {
    return this.getNames().includes(name);
  }
}

/**
 * Validate and normalize a public key input.
 * @param {Uint8Array | string | _PublicKey} publicKey - Public key data or object.
 * @param {typeof _PublicKey} publicKeyCls - Expected public key class.
 * @returns {_PublicKey} Validated and instantiated public key.
 * @throws {PublicKeyError} If the public key is invalid or of the wrong type.
 */
export function validateAndGetPublicKey(
  publicKey: Uint8Array | string | _PublicKey, publicKeyCls: typeof _PublicKey
): _PublicKey {
  try {
    if (publicKey instanceof Uint8Array) {
      return publicKeyCls.fromBytes(publicKey);
    }
    if (typeof publicKey === 'string') {
      const bytes = getBytes(publicKey);
      return publicKeyCls.fromBytes(bytes);
    }
    if (!(publicKey instanceof (<any>publicKeyCls))) {
      throw new PublicKeyError(
        `Invalid public key instance`, {
          expected: publicKeyCls.name,
          got: publicKey.constructor.name
        }
      );
    }
    return publicKey;
  } catch (err: any) {
    if (err instanceof PublicKeyError) throw err;
    throw new PublicKeyError(
      'Invalid public key data'
    );
  }
}

export {
  _EllipticCurveCryptography as EllipticCurveCryptography,
  _Point as Point,
  _PublicKey as PublicKey,
  _PrivateKey as PrivateKey,
  _KholawEd25519ECC as KholawEd25519ECC,
  _SLIP10Ed25519ECC as SLIP10Ed25519ECC,
  _SLIP10Ed25519Blake2bECC as SLIP10Ed25519Blake2bECC,
  _SLIP10Ed25519MoneroECC as SLIP10Ed25519MoneroECC,
  _SLIP10Nist256p1ECC as SLIP10Nist256p1ECC,
  _SLIP10Secp256k1ECC as SLIP10Secp256k1ECC
};

export {
  KholawEd25519Point,
  KholawEd25519PublicKey,
  KholawEd25519PrivateKey
} from './kholaw';

export {
  SLIP10Ed25519Point,
  SLIP10Ed25519PublicKey,
  SLIP10Ed25519PrivateKey,
  SLIP10Ed25519Blake2bPoint,
  SLIP10Ed25519Blake2bPublicKey,
  SLIP10Ed25519Blake2bPrivateKey,
  SLIP10Ed25519MoneroPoint,
  SLIP10Ed25519MoneroPublicKey,
  SLIP10Ed25519MoneroPrivateKey,
  SLIP10Nist256p1Point,
  SLIP10Nist256p1PublicKey,
  SLIP10Nist256p1PrivateKey,
  SLIP10Secp256k1Point,
  SLIP10Secp256k1PublicKey,
  SLIP10Secp256k1PrivateKey
} from './slip10';
