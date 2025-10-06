// SPDX-License-Identifier: MIT

import eccs from '../data/json/eccs.json';


import {
  ECCS,
  SLIP10Ed25519Point,
  SLIP10Ed25519MoneroECC,
  SLIP10Ed25519MoneroPoint,
  SLIP10Ed25519MoneroPublicKey,
  SLIP10Ed25519MoneroPrivateKey
} from '../../src/eccs';

import { getBytes } from '../../src/utils';


interface PointVec { encode: string; decode: string; x: number; y: number }
interface CurveData {
  name: string;
  "private-key-length": number;
  "private-key": string;
  uncompressed: { length: number; "public-key": string; point: PointVec };
  compressed:   { length: number; "public-key": string; point: PointVec };
}

const data = (eccs as Record<string, CurveData>)["SLIP10-Ed25519-Monero"];
const skBytes    = getBytes(data["private-key"]);
const bytesUncmp = getBytes(data.uncompressed["public-key"]);
const bytesCcmp  = getBytes(data.compressed["public-key"]);
const encPoint   = getBytes(data.uncompressed.point.encode);

describe("SLIP10-Ed25519-Monero (tweetnacl) end-to-end", () => {
  it("instance .getName()", () => {
    const sk = SLIP10Ed25519MoneroPrivateKey.fromBytes(
      getBytes(data["private-key"])
    );
    expect(sk.getName()).toBe(data.name);

    const pt = SLIP10Ed25519MoneroPoint.fromBytes(
      getBytes(data.uncompressed.point.encode)
    );
    expect(pt.getName()).toBe(data.name);

    const pk = SLIP10Ed25519MoneroPublicKey.fromBytes(
      getBytes(data.uncompressed["public-key"])
    );
    expect(pk.getName()).toBe(data.name);
  });

  for (const type of ["uncompressed", "compressed"] as const) {
    const vec = data[type].point;
    const enc = getBytes(vec.encode);

    const canonical = SLIP10Ed25519MoneroPoint.fromBytes(enc);
    const expectedEncoded = canonical.getRawEncoded();
    const expectedDecoded = canonical.getRawDecoded();
    const xs = canonical.getX();
    const ys = canonical.getY();

    describe(`Point (${type})`, () => {
      it("fromBytes()", () => {
        const p = SLIP10Ed25519MoneroPoint.fromBytes(enc);
        expect(p.getX()).toBe(xs);
        expect(p.getY()).toBe(ys);
        expect(p.getRawEncoded()).toEqual(expectedEncoded);
        expect(p.getRawDecoded()).toEqual(expectedDecoded);
      });

      it("fromCoordinates()", () => {
        const p = SLIP10Ed25519MoneroPoint.fromCoordinates(xs, ys);
        expect(p.getX()).toBe(xs);
        expect(p.getY()).toBe(ys);
        expect(p.getRawEncoded()).toEqual(expectedEncoded);
        expect(p.getRawDecoded()).toEqual(expectedDecoded);
      });
    });

    describe(`PublicKey (${type})`, () => {
      const pkBytes = getBytes(data[type]["public-key"]);
      it("fromBytes()", () => {
        const pk = SLIP10Ed25519MoneroPublicKey.fromBytes(pkBytes);
        expect(pk.getRawUncompressed()).toEqual(
          getBytes(data.uncompressed["public-key"])
        );
        expect(pk.getRawCompressed()).toEqual(
          getBytes(data.compressed["public-key"])
        );

        const pt2 = pk.getPoint();
        expect(pt2.getX()).toBe(xs);
        expect(pt2.getY()).toBe(ys);
      });
    });
  }

  describe("PrivateKey", () => {
    it("fromBytes() → raw & pubkey", () => {
      const sk = SLIP10Ed25519MoneroPrivateKey.fromBytes(
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
  });

  describe("Point arithmetic", () => {
    const enc = getBytes(data.uncompressed.point.encode);
    const G   = SLIP10Ed25519MoneroPoint.fromBytes(enc);

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
          expect(q.getX()).toBe(m1.getX());
          expect(q.getY()).toBe(m1.getY());
          expect(q.getRawEncoded()).toEqual(expectedEncoded);
          expect(q.getRawDecoded()).toEqual(expectedDecoded);
        }
      });
    }
  });
  
  describe("SLIP10-Ed25519-Monero (generic)", () => {
    const ecc = ECCS.getECCClass(SLIP10Ed25519MoneroECC.NAME);

    it("ECC.NAME matches concrete NAME", () => {
      expect(SLIP10Ed25519MoneroECC.NAME).toBe(data.name);
      expect(ecc.NAME).toBe(SLIP10Ed25519MoneroECC.NAME);
    });

    it("generic PRIVATE_KEY.fromBytes()", () => {
      const skConcrete = SLIP10Ed25519MoneroPrivateKey.fromBytes(skBytes);
      const skGeneric = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skGeneric).toBeInstanceOf(SLIP10Ed25519MoneroPrivateKey);
      expect(skGeneric.getRaw()).toEqual(skBytes);
      expect(skGeneric.getRaw()).toEqual(skConcrete.getRaw());
    });

    it("generic POINT.fromBytes and .fromCoordinates", () => {
      const basePoint = SLIP10Ed25519MoneroPoint.fromBytes(encPoint);
      const pGeneric1 = ecc.POINT.fromBytes(encPoint);
      const pGeneric2 = ecc.POINT.fromCoordinates(basePoint.getX(), basePoint.getY());
      expect(pGeneric1.getRawEncoded()).toEqual(encPoint);
      expect(pGeneric2.getRawDecoded()).toEqual(basePoint.getRawDecoded());
    });

    it("generic PUBLIC_KEY.fromBytes and .fromPoint", () => {
      const basePoint = SLIP10Ed25519MoneroPoint.fromBytes(encPoint);
      const puGeneric1 = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      const puGeneric2 = ecc.PUBLIC_KEY.fromPoint(basePoint);
      expect(puGeneric1.getRawUncompressed()).toEqual(bytesUncmp);
      expect(puGeneric2.getRawCompressed()).toEqual(bytesCcmp);
    });

    it("cross-route byte equality", () => {
      const skConc = SLIP10Ed25519MoneroPrivateKey.fromBytes(skBytes);
      const skGen = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skConc.getRaw()).toEqual(skGen.getRaw());

      const ptConc = SLIP10Ed25519MoneroPoint.fromBytes(encPoint);
      const ptGen = ecc.POINT.fromBytes(encPoint);
      expect(ptConc.getRawDecoded()).toEqual(ptGen.getRawDecoded());

      const pkConc = SLIP10Ed25519MoneroPublicKey.fromBytes(bytesUncmp);
      const pkGen = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      expect(pkConc.getRawCompressed()).toEqual(pkGen.getRawCompressed());
    });

    it("curve constants & classes", () => {
      expect(SLIP10Ed25519MoneroECC.NAME).toBe(data.name);
      expect(typeof SLIP10Ed25519MoneroECC.ORDER).toBe("bigint");
      expect(SLIP10Ed25519MoneroECC.GENERATOR).toBeInstanceOf(SLIP10Ed25519Point);
      expect(SLIP10Ed25519MoneroECC.POINT).toBe(SLIP10Ed25519MoneroPoint);
      expect(SLIP10Ed25519MoneroECC.PUBLIC_KEY).toBe(SLIP10Ed25519MoneroPublicKey);
      expect(SLIP10Ed25519MoneroECC.PRIVATE_KEY).toBe(SLIP10Ed25519MoneroPrivateKey);
    });

    it("public key lengths", () => {
      expect(SLIP10Ed25519MoneroPublicKey.getCompressedLength())
          .toBe(data.compressed.length);
      expect(SLIP10Ed25519MoneroPublicKey.getUncompressedLength())
          .toBe(data.uncompressed.length);
    });

    it("private key length (via instance)", () => {
      const sk = SLIP10Ed25519MoneroPrivateKey.fromBytes(skBytes);
      expect(sk.getRaw().length).toBe(data["private-key-length"]);
    });

  });
});
