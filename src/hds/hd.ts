// SPDX-License-Identifier: MIT

import { Derivation } from '../derivations';
import { HDOptionsInterface } from '../interfaces';
import { EllipticCurveCryptography } from '../eccs';
import { ECCError } from '../exceptions';

export class HD {

  public ecc: typeof EllipticCurveCryptography;
  public derivation: any;

  constructor(options: HDOptionsInterface = { }) {
    if(!options.ecc) {
      throw new ECCError('Elliptic Curve Cryptography (ECC) is required');
    }
    this.ecc = options.ecc;
  }

  static getName(): string {
    throw new Error('Must override getName()');
  }

  getName(): string {
    return (this.constructor as typeof HD).getName();
  }

  fromSeed(...args: any[]): this {
    throw new Error('Not implemented');
  }

  fromXPrivateKey(...args: any[]): this {
    throw new Error('Not implemented');
  }

  fromXPublicKey(...args: any[]): this {
    throw new Error('Not implemented');
  }

  fromWIF(wif: string): this {
    throw new Error('Not implemented');
  }

  fromPrivateKey(privateKey: string): this {
    throw new Error('Not implemented');
  }

  fromSpendPrivateKey(spendPrivateKey: string): this {
    throw new Error('Not implemented');
  }

  fromPublicKey(publicKey: string): this {
    throw new Error('Not implemented');
  }

  fromWatchOnly(viewPrivateKey: string, spendPublicKey: string): this {
    throw new Error('Not implemented');
  }

  fromDerivation(derivation: Derivation): this {
    throw new Error('Not implemented');
  }

  updateDerivation(derivation: Derivation): this {
    throw new Error('Not implemented');
  }

  cleanDerivation(): this {
    throw new Error('Not implemented');
  }

  getDerivation(): Derivation {
    return this.derivation;
  }

  getSeed(): string | null {
    throw new Error('Not implemented');
  }

  getSemantic(): string | null {
    return null;
  }

  getRootXPrivateKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getRootXPublicKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getMasterXPrivateKey(...args: any[]): string | null {
    return this.getRootXPrivateKey(...args);
  }

  getMasterXPublicKey(...args: any[]): string | null {
    return this.getRootXPublicKey(...args);
  }

  getRootPrivateKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getRootWIF(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getRootChainCode(): string | null {
    throw new Error('Not implemented');
  }

  getRootPublicKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getMasterPrivateKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getMasterWIF(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getMasterChainCode(...args: any[]): string | null {
    return this.getRootChainCode();
  }

  getMasterPublicKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getXPrivateKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getXPublicKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getPrivateKey(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getStrict(): boolean | null {
    throw new Error('Not implemented');
  }

  getSpendPrivateKey(): string | null {
    throw new Error('Not implemented');
  }

  getViewPrivateKey(): string {
    throw new Error('Not implemented');
  }

  getWIF(..._args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getWIFType(): any {
    throw new Error('Not implemented');
  }

  getChainCode(): any {
    throw new Error('Not implemented');
  }

  getPublicKey(...args: any[]): any {
    throw new Error('Not implemented');
  }

  getCompressed(): string {
    throw new Error('Not implemented');
  }

  getUncompressed(): string {
    throw new Error('Not implemented');
  }

  getSpendPublicKey(): string {
    throw new Error('Not implemented');
  }

  getViewPublicKey(): string {
    throw new Error('Not implemented');
  }

  getPublicKeyType(): string {
    throw new Error('Not implemented');
  }

  getMode(): string {
    throw new Error('Not implemented');
  }

  getHash(): string {
    throw new Error('Not implemented');
  }

  getFingerprint(): string {
    throw new Error('Not implemented');
  }

  getParentFingerprint(): any {
    throw new Error('Not implemented');
  }

  getDepth(): number {
    throw new Error('Not implemented');
  }

  getPath(): string {
    throw new Error('Not implemented');
  }

  getPathKey(): string | null {
    return null;
  }

  getIndex(): number {
    throw new Error('Not implemented');
  }

  getIndexes(): number[] {
    throw new Error('Not implemented');
  }

  getIntegratedAddress(...args: any[]): string | null {
    throw new Error('Not implemented');
  }

  getPrimaryAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }

  getSubAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }

  getAddress(...args: any[]): string | null {
    throw new Error('Not implemented');
  }
}
