// SPDX-License-Identifier: MIT

import {
  EllipticCurveCryptography,
  PrivateKey,
  PublicKey,
  Point,
  ECCS,
  validateAndGetPublicKey,
  KholawEd25519ECC,
  KholawEd25519Point,
  KholawEd25519PublicKey,
  KholawEd25519PrivateKey,
} from '../../src/eccs';
import { hexToBytes, bytesToString, isAllEqual } from '../../src/utils';

const ecc: typeof EllipticCurveCryptography = ECCS.getECCClass(KholawEd25519ECC.NAME);

const data = {
  name: 'Kholaw-Ed25519',
  privateKey: hexToBytes('8061879a8fc9e7c685cb89b7014c85a6c4a2a8f3b6fa4964381d0751baf8fb5ff97530b002426a6eb1308e01372905d4c19c2b52a939bccd24c99a5826b9f87c'),
  publicKey: {
    uncompressed: hexToBytes('00e55487c92c1913439f336b1b2dc316da6e88c02a157208f98781494b87f27eb8'),
    compressed: hexToBytes('00e55487c92c1913439f336b1b2dc316da6e88c02a157208f98781494b87f27eb8')
  },
  point: {
    raw: hexToBytes('e55487c92c1913439f336b1b2dc316da6e88c02a157208f98781494b87f27eb8'),
    x: BigInt('18529038270296824438026848489315401829943202020841826252456650783397010322849'),
    y: BigInt('25553816120962378038042195812249947304098260420554035661068256958789815063781')
  }
}

const kholawEd25519PrivateKey: PrivateKey = KholawEd25519PrivateKey.fromBytes(data.privateKey);
const eccKholawEd25519PrivateKey: PrivateKey = ecc.PRIVATE_KEY.fromBytes(data.privateKey);

console.log(
  'Private Key:',
  ecc.NAME === kholawEd25519PrivateKey.getName(),
  kholawEd25519PrivateKey instanceof KholawEd25519PrivateKey,
  eccKholawEd25519PrivateKey instanceof KholawEd25519PrivateKey,
  isAllEqual(
    kholawEd25519PrivateKey.getRaw(),
    eccKholawEd25519PrivateKey.getRaw(),
    data.privateKey
  )
);

const rawKholawEd25519Point: Point = KholawEd25519Point.fromBytes(data.point.raw);
const coordinatesKholawEd25519Point: Point = KholawEd25519Point.fromCoordinates(data.point.x, data.point.y);

console.log(
  'Point:',
  rawKholawEd25519Point instanceof KholawEd25519Point,
  coordinatesKholawEd25519Point instanceof KholawEd25519Point,
  isAllEqual(
    rawKholawEd25519Point.getRaw(),
    coordinatesKholawEd25519Point .getRaw(),
    ecc.POINT.fromBytes(data.point.raw).getRaw(),
    ecc.POINT.fromCoordinates(data.point.x, data.point.y).getRaw(),
    data.point.raw
  )
);

const kholawEd25519PublicKey: PublicKey = kholawEd25519PrivateKey.getPublicKey();
const eccKholawEd25519PublicKey: PublicKey = eccKholawEd25519PrivateKey.getPublicKey();
const uncompressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.uncompressed, KholawEd25519PublicKey);
const compressedPublicKey: PublicKey = validateAndGetPublicKey(data.publicKey.compressed, KholawEd25519PublicKey);

console.log(
  '(Uncompressed) Public Key:',
  kholawEd25519PublicKey instanceof KholawEd25519PublicKey,
  eccKholawEd25519PublicKey instanceof KholawEd25519PublicKey,
  uncompressedPublicKey instanceof KholawEd25519PublicKey,
  isAllEqual(
    uncompressedPublicKey.getRawUncompressed(),
    kholawEd25519PublicKey.getRawUncompressed(),
    eccKholawEd25519PublicKey.getRawUncompressed(),
    KholawEd25519PublicKey.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    KholawEd25519PublicKey.fromPoint(rawKholawEd25519Point).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.uncompressed).getRawUncompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesKholawEd25519Point).getRawUncompressed(),
    data.publicKey.uncompressed
  )
);

console.log(
  '(Compressed) Public Key:',
  kholawEd25519PublicKey instanceof KholawEd25519PublicKey,
  eccKholawEd25519PublicKey instanceof KholawEd25519PublicKey,
  compressedPublicKey instanceof KholawEd25519PublicKey,
  isAllEqual(
    compressedPublicKey.getRawCompressed(),
    kholawEd25519PublicKey.getRawCompressed(),
    eccKholawEd25519PublicKey.getRawCompressed(),
    KholawEd25519PublicKey.fromBytes(data.publicKey.compressed).getRawCompressed(),
    KholawEd25519PublicKey.fromPoint(rawKholawEd25519Point).getRawCompressed(),
    ecc.PUBLIC_KEY.fromBytes(data.publicKey.compressed).getRawCompressed(),
    ecc.PUBLIC_KEY.fromPoint(coordinatesKholawEd25519Point).getRawCompressed(),
    data.publicKey.compressed
  )
);

console.log(
  'ECC:',
  isAllEqual(
    KholawEd25519ECC.NAME,
    ecc.NAME,
    kholawEd25519PrivateKey.getName(),
    eccKholawEd25519PrivateKey.getName(),
    rawKholawEd25519Point.getName(),
    coordinatesKholawEd25519Point.getName(),
    kholawEd25519PublicKey.getName(),
    eccKholawEd25519PublicKey.getName(),
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
