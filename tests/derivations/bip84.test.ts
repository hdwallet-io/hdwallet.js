// SPDX-License-Identifier: MIT

import { DERIVATIONS, BIP84Derivation } from '../../src/derivations';
import { DerivationError } from '../../src/exceptions';

const rawVectors = require('../data/json/derivations.json') as {
  BIP84: {
    default: {
      name: string;
      purpose: number;
      coin_type: number;
      account: number;
      change: string;
      address: number;
      path: string;
    };
    from: {
      coin_type: number;
      account: number;
      change: string;
      address: number;
      path: string;
    };
  };
};

describe("BIP84Derivation", () => {
  const def = rawVectors.BIP84.default;
  const from = rawVectors.BIP84.from;

  it("initializes with defaults", () => {
    const d = new BIP84Derivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getPurpose()).toBe(def.purpose);
    expect(d.getCoinType()).toBe(def.coin_type);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getChange()).toBe(def.change);
    expect(d.getAddress()).toBe(def.address);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new BIP84Derivation({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });
    expect(d.getCoinType()).toBe(from.coin_type);
    expect(d.getAccount()).toBe(from.account);
    expect(d.getChange()).toBe(from.change);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("clean() keeps coin_type and resets others to defaults", () => {
    const d = new BIP84Derivation({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });
    d.clean();
    expect(d.getName()).toBe(def.name);
    expect(d.getPurpose()).toBe(def.purpose);
    expect(d.getCoinType()).toBe(from.coin_type);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getChange()).toBe(def.change);
    expect(d.getAddress()).toBe(def.address);
  });

  it("supports from* setters", () => {
    const d = new BIP84Derivation();
    d.fromCoinType(from.coin_type);
    d.fromAccount(from.account);
    d.fromChange(from.change as any);
    d.fromAddress(from.address);
    expect(d.getCoinType()).toBe(from.coin_type);
    expect(d.getAccount()).toBe(from.account);
    expect(d.getChange()).toBe(from.change);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("rejects invalid change at construction", () => {
    expect(() => new BIP84Derivation({ change: "invalid-change" as any })).toThrow(DerivationError);
  });

  it("rejects invalid change via setter", () => {
    const d = new BIP84Derivation();
    expect(() => d.fromChange("invalid-change" as any)).toThrow(DerivationError);
  });

  // --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(BIP84Derivation);
  });

  it("registry-created and direct instances return default derivation", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass();
    const b = new BIP84Derivation();
    expect(a.getPath()).toBe(def.path);
    expect(b.getPath()).toBe(def.path);
  });

  it("constructor parity between registry class and direct class", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });
    const b = new BIP84Derivation({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });
    expect(a.getPath()).toBe(from.path);
    expect(b.getPath()).toBe(from.path);
  });
});