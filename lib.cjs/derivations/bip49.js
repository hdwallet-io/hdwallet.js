"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP49Derivation = void 0;
const bip44_1 = require("./bip44");
const cryptocurrencies_1 = require("../cryptocurrencies");
/**
 * Represents the BIP49 derivation standard.
 *
 * BIP49 defines the derivation scheme for hierarchical deterministic (HD)
 * wallets using P2WPKH-nested-in-P2SH addresses (i.e., SegWit wrapped in
 * P2SH). It extends BIP44 derivation and changes the purpose field to `49'`.
 *
 */
class BIP49Derivation extends bip44_1.BIP44Derivation {
    purpose = [49, true];
    /**
     * Creates a new instance of the BIP49 derivation class.
     *
     * @param {DerivationOptionsInterface} [options] - Optional configuration object.
     * @param {number} [options.coinType=Bitcoin.COIN_TYPE] - The SLIP-44 coin type (default is Bitcoin).
     * @param {number} [options.account=0] - The account index in the derivation path.
     * @param {number} [options.change=CHANGES.EXTERNAL_CHAIN] - The change type (0 for external, 1 for internal).
     * @param {number} [options.address=0] - The address index.
     * @returns {BIP49Derivation} Returns a configured instance of `BIP49Derivation`.
     */
    constructor(options = {
        coinType: cryptocurrencies_1.Bitcoin.COIN_TYPE, account: 0, change: bip44_1.CHANGES.EXTERNAL_CHAIN, address: 0
    }) {
        super(options);
        this.updateDerivation();
    }
    /**
     * Retrieves the derivation name identifier.
     *
     * @returns {string} Returns the name `"BIP49"`.
     */
    static getName() {
        return 'BIP49';
    }
}
exports.BIP49Derivation = BIP49Derivation;
//# sourceMappingURL=bip49.js.map