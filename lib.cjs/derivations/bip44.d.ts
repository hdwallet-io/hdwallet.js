import { Derivation } from './derivation';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType, DerivationType, DerivationsType } from '../types';
export declare const CHANGES: {
    readonly EXTERNAL_CHAIN: "external-chain";
    readonly INTERNAL_CHAIN: "internal-chain";
};
/**
 * Implements the BIP44 hierarchical deterministic derivation standard.
 *
 * BIP44 defines a path structure:
 * `m / purpose' / coin_type' / account' / change / address_index`
 */
export declare class BIP44Derivation extends Derivation {
    protected purpose: DerivationType;
    protected coinType: DerivationsType;
    protected account: DerivationsType;
    protected change: DerivationsType;
    protected address: DerivationsType;
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
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the derivation standard name.
     * @returns {string} `'BIP44'`
     */
    static getName(): string;
    /**
     * Maps the given change value to its numeric or name form.
     *
     * @protected
     * @param {IndexType} change - Change value (`0`, `1`, `'external-chain'`, or `'internal-chain'`).
     * @param {boolean} [nameOnly=false] - If true, returns string name; otherwise numeric index.
     * @returns {number|string} Mapped change value.
     * @throws {DerivationError} If the change parameter is invalid.
     */
    protected getChangeValue(change: IndexType, nameOnly?: boolean): any;
    /**
     * Updates internal path, derivations, and indexes based on current parameters.
     * @protected
     */
    protected updateDerivation(): void;
    /**
     * Updates the coin type and regenerates the derivation path.
     * @param {string|number} coinType - Coin type index (e.g., `0` for Bitcoin).
     * @returns {this} Current instance for chaining.
     */
    fromCoinType(coinType: string | number): this;
    /**
     * Updates the account index and regenerates the derivation path.
     * @param {IndexType} account - Account index.
     * @returns {this} Current instance for chaining.
     */
    fromAccount(account: IndexType): this;
    /**
     * Updates the change type and regenerates the derivation path.
     * @param {string|number} change - Change type or index.
     * @returns {this} Current instance for chaining.
     * @throws {DerivationError} If the change value is invalid.
     */
    fromChange(change: string | number): this;
    /**
     * Updates the address index and regenerates the derivation path.
     * @param {IndexType} address - Address index.
     * @returns {this} Current instance for chaining.
     */
    fromAddress(address: IndexType): this;
    /**
     * Resets the derivation to account `0`, change `'external-chain'`, and address `0`.
     * @returns {this} Current instance for chaining.
     */
    clean(): this;
    /**
     * Gets the BIP purpose (always `44`).
     * @returns {number} The BIP purpose index.
     */
    getPurpose(): number;
    /**
     * Gets the current coin type index.
     * @returns {number} Coin type index.
     */
    getCoinType(): number;
    /**
     * Gets the current account index.
     * @returns {number} Account index.
     */
    getAccount(): number;
    /**
     * Gets the change name or index value.
     * @param {boolean} [nameOnly=true] - Whether to return `'external-chain'` or `'internal-chain'` instead of `0` or `1`.
     * @returns {string} The change name if `nameOnly=true`; otherwise the index.
     */
    getChange(nameOnly?: boolean): string;
    /**
     * Gets the address index.
     * @returns {number} Address index.
     */
    getAddress(): number;
}
//# sourceMappingURL=bip44.d.ts.map