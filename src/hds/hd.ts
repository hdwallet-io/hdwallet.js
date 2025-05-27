// SPDX-License-Identifier: MIT

import { Derivation } from '../derivations';
import { HDOptionsInterface } from '../interfaces';

export class HD {

  protected derivation!: Derivation;

  constructor(options: HDOptionsInterface = { }) { }

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

  getSeed(): string | undefined {
    throw new Error('Not implemented');
  }

  getSemantic(): string | undefined {
    return undefined;
  }

  getRootXPrivateKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getRootXPublicKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getMasterXPrivateKey(...args: any[]): string | undefined {
    return this.getRootXPrivateKey(...args);
  }

  getMasterXPublicKey(...args: any[]): string | undefined {
    return this.getRootXPublicKey(...args);
  }

  getRootPrivateKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getRootWIF(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getRootChainCode(): string | undefined {
    throw new Error('Not implemented');
  }

  getRootPublicKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getMasterPrivateKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getMasterWIF(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getMasterChainCode(...args: any[]): string | undefined {
    return this.getRootChainCode();
  }

  getMasterPublicKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getXPrivateKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getXPublicKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getPrivateKey(...args: any[]): string | undefined {
    throw new Error('Not implemented');
  }

  getStrict(): boolean | undefined {
    throw new Error('Not implemented');
  }

  getSpendPrivateKey(): string | undefined {
    throw new Error('Not implemented');
  }

  getViewPrivateKey(): string {
    throw new Error('Not implemented');
  }

  getWIF(..._args: any[]): string | undefined {
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

  getPathKey(): string | undefined {
    throw new Error('Not implemented');
  }

  getIndex(): number {
    throw new Error('Not implemented');
  }

  getIndexes(): number[] {
    throw new Error('Not implemented');
  }

  getIntegratedAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }

  getPrimaryAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }

  getSubAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }

  getAddress(...args: any[]): string {
    throw new Error('Not implemented');
  }
}
