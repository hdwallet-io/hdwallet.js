"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroDerivation = void 0;
const derivation_1 = require("./derivation");
const utils_1 = require("../utils");
/**
 * MoneroDerivation implements a hierarchical derivation path for Monero wallets.
 *
 **/
class MoneroDerivation extends derivation_1.Derivation {
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
        this.minor = (0, utils_1.normalizeIndex)(options.minor ?? 0, false);
        this.major = (0, utils_1.normalizeIndex)(options.major ?? 0, false);
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
        const [path, indexes, derivations] = (0, utils_1.normalizeDerivation)(`m/${(0, utils_1.indexTupleToString)(this.minor)}/` +
            `${(0, utils_1.indexTupleToString)(this.major)}`);
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
        this.minor = (0, utils_1.normalizeIndex)(minor, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Set a new major index.
     * @param major - The major index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromMajor(major) {
        this.major = (0, utils_1.normalizeIndex)(major, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Reset the derivation to default values.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    clean() {
        this.minor = (0, utils_1.normalizeIndex)(1, false);
        this.major = (0, utils_1.normalizeIndex)(0, false);
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
exports.MoneroDerivation = MoneroDerivation;
//# sourceMappingURL=monero.js.map