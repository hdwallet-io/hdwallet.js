// SPDX-License-Identifier: MIT

import { ADDRESSES, NeoAddress } from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['SLIP10-Nist256p1']: {
    ['public-key']: string;
    addresses: {
      Neo: { name: string; encode: string; decode: string };
    };
  };
};

describe("NeoAddress (SLIP10-Nist256p1)", () => {
  const group = rawVectors['SLIP10-Nist256p1'];
  const pub = group['public-key'];
  const { Neo } = group.addresses;

  it("has the correct name", () => {
    expect(NeoAddress.getName()).toBe(Neo.name);
  });

  it("encodes/decodes correctly", () => {
    expect(NeoAddress.encode(pub)).toBe(Neo.encode);
    expect(NeoAddress.decode(Neo.encode)).toBe(Neo.decode);
  });

  // --- registry (getAddressClass) ---
  it("registry returns the same class and works identically", () => {
    const RegistryClass = ADDRESSES.getAddressClass(Neo.name);
    expect(RegistryClass).toBe(NeoAddress);
    expect((RegistryClass as any).encode(pub)).toBe(Neo.encode);
    expect((RegistryClass as any).decode(Neo.encode)).toBe(Neo.decode);
  });
});
