import { Derivation } from './derivation';
/**
 * Represents a custom derivation path that does not conform to a specific standard (like BIP44).
 *
 * This class allows flexible derivation path construction based on either:
 * - a direct string path (e.g. `"m/44'/0'/0'/0/0"`)
 * - a list of indexes (e.g. `[44, 0, 0, 0, 0]`)
 *
 * @extends Derivation
 */
export declare class CustomDerivation extends Derivation {
    /**
     * Returns the derivation name.
     *
     * @returns {string} The string `'Custom'`.
     */
    static getName(): string;
    /**
     * Derives from a given string path.
     *
     * The path must start with `"m/"`, e.g. `"m/44'/0'/0'/0/0"`.
     *
     * @param {string} path - The derivation path string.
     * @returns {this} The current instance for chaining.
     * @throws {DerivationError} If the path format is invalid.
     */
    fromPath(path: string): this;
    /**
     * Derives from an array of indexes.
     *
     * Automatically generates a valid derivation path from the given index sequence.
     *
     * @param {number[]} indexes - The list of indexes (e.g. `[44, 0, 0, 0, 0]`).
     * @returns {this} The current instance for chaining.
     */
    fromIndexes(indexes: number[]): this;
    /**
     * Extends the current derivation path by appending an index.
     *
     * Optionally marks the index as hardened using the `'` suffix.
     *
     * @param {number} index - The index to append.
     * @param {boolean} [hardened=false] - Whether the index is hardened.
     * @returns {this} The current instance for chaining.
     */
    fromIndex(index: number, hardened?: boolean): this;
    /**
     * Resets the derivation to its default (empty) state.
     *
     * @returns {this} The current instance for chaining.
     */
    clean(): this;
}
//# sourceMappingURL=custom.d.ts.map