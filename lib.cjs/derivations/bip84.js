"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP84Derivation = void 0;
const bip44_1 = require("./bip44");
const cryptocurrencies_1 = require("../cryptocurrencies");
/**
 * Implements the BIP84 hierarchical deterministic derivation standard.
 *
 * BIP84 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 *
 * This class extends BIP44Derivation but uses purpose `84` (native SegWit addresses).
 */
class BIP84Derivation extends bip44_1.BIP44Derivation {
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
        coinType: cryptocurrencies_1.Bitcoin.COIN_TYPE, account: 0, change: bip44_1.CHANGES.EXTERNAL_CHAIN, address: 0
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
exports.BIP84Derivation = BIP84Derivation;
//# sourceMappingURL=bip84.js.map