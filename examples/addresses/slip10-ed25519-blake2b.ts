// SPDX-License-Identifier: MIT

import {
  PrivateKey, PublicKey, SLIP10Ed25519Blake2bPrivateKey
} from '../../src/eccs';
import { NanoAddress } from '../../src/addresses';
import { bytesToString, getBytes } from '../../src/utils';

const privateKey: PrivateKey = SLIP10Ed25519Blake2bPrivateKey.fromBytes(getBytes(
  'bb37794073e5094ebbfcfa070e9254fe6094b56e7cccb094a2304c5eccccdc07'
));
const publicKey: PublicKey = privateKey.getPublicKey();

console.log('Private Key:', bytesToString(privateKey.getRaw()));
console.log('Uncompressed Public Key:', bytesToString(publicKey.getRawUncompressed()));
console.log('Compressed Public Key:', bytesToString(publicKey.getRawCompressed()), '\n');

const nanoAddress = NanoAddress.encode(publicKey);
const nanoPublicKey = NanoAddress.decode(nanoAddress);
console.log('Nano Address:', nanoAddress, nanoPublicKey);
