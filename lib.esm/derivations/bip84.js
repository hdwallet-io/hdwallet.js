// SPDX-License-Identifier: MIT
import { BIP44Derivation, CHANGES } from './bip44';
import { Bitcoin } from '../cryptocurrencies';
/**
 * Implements the BIP84 hierarchical deterministic derivation standard.
 *
 * BIP84 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 *
 * This class extends BIP44Derivation but uses purpose `84` (native SegWit addresses).
 */
export class BIP84Derivation extends BIP44Derivation {
    purpose = [84, true];
    /**
     * Creates a new BIP84 derivation path.
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
     * @returns {string} `'BIP84'`
     */
    static getName() {
        return 'BIP84';
    }
}
//# sourceMappingURL=bip84.js.map