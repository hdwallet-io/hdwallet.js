// SPDX-License-Identifier: MIT
import { BIP44Derivation, CHANGES } from './bip44';
import { Bitcoin } from '../cryptocurrencies';
/**
 * Implements the BIP86 hierarchical deterministic derivation standard.
 *
 * BIP86 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 * where purpose is 86.
 *
 * Extends BIP44Derivation.
 */
export class BIP86Derivation extends BIP44Derivation {
    purpose = [86, true];
    /**
     * Creates a new BIP86 derivation path.
     *
     * @param {DerivationOptionsInterface} [options] - Derivation configuration.
     * @param {number|string} [options.coinType=Bitcoin.COIN_TYPE] - Cryptocurrency coin type.
     * @param {number} [options.account=0] - Account index.
     * @param {string|number} [options.change='external-chain'] - Change type or index.
     * @param {number} [options.address=0] - Address index.
     */
    constructor(options = {
        coinType: Bitcoin.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
    }) {
        super(options);
        this.updateDerivation();
    }
    /**
     * Returns the derivation standard name.
     * @returns {string} `'BIP86'`
     */
    static getName() {
        return 'BIP86';
    }
}
//# sourceMappingURL=bip86.js.map