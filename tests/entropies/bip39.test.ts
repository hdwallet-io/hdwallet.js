// SPDX-License-Identifier: MIT

import {
  ENTROPIES, BIP39Entropy, BIP39_ENTROPY_STRENGTHS
} from '../../src/entropies';
import { EntropyError } from '../../src/exceptions';

const rawVectors = require('../data/json/entropies.json') as {
  BIP39: Record<string, { name:string; entropy:string; strength:number }>;
};

describe("BIP39Entropy", () => {
  for (const [bits, vector] of Object.entries(rawVectors.BIP39)) {
    const data = {
      name: vector.name,
      entropy: vector.entropy,
      strength: vector.strength as number
    };

    it("defines the 256-bit constant correctly", () => {
      expect(BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX).toBe(256);
    });

    it("validates supported strengths", () => {
      expect(BIP39Entropy.isValidStrength(data.strength)).toBe(true);
      expect(BIP39Entropy.isValidStrength(250)).toBe(false);
    });

    it("generates hex of correct length for each supported strength", () => {
      for (const strength of BIP39Entropy.strengths) {
        const hex = BIP39Entropy.generate(strength);
        expect(typeof hex).toBe("string");
        expect(hex).toHaveLength(strength / 4);
      }
    });

    it("round-trips entropy and strength for a 256-bit value", () => {
      const hex = BIP39Entropy.generate(data.strength);
      const inst = new BIP39Entropy(hex);
      expect(inst.getEntropy()).toBe(hex);
      expect(inst.getStrength()).toBe(data.strength);
    });

    it("reports its name correctly", () => {
      expect(BIP39Entropy.getName()).toBe(data.name);
    });

    it("validates hex strings statically", () => {
      const good = BIP39Entropy.generate(data.strength);
      expect(BIP39Entropy.isValid(good)).toBe(true);
      expect(BIP39Entropy.isValid("00")).toBe(false);
    });

    it("throws if you pass totally invalid hex", () => {
      expect(() => new BIP39Entropy("NOT_HEX")).toThrow(EntropyError);
    });

    it("rejects hex strings of unsupported length", () => {
      const wrong = data.entropy.slice(1);
      expect(BIP39Entropy.isValid(wrong)).toBe(false);
    });

    it("registry returns the same class as a direct import", () => {
      const RegistryClass = ENTROPIES.getEntropyClass(data.name);
      expect(RegistryClass).toBe(BIP39Entropy);
    });

    it("both registry-created and direct instances return the correct entropy & strength", () => {
      const RegistryClass = ENTROPIES.getEntropyClass(data.name);
      const instFromRegistry = new RegistryClass(data.entropy);
      const instDirect = new BIP39Entropy(data.entropy);

      expect(instFromRegistry.getEntropy()).toBe(data.entropy);
      expect(instDirect.getEntropy()).toBe(data.entropy);
      expect(instFromRegistry.getStrength()).toBe(data.strength);
      expect(instDirect.getStrength()).toBe(data.strength);
    });

    it("static methods and generate() are consistent between registry and direct class", () => {
      const RegistryClass = ENTROPIES.getEntropyClass(data.name);
      expect(RegistryClass.isValidStrength(data.strength)).toBe(
          BIP39Entropy.isValidStrength(data.strength)
      );
      expect(RegistryClass.isValid(data.entropy)).toBe(
          BIP39Entropy.isValid(data.entropy)
      );
      const genFromRegistry = RegistryClass.generate(data.strength);
      const genDirect = BIP39Entropy.generate(data.strength);

      expect(genFromRegistry).toMatch(/^[0-9a-f]+$/);
      expect(genDirect).toMatch(/^[0-9a-f]+$/);

      expect(genFromRegistry).toHaveLength(data.strength / 4);
      expect(genDirect).toHaveLength(data.strength / 4);

      expect(genFromRegistry.length).toBe(genDirect.length);
    });
  }
});
