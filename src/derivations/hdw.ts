// SPDX-License-Identifier: MIT

import { Derivation } from './derivation';
import {
  normalizeIndex, normalizeDerivation, indexTupleToString, ensureTypeMatch
} from '../utils';
import {
  EllipticCurveCryptography,
  SLIP10Secp256k1ECC,
  SLIP10Ed25519ECC,
  SLIP10Nist256p1ECC,
  KholawEd25519ECC,
  SLIP10Ed25519Blake2bECC,
  SLIP10Ed25519MoneroECC
} from '../eccs';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType, DerivationsType } from '../types';
import { DerivationError } from '../exceptions';

export class HDWDerivation extends Derivation {

  private account: DerivationsType;
  private ecc: DerivationsType;
  private address: DerivationsType;

  constructor(options: DerivationOptionsInterface = {
    account: 0, ecc: SLIP10Secp256k1ECC, address: 0
  }) {
    super(options);
    this.account = normalizeIndex(options.account ?? 0, true);
    this.ecc = normalizeIndex(this.getECCValue(
      options.ecc ?? SLIP10Secp256k1ECC
    ), false);
    this.address = normalizeIndex(options.address ?? 0, false);
    this.updateDerivation();
  }

  static getName(): string {
    return 'HDW';
  }

  protected getECCValue(
    ecc: IndexType | EllipticCurveCryptography, nameOnly: boolean = false
  ): any {
    const { value, isValid } = ensureTypeMatch(
      ecc, EllipticCurveCryptography, { otherTypes: ['string', 'number'] }
    );
    const curve = isValid ? value.NAME : ecc;
    const slip10Secp256k1 = [ SLIP10Secp256k1ECC.NAME, 0, '0' ];
    const slip10Ed25519 = [ SLIP10Ed25519ECC.NAME, 1, '1' ];
    const slip10Nist256p1 = [ SLIP10Nist256p1ECC.NAME, 2, '2' ];
    const kholawEd25519 = [ KholawEd25519ECC.NAME, 3, '3' ];
    const slip10Ed25519Blake2b = [ SLIP10Ed25519Blake2bECC.NAME, 4, '4' ];
    const slip10Ed25519Monero = [ SLIP10Ed25519MoneroECC.NAME, 5, '5' ];
    const exceptedECC = [
      ...slip10Secp256k1, ...slip10Ed25519, ...slip10Nist256p1,
      ...kholawEd25519, ...slip10Ed25519Blake2b, ...slip10Ed25519Monero
    ];
    if (!exceptedECC.includes(curve)) {
      throw new DerivationError(
        `Bad ${this.getName()} ECC index`, {
          expected: exceptedECC, got: curve
        }
      );
    }
    if (slip10Secp256k1.includes(curve)) return nameOnly ? SLIP10Secp256k1ECC.NAME : 0;
    if (slip10Ed25519.includes(curve)) return nameOnly ? SLIP10Ed25519ECC.NAME : 1;
    if (slip10Nist256p1.includes(curve)) return nameOnly ? SLIP10Nist256p1ECC.NAME : 2;
    if (kholawEd25519.includes(curve)) return nameOnly ? KholawEd25519ECC.NAME : 3;
    if (slip10Ed25519Blake2b.includes(curve)) return nameOnly ? SLIP10Ed25519Blake2bECC.NAME : 4;
    if (slip10Ed25519Monero.includes(curve)) return nameOnly ? SLIP10Ed25519MoneroECC.NAME : 5;
  }

  private updateDerivation(): void {
    const [path, indexes, derivations] = normalizeDerivation(
      `m/${indexTupleToString(this.account)}/` +
      `${indexTupleToString(this.ecc)}/` +
      `${indexTupleToString(this.address)}`
    );
    this.derivations = derivations;
    this.indexes = indexes;
    this.path = path;
  }

  fromAccount(account: IndexType): this {
    this.account = normalizeIndex(account, true);
    this.updateDerivation();
    return this;
  }

  fromECC(ecc: string | number | EllipticCurveCryptography): this {
    this.ecc = normalizeIndex(this.getECCValue(ecc), false);
    this.updateDerivation();
    return this;
  }

  fromAddress(address: IndexType): this {
    this.address = normalizeIndex(address, false);
    this.updateDerivation();
    return this;
  }

  clean(): this {
    this.account = normalizeIndex(0, true);
    this.ecc = normalizeIndex(
      this.getECCValue(SLIP10Secp256k1ECC), false
    );
    this.address = normalizeIndex(0, false);
    this.updateDerivation();
    return this;
  }

  getAccount(): number {
    return this.account.length === 3 ? this.account[1] : this.account[0];
  }

  getECC(nameOnly: boolean = true): string {
    return this.getECCValue(this.ecc[0], nameOnly);
  }

  getAddress(): number {
    return this.address.length === 3 ? this.address[1] : this.address[0];
  }
}
