// SPDX-License-Identifier: MIT
import { OKTChainAddress } from './okt-chain';
import { Harmony } from '../cryptocurrencies';
/**
 * Class representing Harmony blockchain addresses.
 * Inherits encoding/decoding logic from OKTChainAddress.
 * Supports the Harmony mainnet HRP (human-readable part) for Bech32 addresses.
 */
export class HarmonyAddress extends OKTChainAddress {
    static hrp = Harmony.NETWORKS.MAINNET.HRP;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Harmony'
     */
    static getName() {
        return 'Harmony';
    }
}
//# sourceMappingURL=harmony.js.map