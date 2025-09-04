// SPDX-License-Identifier: MIT

import { DERIVATIONS, MoneroDerivation } from '../../src/derivations';

const rawVectors = require('../data/json/derivations.json') as {
  Monero: {
    default: { name: string; minor: number; major: number; path: string };
    from: { minor: number; major: number; path: string };
  };
};

describe("MoneroDerivation", () => {
  const def = rawVectors.Monero.default;
  const from = rawVectors.Monero.from;

  it("initializes with defaults", () => {
    const d = new MoneroDerivation();
    expect(d.getName()).toBe(def.name);
    expect(d.getMinor()).toBe(def.minor);
    expect(d.getMajor()).toBe(def.major);
    expect(d.getPath()).toBe(def.path);
  });

  it("accepts explicit params", () => {
    const d = new MoneroDerivation({
      minor: from.minor,
      major: from.major
    });
    expect(d.getMinor()).toBe(from.minor);
    expect(d.getMajor()).toBe(from.major);
    expect(d.getPath()).toBe(from.path);
  });

  it("clean() resets to defaults", () => {
    const d = new MoneroDerivation({
      minor: from.minor,
      major: from.major
    });
    d.clean();
    expect(d.getMinor()).toBe(def.minor);
    expect(d.getMajor()).toBe(def.major);
  });

  it("supports from* setters", () => {
    const d = new MoneroDerivation();
    d.fromMinor(from.minor);
    d.fromMajor(from.major);
    expect(d.getMinor()).toBe(from.minor);
    expect(d.getMajor()).toBe(from.major);
    expect(d.getPath()).toBe(from.path);
  });

  /// --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    expect(RegistryClass).toBe(MoneroDerivation);
  });

  it("registry-created and direct instances return expected paths", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(def.name);
    const a = new RegistryClass();
    const b = new MoneroDerivation();
    expect(a.getPath()).toBe(def.path);
    expect(b.getPath()).toBe(def.path);

    const a2 = new RegistryClass({ minor: from.minor, major: from.major });
    const b2 = new MoneroDerivation({ minor: from.minor, major: from.major });
    expect(a2.getPath()).toBe(from.path);
    expect(b2.getPath()).toBe(from.path);
  });
});
