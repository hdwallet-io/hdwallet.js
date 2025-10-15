// SPDX-License-Identifier: MIT

import { PublicKey } from './public-key';
import { OptionsPrivateKey } from '../interfaces';

/**
 * Abstract base class representing a private key in elliptic curve cryptography (ECC).
 *
 * This class defines the common interface and behavior expected for all private key implementations.
 * Concrete subclasses (e.g., for specific curves) must override all abstract and static methods as needed.
 */
export abstract class PrivateKey {

  privateKey: any;
  options: OptionsPrivateKey;

  /**
   * Constructs a new PrivateKey instance.
   * 
   * @param privateKey - The underlying curve-specific private key object.
   * @param options - Optional configuration for the private key.
   */
  constructor(
    privateKey: any, options: OptionsPrivateKey = { }
  ) {
    this.privateKey = privateKey;
    this.options = options;
  }

  /**
   * Returns the name of the cryptographic curve or private key type.
   * 
   * @returns The name of the private key (e.g., "secp256k1", "ed25519").
   * @throws Error if not implemented by subclass.
   */
  getName(): string {
    throw new Error('Must override getName()');
  }

  /**
   * Creates a PrivateKey instance from its byte representation.
   * 
   * @param privateKey - The private key as a byte array.
   * @returns A new PrivateKey instance.
   * @throws Error if not implemented by subclass.
   */
  static fromBytes(privateKey: Uint8Array): PrivateKey {
    throw new Error('Must override fromBytes()');
  }

  /**
   * Returns the length (in bytes) of the private key.
   * 
   * @returns The private key size in bytes.
   * @throws Error if not implemented by subclass.
   */
  static getLength(): number {
    throw new Error('Must override size()');
  }

  /**
   * Returns the raw byte representation of the private key.
   * 
   * @returns The private key bytes as a Uint8Array.
   */
  abstract getRaw(): Uint8Array;

  /**
   * Derives and returns the corresponding public key.
   * 
   * @returns The public key derived from this private key.
   */
  abstract getPublicKey(): PublicKey;

  /**
   * Returns the underlying curve-specific private key object.
   * 
   * @returns The underlying private key instance from the ECC library.
   */
  abstract getUnderlyingObject(): any;

  /**
   * Validates whether a given byte sequence represents a valid private key.
   * 
   * @param bytes - The private key bytes to validate.
   * @returns `true` if the bytes represent a valid private key, otherwise `false`.
   */
  static isValidBytes(bytes: Uint8Array): boolean {
    try {
      this.fromBytes(bytes);
      return true;
    } catch {
      return false;
    }
  }
}
