// SPDX-License-Identifier: MIT

import eccs from '../data/json/eccs.json';

import { ECCS } from '../../src/eccs'

import {
  SLIP10Ed25519Point,
  SLIP10Ed25519Blake2bECC,
  SLIP10Ed25519Blake2bPoint,
  SLIP10Ed25519Blake2bPublicKey,
  SLIP10Ed25519Blake2bPrivateKey
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

const data = (eccs as Record<string, CurveData>)["SLIP10-Ed25519-Blake2b"];
const skBytes    = getBytes(data["private-key"]);
const bytesUncmp = getBytes(data.uncompressed["public-key"]);
const bytesCcmp  = getBytes(data.compressed["public-key"]);
const encPoint   = getBytes(data.uncompressed.point.encode);

describe("SLIP10-Ed25519-Blake2b (tweetnacl) end-to-end", () => {
  it("curve name via instances", () => {
    const sk = SLIP10Ed25519Blake2bPrivateKey.fromBytes(
      getBytes(data["private-key"])
    );
    expect(sk.getName()).toBe(data.name);

    const baseEnc = getBytes(data.uncompressed.point.encode);
    const pt      = SLIP10Ed25519Blake2bPoint.fromBytes(baseEnc);
    expect(pt.getName()).toBe(data.name);

    const pkEnc   = getBytes(data.uncompressed["public-key"]);
    const pk      = SLIP10Ed25519Blake2bPublicKey.fromBytes(pkEnc);
    expect(pk.getName()).toBe(data.name);
  });

  for (const type of ["uncompressed", "compressed"] as const) {
    const { encode } = data[type].point;
    const enc        = getBytes(encode);

    const canonical = SLIP10Ed25519Blake2bPoint.fromBytes(enc);
    const xs        = canonical.getX();
    const ys        = canonical.getY();
    const expEnc    = canonical.getRawEncoded();
    const expDec    = canonical.getRawDecoded();

    it(`Point.fromBytes() (${type})`, () => {
      const p = SLIP10Ed25519Blake2bPoint.fromBytes(enc);
      expect(p.getName()).toBe(data.name);
      expect(p.getX()).toBe(xs);
      expect(p.getY()).toBe(ys);
      expect(p.getRawEncoded()).toEqual(expEnc);
      expect(p.getRawDecoded()).toEqual(expDec);
    });

    it(`Point.fromCoordinates() (${type})`, () => {
      const p = SLIP10Ed25519Blake2bPoint.fromCoordinates(xs, ys);
      expect(p.getName()).toBe(data.name);
      expect(p.getX()).toBe(xs);
      expect(p.getY()).toBe(ys);
      expect(p.getRawEncoded()).toEqual(expEnc);
      expect(p.getRawDecoded()).toEqual(expDec);
    });
  }

  it("scalar arithmetic on base-point", () => {
    const enc = getBytes(data.uncompressed.point.encode);
    const G   = SLIP10Ed25519Blake2bPoint.fromBytes(enc);

    for (let n = 2; n < 50; n++) {
      const prev = BigInt(n - 1), cur = BigInt(n);
      const a1   = G.add(G.multiply(prev));
      const a2   = G.multiply(prev).add(G);
      const m1   = G.multiply(cur);
      const m2   = G.multiply(cur);

      const expEnc = m1.getRawEncoded();
      const expDec = m1.getRawDecoded();

      for (const q of [a1, a2, m1, m2]) {
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
      const pk = SLIP10Ed25519Blake2bPublicKey.fromBytes(pkBytes);
      expect(pk.getName()).toBe(data.name);
      expect(pk.getRawUncompressed()).toEqual(
        getBytes(data.uncompressed["public-key"])
      );
      expect(pk.getRawCompressed()).toEqual(
        getBytes(data.compressed["public-key"])
      );

      const pt = pk.getPoint();
      const base = SLIP10Ed25519Blake2bPoint.fromBytes(
        getBytes(data.uncompressed.point.encode)
      );
      expect(pt.getX()).toBe(base.getX());
      expect(pt.getY()).toBe(base.getY());
    });
  }

  it("PrivateKey.fromBytes() → raw & publicKey", () => {
    const sk = SLIP10Ed25519Blake2bPrivateKey.fromBytes(
      getBytes(data["private-key"])
    );
    expect(sk.getName()).toBe(data.name);
    expect(sk.getRaw()).toEqual(getBytes(data["private-key"]));

    const pk = sk.getPublicKey();
    expect(pk.getName()).toBe(data.name);
    expect(pk.getRawUncompressed()).toEqual(
      getBytes(data.uncompressed["public-key"])
    );
    expect(pk.getRawCompressed()).toEqual(
      getBytes(data.compressed["public-key"])
    );
  });
  
    describe("SLIP10-Ed25519-Blake2b (generic)", () => {
    const ecc = ECCS.getECCClass(SLIP10Ed25519Blake2bECC.NAME);

    it("ECC.NAME matches concrete NAME", () => {
      expect(SLIP10Ed25519Blake2bECC.NAME).toBe(data.name);
      expect(ecc.NAME).toBe(SLIP10Ed25519Blake2bECC.NAME);
    });

    it("generic PRIVATE_KEY.fromBytes()", () => {
      const skConcrete = SLIP10Ed25519Blake2bPrivateKey.fromBytes(skBytes);
      const skGeneric = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skGeneric).toBeInstanceOf(SLIP10Ed25519Blake2bPrivateKey);
      expect(skGeneric.getRaw()).toEqual(skBytes);
      expect(skGeneric.getRaw()).toEqual(skConcrete.getRaw());
    });

    it("generic POINT.fromBytes and .fromCoordinates", () => {
      const basePoint = SLIP10Ed25519Blake2bPoint.fromBytes(encPoint);
      const pGeneric1 = ecc.POINT.fromBytes(encPoint);
      const pGeneric2 = ecc.POINT.fromCoordinates(basePoint.getX(), basePoint.getY());
      expect(pGeneric1.getRawEncoded()).toEqual(encPoint);
      expect(pGeneric2.getRawDecoded()).toEqual(basePoint.getRawDecoded());
    });

    it("generic PUBLIC_KEY.fromBytes and .fromPoint", () => {
      const basePoint = SLIP10Ed25519Blake2bPoint.fromBytes(encPoint);
      const puGeneric1 = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      const puGeneric2 = ecc.PUBLIC_KEY.fromPoint(basePoint);
      expect(puGeneric1.getRawUncompressed()).toEqual(bytesUncmp);
      expect(puGeneric2.getRawCompressed()).toEqual(bytesCcmp);
    });

    it("cross-route byte equality", () => {
      const skConc = SLIP10Ed25519Blake2bPrivateKey.fromBytes(skBytes);
      const skGen = ecc.PRIVATE_KEY.fromBytes(skBytes);
      expect(skConc.getRaw()).toEqual(skGen.getRaw());

      const ptConc = SLIP10Ed25519Blake2bPoint.fromBytes(encPoint);
      const ptGen = ecc.POINT.fromBytes(encPoint);
      expect(ptConc.getRawDecoded()).toEqual(ptGen.getRawDecoded());

      const pkConc = SLIP10Ed25519Blake2bPublicKey.fromBytes(bytesUncmp);
      const pkGen = ecc.PUBLIC_KEY.fromBytes(bytesUncmp);
      expect(pkConc.getRawCompressed()).toEqual(pkGen.getRawCompressed());
    });

    it("curve constants & classes", () => {
      expect(SLIP10Ed25519Blake2bECC.NAME).toBe(data.name);
      expect(typeof SLIP10Ed25519Blake2bECC.ORDER).toBe("bigint");
      expect(SLIP10Ed25519Blake2bECC.GENERATOR).toBeInstanceOf(SLIP10Ed25519Point);
      expect(SLIP10Ed25519Blake2bECC.POINT).toBe(SLIP10Ed25519Blake2bPoint);
      expect(SLIP10Ed25519Blake2bECC.PUBLIC_KEY).toBe(SLIP10Ed25519Blake2bPublicKey);
      expect(SLIP10Ed25519Blake2bECC.PRIVATE_KEY).toBe(SLIP10Ed25519Blake2bPrivateKey);
    });

    it("public key lengths", () => {
      expect(SLIP10Ed25519Blake2bPublicKey.getUncompressedLength())
          .toBe(data.uncompressed.length);
      expect(SLIP10Ed25519Blake2bPublicKey.getCompressedLength())
          .toBe(data.compressed.length);
    });

    it("private key length (via instance)", () => {
      const sk = SLIP10Ed25519Blake2bPrivateKey.fromBytes(skBytes);
      expect(sk.getRaw().length).toBe(data["private-key-length"]);
    });

  });
});
