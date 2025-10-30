import { Seed } from './seed';
import { Mnemonic } from '../mnemonics';
/**
 * Represents the **Algorand** seed implementation.
 *
 * The `AlgorandSeed` class extends the base `Seed` class and provides
 * functionality for generating and validating Algorand-compatible seeds.
 *
 * This class primarily handles conversion from mnemonic phrases
 * (either as plain strings or `Mnemonic` instances) into seed bytes.
 */
export declare class AlgorandSeed extends Seed {
    /**
     * Returns the name identifier for this seed type.
     *
     * @returns {string} The string `"Algorand"`.
     */
    static getName(): string;
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
    static fromMnemonic(mnemonic: string | Mnemonic): string;
}
//# sourceMappingURL=algorand.d.ts.map