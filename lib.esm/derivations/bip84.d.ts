import { BIP44Derivation } from './bip44';
import { DerivationType } from '../types';
import { DerivationOptionsInterface } from '../interfaces';
/**
 * Implements the BIP84 hierarchical deterministic derivation standard.
 *
 * BIP84 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 *
 * This class extends BIP44Derivation but uses purpose `84` (native SegWit addresses).
 */
export declare class BIP84Derivation extends BIP44Derivation {
    protected purpose: DerivationType;
    /**
     * Creates a new BIP84 derivation path.
     *
     * @param {DerivationOptionsInterface} [options] - Derivation configuration.
     * @param {number|string} [options.coinType=Bitcoin.COIN_TYPE] - Cryptocurrency coin type.
     * @param {number} [options.account=0] - Account index.
     * @param {string|number} [options.change='external-chain'] - Change type or index.
     * @param {number} [options.address=0] - Address index.
     */
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the derivation standard name.
     * @returns {string} `'BIP84'`
     */
    static getName(): string;
}
//# sourceMappingURL=bip84.d.ts.map