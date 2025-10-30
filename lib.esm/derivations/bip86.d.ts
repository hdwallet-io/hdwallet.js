import { BIP44Derivation } from './bip44';
import { DerivationType } from '../types';
import { DerivationOptionsInterface } from '../interfaces';
/**
 * Implements the BIP86 hierarchical deterministic derivation standard.
 *
 * BIP86 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 * where purpose is 86.
 *
 * Extends BIP44Derivation.
 */
export declare class BIP86Derivation extends BIP44Derivation {
    protected purpose: DerivationType;
    /**
     * Creates a new BIP86 derivation path.
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
     * @returns {string} `'BIP86'`
     */
    static getName(): string;
}
//# sourceMappingURL=bip86.d.ts.map