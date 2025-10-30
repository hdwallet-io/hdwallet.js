// SPDX-License-Identifier: MIT
import { Seed } from './seed';
import { AlgorandMnemonic } from '../mnemonics';
import { MnemonicError } from '../exceptions';
/**
 * Represents the **Algorand** seed implementation.
 *
 * The `AlgorandSeed` class extends the base `Seed` class and provides
 * functionality for generating and validating Algorand-compatible seeds.
 *
 * This class primarily handles conversion from mnemonic phrases
 * (either as plain strings or `Mnemonic` instances) into seed bytes.
 */
export class AlgorandSeed extends Seed {
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
        if (!AlgorandMnemonic.isValid(phrase)) {
            throw new MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        return AlgorandMnemonic.decode(phrase);
    }
}
//# sourceMappingURL=algorand.js.map