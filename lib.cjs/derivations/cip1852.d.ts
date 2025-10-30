import { Derivation } from './derivation';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType, DerivationType } from '../types';
export declare const ROLES: {
    readonly EXTERNAL_CHAIN: "external-chain";
    readonly INTERNAL_CHAIN: "internal-chain";
    readonly STAKING_KEY: "staking-key";
};
/**
 * Implements the CIP-1852 hierarchical deterministic derivation standard for Cardano.
 *
 * The derivation path structure is:
 * `m / purpose' / coin_type' / account' / role / address_index`
 */
export declare class CIP1852Derivation extends Derivation {
    protected purpose: DerivationType;
    private coinType;
    private account;
    private role;
    private address;
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
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the derivation standard name.
     * @returns {string} `'CIP1852'`
     */
    static getName(): string;
    /**
     * Maps the given role value to its numeric or name form.
     *
     * @protected
     * @param {IndexType} role - Role value (`0`, `1`, `2`, or corresponding role name).
     * @param {boolean} [nameOnly=false] - If true, returns string name; otherwise numeric index.
     * @returns {number|string} Mapped role value.
     * @throws {DerivationError} If the role value is invalid.
     */
    protected getRoleValue(role: IndexType, nameOnly?: boolean): any;
    private updateDerivation;
    /**
     * Sets the coin type and updates the derivation.
     * @param {string|number} coinType
     * @returns {this} Current instance for chaining.
     */
    fromCoinType(coinType: string | number): this;
    /**
     * Sets the account index and updates the derivation.
     * @param {IndexType} account
     * @returns {this} Current instance for chaining.
     */
    fromAccount(account: IndexType): this;
    /**
     * Sets the role and updates the derivation.
     * @param {string|number} role
     * @returns {this} Current instance for chaining.
     */
    fromRole(role: string | number): this;
    /**
     * Sets the address index and updates the derivation.
     * @param {IndexType} address
     * @returns {this} Current instance for chaining.
     */
    fromAddress(address: IndexType): this;
    /**
     * Resets derivation to default Cardano parameters.
     * @returns {this} Current instance for chaining.
     */
    clean(): this;
    /**
     * Returns the purpose index (always 1852).
     * @returns {number}
     */
    getPurpose(): number;
    /**
     * Returns the coin type index.
     * @returns {number}
     */
    getCoinType(): number;
    /**
     * Returns the account index.
     * @returns {number}
     */
    getAccount(): number;
    /**
     * Returns the role name or index.
     * @param {boolean} [nameOnly=true] - If true, returns role name; otherwise numeric index.
     * @returns {string|number}
     */
    getRole(nameOnly?: boolean): string;
    /**
     * Returns the address index.
     * @returns {number}
     */
    getAddress(): number;
}
//# sourceMappingURL=cip1852.d.ts.map