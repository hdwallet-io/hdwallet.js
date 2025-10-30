import { Derivation } from './derivation';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType } from '../types';
/**
 * MoneroDerivation implements a hierarchical derivation path for Monero wallets.
 *
 **/
export declare class MoneroDerivation extends Derivation {
    private minor;
    private major;
    /**
     * Constructor to initialize Monero derivation.
     * @param options - Options including minor and major indices.
     */
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the name of this derivation class.
     * @returns {string} - 'Monero'
     */
    static getName(): string;
    private updateDerivation;
    /**
     * Set a new minor index.
     * @param minor - The minor index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromMinor(minor: IndexType): this;
    /**
     * Set a new major index.
     * @param major - The major index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromMajor(major: IndexType): this;
    /**
     * Reset the derivation to default values.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    clean(): this;
    /**
     * Get the minor index.
     * @returns {number} - The minor index.
     */
    getMinor(): number;
    /**
     * Get the major index.
     * @returns {number} - The major index.
     */
    getMajor(): number;
}
//# sourceMappingURL=monero.d.ts.map