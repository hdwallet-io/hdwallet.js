// SPDX-License-Identifier: MIT

import eccs from '../data/json/eccs.json';


import {
  SLIP10Secp256k1ECC,
  SLIP10Secp256k1Point,
  SLIP10Secp256k1PublicKey,
  SLIP10Secp256k1PrivateKey,
  ECCS,
  validateAndGetPublicKey
} from '../../src/eccs';

import { getBytes } from '../../src/utils';

interface PointVec {
  encode: string;
  decode: string;
  x: number;
  y: number;
}

interface CurveData {
  name: string;
  "private-key-length": number;
  "private-key": string;
  uncompressed: { length: number; "public-key": string; point: PointVec };
  compressed:   { length: number; "public-key": string; point: PointVec };
}

const data = (eccs as Record<string, CurveData>)["SLIP10-Secp256k1"];
const skBytes    = getBytes(data["private-key"]);
const bytesUncmp = getBytes(data.uncompressed["public-key"]);
const bytesCcmp  = getBytes(data.compressed["public-key"]);
const encPoint   = getBytes(data.uncompressed.point.encode);

describe("SLIP10-Secp256k1 (elliptic) end-to-end", () => {
  it("curve name via instances", () => {
    const sk = SLIP10Secp256k1PrivateKey.fromBytes(skBytes);
    expect(sk.getName()).toBe(data.name);

    const p = SLIP10Secp256k1Point.fromBytes(encPoint);
    expect(p.getName()).toBe(data.name);

    const pk = SLIP10Secp256k1PublicKey.fromBytes(bytesUncmp);
    expect(pk.getName()).toBe(data.name);
  });

  it("accepts and normalizes an uncompressed key", () => {
    const uncmp = validateAndGetPublicKey(bytesUncmp, SLIP10Secp256k1PublicKey);
    expect(uncmp).toBeInstanceOf(SLIP10Secp256k1PublicKey);
    expect(uncmp.getRawUncompressed()).toEqual(bytesUncmp);
  });

  it("accepts and normalizes a compressed key", () => {
    const ccmp = validateAndGetPublicKey(bytesCcmp, SLIP10Secp256k1PublicKey);
    expect(ccmp).toBeInstanceOf(SLIP10Secp256k1PublicKey);
    expect(ccmp.getRawCompressed()).toEqual(bytesCcmp);
    expect(ccmp.getRawUncompressed()).toEqual(bytesUncmp);
  });

  for (const type of ["uncompressed", "compressed"] as const) {
    const vec = data[type].point;
    const enc = getBytes(vec.encode);
    const dec = getBytes(vec.decode);

    const basePoint = SLIP10Secp256k1Point.fromBytes(enc);
    const xs = basePoint.getX().toString();
    const ys = basePoint.getY().toString();

    describe(`Point (${type})`, () => {
      it("fromBytes()", () => {
        const p = SLIP10Secp256k1Point.fromBytes(enc);
        expect(p.getX().toString()).toBe(xs);
        expect(p.getY().toString()).toBe(ys);
        expect(p.getRawDecoded()).toEqual(dec);
        expect(p.getRawEncoded()).toEqual(enc);
      });

      it("fromCoordinates()", () => {
        const p = SLIP10Secp256k1Point.fromCoordinates(
          BigInt(xs),
          BigInt(ys)
        );
        expect(p.getX().toString()).toBe(xs);
        expect(p.getY().toString()).toBe(ys);
        expect(p.getRawDecoded()).toEqual(dec);
        expect(p.getRawEncoded()).toEqual(enc);
      });
    });

    describe(`PublicKey (${type})`, () => {
      const pkBytes = getBytes(data[type]["public-key"]);
      it("fromBytes()", () => {
        const pk = SLIP10Secp256k1PublicKey.fromBytes(pkBytes);
        expect(pk.getRawUncompressed()).toEqual(bytesUncmp);
        expect(pk.getRawCompressed()).toEqual(bytesCcmp);
        const pt = pk.getPoint();
        expect(pt.getX().toString()).toBe(xs);
        expect(pt.getY().toString()).toBe(ys);
      });
    });
  }

  describe("PrivateKey", () => {
    it("fromBytes() → raw & pubkey", () => {
      const sk = SLIP10Secp256k1PrivateKey.fromBytes(skBytes);
      expect(sk.getRaw()).toEqual(skBytes);
      const pk = sk.getPublicKey();
      expect(pk.getRawUncompressed()).toEqual(bytesUncmp);
      expect(pk.getRawCompressed()).toEqual(bytesCcmp);
    });
  });

  describe("Point arithmetic", () => {
    const G = SLIP10Secp256k1Point.fromBytes(encPoint);

    for (let n = 2; n < 50; n++) {
      it(`n=${n}`, () => {
        const prev = BigInt(n - 1);
        const cur  = BigInt(n);

        const a1 = G.add(G.multiply(prev));
        const a2 = G.multiply(prev).add(G);
        const m1 = G.multiply(cur);
        const m2 = G.multiply(cur);

        const expectedDecoded = m1.getRawDecoded();
        const expectedEncoded = m1.getRawEncoded();

        for (const q of [a1, a2, m1, m2]) {
          expect(q.getX().toString()).toBe(m1.getX().toString());
          expect(q.getY().toString()).toBe(m1.getY().toString());
          expect(q.getRawDecoded()).toEqual(expectedDecoded);
          expect(q.getRawEncoded()).toEqual(expectedEncoded);
        }
      });
    }
  });
});

