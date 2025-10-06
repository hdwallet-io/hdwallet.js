// SPDX-License-Identifier: MIT

import {
  ENTROPIES, ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS
} from '../../../src/entropies';
import { EntropyError } from '../../../src/exceptions';

const rawVectors = require('../../data/json/entropies.json') as {
  "Electrum-V1": Record<string, { name:string; entropy:string; strength:number }>;
};

describe("Electrum-V1 Entropy", () => {
  const vector = rawVectors["Electrum-V1"]["128"];
  const strength = vector.strength as number;
  const entropy  = vector.entropy as string;

  it("defines the constant correctly", () => {
    expect(
      ELECTRUM_V1_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
    ).toBe(strength);
  });

  it("validates supported strengths", () => {
    expect(ElectrumV1Entropy.isValidStrength(strength)).toBe(true);
    expect(ElectrumV1Entropy.isValidStrength(strength - 8)).toBe(false);
  });

  it("generates hex of correct length for each supported strength", () => {
    for (const s of ElectrumV1Entropy.strengths) {
      const hex = ElectrumV1Entropy.generate(s);
      expect(typeof hex).toBe("string");
      expect(hex).toHaveLength(s / 4);
    }
  });

  it("round-trips entropy and strength", () => {
    const inst = new ElectrumV1Entropy(entropy);
    expect(inst.getEntropy()).toBe(entropy);
    expect(inst.getStrength()).toBe(strength);
  });

  it("reports its name correctly", () => {
    expect(ElectrumV1Entropy.getName()).toBe(vector.name);
  });

  it("validates hex statically", () => {
    expect(ElectrumV1Entropy.isValid(entropy)).toBe(true);
    expect(ElectrumV1Entropy.isValid("00")).toBe(false);
  });

  it("throws on totally invalid hex", () => {
    expect(() => new ElectrumV1Entropy("NOT_HEX")).toThrow(EntropyError);
  });

  it("rejects hex of unsupported length", () => {
    const bad = entropy.slice(1); // drop one hex character
    expect(ElectrumV1Entropy.isValid(bad)).toBe(false);
  });

  const RegistryClass = ENTROPIES.getEntropyClass(vector.name);

  it("registry returns the same class", () => {
    expect(RegistryClass).toBe(ElectrumV1Entropy);
  });

  it("registry instance matches direct instance", () => {
    const fromReg = new RegistryClass(entropy);
    const direct  = new ElectrumV1Entropy(entropy);
    expect(fromReg.getEntropy()).toBe(direct.getEntropy());
    expect(fromReg.getStrength()).toBe(direct.getStrength());
  });

  it("static methods and generate() are consistent", () => {
    expect(RegistryClass.isValidStrength(strength)).toBe(ElectrumV1Entropy.isValidStrength(strength));
    expect(RegistryClass.isValid(entropy)).toBe(ElectrumV1Entropy.isValid(entropy));

    const genA = RegistryClass.generate(strength);
    const genB = ElectrumV1Entropy.generate(strength);

    expect(genA).toMatch(/^[0-9a-f]+$/);
    expect(genB).toMatch(/^[0-9a-f]+$/);

    expect(genA).toHaveLength(strength / 4);
    expect(genB).toHaveLength(strength / 4);

    expect(genA.length).toBe(genB.length);
  });
});
