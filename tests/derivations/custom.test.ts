// SPDX-License-Identifier: MIT

import { DERIVATIONS, CustomDerivation } from '../../src/derivations';
import { DerivationError } from '../../src/exceptions';

const rawVectors = require('../data/json/derivations.json') as {
  Custom: {
    name: string;
    "default-path": string;
    "from-path": { indexes: number[]; path: string };
    "from-index": { index: number; hardened: boolean; path: string };
  };
};

describe("CustomDerivation", () => {
  const vec = rawVectors.Custom;

  it("defaults", () => {
    const d = new CustomDerivation();
    expect(d.getName()).toBe(vec.name);
    expect(d.getPath()).toBe(vec["default-path"]);
  });

  it("fromPath and clean()", () => {
    const d = new CustomDerivation().fromPath(vec["from-path"].path);
    expect(d.getPath()).toBe(vec["from-path"].path);
    d.clean();
    expect(d.getPath()).toBe(vec["default-path"]);
  });

  it("fromIndexes builds expected path", () => {
    const d = new CustomDerivation().fromIndexes(vec["from-path"].indexes);
    expect(d.getPath()).toBe(vec["from-path"].path);
  });

  it("fromIndex builds expected path with hardened flag", () => {
    const d = new CustomDerivation().fromIndex(
      vec["from-index"].index,
      vec["from-index"].hardened
    );
    expect(d.getPath()).toBe(vec["from-index"].path);
  });

  it("invalid inputs throw (path)", () => {
    expect(() => new CustomDerivation().fromPath('n/15/0/0/0/0')).toThrow(DerivationError);
    expect(() => new CustomDerivation().fromPath('n/15/0/0/0/0')).toThrow(/Bad path format/);
  });



  // --- registry (getDerivationClass) ---
  it("registry returns the same class as a direct import", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(vec.name);
    expect(RegistryClass).toBe(CustomDerivation);
  });

  it("registry-created and direct instances behave the same", () => {
    const RegistryClass = DERIVATIONS.getDerivationClass(vec.name);
    const a = new RegistryClass().fromPath(vec["from-path"].path);
    const b = new CustomDerivation().fromPath(vec["from-path"].path);
    expect(a.getPath()).toBe(vec["from-path"].path);
    expect(b.getPath()).toBe(vec["from-path"].path);
  });
});
