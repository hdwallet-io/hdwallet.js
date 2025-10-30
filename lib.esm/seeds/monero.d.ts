import { Mnemonic } from '../mnemonics';
import { Seed } from './seed';
/**
 * Represents the Monero-specific seed derivation implementation.
 *
 * The `MoneroSeed` class provides functionality for validating and
 * decoding Monero mnemonic phrases into their corresponding seed value.
 *
 * Each Monero seed follows the Monero-specific encoding and decoding scheme.
 */
export declare class MoneroSeed extends Seed {
    /**
     * Returns the name of the seed type.
     *
     * @returns {string} The name `"Monero"`.
     */
    static getName(): string;
    /**
     * Derives a Monero seed from a given mnemonic phrase.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or `Mnemonic` instance.
     * @returns {string} The derived Monero seed as a hexadecimal string.
     * @throws {MnemonicError} If the provided mnemonic phrase is invalid.
     */
    static fromMnemonic(mnemonic: string | Mnemonic): string;
}
//# sourceMappingURL=monero.d.ts.map