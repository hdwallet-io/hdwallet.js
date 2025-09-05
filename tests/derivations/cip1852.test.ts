// SPDX-License-Identifier: MIT

import { DERIVATIONS, CIP1852Derivation, ROLES } from '../../src/derivations';
import { DerivationError } from '../../src/exceptions';

const rawVectors = require('../data/json/derivations.json') as {
  CIP1852: {
    default: {
      name: string;
      purpose: number;
      coin_type: number;
      account: number;
      role: string;
      address: number;
      path: string;
    };
    from: {
      coin_type: number;
      account: number;
      role: string;
      address: number;
      path: string;
    };
  };
};

describe("CIP1852Derivation", () => {
  const def = rawVectors.CIP1852.default;
  const from = rawVectors.CIP1852.from;

  it("exposes role constants", () => {
    expect(ROLES.EXTERNAL_CHAIN).toBe("external-chain");
    expect(ROLES.INTERNAL_CHAIN).toBe("internal-chain");
  });

  it("initializes with defaults", () => {
    const d = new CIP1852Derivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getPurpose()).toBe(def.purpose);
    expect(d.getCoinType()).toBe(def.coin_type);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getRole()).toBe(def.role);
    expect(d.getAddress()).toBe(def.address);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new CIP1852Derivation({
      coinType: from.coin_type,
      account: from.account,
      role: from.role as any,
      address: from.address
    });
    expect(d.getCoinType()).toBe(from.coin_type);
    expect(d.getAccount()).toBe(from.account);
    expect(d.getRole()).toBe(from.role);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("clean() keeps coin_type and resets others to defaults", () => {
    const d = new CIP1852Derivation({
      coinType: from.coin_type,
      account: from.account,
      role: from.role as any,
      address: from.address
    });
    d.clean();
    expect(d.getName()).toBe(def.name);
    expect(d.getPurpose()).toBe(def.purpose);
    expect(d.getCoinType()).toBe(def.coin_type);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getRole()).toBe(def.role);
    expect(d.getAddress()).toBe(def.address);
  });

  it("supports from* setters", () => {
    const d = new CIP1852Derivation();
    d.fromCoinType(from.coin_type);
    d.fromAccount(from.account);
    d.fromRole(from.role as any);
    d.fromAddress(from.address);
    expect(d.getCoinType()).toBe(from.coin_type);
    expect(d.getAccount()).toBe(from.account);
    expect(d.getRole()).toBe(from.role);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("rejects invalid role at construction", () => {
    expect(() => new CIP1852Derivation({ role: "invalid-role" as any })).toThrow(DerivationError);
  });

  it("rejects invalid role via setter", () => {
    const d = new CIP1852Derivation();
    expect(() => d.fromRole("invalid-role" as any)).toThrow(DerivationError);
  });

  // --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(CIP1852Derivation);
  });

  it("registry-created and direct instances return default derivation", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass();
    const b = new CIP1852Derivation();
    expect(a.getPath()).toBe(def.path);
    expect(b.getPath()).toBe(def.path);
  });

  it("constructor parity between registry class and direct class", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass({
      coinType: from.coin_type,
      account: from.account,
      role: from.role as any,
      address: from.address
    });
    const b = new CIP1852Derivation({
      coinType: from.coin_type,
      account: from.account,
      role: from.role as any,
      address: from.address
    });
    expect(a.getPath()).toBe(from.path);
    expect(b.getPath()).toBe(from.path);
  });
});
