// SPDX-License-Identifier: MIT

import {
  PrivateKey, PublicKey, SLIP10Secp256k1PrivateKey
} from '../../src/eccs';
import {
  P2PKHAddress,
  P2SHAddress,
  P2TRAddress,
  P2WPKHAddress,
  P2WPKHInP2SHAddress,
  P2WSHAddress,
  P2WSHInP2SHAddress,
  EthereumAddress,
  CosmosAddress,
  XinFinAddress,
  TronAddress,
  RippleAddress,
  FilecoinAddress,
  AvalancheAddress,
  EOSAddress,
  ErgoAddress,
  IconAddress,
  OKTChainAddress,
  HarmonyAddress,
  ZilliqaAddress,
  InjectiveAddress
} from '../../src/addresses';
import { PUBLIC_KEY_TYPES } from '../../src/consts';
import { bytesToString, getBytes } from '../../src/utils';
import {
  Bitcoin, Cosmos, Filecoin, Avalanche, Ergo, OKTChain, Harmony, Zilliqa, Injective
} from '../../src/cryptocurrencies';

const privateKey: PrivateKey = SLIP10Secp256k1PrivateKey.fromBytes(getBytes(
  'be3851aa7822b92deb2f34655e41a40fd510f6cf9aa2a4f0c4d7a4bc81f0ad74'
));
const publicKey: PublicKey = privateKey.getPublicKey();

console.log('Private Key:', bytesToString(privateKey.getRaw()));
console.log('Uncompressed Public Key:', bytesToString(publicKey.getRawUncompressed()));
console.log('Compressed Public Key:', bytesToString(publicKey.getRawCompressed()), '\n');

const p2pkhAddress: string = P2PKHAddress.encode(publicKey, {
  publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
  publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED
});
const p2pkhAddressHash: string = P2PKHAddress.decode(p2pkhAddress, {
  publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
});
console.log('P2PKH Address:', p2pkhAddress, p2pkhAddressHash);

const p2shAddress: string = P2SHAddress.encode(publicKey, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
});
const p2shAddressHash: string = P2SHAddress.decode(p2shAddress, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
});
console.log('P2SH Address:', p2shAddress, p2shAddressHash);

const p2trAddress: string = P2TRAddress.encode(publicKey, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP,
  witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
});
const p2trAddressHash: string = P2TRAddress.decode(p2trAddress, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP
});
console.log('P2TR Address:', p2trAddress, p2trAddressHash);

const p2wpkhAddress: string = P2WPKHAddress.encode(publicKey, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
  witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
});
const p2wpkhAddressHash: string = P2WPKHAddress.decode(p2wpkhAddress, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP
});
console.log('P2WPKH Address:', p2wpkhAddress, p2wpkhAddressHash);

const p2wpkhInP2SHAddress: string = P2WPKHInP2SHAddress.encode(publicKey, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
});
const p2wpkhInP2SHAddressHash: string = P2WPKHInP2SHAddress.decode(p2wpkhInP2SHAddress, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
});
console.log('P2WPKH-In-P2SH Address:', p2wpkhInP2SHAddress, p2wpkhInP2SHAddressHash);

const p2wshAddress: string = P2WSHAddress.encode(publicKey, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
  witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH
});
const p2wshAddressHash: string = P2WSHAddress.decode(p2wshAddress, {
  hrp: Bitcoin.NETWORKS.MAINNET.HRP
});
console.log('P2WSH Address:', p2wshAddress, p2wshAddressHash);

const p2wshInP2SHAddress: string = P2WSHInP2SHAddress.encode(publicKey, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
  publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
});
const p2wshInP2SHAddressHash: string = P2WSHInP2SHAddress.decode(p2wshInP2SHAddress, {
  scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
});
console.log('P2WSH-In-P2SH Address:', p2wshInP2SHAddress, p2wshInP2SHAddressHash);

const ethereumAddress: string = EthereumAddress.encode(publicKey, {
  skipChecksumEncode: false
});
const ethereumAddressHash: string = EthereumAddress.decode(ethereumAddress, {
  skipChecksumEncode: false
});
console.log('Ethereum Address:', ethereumAddress, ethereumAddressHash);

const cosmosAddress: string = CosmosAddress.encode(publicKey, {
  hrp: Cosmos.NETWORKS.MAINNET.HRP
});
const cosmosAddressHash: string = CosmosAddress.decode(cosmosAddress, {
  hrp: Cosmos.NETWORKS.MAINNET.HRP
});
console.log('Cosmos Address:', cosmosAddress, cosmosAddressHash);

const xinfinAddress: string = XinFinAddress.encode(publicKey, {
  skipChecksumEncode: false
});
const xinfinAddressHash: string = XinFinAddress.decode(xinfinAddress, {
  skipChecksumEncode: false
});
console.log('XinFin Address:', xinfinAddress, xinfinAddressHash);

const tronAddress: string = TronAddress.encode(publicKey);
const tronAddressHash: string = TronAddress.decode(tronAddress);
console.log('Tron Address:', tronAddress, tronAddressHash);

