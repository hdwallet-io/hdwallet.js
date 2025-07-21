// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography,
  PrivateKey,
  PublicKey,
  Point,
  ECCS,
  validateAndGetPublicKey,
  SLIP10Ed25519MoneroECC,
  SLIP10Ed25519MoneroPoint,
  SLIP10Ed25519MoneroPublicKey,
  SLIP10Ed25519MoneroPrivateKey,
} from '../../src/eccs';
import { hexToBytes, bytesToString, isAllEqual } from '../../src/utils';

const ecc: typeof EllipticCurveCryptography = ECCS.getECCClass(SLIP10Ed25519MoneroECC.NAME);

const data = {
  name: 'SLIP10-Ed25519-Monero',
  privateKey: hexToBytes('bb37794073e5094ebbfcfa070e9254fe6094b56e7cccb094a2304c5eccccdc07'),
  publicKey: {
    uncompressed: hexToBytes('628247d3de93857cdd360fee4aef9a67ecfebedfe8eaec9cf6be35eacc895ca7'),
    compressed: hexToBytes('628247d3de93857cdd360fee4aef9a67ecfebedfe8eaec9cf6be35eacc895ca7')
  },
  point: {
    raw: hexToBytes('628247d3de93857cdd360fee4aef9a67ecfebedfe8eaec9cf6be35eacc895ca7'),
    x: BigInt('29078407399097928298542937704975150613766572636435642857509307729044618011935'),
    y: BigInt('17803702088450816962920827141125906638766406094286540639665541388805331190370')
  }
}

const slip10Ed25519MoneroPrivateKey: PrivateKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(data.privateKey);
const eccSLIP10Ed25519MoneroPrivateKey: PrivateKey = ecc.PRIVATE_KEY.fromBytes(data.privateKey);

console.log(
  'Private Key:',
  ecc.NAME === slip10Ed25519MoneroPrivateKey.getName(),
  slip10Ed25519MoneroPrivateKey instanceof SLIP10Ed25519MoneroPrivateKey,
  eccSLIP10Ed25519MoneroPrivateKey instanceof SLIP10Ed25519MoneroPrivateKey,
  isAllEqual(
    slip10Ed25519MoneroPrivateKey.getRaw(),
    eccSLIP10Ed25519MoneroPrivateKey.getRaw(),
    data.privateKey
  )
);

const rawSLIP10Ed25519MoneroPoint: Point = SLIP10Ed25519MoneroPoint.fromBytes(data.point.raw);
const coordinatesSLIP10Ed25519MoneroPoint: Point = SLIP10Ed25519MoneroPoint.fromCoordinates(data.point.x, data.point.y);

console.log(
  'Point:',
  rawSLIP10Ed25519MoneroPoint instanceof SLIP10Ed25519MoneroPoint,
  coordinatesSLIP10Ed25519MoneroPoint instanceof SLIP10Ed25519MoneroPoint,
  isAllEqual(
    rawSLIP10Ed25519MoneroPoint.getRaw(),
    coordinatesSLIP10Ed25519MoneroPoint .getRaw(),
    ecc.POINT.fromBytes(data.point.raw).getRaw(),
    ecc.POINT.fromCoordinates(data.point.x, data.point.y).getRaw(),
    data.point.raw
  )
);

const slip10Ed25519MoneroPublicKey: PublicKey = slip10Ed25519MoneroPrivateKey.getPublicKey();
const eccSLIP10Ed25519MoneroPublicKey: PublicKey = eccSLIP10Ed25519MoneroPrivateKey.getPublicKey();
const uncompressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.uncompressed, SLIP10Ed25519MoneroPublicKey);
const compressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.compressed, SLIP10Ed25519MoneroPublicKey);

console.log(
  '(Uncompressed) Public Key:',
  slip10Ed25519MoneroPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  eccSLIP10Ed25519MoneroPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  uncompressedPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  isAllEqual(
    uncompressedPublicKey.getRawUncompressed(),
    slip10Ed25519MoneroPublicKey.getRawUncompressed(),
    eccSLIP10Ed25519MoneroPublicKey.getRawUncompressed(),
    SLIP10Ed25519MoneroPublicKey.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    SLIP10Ed25519MoneroPublicKey.fromPoint(rawSLIP10Ed25519MoneroPoint).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519MoneroPoint).getRawUncompressed(),
    data.publicKey.uncompressed
  )
);

console.log(
  '(Compressed) Public Key:',
  slip10Ed25519MoneroPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  eccSLIP10Ed25519MoneroPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  compressedPublicKey instanceof SLIP10Ed25519MoneroPublicKey,
  isAllEqual(
    compressedPublicKey.getRawCompressed(),
    slip10Ed25519MoneroPublicKey.getRawCompressed(),
    eccSLIP10Ed25519MoneroPublicKey.getRawCompressed(),
    SLIP10Ed25519MoneroPublicKey.fromBytes(data.publicKey.compressed).getRawCompressed(),
    SLIP10Ed25519MoneroPublicKey.fromPoint(rawSLIP10Ed25519MoneroPoint).getRawCompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.compressed).getRawCompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519MoneroPoint).getRawCompressed(),
    data.publicKey.compressed
  )
);

console.log(
  'ECC:',
  isAllEqual(
    SLIP10Ed25519MoneroECC.NAME,
    ecc.NAME,
    slip10Ed25519MoneroPrivateKey.getName(),
    eccSLIP10Ed25519MoneroPrivateKey.getName(),
    rawSLIP10Ed25519MoneroPoint.getName(),
    coordinatesSLIP10Ed25519MoneroPoint.getName(),
    slip10Ed25519MoneroPublicKey.getName(),
    eccSLIP10Ed25519MoneroPublicKey.getName(),
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
