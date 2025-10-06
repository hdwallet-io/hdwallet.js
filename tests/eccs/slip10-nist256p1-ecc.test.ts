// SPDX-License-Identifier: MIT

import eccs from '../data/json/eccs.json';

import {
  ECCS,
  SLIP10Nist256p1ECC,
  SLIP10Nist256p1Point,
  SLIP10Nist256p1PublicKey,
  SLIP10Nist256p1PrivateKey
} from '../../src/eccs';

import { getBytes } from '../../src/utils';


interface PointVec { encode: string; decode: string; }
interface CurveData {
  name: string;
  "private-key-length": number;
  "private-key": string;
  uncompressed: { length: number; "public-key": string; point: PointVec };
  compressed:   { length: number; "public-key": string; point: PointVec };
}

const data = (eccs as Record<string, CurveData>)["SLIP10-Nist256p1"];
const skBytes    = getBytes(data["private-key"]);
const bytesUncmp = getBytes(data.uncompressed["public-key"]);
const bytesCcmp  = getBytes(data.compressed["public-key"]);
const encPoint   = getBytes(data.uncompressed.point.encode);

describe("SLIP10-Nist256p1 end-to-end", () => {
  it("instance .getName()", () => {
    const sk = SLIP10Nist256p1PrivateKey.fromBytes(getBytes(data["private-key"]));
    expect(sk.getName()).toBe(data.name);

    const pt = SLIP10Nist256p1Point.fromBytes(getBytes(data.uncompressed.point.encode));
    expect(pt.getName()).toBe(data.name);

    const pk = SLIP10Nist256p1PublicKey.fromBytes(getBytes(data.uncompressed["public-key"]));
    expect(pk.getName()).toBe(data.name);
  });

  describe("Base-point (generator) matches JSON", () => {
    const enc = getBytes(data.uncompressed.point.encode);
    const dec = getBytes(data.uncompressed.point.decode);

    const G1 = SLIP10Nist256p1Point.fromBytes(enc);
    const xs = G1.getX();
    const ys = G1.getY();

    it("fromBytes() → rawEncoded/rawDecoded", () => {
      expect(G1.getRawEncoded()).toEqual(enc);
      expect(G1.getRawDecoded()).toEqual(dec);
    });

    it("fromCoordinates(x,y) → rawEncoded/rawDecoded", () => {
      const G2 = SLIP10Nist256p1Point.fromCoordinates(xs, ys);
      expect(G2.getRawEncoded()).toEqual(enc);
      expect(G2.getRawDecoded()).toEqual(dec);
    });
  });

  for (const type of ["uncompressed", "compressed"] as const) {
    const vec = data[type].point;
    const enc = getBytes(vec.encode);
    const dec = getBytes(vec.decode);

    const baseP = SLIP10Nist256p1Point.fromBytes(enc);
    const xsStr = baseP.getX().toString();
    const ysStr = baseP.getY().toString();

    describe(`Point (${type})`, () => {
      it("fromBytes()", () => {
        const p = SLIP10Nist256p1Point.fromBytes(enc);
        expect(p.getX().toString()).toBe(xsStr);
        expect(p.getY().toString()).toBe(ysStr);
        expect(p.getRawDecoded()).toEqual(dec);
        expect(p.getRawEncoded()).toEqual(enc);
      });

      it("fromCoordinates()", () => {
        const p = SLIP10Nist256p1Point.fromCoordinates(
          BigInt(xsStr),
          BigInt(ysStr)
        );
        expect(p.getX().toString()).toBe(xsStr);
        expect(p.getY().toString()).toBe(ysStr);
        expect(p.getRawDecoded()).toEqual(dec);
        expect(p.getRawEncoded()).toEqual(enc);
      });
    });

    describe(`PublicKey (${type})`, () => {
      const pkBytes = getBytes(data[type]["public-key"]);
      it("fromBytes()", () => {
        const pk = SLIP10Nist256p1PublicKey.fromBytes(pkBytes);
        expect(pk.getRawUncompressed()).toEqual(
          getBytes(data.uncompressed["public-key"])
        );
        expect(pk.getRawCompressed()).toEqual(
          getBytes(data.compressed["public-key"])
        );

        const pt = pk.getPoint();
        expect(pt.getX().toString()).toBe(xsStr);
        expect(pt.getY().toString()).toBe(ysStr);
      });
    });
  }

  describe("PrivateKey", () => {
    it("fromBytes() → raw & pubkey", () => {
      const sk = SLIP10Nist256p1PrivateKey.fromBytes(getBytes(data["private-key"]));
      expect(sk.getRaw()).toEqual(getBytes(data["private-key"]));

      const pk = sk.getPublicKey();
      expect(pk.getRawUncompressed()).toEqual(
        getBytes(data.uncompressed["public-key"])
      );
      expect(pk.getRawCompressed()).toEqual(
        getBytes(data.compressed["public-key"])
      );
    });
  });

  describe("Point arithmetic", () => {
    const enc = getBytes(data.uncompressed.point.encode);
    const G   = SLIP10Nist256p1Point.fromBytes(enc);

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

  describe("SLIP10-Nist256p1 (generic)", () => {
    const ecc = ECCS.getECCClass(SLIP10Nist256p1ECC.NAME);

    it("ECC.NAME matches concrete NAME", () => {
      expect(SLIP10Nist256p1ECC.NAME).toBe(data.name);
      expect(ecc.NAME).toBe(SLIP10Nist256p1ECC.NAME);
    });

    it("generic PRIVATE_KEY.fromBytes()", () => {
      const skConcrete = SLIP10Nist256p1PrivateKey.fromBytes(skBytes);
      const skGeneric = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skGeneric).toBeInstanceOf(SLIP10Nist256p1PrivateKey);
      expect(skGeneric.getRaw()).toEqual(skBytes);
      expect(skGeneric.getRaw()).toEqual(skConcrete.getRaw());
    });

    it("generic POINT.fromBytes and .fromCoordinates", () => {
      const basePoint = SLIP10Nist256p1Point.fromBytes(encPoint);
      const pGeneric1 = ecc.POINT.fromBytes(encPoint);
      const pGeneric2 = ecc.POINT.fromCoordinates(basePoint.getX(), basePoint.getY());
      expect(pGeneric1.getRawEncoded()).toEqual(encPoint);
      expect(pGeneric2.getRawDecoded()).toEqual(basePoint.getRawDecoded());
    });

    it("generic PUBLIC_KEY.fromBytes and .fromPoint", () => {
      const basePoint = SLIP10Nist256p1Point.fromBytes(encPoint);
      const puGeneric1 = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      const puGeneric2 = ecc.PUBLIC_KEY.fromPoint(basePoint);
      expect(puGeneric1.getRawUncompressed()).toEqual(bytesUncmp);
      expect(puGeneric2.getRawCompressed()).toEqual(bytesCcmp);
    });

    it("cross-route byte equality", () => {
      const skConc = SLIP10Nist256p1PrivateKey.fromBytes(skBytes);
      const skGen = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skConc.getRaw()).toEqual(skGen.getRaw());

      const ptConc = SLIP10Nist256p1Point.fromBytes(encPoint);
      const ptGen = ecc.POINT.fromBytes(encPoint);
      expect(ptConc.getRawDecoded()).toEqual(ptGen.getRawDecoded());

      const pkConc = SLIP10Nist256p1PublicKey.fromBytes(bytesUncmp);
      const pkGen = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      expect(pkConc.getRawCompressed()).toEqual(pkGen.getRawCompressed());
    });

    it("curve constants & classes", () => {
      expect(SLIP10Nist256p1ECC.NAME).toBe(data.name);
      expect(typeof SLIP10Nist256p1ECC.ORDER).toBe("bigint");
      expect(SLIP10Nist256p1ECC.GENERATOR).toBeInstanceOf(SLIP10Nist256p1Point);
      expect(SLIP10Nist256p1ECC.POINT).toBe(SLIP10Nist256p1Point);
      expect(SLIP10Nist256p1ECC.PUBLIC_KEY).toBe(SLIP10Nist256p1PublicKey);
      expect(SLIP10Nist256p1ECC.PRIVATE_KEY).toBe(SLIP10Nist256p1PrivateKey);
    });

    it("public key lengths", () => {
      expect(SLIP10Nist256p1PublicKey.getUncompressedLength())
          .toBe(data.uncompressed.length);
      expect(SLIP10Nist256p1PublicKey.getCompressedLength())
          .toBe(data.compressed.length);
    });

    it("private key length (via instance)", () => {
      const sk = SLIP10Nist256p1PrivateKey.fromBytes(skBytes);
      expect(sk.getRaw().length).toBe(data["private-key-length"]);
    });

  });
});
