// SPDX-License-Identifier: MIT

import {
  ADDRESSES,
  AlgorandAddress,
  AptosAddress,
  MultiversXAddress,
  NearAddress,
  SolanaAddress,
  StellarAddress,
  TezosAddress,
  SuiAddress
} from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['SLIP10-Ed25519']: {
    ['public-key']: string;
    addresses: {
      Algorand: { name: string; encode: string; decode: string };
      MultiversX: { name: string; encode: string; decode: string };
      Solana: { name: string; encode: string; decode: string };
      Stellar: { name: string; encode: string; decode: string };
      Tezos: { name: string; encode: string; decode: string };
      Sui: { name: string; encode: string; decode: string };
      Aptos: { name: string; encode: string; decode: string };
      Near: { name: string; encode: string; decode: string };
    };
  };
};

describe("SLIP10-Ed25519 based address encoders", () => {
  const group = rawVectors['SLIP10-Ed25519'];
  const pub = group['public-key'];
  const { Algorand, MultiversX, Solana, Stellar, Tezos, Sui, Aptos, Near } = group.addresses;

  // ---- Algorand ----
  describe("AlgorandAddress", () => {
    it("has the correct name", () => {
      expect(AlgorandAddress.getName()).toBe(Algorand.name);
    });

    it("encodes/decodes correctly", () => {
      expect(AlgorandAddress.encode(pub)).toBe(Algorand.encode);
      expect(AlgorandAddress.decode(Algorand.encode)).toBe(Algorand.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Algorand.name);
      expect(RegistryClass).toBe(AlgorandAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Algorand.encode);
      expect((RegistryClass as any).decode(Algorand.encode)).toBe(Algorand.decode);
    });
  });

  // ---- MultiversX ----
  describe("MultiversXAddress", () => {
    it("has the correct name", () => {
      expect(MultiversXAddress.getName()).toBe(MultiversX.name);
    });

    it("encodes/decodes correctly", () => {
      expect(MultiversXAddress.encode(pub)).toBe(MultiversX.encode);
      expect(MultiversXAddress.decode(MultiversX.encode)).toBe(MultiversX.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(MultiversX.name);
      expect(RegistryClass).toBe(MultiversXAddress);
      expect((RegistryClass as any).encode(pub)).toBe(MultiversX.encode);
      expect((RegistryClass as any).decode(MultiversX.encode)).toBe(MultiversX.decode);
    });
  });

  // ---- Solana ----
  describe("SolanaAddress", () => {
    it("has the correct name", () => {
      expect(SolanaAddress.getName()).toBe(Solana.name);
    });

    it("encodes/decodes correctly", () => {
      expect(SolanaAddress.encode(pub)).toBe(Solana.encode);
      expect(SolanaAddress.decode(Solana.encode)).toBe(Solana.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Solana.name);
      expect(RegistryClass).toBe(SolanaAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Solana.encode);
      expect((RegistryClass as any).decode(Solana.encode)).toBe(Solana.decode);
    });
  });

  // ---- Stellar ----
  describe("StellarAddress", () => {
    it("has the correct name", () => {
      expect(StellarAddress.getName()).toBe(Stellar.name);
    });

    it("encodes/decodes correctly", () => {
      expect(StellarAddress.encode(pub)).toBe(Stellar.encode);
      expect(StellarAddress.decode(Stellar.encode)).toBe(Stellar.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Stellar.name);
      expect(RegistryClass).toBe(StellarAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Stellar.encode);
      expect((RegistryClass as any).decode(Stellar.encode)).toBe(Stellar.decode);
    });
  });

  // ---- Tezos ----
  describe("TezosAddress", () => {
    it("has the correct name", () => {
      expect(TezosAddress.getName()).toBe(Tezos.name);
    });

    it("encodes/decodes correctly", () => {
      expect(TezosAddress.encode(pub)).toBe(Tezos.encode);
      expect(TezosAddress.decode(Tezos.encode)).toBe(Tezos.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Tezos.name);
      expect(RegistryClass).toBe(TezosAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Tezos.encode);
      expect((RegistryClass as any).decode(Tezos.encode)).toBe(Tezos.decode);
    });
  });

  // ---- Sui ----
  describe("SuiAddress", () => {
    it("has the correct name", () => {
      expect(SuiAddress.getName()).toBe(Sui.name);
    });

    it("encodes/decodes correctly", () => {
      expect(SuiAddress.encode(pub)).toBe(Sui.encode);
      expect(SuiAddress.decode(Sui.encode)).toBe(Sui.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Sui.name);
      expect(RegistryClass).toBe(SuiAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Sui.encode);
      expect((RegistryClass as any).decode(Sui.encode)).toBe(Sui.decode);
    });
  });

  // ---- Aptos ----
  describe("AptosAddress", () => {
    it("has the correct name", () => {
      expect(AptosAddress.getName()).toBe(Aptos.name);
    });

    it("encodes/decodes correctly", () => {
      expect(AptosAddress.encode(pub)).toBe(Aptos.encode);
      expect(AptosAddress.decode(Aptos.encode)).toBe(Aptos.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Aptos.name);
      expect(RegistryClass).toBe(AptosAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Aptos.encode);
      expect((RegistryClass as any).decode(Aptos.encode)).toBe(Aptos.decode);
    });
  });

  // ---- Near ----
  describe("NearAddress", () => {
    it("has the correct name", () => {
      expect(NearAddress.getName()).toBe(Near.name);
    });

    it("encodes/decodes correctly", () => {
      expect(NearAddress.encode(pub)).toBe(Near.encode);
      expect(NearAddress.decode(Near.encode)).toBe(Near.decode);
    });

    it("registry returns same class and works identically", () => {
      const RegistryClass = ADDRESSES.getAddressClass(Near.name);
      expect(RegistryClass).toBe(NearAddress);
      expect((RegistryClass as any).encode(pub)).toBe(Near.encode);
      expect((RegistryClass as any).decode(Near.encode)).toBe(Near.decode);
    });
  });
});
