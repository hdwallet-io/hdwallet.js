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
class BIP44Derivation extends derivation_1.Derivation {
    purpose = [44, true];
    coinType;
    account;
    change;
    address;
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
    static getName() {
        return 'BIP44';
    }
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
    fromCoinType(coinType) {
        this.coinType = (0, utils_1.normalizeIndex)(coinType, true);
        this.updateDerivation();
        return this;
    }
    fromAccount(account) {
        this.account = (0, utils_1.normalizeIndex)(account, true);
        this.updateDerivation();
        return this;
    }
    fromChange(change) {
        this.change = (0, utils_1.normalizeIndex)(this.getChangeValue(change), false);
        this.updateDerivation();
        return this;
    }
    fromAddress(address) {
        this.address = (0, utils_1.normalizeIndex)(address, false);
        this.updateDerivation();
        return this;
    }
    clean() {
        this.account = (0, utils_1.normalizeIndex)(0, true);
        this.change = (0, utils_1.normalizeIndex)(this.getChangeValue(exports.CHANGES.EXTERNAL_CHAIN), false);
        this.address = (0, utils_1.normalizeIndex)(0, false);
        this.updateDerivation();
        return this;
    }
    getPurpose() {
        return this.purpose[0];
    }
    getCoinType() {
        return this.coinType[0];
    }
    getAccount() {
        return this.account.length === 3 ? this.account[1] : this.account[0];
    }
    getChange(nameOnly = true) {
        return this.getChangeValue(this.change[0], nameOnly);
    }
    getAddress() {
        return this.address.length === 3 ? this.address[1] : this.address[0];
    }
}
exports.BIP44Derivation = BIP44Derivation;
//# sourceMappingURL=bip44.js.map