import { DerivationOptionsInterface } from '../interfaces';
import { DerivationsType, DerivationType } from '../types';
/**
 * Base abstract class for all hierarchical deterministic derivations.
 *
 * Provides common functionality such as normalization, path management,
 * and standard interface definitions for BIP-based and custom derivations.
 *
 * Subclasses (like BIP44Derivation, CIP1852Derivation, etc.) must override
 * abstract methods like `getName()`, `clean()`, `getPurpose()`, `getCoinType()`, etc.
 */
export declare class Derivation {
    path: string;
    indexes: number[];
    derivations: DerivationsType[];
    protected purpose: DerivationType;
    /**
     * Creates a new derivation instance.
     *
     * @param {DerivationOptionsInterface} [options] - Optional derivation configuration.
     * @param {string} [options.path] - Derivation path (e.g., `'m/44'/0'/0'/0/0'`).
     * @param {number[]} [options.indexes] - Array of derivation indexes.
     */
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the name of the derivation standard (e.g., `'BIP44'`).
     * Must be overridden in subclasses.
     * @returns {string}
     * @throws {Error} Must override in subclass.
     */
    static getName(): string;
    /**
     * Returns the derivation standard name for the current instance.
     * @returns {string} The derivation standard name.
     */
    getName(): string;
    /**
     * Resets the derivation to its default clean state.
     * Must be implemented by subclasses.
     * @returns {this}
     * @throws {Error} Must override in subclass.
     */
    clean(): this;
    /**
     * Returns the full derivation path.
     * @returns {string} The derivation path (e.g., `'m/44'/0'/0'/0/0'`).
     */
    getPath(): string;
    /**
     * Returns the list of indexes in the derivation path.
     * @returns {number[]} Array of index numbers.
     */
    getIndexes(): number[];
    /**
     * Returns the structured derivations array.
     * @returns {DerivationsType[]} Array of derivation tuples.
     */
    getDerivations(): DerivationsType[];
    /**
     * Returns the depth (number of derivation levels).
     * @returns {number} The depth of the derivation path.
     */
    getDepth(): number;
    /**
     * Returns the derivation purpose (e.g., `44` for BIP44).
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getPurpose(): number;
    /**
     * Returns the coin type (e.g., `0` for Bitcoin).
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getCoinType(): number;
    /**
     * Returns the account index.
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getAccount(): number;
    /**
     * Returns the change chain identifier.
     * Must be implemented by subclasses.
     * @param {...any} args - Optional arguments for change formatting.
     * @returns {string|number}
     */
    getChange(...args: any[]): string | number;
    /**
     * Returns the role name in role-based derivations (e.g., `'external'`, `'staking'`).
     * Must be implemented by subclasses.
     * @param {...any} args - Optional arguments for role formatting.
     * @returns {string}
     */
    getRole(...args: any[]): string;
    /**
     * Returns the address index.
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getAddress(): number;
    /**
     * Returns the minor index (if applicable in hierarchical standards).
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getMinor(): number;
    /**
     * Returns the major index (if applicable in hierarchical standards).
     * Must be implemented by subclasses.
     * @returns {number}
     */
    getMajor(): number;
}
//# sourceMappingURL=derivation.d.ts.map