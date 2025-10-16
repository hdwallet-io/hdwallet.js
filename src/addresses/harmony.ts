// SPDX-License-Identifier: MIT

import { OKTChainAddress } from './okt-chain';
import { Harmony } from '../cryptocurrencies';
import { Address } from './address';

/**
 * Class representing Harmony blockchain addresses.
 * Inherits encoding/decoding logic from OKTChainAddress.
 * Supports the Harmony mainnet HRP (human-readable part) for Bech32 addresses.
 */
export class HarmonyAddress extends OKTChainAddress implements Address {

  static hrp: string = Harmony.NETWORKS.MAINNET.HRP;

  /**
   * Returns the name of the address implementation.
   * @returns {string} 'Harmony'
   */
  static getName(): string {
    return 'Harmony';
  }
}
