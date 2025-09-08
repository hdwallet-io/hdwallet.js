// SPDX-License-Identifier: MIT

import { ADDRESSES, NanoAddress } from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['SLIP10-Ed25519-Blake2b']: {
    ['public-key']: string;
    addresses: {
      Nano: { name: string; encode: string; decode: string };
    };
  };
};

describe("NanoAddress (SLIP10-Ed25519-Blake2b)", () => {
  const group = rawVectors['SLIP10-Ed25519-Blake2b'];
  const pub = group['public-key'];
  const { Nano } = group.addresses;

  it("has the correct name", () => {
    expect(NanoAddress.getName()).toBe(Nano.name);
  });

  it("encodes/decodes correctly", () => {
    expect(NanoAddress.encode(pub)).toBe(Nano.encode);
    expect(NanoAddress.decode(Nano.encode)).toBe(Nano.decode);
  });

  // --- registry (getAddressClass) ---
  it("registry returns the same class and works identically", () => {
    const RegistryClass = ADDRESSES.getAddressClass(Nano.name);
    expect(RegistryClass).toBe(NanoAddress);
    expect((RegistryClass as any).encode(pub)).toBe(Nano.encode);
    expect((RegistryClass as any).decode(Nano.encode)).toBe(Nano.decode);
  });
});