"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorandSeed = void 0;
const seed_1 = require("./seed");
const mnemonics_1 = require("../mnemonics");
const exceptions_1 = require("../exceptions");
/**
 * Represents the **Algorand** seed implementation.
 *
 * The `AlgorandSeed` class extends the base `Seed` class and provides
 * functionality for generating and validating Algorand-compatible seeds.
 *
 * This class primarily handles conversion from mnemonic phrases
 * (either as plain strings or `Mnemonic` instances) into seed bytes.
 */
class AlgorandSeed extends seed_1.Seed {
    /**
     * Returns the name identifier for this seed type.
     *
     * @returns {string} The string `"Algorand"`.
     */
    static getName() {
        return 'Algorand';
    }
    /**
     * Derives a seed from an Algorand mnemonic phrase.
     *
     * Accepts either a string-based mnemonic or a `Mnemonic` instance.
     * If the mnemonic is invalid, a `MnemonicError` is thrown.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or `Mnemonic` object.
     * @returns {string} The derived seed as a string (typically base-encoded or hex-encoded).
     * @throws {MnemonicError} If the provided mnemonic is not a valid Algorand phrase.
     */
    static fromMnemonic(mnemonic) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.AlgorandMnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        return mnemonics_1.AlgorandMnemonic.decode(phrase);
    }
}
exports.AlgorandSeed = AlgorandSeed;
//# sourceMappingURL=algorand.js.map