describe("SLIP10-Secp256k1 (generic)", () => {
  const ecc = ECCS.getECCClass(SLIP10Secp256k1ECC.NAME);

  it("ECC.NAME matches concrete NAME", () => {
    expect(SLIP10Secp256k1ECC.NAME).toBe(data.name);
    expect(ecc.NAME).toBe(SLIP10Secp256k1ECC.NAME);
  });

  it("generic PRIVATE_KEY.fromBytes()", () => {
    const skConcrete = SLIP10Secp256k1PrivateKey.fromBytes(skBytes);
    const skGeneric  = ecc.PRIVATE_KEY.fromBytes(skBytes);
    expect(skGeneric).toBeInstanceOf(SLIP10Secp256k1PrivateKey);
    expect(skGeneric.getRaw()).toEqual(skBytes);
    expect(skGeneric.getRaw()).toEqual(skConcrete.getRaw());
  });

  it("generic POINT.fromBytes and .fromCoordinates", () => {
    const basePoint  = SLIP10Secp256k1Point.fromBytes(encPoint);
    const pGeneric1  = ecc.POINT.fromBytes(encPoint);
    const pGeneric2  = ecc.POINT.fromCoordinates(basePoint.getX(), basePoint.getY());
    expect(pGeneric1.getRawEncoded()).toEqual(encPoint);
    expect(pGeneric2.getRawDecoded()).toEqual(basePoint.getRawDecoded());
  });

  it("generic PUBLIC_KEY.fromBytes and .fromPoint", () => {
    const basePoint  = SLIP10Secp256k1Point.fromBytes(encPoint);
    const puGeneric1 = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
    const puGeneric2 = ecc.PUBLIC_KEY.fromPoint(basePoint);
    expect(puGeneric1.getRawUncompressed()).toEqual(bytesUncmp);
    expect(puGeneric2.getRawCompressed()).toEqual(bytesCcmp);
  });

  it("cross-route byte equality", () => {
    const skConc = SLIP10Secp256k1PrivateKey.fromBytes(skBytes);
    const skGen  = ecc.PRIVATE_KEY.fromBytes(skBytes);
    expect(skConc.getRaw()).toEqual(skGen.getRaw());

    const ptConc = SLIP10Secp256k1Point.fromBytes(encPoint);
    const ptGen  = ecc.POINT.fromBytes(encPoint);
    expect(ptConc.getRawDecoded()).toEqual(ptGen.getRawDecoded());

    const pkConc = SLIP10Secp256k1PublicKey.fromBytes(bytesUncmp);
    const pkGen  = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
    expect(pkConc.getRawCompressed()).toEqual(pkGen.getRawCompressed());
  });

  it("curve constants & classes", () => {
    expect(SLIP10Secp256k1ECC.NAME).toBe(data.name);
    expect(typeof SLIP10Secp256k1ECC.ORDER).toBe("bigint");
    expect(SLIP10Secp256k1ECC.GENERATOR).toBeInstanceOf(SLIP10Secp256k1Point);
    expect(SLIP10Secp256k1ECC.POINT).toBe(SLIP10Secp256k1Point);
    expect(SLIP10Secp256k1ECC.PUBLIC_KEY).toBe(SLIP10Secp256k1PublicKey);
    expect(SLIP10Secp256k1ECC.PRIVATE_KEY).toBe(SLIP10Secp256k1PrivateKey);
  });

  it("public key lengths", () => {
    expect(SLIP10Secp256k1PublicKey.getUncompressedLength())
      .toBe(data.uncompressed.length);
    expect(SLIP10Secp256k1PublicKey.getCompressedLength())
      .toBe(data.compressed.length);
  });

  it("private key length (via instance)", () => {
    const sk = SLIP10Secp256k1PrivateKey.fromBytes(skBytes);
    expect(sk.getRaw().length).toBe(data["private-key-length"]);
  });

});
