// SPDX-License-Identifier: MIT

import { DERIVATIONS, HDWDerivation } from '../../src/derivations';
import { DerivationError } from '../../src/exceptions';

const rawVectors = require('../data/json/derivations.json') as {
  HDW: {
    default: { name: string; account: number; ecc: string; address: number; path: string };
    from: { account: number; ecc: string; address: number; path: string };
  };
};

describe("HDWDerivation", () => {
  const def = rawVectors.HDW.default;
  const from = rawVectors.HDW.from;

  it("initializes with defaults", () => {
    const d = new HDWDerivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getECC()).toBe(def.ecc);
    expect(d.getAddress()).toBe(def.address);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new HDWDerivation({
      account: from.account,
      ecc: from.ecc as any,
      address: from.address
    });
    expect(d.getAccount()).toBe(from.account);
    expect(d.getECC()).toBe(from.ecc);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("clean() keeps ecc and resets others to defaults", () => {
    const d = new HDWDerivation({
      account: from.account,
      ecc: from.ecc as any,
      address: from.address
    });
    d.clean();
    expect(d.getName()).toBe(def.name);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getECC()).toBe(def.ecc);
    expect(d.getAddress()).toBe(def.address);
  });

  it("supports from* setters", () => {
    const d = new HDWDerivation();
    d.fromAccount(from.account);
    d.fromECC(from.ecc as any);
    d.fromAddress(from.address);
    expect(d.getAccount()).toBe(from.account);
    expect(d.getECC()).toBe(from.ecc);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("rejects invalid ecc at construction", () => {
    expect(() => new HDWDerivation({ ecc: "invalid-ecc" as any })).toThrow(DerivationError);
  });

  it("rejects invalid ecc via setter", () => {
    const d = new HDWDerivation();
    expect(() => d.fromECC("invalid-ecc" as any)).toThrow(DerivationError);
  });

  // --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(HDWDerivation);
  });

  it("registry-created and direct instances return default derivation", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass();
    const b = new HDWDerivation();
    expect(a.getPath()).toBe(def.path);
    expect(b.getPath()).toBe(def.path);
  });

  it("constructor parity between registry class and direct class", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass({
      account: from.account,
      ecc: from.ecc as any,
      address: from.address
    });
    const b = new HDWDerivation({
      account: from.account,
      ecc: from.ecc as any,
      address: from.address
    });
    expect(a.getPath()).toBe(from.path);
    expect(b.getPath()).toBe(from.path);
  });
});
