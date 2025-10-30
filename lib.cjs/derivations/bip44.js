"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP44Derivation = exports.CHANGES = void 0;
const derivation_1 = require("./derivation");
const cryptocurrencies_1 = require("../cryptocurrencies");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
exports.CHANGES = {
    EXTERNAL_CHAIN: 'external-chain',
    INTERNAL_CHAIN: 'internal-chain'
};
/**
 * Implements the BIP44 hierarchical deterministic derivation standard.
 *
 * BIP44 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 */
class BIP44Derivation extends derivation_1.Derivation {
    purpose = [44, true];
    coinType;
    account;
    change;
    address;
    /**
     * Creates a new BIP44 derivation path.
     *
     * @param {DerivationOptionsInterface} [options] - Derivation configuration.
     * @param {number|string} [options.coinType=Bitcoin.COIN_TYPE] - Cryptocurrency coin type.
     * @param {number} [options.account=0] - Account index.
     * @param {string|number} [options.change='external-chain'] - Change type or index.
     * @param {number} [options.address=0] - Address index.
     * @throws {DerivationError} If the change parameter is invalid.
     */
    constructor(options = {
        coinType: cryptocurrencies_1.Bitcoin.COIN_TYPE, account: 0, change: exports.CHANGES.EXTERNAL_CHAIN, address: 0
    }) {
        super(options);
        this.coinType = (0, utils_1.normalizeIndex)(options.coinType ?? cryptocurrencies_1.Bitcoin.COIN_TYPE, true);
        this.account = (0, utils_1.normalizeIndex)(options.account ?? 0, true);
        this.change = (0, utils_1.normalizeIndex)(this.getChangeValue(options.change ?? exports.CHANGES.EXTERNAL_CHAIN), false);
        this.address = (0, utils_1.normalizeIndex)(options.address ?? 0, false);
        this.updateDerivation();
    }
    /**
     * Returns the derivation standard name.
     * @returns {string} `'BIP44'`
     */
    static getName() {
        return 'BIP44';
    }
    /**
     * Maps the given change value to its numeric or name form.
     *
     * @protected
     * @param {IndexType} change - Change value (`0`, `1`, `'external-chain'`, or `'internal-chain'`).
     * @param {boolean} [nameOnly=false] - If true, returns string name; otherwise numeric index.
     * @returns {number|string} Mapped change value.
     * @throws {DerivationError} If the change parameter is invalid.
     */
    getChangeValue(change, nameOnly = false) {
        if (Array.isArray(change)) {
            throw new exceptions_1.DerivationError('Bad change instance', {
                expected: 'number | string', got: typeof change
            });
        }
        const externalChange = [exports.CHANGES.EXTERNAL_CHAIN, 0, '0'];
        const internalChange = [exports.CHANGES.INTERNAL_CHAIN, 1, '1'];
        const exceptedChange = [
            ...externalChange, ...internalChange
        ];
        if (!exceptedChange.includes(change)) {
            throw new exceptions_1.DerivationError(`Bad ${this.getName()} change index`, {
                expected: exceptedChange, got: change
            });
        }
        if (externalChange.includes(change))
            return nameOnly ? exports.CHANGES.EXTERNAL_CHAIN : 0;
        if (internalChange.includes(change))
            return nameOnly ? exports.CHANGES.INTERNAL_CHAIN : 1;
    }
    /**
     * Updates internal path, derivations, and indexes based on current parameters.
     * @protected
     */
    updateDerivation() {
        const [path, indexes, derivations] = (0, utils_1.normalizeDerivation)(`m/${(0, utils_1.indexTupleToString)(this.purpose)}/` +
            `${(0, utils_1.indexTupleToString)(this.coinType)}/` +
            `${(0, utils_1.indexTupleToString)(this.account)}/` +
            `${(0, utils_1.indexTupleToString)(this.change)}/` +
            `${(0, utils_1.indexTupleToString)(this.address)}`);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
    }
    /**
     * Updates the coin type and regenerates the derivation path.
     * @param {string|number} coinType - Coin type index (e.g., `0` for Bitcoin).
     * @returns {this} Current instance for chaining.
     */
    fromCoinType(coinType) {
        this.coinType = (0, utils_1.normalizeIndex)(coinType, true);
        this.updateDerivation();
        return this;
    }
    /**
     * Updates the account index and regenerates the derivation path.
     * @param {IndexType} account - Account index.
     * @returns {this} Current instance for chaining.
     */
    fromAccount(account) {
        this.account = (0, utils_1.normalizeIndex)(account, true);
        this.updateDerivation();
        return this;
    }
    /**
     * Updates the change type and regenerates the derivation path.
     * @param {string|number} change - Change type or index.
     * @returns {this} Current instance for chaining.
     * @throws {DerivationError} If the change value is invalid.
     */
    fromChange(change) {
        this.change = (0, utils_1.normalizeIndex)(this.getChangeValue(change), false);
        this.updateDerivation();
        return this;
    }
    /**
     * Updates the address index and regenerates the derivation path.
     * @param {IndexType} address - Address index.
     * @returns {this} Current instance for chaining.
     */
    fromAddress(address) {
        this.address = (0, utils_1.normalizeIndex)(address, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Resets the derivation to account `0`, change `'external-chain'`, and address `0`.
     * @returns {this} Current instance for chaining.
     */
    clean() {
        this.account = (0, utils_1.normalizeIndex)(0, true);
        this.change = (0, utils_1.normalizeIndex)(this.getChangeValue(exports.CHANGES.EXTERNAL_CHAIN), false);
        this.address = (0, utils_1.normalizeIndex)(0, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Gets the BIP purpose (always `44`).
     * @returns {number} The BIP purpose index.
     */
    getPurpose() {
        return this.purpose[0];
    }
    /**
     * Gets the current coin type index.
     * @returns {number} Coin type index.
     */
    getCoinType() {
        return this.coinType[0];
    }
    /**
     * Gets the current account index.
     * @returns {number} Account index.
     */
    getAccount() {
        return this.account.length === 3 ? this.account[1] : this.account[0];
    }
    /**
     * Gets the change name or index value.
     * @param {boolean} [nameOnly=true] - Whether to return `'external-chain'` or `'internal-chain'` instead of `0` or `1`.
     * @returns {string} The change name if `nameOnly=true`; otherwise the index.
     */
    getChange(nameOnly = true) {
        return this.getChangeValue(this.change[0], nameOnly);
    }
    /**
     * Gets the address index.
     * @returns {number} Address index.
     */
    getAddress() {
        return this.address.length === 3 ? this.address[1] : this.address[0];
    }
}
exports.BIP44Derivation = BIP44Derivation;
//# sourceMappingURL=bip44.js.map