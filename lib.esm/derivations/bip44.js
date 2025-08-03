// SPDX-License-Identifier: MIT
import { Derivation } from './derivation';
import { Bitcoin } from '../cryptocurrencies';
import { normalizeIndex, normalizeDerivation, indexTupleToString } from '../utils';
import { DerivationError } from '../exceptions';
export const CHANGES = {
    EXTERNAL_CHAIN: 'external-chain',
    INTERNAL_CHAIN: 'internal-chain'
};
export class BIP44Derivation extends Derivation {
    purpose = [44, true];
    coinType;
    account;
    change;
    address;
    constructor(options = {
        coinType: Bitcoin.COIN_TYPE, account: 0, change: CHANGES.EXTERNAL_CHAIN, address: 0
    }) {
        super(options);
        this.coinType = normalizeIndex(options.coinType ?? Bitcoin.COIN_TYPE, true);
        this.account = normalizeIndex(options.account ?? 0, true);
        this.change = normalizeIndex(this.getChangeValue(options.change ?? CHANGES.EXTERNAL_CHAIN), false);
        this.address = normalizeIndex(options.address ?? 0, false);
        this.updateDerivation();
    }
    static getName() {
        return 'BIP44';
    }
    getChangeValue(change, nameOnly = false) {
        if (Array.isArray(change)) {
            throw new DerivationError('Bad change instance', {
                expected: 'number | string', got: typeof change
            });
        }
        const externalChange = [CHANGES.EXTERNAL_CHAIN, 0, '0'];
        const internalChange = [CHANGES.INTERNAL_CHAIN, 1, '1'];
        const exceptedChange = [
            ...externalChange, ...internalChange
        ];
        if (!exceptedChange.includes(change)) {
            throw new DerivationError(`Bad ${this.getName()} change index`, {
                expected: exceptedChange, got: change
            });
        }
        if (externalChange.includes(change))
            return nameOnly ? CHANGES.EXTERNAL_CHAIN : 0;
        if (internalChange.includes(change))
            return nameOnly ? CHANGES.INTERNAL_CHAIN : 1;
    }
    updateDerivation() {
        const [path, indexes, derivations] = normalizeDerivation(`m/${indexTupleToString(this.purpose)}/` +
            `${indexTupleToString(this.coinType)}/` +
            `${indexTupleToString(this.account)}/` +
            `${indexTupleToString(this.change)}/` +
            `${indexTupleToString(this.address)}`);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
    }
    fromCoinType(coinType) {
        this.coinType = normalizeIndex(coinType, true);
        this.updateDerivation();
        return this;
    }
    fromAccount(account) {
        this.account = normalizeIndex(account, true);
        this.updateDerivation();
        return this;
    }
    fromChange(change) {
        this.change = normalizeIndex(this.getChangeValue(change), false);
        this.updateDerivation();
        return this;
    }
    fromAddress(address) {
        this.address = normalizeIndex(address, false);
        this.updateDerivation();
        return this;
    }
    clean() {
        this.account = normalizeIndex(0, true);
        this.change = normalizeIndex(this.getChangeValue(CHANGES.EXTERNAL_CHAIN), false);
        this.address = normalizeIndex(0, false);
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
//# sourceMappingURL=bip44.js.map