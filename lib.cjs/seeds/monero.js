"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroSeed = void 0;
const mnemonics_1 = require("../mnemonics");
const exceptions_1 = require("../exceptions");
const seed_1 = require("./seed");
/**
 * Represents the Monero-specific seed derivation implementation.
 *
 * The `MoneroSeed` class provides functionality for validating and
 * decoding Monero mnemonic phrases into their corresponding seed value.
 *
 * Each Monero seed follows the Monero-specific encoding and decoding scheme.
 */
class MoneroSeed extends seed_1.Seed {
    /**
     * Returns the name of the seed type.
     *
     * @returns {string} The name `"Monero"`.
     */
    static getName() {
        return 'Monero';
    }
    /**
     * Derives a Monero seed from a given mnemonic phrase.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or `Mnemonic` instance.
     * @returns {string} The derived Monero seed as a hexadecimal string.
     * @throws {MnemonicError} If the provided mnemonic phrase is invalid.
     */
    static fromMnemonic(mnemonic) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.MoneroMnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        return mnemonics_1.MoneroMnemonic.decode(phrase);
    }
}
exports.MoneroSeed = MoneroSeed;
//# sourceMappingURL=monero.js.map