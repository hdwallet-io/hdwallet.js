// SPDX-License-Identifier: MIT

import { Address } from './address';
import { P2PKHAddress } from './p2pkh';
import { P2SHAddress } from './p2sh';
import { P2TRAddress } from './p2tr';
import { P2WPKHAddress } from './p2wpkh';
import { P2WPKHInP2SHAddress } from './p2wpkh-in-p2sh';
import { P2WSHAddress } from './p2wsh';
import { P2WSHInP2SHAddress } from './p2wsh-in-p2sh';
import { EthereumAddress } from './ethereum';
import { CosmosAddress } from './cosmos';
import { XinFinAddress } from './xinfin';
import { TronAddress } from './tron';
import { AddressError } from '../exceptions';
import { RippleAddress } from './ripple';
import { FilecoinAddress } from './filecoin';
import { AvalancheAddress } from './avalanche';
import { EOSAddress } from './eos';
import { ErgoAddress } from './ergo';
import { IconAddress } from './icon';
import { OKTChainAddress } from './okt-chain';
import { HarmonyAddress } from './harmony';
import { ZilliqaAddress } from './zilliqa';
import { InjectiveAddress } from './injective';
import { CardanoAddress } from './cardano';
import { MoneroAddress } from './monero';
import { NanoAddress } from './nano';
import { NeoAddress } from './neo';
import { AlgorandAddress } from './algorand';
import { MultiversXAddress } from './multiversx';
import { SolanaAddress } from './solana';
import { StellarAddress } from './stellar';
import { TezosAddress } from './tezos';
import { SuiAddress } from './sui';
import { AptosAddress } from './aptos';
import { NearAddress } from './near';

/**
 * Central registry of all supported blockchain address classes.
 * Provides utility methods to fetch names, classes, or check validity.
 */
export class ADDRESSES {

  private static readonly dictionary: Record<string, typeof Address> = {
    [P2PKHAddress.getName()]: P2PKHAddress,
    [P2SHAddress.getName()]: P2SHAddress,
    [P2TRAddress.getName()]: P2TRAddress,
    [P2WPKHAddress.getName()]: P2WPKHAddress,
    [P2WPKHInP2SHAddress.getName()]: P2WPKHInP2SHAddress,
    [P2WSHAddress.getName()]: P2WSHAddress,
    [P2WSHInP2SHAddress.getName()]: P2WSHInP2SHAddress,
    [EthereumAddress.getName()]: EthereumAddress,
    [CosmosAddress.getName()]: CosmosAddress,
    [XinFinAddress.getName()]: XinFinAddress,
    [TronAddress.getName()]: TronAddress,
    [RippleAddress.getName()]: RippleAddress,
    [FilecoinAddress.getName()]: FilecoinAddress,
    [AvalancheAddress.getName()]: AvalancheAddress,
    [EOSAddress.getName()]: EOSAddress,
    [ErgoAddress.getName()]: ErgoAddress,
    [IconAddress.getName()]: IconAddress,
    [OKTChainAddress.getName()]: OKTChainAddress,
    [HarmonyAddress.getName()]: HarmonyAddress,
    [ZilliqaAddress.getName()]: ZilliqaAddress,
    [InjectiveAddress.getName()]: InjectiveAddress,
    [CardanoAddress.getName()]: CardanoAddress,
    [MoneroAddress.getName()]: MoneroAddress,
    [NanoAddress.getName()]: NanoAddress,
    [NeoAddress.getName()]: NeoAddress,
    [AlgorandAddress.getName()]: AlgorandAddress,
    [MultiversXAddress.getName()]: MultiversXAddress,
    [SolanaAddress.getName()]: SolanaAddress,
    [StellarAddress.getName()]: StellarAddress,
    [TezosAddress.getName()]: TezosAddress,
    [SuiAddress.getName()]: SuiAddress,
    [AptosAddress.getName()]: AptosAddress,
    [NearAddress.getName()]: NearAddress
  };

  /**
   * Returns an array of all supported address names.
   * @returns {string[]} List of address names.
   */
  public static getNames(): string[] {
    return Object.keys(this.dictionary);
  }

  /**
   * Returns an array of all address classes.
   * @returns {Array<typeof Address>} List of address classes.
   */
  public static getClasses(): Array<typeof Address> {
    return Object.values(this.dictionary);
  }

  /**
   * Fetches the address class corresponding to the given name.
   * @param {string} name - Name of the address.
   * @returns {typeof Address} The corresponding address class.
   * @throws {AddressError} If the name is not a valid address.
   */
  public static getAddressClass(name: string): typeof Address {
    if (!this.isAddress(name)) {
      throw new AddressError(
        'Invalid address name', { expected: this.getNames(), got: name }
      );
    }
    return this.dictionary[name];
  }

  /**
   * Checks whether a given name corresponds to a supported address.
   * @param {string} name - Name to check.
   * @returns {boolean} True if the name is supported, false otherwise.
   */
  public static isAddress(name: string): boolean {
    return name in this.dictionary;
  }
}

export {
  Address,
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
  InjectiveAddress,
  CardanoAddress,
  MoneroAddress,
  NanoAddress,
  NeoAddress,
  AlgorandAddress,
  MultiversXAddress,
  SolanaAddress,
  StellarAddress,
  TezosAddress,
  SuiAddress,
  AptosAddress,
  NearAddress
};
