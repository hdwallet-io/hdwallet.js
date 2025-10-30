import { OKTChainAddress } from './okt-chain';
import { Address } from './address';
/**
 * Class representing Harmony blockchain addresses.
 * Inherits encoding/decoding logic from OKTChainAddress.
 * Supports the Harmony mainnet HRP (human-readable part) for Bech32 addresses.
 */
export declare class HarmonyAddress extends OKTChainAddress implements Address {
    static hrp: string;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Harmony'
     */
    static getName(): string;
}
//# sourceMappingURL=harmony.d.ts.map