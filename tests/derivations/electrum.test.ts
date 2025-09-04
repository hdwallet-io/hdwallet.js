// SPDX-License-Identifier: MIT

import { DERIVATIONS, ElectrumDerivation } from '../../src/derivations';

const rawVectors = require('../data/json/derivations.json') as {
  Electrum: {
    default: { name: string; change: number; address: number; path: string };
    from: { change: number; address: number; path: string };
  };
};

describe("ElectrumDerivation", () => {
  const def = rawVectors.Electrum.default;
  const from = rawVectors.Electrum.from;

  it("initializes with defaults", () => {
    const d = new ElectrumDerivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getChange()).toBe(def.change);
    expect(d.getAddress()).toBe(def.address);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new ElectrumDerivation({
      change: from.change,
      address: from.address
    });
    expect(d.getChange()).toBe(from.change);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  it("clean() resets to defaults", () => {
    const d = new ElectrumDerivation({
      change: from.change,
      address: from.address
    });
    d.clean();
    expect(d.getChange()).toBe(def.change);
    expect(d.getAddress()).toBe(def.address);
  });

  it("supports from* setters", () => {
    const d = new ElectrumDerivation();
    d.fromChange(from.change);
    d.fromAddress(from.address);
    expect(d.getChange()).toBe(from.change);
    expect(d.getAddress()).toBe(from.address);
    expect(d.getPath()).toBe(from.path);
  });

  // --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(ElectrumDerivation);
  });

  it("registry-created and direct instances return expected paths", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass();
    const b = new ElectrumDerivation();
    expect(a.getPath()).toBe(def.path);
    expect(b.getPath()).toBe(def.path);

    const a2 = new RegistryClass({ change: from.change, address: from.address });
    const b2 = new ElectrumDerivation({ change: from.change, address: from.address });
    expect(a2.getPath()).toBe(from.path);
    expect(b2.getPath()).toBe(from.path);
  });
});
