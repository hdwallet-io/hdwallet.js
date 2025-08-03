// SPDX-License-Identifier: MIT

import { HDWallet } from '@hdwallet/core';
import { SLIP10Secp256k1ECC, SLIP10Ed25519ECC } from '@hdwallet/core/eccs';
import { BIP39Seed } from '@hdwallet/core/seeds';
import { Algorand, Solana, Stellar, Neo } from '@hdwallet/core/cryptocurrencies';
import { BIP44HD } from '@hdwallet/core/hds';

const seed: string = BIP39Seed.fromMnemonic(
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  { passphrase: null }
);

for (const { Cryptocurrency, ECC } of [
  { Cryptocurrency: Algorand, ECC: SLIP10Ed25519ECC },
  { Cryptocurrency: Solana, ECC: Solana.ECC },
  { Cryptocurrency: Stellar, ECC: Stellar.ECC },
  { Cryptocurrency: Neo, ECC: Neo.ECC }
]) {

  const bip44HD: BIP44HD = new BIP44HD({
    ecc: SLIP10Secp256k1ECC, coinType: Cryptocurrency.COIN_TYPE
  }).fromSeed(new BIP39Seed(seed));

  const hdwallet: HDWallet = new HDWallet(Cryptocurrency, {
    ecc: ECC, hd: BIP44HD, network: Cryptocurrency.NETWORKS.MAINNET
  }).fromPrivateKey(
    bip44HD.getPrivateKey()
  );

  // Same address of Exodus
  console.log(`Address for ${Cryptocurrency.NAME}: ${hdwallet.getAddress()}`);
}
