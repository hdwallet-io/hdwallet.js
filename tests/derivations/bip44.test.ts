// SPDX-License-Identifier: MIT

import { DERIVATIONS, BIP44Derivation, CHANGES } from '../../src/derivations';
import { DerivationError } from '../../src/exceptions';

const rawVectors = require('../data/json/derivations.json') as {
  BIP44: {
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

describe("BIP44Derivation", () => {
  const def = rawVectors.BIP44.default;
  const from = rawVectors.BIP44.from;

  it("exposes change constants", () => {
    expect(CHANGES.EXTERNAL_CHAIN).toBe("external-chain");
    expect(CHANGES.INTERNAL_CHAIN).toBe("internal-chain");
  });

  it("initializes with defaults", () => {
    const d = new BIP44Derivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getPurpose()).toBe(def.purpose);
    expect(d.getCoinType()).toBe(def.coin_type);
    expect(d.getAccount()).toBe(def.account);
    expect(d.getChange()).toBe(def.change);
    expect(d.getAddress()).toBe(def.address);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new BIP44Derivation({
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
    const d = new BIP44Derivation({
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
    const d = new BIP44Derivation();
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
    expect(() => new BIP44Derivation({ change: "invalid-change" as any })).toThrow(DerivationError);
  });

  it("rejects invalid change via setter", () => {
    const d = new BIP44Derivation();
    expect(() => d.fromChange("invalid-change" as any)).toThrow(DerivationError);
  });

  // --- registry (getDerivationClass) ---

  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(BIP44Derivation);
  });

  it("registry-created and direct instances return the correct default derivation", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const instFromRegistry = new RegistryClass();
    const instDirect = new BIP44Derivation();

    expect(instFromRegistry.getName()).toBe(def.name);
    expect(instDirect.getName()).toBe(def.name);

    expect(instFromRegistry.getPath()).toBe(def.path);
    expect(instDirect.getPath()).toBe(def.path);
  });

  it("registry-created and direct instances return the correct 'from' derivation", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const instFromRegistry = new RegistryClass({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });
    const instDirect = new BIP44Derivation({
      coinType: from.coin_type,
      account: from.account,
      change: from.change as any,
      address: from.address
    });

    expect(instFromRegistry.getCoinType()).toBe(from.coin_type);
    expect(instDirect.getCoinType()).toBe(from.coin_type);

    expect(instFromRegistry.getAccount()).toBe(from.account);
    expect(instDirect.getAccount()).toBe(from.account);

    expect(instFromRegistry.getChange()).toBe(from.change);
    expect(instDirect.getChange()).toBe(from.change);

    expect(instFromRegistry.getAddress()).toBe(from.address);
    expect(instDirect.getAddress()).toBe(from.address);

    expect(instFromRegistry.getPath()).toBe(from.path);
    expect(instDirect.getPath()).toBe(from.path);
  });
});