const rippleAddress: string = RippleAddress.encode(publicKey);
const rippleAddressHash: string = RippleAddress.decode(rippleAddress);
console.log('Ripple Address:', rippleAddress, rippleAddressHash);

const secp256k1FilecoinAddress: string = FilecoinAddress.encode(publicKey, {
  addressType: Filecoin.ADDRESS_TYPES.SECP256K1
});
const secp256k1FilecoinAddressHash: string = FilecoinAddress.decode(secp256k1FilecoinAddress, {
  addressType: Filecoin.ADDRESS_TYPES.SECP256K1
});
console.log('(Secp256k1) Filecoin Address:', secp256k1FilecoinAddress, secp256k1FilecoinAddressHash);

const blsFilecoinAddress: string = FilecoinAddress.encode(publicKey, {
  addressType: Filecoin.ADDRESS_TYPES.BLS
});
const blsFilecoinAddressHash: string = FilecoinAddress.decode(blsFilecoinAddress, {
  addressType: Filecoin.ADDRESS_TYPES.BLS
});
console.log('(BLS) Filecoin Address:', blsFilecoinAddress, blsFilecoinAddressHash);

const pAvalancheAddress: string = AvalancheAddress.encode(publicKey, {
  addressType: Avalanche.ADDRESS_TYPES.P_CHAIN
});
const pAvalancheAddressHash: string = AvalancheAddress.decode(pAvalancheAddress, {
  addressType: Avalanche.ADDRESS_TYPES.P_CHAIN
});
console.log('(P-Chain) Avalanche Address:', pAvalancheAddress, pAvalancheAddressHash);

const xAvalancheAddress: string = AvalancheAddress.encode(publicKey, {
  addressType: Avalanche.ADDRESS_TYPES.X_CHAIN
});
const xAvalancheAddressHash: string = AvalancheAddress.decode(xAvalancheAddress, {
  addressType: Avalanche.ADDRESS_TYPES.X_CHAIN
});
console.log('(X-Chain) Avalanche Address:', xAvalancheAddress, xAvalancheAddressHash);

const eosAddress: string = EOSAddress.encode(publicKey);
const eosPublicKey: string = EOSAddress.decode(eosAddress);
console.log("EOS Address:", eosAddress, eosPublicKey);

const p2pkhErgoAddress: string = ErgoAddress.encode(publicKey, {
  addressType: Ergo.ADDRESS_TYPES.P2PKH, networkType: Ergo.NETWORKS.TESTNET
});
const p2pkhErgoPublicKey: string = ErgoAddress.decode(p2pkhErgoAddress, {
  addressType: Ergo.ADDRESS_TYPES.P2PKH, networkType: Ergo.NETWORKS.TESTNET
});
console.log("(P2PKH) Ergo Address:", p2pkhErgoAddress, p2pkhErgoPublicKey);

const p2shErgoAddress: string = ErgoAddress.encode(publicKey, {
  addressType: Ergo.ADDRESS_TYPES.P2SH, networkType: Ergo.NETWORKS.TESTNET
});
const p2shErgoPublicKey: string = ErgoAddress.decode(p2shErgoAddress, {
  addressType: Ergo.ADDRESS_TYPES.P2SH, networkType: Ergo.NETWORKS.TESTNET
});
console.log("(P2SH) Ergo Address:", p2shErgoAddress, p2shErgoPublicKey);

const iconAddress: string = IconAddress.encode(publicKey);
const iconAddressHash: string = IconAddress.decode(iconAddress);
console.log("Icon Address:", iconAddress, iconAddressHash);

const oktChainAddress: string = OKTChainAddress.encode(publicKey, {
  hrp: OKTChain.NETWORKS.MAINNET.HRP
});
const oktChainAddressHash: string = OKTChainAddress.decode(oktChainAddress, {
  hrp: OKTChain.NETWORKS.MAINNET.HRP
});
console.log("OKTChain Address:", oktChainAddress, oktChainAddressHash);

const harmonyAddress: string = HarmonyAddress.encode(publicKey, {
  hrp: Harmony.NETWORKS.MAINNET.HRP
});
const harmonyAddressHash: string = HarmonyAddress.decode(harmonyAddress, {
  hrp: Harmony.NETWORKS.MAINNET.HRP
});
console.log("Harmony Address:", harmonyAddress, harmonyAddressHash);

const zilliqaAddress: string = ZilliqaAddress.encode(publicKey, {
  hrp: Zilliqa.NETWORKS.MAINNET.HRP
});
const zilliqaAddressHash: string = ZilliqaAddress.decode(zilliqaAddress, {
  hrp: Zilliqa.NETWORKS.MAINNET.HRP
});
console.log("Zilliqa Address:", zilliqaAddress, zilliqaAddressHash);

const injectiveAddress: string = InjectiveAddress.encode(publicKey, {
  hrp: Injective.NETWORKS.MAINNET.HRP
});
const injectiveAddressHash: string = InjectiveAddress.decode(injectiveAddress, {
  hrp: Injective.NETWORKS.MAINNET.HRP
});
console.log("Injective Address:", injectiveAddress, injectiveAddressHash);
