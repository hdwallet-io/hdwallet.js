// SPDX-License-Identifier: MIT
import { Derivation } from './derivation';
import { Cardano } from '../cryptocurrencies';
import { normalizeIndex, normalizeDerivation, indexTupleToString } from '../utils';
import { DerivationError } from '../exceptions';
export const ROLES = {
    EXTERNAL_CHAIN: 'external-chain',
    INTERNAL_CHAIN: 'internal-chain',
    STAKING_KEY: 'staking-key'
};
/**
 * Implements the CIP-1852 hierarchical deterministic derivation standard for Cardano.
 *
 * The derivation path structure is:
 * `m / purpose' / coin_type' / account' / role / address_index`
 */
export class CIP1852Derivation extends Derivation {
    purpose = [1852, true];
    coinType;
    account;
    role;
    address;
    /**
     * Creates a new CIP1852 derivation path.
     *
     * @param {DerivationOptionsInterface} [options] - Derivation configuration.
     * @param {number|string} [options.coinType=Cardano.COIN_TYPE] - Coin type index.
     * @param {number} [options.account=0] - Account index.
     * @param {string|number} [options.role='external-chain'] - Role type or index.
     * @param {number} [options.address=0] - Address index.
     * @throws {DerivationError} If the role value is invalid.
     */
    constructor(options = {
        coinType: Cardano.COIN_TYPE, account: 0, role: ROLES.EXTERNAL_CHAIN, address: 0
    }) {
        super(options);
        this.coinType = normalizeIndex(options.coinType ?? Cardano.COIN_TYPE, true);
        this.account = normalizeIndex(options.account ?? 0, true);
        this.role = normalizeIndex(this.getRoleValue(options.role ?? ROLES.EXTERNAL_CHAIN), false);
        this.address = normalizeIndex(options.address ?? 0, false);
        this.updateDerivation();
    }
    /**
     * Returns the derivation standard name.
     * @returns {string} `'CIP1852'`
     */
    static getName() {
        return 'CIP1852';
    }
    /**
     * Maps the given role value to its numeric or name form.
     *
     * @protected
     * @param {IndexType} role - Role value (`0`, `1`, `2`, or corresponding role name).
     * @param {boolean} [nameOnly=false] - If true, returns string name; otherwise numeric index.
     * @returns {number|string} Mapped role value.
     * @throws {DerivationError} If the role value is invalid.
     */
    getRoleValue(role, nameOnly = false) {
        if (Array.isArray(role)) {
            throw new DerivationError('Bad role instance', {
                expected: 'number | string', got: typeof role
            });
        }
        const externalChange = [ROLES.EXTERNAL_CHAIN, 0, '0'];
        const internalChange = [ROLES.INTERNAL_CHAIN, 1, '1'];
        const stakingKey = [ROLES.STAKING_KEY, 2, '2'];
        const exceptedRole = [
            ...externalChange, ...internalChange, ...stakingKey
        ];
        if (!exceptedRole.includes(role)) {
            throw new DerivationError(`Bad ${this.getName()} role index`, {
                expected: exceptedRole, got: role
            });
        }
        if (externalChange.includes(role))
            return nameOnly ? ROLES.EXTERNAL_CHAIN : 0;
        if (internalChange.includes(role))
            return nameOnly ? ROLES.INTERNAL_CHAIN : 1;
        if (stakingKey.includes(role))
            return nameOnly ? ROLES.STAKING_KEY : 2;
    }
    updateDerivation() {
        const [path, indexes, derivations] = normalizeDerivation(`m/${indexTupleToString(this.purpose)}/` +
            `${indexTupleToString(this.coinType)}/` +
            `${indexTupleToString(this.account)}/` +
            `${indexTupleToString(this.role)}/` +
            `${indexTupleToString(this.address)}`);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
    }
    /**
     * Sets the coin type and updates the derivation.
     * @param {string|number} coinType
     * @returns {this} Current instance for chaining.
     */
    fromCoinType(coinType) {
        this.coinType = normalizeIndex(coinType, true);
        this.updateDerivation();
        return this;
    }
    /**
     * Sets the account index and updates the derivation.
     * @param {IndexType} account
     * @returns {this} Current instance for chaining.
     */
    fromAccount(account) {
        this.account = normalizeIndex(account, true);
        this.updateDerivation();
        return this;
    }
    /**
     * Sets the role and updates the derivation.
     * @param {string|number} role
     * @returns {this} Current instance for chaining.
     */
    fromRole(role) {
        this.role = normalizeIndex(this.getRoleValue(role), false);
        this.updateDerivation();
        return this;
    }
    /**
     * Sets the address index and updates the derivation.
     * @param {IndexType} address
     * @returns {this} Current instance for chaining.
     */
    fromAddress(address) {
        this.address = normalizeIndex(address, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Resets derivation to default Cardano parameters.
     * @returns {this} Current instance for chaining.
     */
    clean() {
        this.coinType = normalizeIndex(Cardano.COIN_TYPE, true);
        this.account = normalizeIndex(0, true);
        this.role = normalizeIndex(this.getRoleValue(ROLES.EXTERNAL_CHAIN), false);
        this.address = normalizeIndex(0, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Returns the purpose index (always 1852).
     * @returns {number}
     */
    getPurpose() {
        return this.purpose[0];
    }
    /**
     * Returns the coin type index.
     * @returns {number}
     */
    getCoinType() {
        return this.coinType[0];
    }
    /**
     * Returns the account index.
     * @returns {number}
     */
    getAccount() {
        return this.account.length === 3 ? this.account[1] : this.account[0];
    }
    /**
     * Returns the role name or index.
     * @param {boolean} [nameOnly=true] - If true, returns role name; otherwise numeric index.
     * @returns {string|number}
     */
    getRole(nameOnly = true) {
        return this.getRoleValue(this.role[0], nameOnly);
    }
    /**
     * Returns the address index.
     * @returns {number}
     */
    getAddress() {
        return this.address.length === 3 ? this.address[1] : this.address[0];
    }
}
//# sourceMappingURL=cip1852.js.map