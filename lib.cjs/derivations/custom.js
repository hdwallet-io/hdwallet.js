"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDerivation = void 0;
const derivation_1 = require("./derivation");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * Represents a custom derivation path that does not conform to a specific standard (like BIP44).
 *
 * This class allows flexible derivation path construction based on either:
 * - a direct string path (e.g. `"m/44'/0'/0'/0/0"`)
 * - a list of indexes (e.g. `[44, 0, 0, 0, 0]`)
 *
 * @extends Derivation
 */
class CustomDerivation extends derivation_1.Derivation {
    /**
     * Returns the derivation name.
     *
     * @returns {string} The string `'Custom'`.
     */
    static getName() {
        return 'Custom';
    }
    /**
     * Derives from a given string path.
     *
     * The path must start with `"m/"`, e.g. `"m/44'/0'/0'/0/0"`.
     *
     * @param {string} path - The derivation path string.
     * @returns {this} The current instance for chaining.
     * @throws {DerivationError} If the path format is invalid.
     */
    fromPath(path) {
        if (!path.startsWith('m/')) {
            throw new exceptions_1.DerivationError('Bad path format', { expected: "like this type of path \'m/0'/0\'", got: path });
        }
        const [_path, indexes, derivations] = (0, utils_1.normalizeDerivation)(path, undefined);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = _path;
        return this;
    }
    /**
     * Derives from an array of indexes.
     *
     * Automatically generates a valid derivation path from the given index sequence.
     *
     * @param {number[]} indexes - The list of indexes (e.g. `[44, 0, 0, 0, 0]`).
     * @returns {this} The current instance for chaining.
     */
    fromIndexes(indexes) {
        const [path, _indexes, derivations] = (0, utils_1.normalizeDerivation)(undefined, indexes);
        this.derivations = derivations;
        this.indexes = _indexes;
        this.path = path;
        return this;
    }
    /**
     * Extends the current derivation path by appending an index.
     *
     * Optionally marks the index as hardened using the `'` suffix.
     *
     * @param {number} index - The index to append.
     * @param {boolean} [hardened=false] - Whether the index is hardened.
     * @returns {this} The current instance for chaining.
     */
    fromIndex(index, hardened = false) {
        const path = hardened ? `${index}'` : `${index}`;
        return this.fromPath(this.path === 'm/' ? `${this.path}${path}` : `${this.path}/${path}`);
    }
    /**
     * Resets the derivation to its default (empty) state.
     *
     * @returns {this} The current instance for chaining.
     */
    clean() {
        const [path, indexes, derivations] = (0, utils_1.normalizeDerivation)(undefined, undefined);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
        return this;
    }
}
exports.CustomDerivation = CustomDerivation;
//# sourceMappingURL=custom.js.map