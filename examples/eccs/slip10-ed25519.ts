// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography,
  PrivateKey,
  PublicKey,
  Point,
  ECCS,
  validateAndGetPublicKey,
  SLIP10Ed25519ECC,
  SLIP10Ed25519Point,
  SLIP10Ed25519PublicKey,
  SLIP10Ed25519PrivateKey,
} from '../../src/eccs';
import { hexToBytes, bytesToString, isAllEqual } from '../../src/utils';

const ecc: typeof EllipticCurveCryptography = ECCS.getECCClass(SLIP10Ed25519ECC.NAME);

const data = {
  name: 'SLIP10-Ed25519',
  privateKey: hexToBytes('bb37794073e5094ebbfcfa070e9254fe6094b56e7cccb094a2304c5eccccdc07'),
  publicKey: {
    uncompressed: hexToBytes('00d14696583ee9144878635b557d515a502b04366818dfe7765737746b4f57978d'),
    compressed: hexToBytes('00d14696583ee9144878635b557d515a502b04366818dfe7765737746b4f57978d')
  },
  point: {
    raw: hexToBytes('d14696583ee9144878635b557d515a502b04366818dfe7765737746b4f57978d'),
    x: BigInt('35008547582340824597639173221735807482318787407965447203743372716499096148063'),
    y: BigInt('6147463531448180337884122237947428143499725886130497179241919515820002002641')
  }
}

const slip10Ed25519PrivateKey: PrivateKey = SLIP10Ed25519PrivateKey.fromBytes(data.privateKey);
const eccSLIP10Ed25519PrivateKey: PrivateKey = ecc.PRIVATE_KEY.fromBytes(data.privateKey);

console.log(
  'Private Key:',
  ecc.NAME === slip10Ed25519PrivateKey.getName(),
  slip10Ed25519PrivateKey instanceof SLIP10Ed25519PrivateKey,
  eccSLIP10Ed25519PrivateKey instanceof SLIP10Ed25519PrivateKey,
  isAllEqual(
    slip10Ed25519PrivateKey.getRaw(),
    eccSLIP10Ed25519PrivateKey.getRaw(),
    data.privateKey
  )
);

const rawSLIP10Ed25519Point: Point = SLIP10Ed25519Point.fromBytes(data.point.raw);
const coordinatesSLIP10Ed25519Point: Point = SLIP10Ed25519Point.fromCoordinates(data.point.x, data.point.y);

console.log(
  'Point:',
  rawSLIP10Ed25519Point instanceof SLIP10Ed25519Point,
  coordinatesSLIP10Ed25519Point instanceof SLIP10Ed25519Point,
  isAllEqual(
    rawSLIP10Ed25519Point.getRaw(),
    coordinatesSLIP10Ed25519Point .getRaw(),
    ecc.POINT.fromBytes(data.point.raw).getRaw(),
    ecc.POINT.fromCoordinates(data.point.x, data.point.y).getRaw(),
    data.point.raw
  )
);

const slip10Ed25519PublicKey: PublicKey = slip10Ed25519PrivateKey.getPublicKey();
const eccSLIP10Ed25519PublicKey: PublicKey = eccSLIP10Ed25519PrivateKey.getPublicKey();
const uncompressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.uncompressed, SLIP10Ed25519PublicKey);
const compressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.compressed, SLIP10Ed25519PublicKey);

console.log(
  '(Uncompressed) Public Key:',
  slip10Ed25519PublicKey instanceof SLIP10Ed25519PublicKey,
  eccSLIP10Ed25519PublicKey instanceof SLIP10Ed25519PublicKey,
  uncompressedPublicKey instanceof SLIP10Ed25519PublicKey,
  isAllEqual(
    uncompressedPublicKey.getRawUncompressed(),
    slip10Ed25519PublicKey.getRawUncompressed(),
    eccSLIP10Ed25519PublicKey.getRawUncompressed(),
    SLIP10Ed25519PublicKey.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    SLIP10Ed25519PublicKey.fromPoint(rawSLIP10Ed25519Point).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519Point).getRawUncompressed(),
    data.publicKey.uncompressed
  )
);

console.log(
  '(Compressed) Public Key:',
  slip10Ed25519PublicKey instanceof SLIP10Ed25519PublicKey,
  eccSLIP10Ed25519PublicKey instanceof SLIP10Ed25519PublicKey,
  compressedPublicKey instanceof SLIP10Ed25519PublicKey,
  isAllEqual(
    compressedPublicKey.getRawCompressed(),
    slip10Ed25519PublicKey.getRawCompressed(),
    eccSLIP10Ed25519PublicKey.getRawCompressed(),
    SLIP10Ed25519PublicKey.fromBytes(data.publicKey.compressed).getRawCompressed(),
    SLIP10Ed25519PublicKey.fromPoint(rawSLIP10Ed25519Point).getRawCompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.compressed).getRawCompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519Point).getRawCompressed(),
    data.publicKey.compressed
  )
);

console.log(
  'ECC:',
  isAllEqual(
    SLIP10Ed25519ECC.NAME,
    ecc.NAME,
    slip10Ed25519PrivateKey.getName(),
    eccSLIP10Ed25519PrivateKey.getName(),
    rawSLIP10Ed25519Point.getName(),
    coordinatesSLIP10Ed25519Point.getName(),
    slip10Ed25519PublicKey.getName(),
    eccSLIP10Ed25519PublicKey.getName(),
    data.name
  ), '\n'
);

console.log('Elliptic Curve Cryptography:', data.name);
console.log('Private Key:', bytesToString(data.privateKey));
console.log('Point:', bytesToString(data.point.raw));
console.log('    x:', data.point.x);
console.log('    y:', data.point.y);
console.log('(Uncompressed) Public Key:', bytesToString(data.publicKey.uncompressed));
console.log('(Compressed) Public Key:', bytesToString(data.publicKey.compressed));
