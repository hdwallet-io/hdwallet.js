// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography,
  PrivateKey,
  PublicKey,
  Point,
  ECCS,
  validateAndGetPublicKey,
  SLIP10Nist256p1ECC,
  SLIP10Nist256p1Point,
  SLIP10Nist256p1PublicKey,
  SLIP10Nist256p1PrivateKey,
} from '../../src/eccs';
import { hexToBytes, bytesToString, isAllEqual } from '../../src/utils';

const ecc: typeof EllipticCurveCryptography = ECCS.getECCClass(SLIP10Nist256p1ECC.NAME);

const data = {
  name: 'SLIP10-Nist256p1',
  privateKey: hexToBytes('f79495fda777197ce73551bcd8e162ceca19167575760d3cc2bced4bf2a213dc'),
  publicKey: {
    uncompressed: hexToBytes('04e4bd97a82a8f3e575a9a35b7cca19cd730addd499a2bd4e9a9811df8bfc35e51c68c3bed41d47d4d05ae880250e4432cc6480b417597f1cffc5ed7d28991d164'),
    compressed: hexToBytes('02e4bd97a82a8f3e575a9a35b7cca19cd730addd499a2bd4e9a9811df8bfc35e51')
  },
  point: {
    raw: hexToBytes('02e4bd97a82a8f3e575a9a35b7cca19cd730addd499a2bd4e9a9811df8bfc35e51'),
    x: BigInt('103462310269679299860340333843259692621316029910306332627414876684344367472209'),
    y: BigInt('89805716208030251512750858827899264938076397422929928838175186998853100491108')
  }
}

const slip10Nist256p1PrivateKey: PrivateKey = SLIP10Nist256p1PrivateKey.fromBytes(data.privateKey);
const eccSLIP10Nist256p1PrivateKey: PrivateKey = ecc.PRIVATE_KEY.fromBytes(data.privateKey);

console.log(
  'Private Key:',
  ecc.NAME === slip10Nist256p1PrivateKey.getName(),
  slip10Nist256p1PrivateKey instanceof SLIP10Nist256p1PrivateKey,
  eccSLIP10Nist256p1PrivateKey instanceof SLIP10Nist256p1PrivateKey,
  isAllEqual(
    slip10Nist256p1PrivateKey.getRaw(),
    eccSLIP10Nist256p1PrivateKey.getRaw(),
    data.privateKey
  )
);

const rawSLIP10Nist256p1Point: Point = SLIP10Nist256p1Point.fromBytes(data.point.raw);
const coordinatesSLIP10Nist256p1Point: Point = SLIP10Nist256p1Point.fromCoordinates(data.point.x, data.point.y);

console.log(
  'Point:',
  rawSLIP10Nist256p1Point instanceof SLIP10Nist256p1Point,
  coordinatesSLIP10Nist256p1Point instanceof SLIP10Nist256p1Point,
  isAllEqual(
    rawSLIP10Nist256p1Point.getRaw(),
    coordinatesSLIP10Nist256p1Point .getRaw(),
    ecc.POINT.fromBytes(data.point.raw).getRaw(),
    ecc.POINT.fromCoordinates(data.point.x, data.point.y).getRaw(),
    data.point.raw
  )
);

const slip10Nist256p1PublicKey: PublicKey = slip10Nist256p1PrivateKey.getPublicKey();
const eccSLIP10Nist256p1PublicKey: PublicKey = eccSLIP10Nist256p1PrivateKey.getPublicKey();
const uncompressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.uncompressed, SLIP10Nist256p1PublicKey);
const compressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.compressed, SLIP10Nist256p1PublicKey);

console.log(
  '(Uncompressed) Public Key:',
  slip10Nist256p1PublicKey instanceof SLIP10Nist256p1PublicKey,
  eccSLIP10Nist256p1PublicKey instanceof SLIP10Nist256p1PublicKey,
  uncompressedPublicKey instanceof SLIP10Nist256p1PublicKey,
  isAllEqual(
    uncompressedPublicKey.getRawUncompressed(),
    slip10Nist256p1PublicKey.getRawUncompressed(),
    eccSLIP10Nist256p1PublicKey.getRawUncompressed(),
    SLIP10Nist256p1PublicKey.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    SLIP10Nist256p1PublicKey.fromPoint(rawSLIP10Nist256p1Point).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Nist256p1Point).getRawUncompressed(),
    data.publicKey.uncompressed
  )
);

console.log(
  '(Compressed) Public Key:',
  slip10Nist256p1PublicKey instanceof SLIP10Nist256p1PublicKey,
  eccSLIP10Nist256p1PublicKey instanceof SLIP10Nist256p1PublicKey,
  compressedPublicKey instanceof SLIP10Nist256p1PublicKey,
  isAllEqual(
    compressedPublicKey.getRawCompressed(),
    slip10Nist256p1PublicKey.getRawCompressed(),
    eccSLIP10Nist256p1PublicKey.getRawCompressed(),
    SLIP10Nist256p1PublicKey.fromBytes(data.publicKey.compressed).getRawCompressed(),
    SLIP10Nist256p1PublicKey.fromPoint(rawSLIP10Nist256p1Point).getRawCompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.compressed).getRawCompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesSLIP10Nist256p1Point).getRawCompressed(),
    data.publicKey.compressed
  )
);

console.log(
  'ECC:',
  isAllEqual(
    SLIP10Nist256p1ECC.NAME,
    ecc.NAME,
    slip10Nist256p1PrivateKey.getName(),
    eccSLIP10Nist256p1PrivateKey.getName(),
    rawSLIP10Nist256p1Point.getName(),
    coordinatesSLIP10Nist256p1Point.getName(),
    slip10Nist256p1PublicKey.getName(),
    eccSLIP10Nist256p1PublicKey.getName(),
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
