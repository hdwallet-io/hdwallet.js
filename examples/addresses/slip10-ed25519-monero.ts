// SPDX-License-Identifier: MIT

import {
  PrivateKey, PublicKey, SLIP10Ed25519MoneroPrivateKey
} from '../../src/eccs';
import { MoneroAddress } from '../../src/addresses';
import { bytesToString, getBytes } from '../../src/utils';
import { Monero } from '../../src/cryptocurrencies';

const spendPrivateKey: PrivateKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(getBytes(
  'bb37794073e5094ebbfcfa070e9254fe6094b56e7cccb094a2304c5eccccdc07'
));
const spendPublicKey: PublicKey = spendPrivateKey.getPublicKey();

console.log('Spend Private Key:', bytesToString(spendPrivateKey.getRaw()));
console.log('Spend Uncompressed Public Key:', bytesToString(spendPublicKey.getRawUncompressed()));
console.log('Spend Compressed Public Key:', bytesToString(spendPublicKey.getRawCompressed()), '\n');

const viewPrivateKey: PrivateKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(getBytes(
  'e3d2855510a8ecba639c29118719ba895446bedbc80f3527c877de43a8d3cf05'
));
const viewPublicKey: PublicKey = viewPrivateKey.getPublicKey();

console.log('View Private Key:', bytesToString(viewPrivateKey.getRaw()));
console.log('View Uncompressed Public Key:', bytesToString(viewPublicKey.getRawUncompressed()));
console.log('View Compressed Public Key:', bytesToString(viewPublicKey.getRawCompressed()), '\n');

const moneroAddress = MoneroAddress.encode(
  { spendPublicKey: spendPublicKey, viewPublicKey: viewPublicKey },
  { network: Monero.NETWORKS.MAINNET, addressType: Monero.ADDRESS_TYPES.STANDARD }
);
const moneroPublicKey = MoneroAddress.decode(moneroAddress, {
  network: Monero.NETWORKS.MAINNET, addressType: Monero.ADDRESS_TYPES.STANDARD
});
console.log('Monero Address:', moneroAddress, moneroPublicKey);
