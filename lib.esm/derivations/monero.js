// SPDX-License-Identifier: MIT
import { Derivation } from './derivation';
import { normalizeIndex, normalizeDerivation, indexTupleToString } from '../utils';
/**
 * MoneroDerivation implements a hierarchical derivation path for Monero wallets.
 *
 **/
export class MoneroDerivation extends Derivation {
    minor;
    major;
    /**
     * Constructor to initialize Monero derivation.
     * @param options - Options including minor and major indices.
     */
    constructor(options = {
        minor: 1, major: 0
    }) {
        super(options);
        this.minor = normalizeIndex(options.minor ?? 0, false);
        this.major = normalizeIndex(options.major ?? 0, false);
        this.updateDerivation();
    }
    /**
     * Returns the name of this derivation class.
     * @returns {string} - 'Monero'
     */
    static getName() {
        return 'Monero';
    }
    updateDerivation() {
        const [path, indexes, derivations] = normalizeDerivation(`m/${indexTupleToString(this.minor)}/` +
            `${indexTupleToString(this.major)}`);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
    }
    /**
     * Set a new minor index.
     * @param minor - The minor index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromMinor(minor) {
        this.minor = normalizeIndex(minor, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Set a new major index.
     * @param major - The major index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromMajor(major) {
        this.major = normalizeIndex(major, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Reset the derivation to default values.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    clean() {
        this.minor = normalizeIndex(1, false);
        this.major = normalizeIndex(0, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Get the minor index.
     * @returns {number} - The minor index.
     */
    getMinor() {
        return this.minor.length === 3 ? this.minor[1] : this.minor[0];
    }
    /**
     * Get the major index.
     * @returns {number} - The major index.
     */
    getMajor() {
        return this.major.length === 3 ? this.major[1] : this.major[0];
    }
}
//# sourceMappingURL=monero.js.map