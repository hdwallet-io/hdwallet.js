// SPDX-License-Identifier: MIT

import { ADDRESSES, MoneroAddress } from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['SLIP10-Ed25519-Monero']: {
    name: string;
    ['spend-public-key']: string;
    ['view-public-key']: string;
    encode: string;
    args: { payment_id: string | null };
  };
};

describe("MoneroAddress (SLIP10-Ed25519-Monero)", () => {
  const vec = rawVectors['SLIP10-Ed25519-Monero'];
  const name = vec.name;
  const spend = vec['spend-public-key'];
  const view = vec['view-public-key'];
  const paymentId = vec.args.payment_id;
  const encoded = vec.encode;

  it("has the correct name", () => {
    expect(MoneroAddress.getName()).toBe(name);
  });

  it("encodes correctly (spend, view, paymentId)", () => {
    expect(
      MoneroAddress.encode(
        { spendPublicKey: spend, viewPublicKey: view },
        { paymentID: paymentId as any }
      )
    ).toBe(encoded);
  });

  it("decodes back to spend/view keys", () => {
    const [decSpend, decView] = MoneroAddress.decode(encoded, {
      paymentID: paymentId as any
    }) as [string, string];
    expect(decSpend).toBe(spend);
    expect(decView).toBe(view);
  });

  // --- registry (getAddressClass) ---
  it("registry returns the same class and works identically", () => {
    const RegistryClass = ADDRESSES.getAddressClass(name);
    expect(RegistryClass).toBe(MoneroAddress);

    expect(
      (RegistryClass as any).encode(
        { spendPublicKey: spend, viewPublicKey: view },
        { paymentID: paymentId as any }
      )
    ).toBe(encoded);

    const [rSpend, rView] = (RegistryClass as any).decode(encoded, {
      paymentID: paymentId as any
    }) as [string, string];
    expect(rSpend).toBe(spend);
    expect(rView).toBe(view);
  });
});
