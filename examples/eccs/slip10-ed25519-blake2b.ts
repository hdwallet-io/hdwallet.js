// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography,
  PrivateKey,
  PublicKey,
  Point,
  ECCS,
  validateAndGetPublicKey,
  SLIP10Ed25519Blake2bECC,
  SLIP10Ed25519Blake2bPoint,
  SLIP10Ed25519Blake2bPublicKey,
  SLIP10Ed25519Blake2bPrivateKey,
} from '../../src/eccs';
import { hexToBytes, bytesToString, isAllEqual } from '../../src/utils';

const ecc: typeof EllipticCurveCryptography = ECCS.getECCClass(SLIP10Ed25519Blake2bECC.NAME);

const data = {
  name: 'SLIP10-Ed25519-Blake2b',
  privateKey: hexToBytes('bb37794073e5094ebbfcfa070e9254fe6094b56e7cccb094a2304c5eccccdc07'),
  publicKey: {
    uncompressed: hexToBytes('006aea61eeed872052377ab16b0fc5d9b9f142be59ac1488e6610645dedb4da45c'),
    compressed: hexToBytes('006aea61eeed872052377ab16b0fc5d9b9f142be59ac1488e6610645dedb4da45c')
  },
  point: {
    raw: hexToBytes('6aea61eeed872052377ab16b0fc5d9b9f142be59ac1488e6610645dedb4da45c'),
    x: BigInt('34526911383684683276858239193646482780856061288565130556349790613080323854020'),
    y: BigInt('41903082350388909699992468710774256578691651237567681160752376024200799971946')
  }
}

const slip10Ed25519Blake2bPrivateKey: PrivateKey = SLIP10Ed25519Blake2bPrivateKey.fromBytes(data.privateKey);
const eccSLIP10Ed25519Blake2bPrivateKey: PrivateKey = ecc.PRIVATE_KEY.fromBytes(data.privateKey);

console.log(
  'Private Key:',
  ecc.NAME === slip10Ed25519Blake2bPrivateKey.getName(),
  slip10Ed25519Blake2bPrivateKey instanceof SLIP10Ed25519Blake2bPrivateKey,
  eccSLIP10Ed25519Blake2bPrivateKey instanceof SLIP10Ed25519Blake2bPrivateKey,
  isAllEqual(
    slip10Ed25519Blake2bPrivateKey.getRaw(),
    eccSLIP10Ed25519Blake2bPrivateKey.getRaw(),
    data.privateKey
  )
);

const rawSLIP10Ed25519Blake2bPoint: Point = SLIP10Ed25519Blake2bPoint.fromBytes(data.point.raw);
const coordinatesSLIP10Ed25519Blake2bPoint: Point = SLIP10Ed25519Blake2bPoint.fromCoordinates(data.point.x, data.point.y);

console.log(
  'Point:',
  rawSLIP10Ed25519Blake2bPoint instanceof SLIP10Ed25519Blake2bPoint,
  coordinatesSLIP10Ed25519Blake2bPoint instanceof SLIP10Ed25519Blake2bPoint,
  isAllEqual(
    rawSLIP10Ed25519Blake2bPoint.getRaw(),
    coordinatesSLIP10Ed25519Blake2bPoint .getRaw(),
    ecc.POINT.fromBytes(data.point.raw).getRaw(),
    ecc.POINT.fromCoordinates(data.point.x, data.point.y).getRaw(),
    data.point.raw
  )
);

const slip10Ed25519Blake2bPublicKey: PublicKey = slip10Ed25519Blake2bPrivateKey.getPublicKey();
const eccSLIP10Ed25519Blake2bPublicKey: PublicKey = eccSLIP10Ed25519Blake2bPrivateKey.getPublicKey();
const uncompressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.uncompressed, SLIP10Ed25519Blake2bPublicKey);
const compressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.compressed, SLIP10Ed25519Blake2bPublicKey);

console.log(
  '(Uncompressed) Public Key:',
  slip10Ed25519Blake2bPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  eccSLIP10Ed25519Blake2bPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  uncompressedPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  isAllEqual(
    uncompressedPublicKey.getRawUncompressed(),
    slip10Ed25519Blake2bPublicKey.getRawUncompressed(),
    eccSLIP10Ed25519Blake2bPublicKey.getRawUncompressed(),
    SLIP10Ed25519Blake2bPublicKey.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    SLIP10Ed25519Blake2bPublicKey.fromPoint(rawSLIP10Ed25519Blake2bPoint).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519Blake2bPoint).getRawUncompressed(),
    data.publicKey.uncompressed
  )
);

console.log(
  '(Compressed) Public Key:',
  slip10Ed25519Blake2bPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  eccSLIP10Ed25519Blake2bPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  compressedPublicKey instanceof SLIP10Ed25519Blake2bPublicKey,
  isAllEqual(
    compressedPublicKey.getRawCompressed(),
    slip10Ed25519Blake2bPublicKey.getRawCompressed(),
    eccSLIP10Ed25519Blake2bPublicKey.getRawCompressed(),
    SLIP10Ed25519Blake2bPublicKey.fromBytes(data.publicKey.compressed).getRawCompressed(),
    SLIP10Ed25519Blake2bPublicKey.fromPoint(rawSLIP10Ed25519Blake2bPoint).getRawCompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.compressed).getRawCompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Ed25519Blake2bPoint).getRawCompressed(),
    data.publicKey.compressed
  )
);

console.log(
  'ECC:',
  isAllEqual(
    SLIP10Ed25519Blake2bECC.NAME,
    ecc.NAME,
    slip10Ed25519Blake2bPrivateKey.getName(),
    eccSLIP10Ed25519Blake2bPrivateKey.getName(),
    rawSLIP10Ed25519Blake2bPoint.getName(),
    coordinatesSLIP10Ed25519Blake2bPoint.getName(),
    slip10Ed25519Blake2bPublicKey.getName(),
    eccSLIP10Ed25519Blake2bPublicKey.getName(),
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
