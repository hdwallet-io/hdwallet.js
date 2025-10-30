"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP86Derivation = void 0;
const bip44_1 = require("./bip44");
const cryptocurrencies_1 = require("../cryptocurrencies");
/**
 * Implements the BIP86 hierarchical deterministic derivation standard.
 *
 * BIP86 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 * where purpose is 86.
 *
 * Extends BIP44Derivation.
 */
class BIP86Derivation extends bip44_1.BIP44Derivation {
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
        coinType: cryptocurrencies_1.Bitcoin.COIN_TYPE, account: 0, change: bip44_1.CHANGES.EXTERNAL_CHAIN, address: 0
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
exports.BIP86Derivation = BIP86Derivation;
//# sourceMappingURL=bip86.js.map