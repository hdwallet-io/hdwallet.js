// SPDX-License-Identifier: MIT

import {
  ENTROPIES, ElectrumV2Entropy,
} from '../../../src/entropies';
import { EntropyError } from '../../../src/exceptions';

const rawVectors = require('../../data/json/entropies.json') as {
  "Electrum-V2": Record<string, {
    "entropy-suitable": string;
    "entropy-not-suitable": string;
    strength: number;
    name: string;
  }>;
};

describe("Electrum-V2 Entropy", () => {
  const ev2 = rawVectors["Electrum-V2"];
  for (const [bits, vector] of Object.entries(ev2)) {
    const { strength, name } = vector;
    const goodHex = vector["entropy-suitable"];
    const badHex  = vector["entropy-not-suitable"];

    it("lists this strength in its static strengths array", () => {
      expect(ElectrumV2Entropy.strengths).toContain(strength);
    });

    it("validates a suitable hex string", () => {
      expect(ElectrumV2Entropy.isValid(goodHex)).toBe(true);
    });

    it("validates a not suitable hex string", () => {
      expect(ElectrumV2Entropy.isValid(badHex)).toBe(true);
    });

    it("round-trips entropy and strength via the constructor", () => {
      const inst = new ElectrumV2Entropy(goodHex);
      expect(inst.getEntropy()).toBe(goodHex);
      expect(inst.getStrength()).toBe(strength);
    });

    it("generates hex of the correct byte-rounded length", () => {
      const hex = ElectrumV2Entropy.generate(strength);
      const expectedLength = 2 * Math.ceil(strength / 8);
      expect(typeof hex).toBe("string");
      expect(hex).toHaveLength(expectedLength);
      expect(ElectrumV2Entropy.isValid(hex)).toBe(true);
    });

    it("throws if given totally invalid hex", () => {
      expect(() => new ElectrumV2Entropy("NOT_HEX")).toThrow(EntropyError);
    });

    const RegistryClass = ENTROPIES.getEntropyClass(name);

    it("registry returns the same class", () => {
      expect(RegistryClass).toBe(ElectrumV2Entropy);
    });

    it("registry instances behave identically to direct instances", () => {
      const a = new RegistryClass(goodHex);
      const b = new ElectrumV2Entropy(goodHex);
      expect(a.getEntropy()).toBe(b.getEntropy());
      expect(a.getStrength()).toBe(b.getStrength());
    });

    it("static methods match between registry class and direct class", () => {
      expect(RegistryClass.isValid(goodHex)).toBe(
        ElectrumV2Entropy.isValid(goodHex)
      );
      expect(RegistryClass.isValidStrength(strength)).toBe(
        ElectrumV2Entropy.isValidStrength(strength)
      );
      const g = RegistryClass.generate(strength);
      expect(g).toHaveLength(2 * Math.ceil(strength / 8));
    });
  }
});
