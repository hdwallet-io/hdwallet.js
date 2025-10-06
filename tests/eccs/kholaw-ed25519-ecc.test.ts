// SPDX-License-Identifier: MIT

import eccs from '../data/json/eccs.json';


import {
  ECCS,
  Point,
  KholawEd25519ECC,
  KholawEd25519Point,
  KholawEd25519PublicKey,
  KholawEd25519PrivateKey
} from '../../src/eccs';

import { getBytes } from '../../src/utils';


interface PointVec { encode: string; x: number; y: number }
interface CurveData {
  name: string;
  "private-key-length": number;
  "private-key": string;
  uncompressed: { length: number; "public-key": string; point: PointVec };
  compressed:   { length: number; "public-key": string; point: PointVec };
}

const data = (eccs as Record<string, CurveData>)["Kholaw-Ed25519"];
const skBytes    = getBytes(data["private-key"]);
const bytesUncmp = getBytes(data.uncompressed["public-key"]);
const bytesCcmp  = getBytes(data.compressed["public-key"]);
const encPoint   = getBytes(data.uncompressed.point.encode);

describe("Kholaw-Ed25519 end-to-end", () => {
  it("curve-name via getName()", () => {
    const sk = KholawEd25519PrivateKey.fromBytes(getBytes(data["private-key"]));
    expect(sk.getName()).toBe(data.name);

    const baseEnc = getBytes(data.uncompressed.point.encode);
    expect(KholawEd25519Point.fromBytes(baseEnc).getName()).toBe(data.name);

    expect(
      KholawEd25519PublicKey.fromBytes(getBytes(data.uncompressed["public-key"])).getName()
    ).toBe(data.name);
  });


  for (const type of ["uncompressed", "compressed"] as const) {
    const enc = getBytes(data[type].point.encode);

    const canonical = KholawEd25519Point.fromBytes(enc);
    const xs        = canonical.getX();
    const ys        = canonical.getY();
    const expEnc    = canonical.getRawEncoded();
    const expDec    = canonical.getRawDecoded();

    it(`Point.fromBytes() (${type})`, () => {
      const p = KholawEd25519Point.fromBytes(enc);
      expect(p.getX()).toBe(xs);
      expect(p.getY()).toBe(ys);
      expect(p.getRawEncoded()).toEqual(expEnc);
      expect(p.getRawDecoded()).toEqual(expDec);
    });

    it(`Point.fromCoordinates() (${type})`, () => {
      const p = KholawEd25519Point.fromCoordinates(xs, ys);
      expect(p.getX()).toBe(xs);
      expect(p.getY()).toBe(ys);
      expect(p.getRawEncoded()).toEqual(expEnc);
      expect(p.getRawDecoded()).toEqual(expDec);
    });
  }

  it("scalar arithmetic on the base-point", () => {
    const enc = getBytes(data.uncompressed.point.encode);
    const G   = KholawEd25519Point.fromBytes(enc);

    for (let n = 2; n < 50; n++) {
      const prev = BigInt(n - 1);
      const cur  = BigInt(n);

      const m1 = G.multiply(cur);
      const expEnc = m1.getRawEncoded();
      const expDec = m1.getRawDecoded();

      for (const q of [
        G.add(G.multiply(prev)),
        G.multiply(prev).add(G),
        m1,
        G.multiply(cur)
      ]) {
        expect(q.getX()).toBe(m1.getX());
        expect(q.getY()).toBe(m1.getY());
        expect(q.getRawEncoded()).toEqual(expEnc);
        expect(q.getRawDecoded()).toEqual(expDec);
      }
    }
  });

  for (const type of ["uncompressed", "compressed"] as const) {
    const pkBytes = getBytes(data[type]["public-key"]);
    it(`PublicKey.fromBytes() (${type})`, () => {
      const pk = KholawEd25519PublicKey.fromBytes(pkBytes);
      expect(pk.getRawUncompressed()).toEqual(
        getBytes(data.uncompressed["public-key"])
      );
      expect(pk.getRawCompressed()).toEqual(
        getBytes(data.compressed["public-key"])
      );

      const pt2 = pk.getPoint();
      const base = KholawEd25519Point.fromBytes(
        getBytes(data.uncompressed.point.encode)
      );
      expect(pt2.getX()).toBe(base.getX());
      expect(pt2.getY()).toBe(base.getY());
    });
  }

  it("PrivateKey.fromBytes() → raw & publicKey", () => {
    const sk = KholawEd25519PrivateKey.fromBytes(
      getBytes(data["private-key"])
    );
    expect(sk.getRaw()).toEqual(getBytes(data["private-key"]));

    const pk = sk.getPublicKey();
    expect(pk.getRawUncompressed()).toEqual(
      getBytes(data.uncompressed["public-key"])
    );
    expect(pk.getRawCompressed()).toEqual(
      getBytes(data.compressed["public-key"])
    );
  });


    describe("Kholaw-Ed25519 (generic)", () => {
    const ecc = ECCS.getECCClass(KholawEd25519ECC.NAME);

    it("ECC.NAME matches concrete NAME", () => {
      expect(KholawEd25519ECC.NAME).toBe(data.name);
      expect(ecc.NAME).toBe(KholawEd25519ECC.NAME);
    });

    it("generic PRIVATE_KEY.fromBytes()", () => {
      const skConcrete = KholawEd25519PrivateKey.fromBytes(skBytes);
      const skGeneric = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skGeneric).toBeInstanceOf(KholawEd25519PrivateKey);
      expect(skGeneric.getRaw()).toEqual(skBytes);
      expect(skGeneric.getRaw()).toEqual(skConcrete.getRaw());
    });

    it("generic POINT.fromBytes and .fromCoordinates", () => {
      const basePoint = KholawEd25519Point.fromBytes(encPoint);
      const pGeneric1 = ecc.POINT.fromBytes(encPoint);
      const pGeneric2 = ecc.POINT.fromCoordinates(basePoint.getX(), basePoint.getY());
      expect(pGeneric1.getRawEncoded()).toEqual(encPoint);
      expect(pGeneric2.getRawDecoded()).toEqual(basePoint.getRawDecoded());
    });

    it("generic PUBLIC_KEY.fromBytes and .fromPoint", () => {
      const basePoint = KholawEd25519Point.fromBytes(encPoint);
      const puGeneric1 = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      const puGeneric2 = ecc.PUBLIC_KEY.fromPoint(basePoint);
      expect(puGeneric1.getRawUncompressed()).toEqual(bytesUncmp);
      expect(puGeneric2.getRawCompressed()).toEqual(bytesCcmp);
    });

    it("cross-route byte equality", () => {
      const skConc = KholawEd25519PrivateKey.fromBytes(skBytes);
      const skGen = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skConc.getRaw()).toEqual(skGen.getRaw());

      const ptConc = KholawEd25519Point.fromBytes(encPoint);
      const ptGen = ecc.POINT.fromBytes(encPoint);
      expect(ptConc.getRawDecoded()).toEqual(ptGen.getRawDecoded());

      const pkConc = KholawEd25519PublicKey.fromBytes(bytesUncmp);
      const pkGen = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      expect(pkConc.getRawCompressed()).toEqual(pkGen.getRawCompressed());
    });

    it("curve constants & classes", () => {
      console.log(KholawEd25519ECC.NAME)
      expect(KholawEd25519ECC.NAME).toBe(data.name);
      expect(typeof KholawEd25519ECC.ORDER).toBe("bigint");
      expect(KholawEd25519ECC.GENERATOR).toBeInstanceOf(Point);
      expect(KholawEd25519ECC.POINT).toBe(KholawEd25519Point);
      expect(KholawEd25519ECC.PUBLIC_KEY).toBe(KholawEd25519PublicKey);
      expect(KholawEd25519ECC.PRIVATE_KEY).toBe(KholawEd25519PrivateKey);
    });

    it("public key lengths", () => {
      expect(KholawEd25519PublicKey.getUncompressedLength())
          .toBe(data.uncompressed.length);
      expect(KholawEd25519PublicKey.getCompressedLength())
          .toBe(data.compressed.length);
    });

    it("private key length (via instance)", () => {
      const sk = KholawEd25519PrivateKey.fromBytes(skBytes);
      expect(sk.getRaw().length).toBe(data["private-key-length"]);
    });

  });
});
