import { Seed } from '../seed';
import { Mnemonic } from '../../mnemonics';
/**
 * Represents the Electrum-V1 seed generation process.
 *
 * This class is responsible for creating a seed from an Electrum-V1 mnemonic phrase.
 * The mnemonic is validated and decoded, and the resulting entropy is hashed iteratively
 * using SHA-256 to derive the final Electrum-V1 seed.
 */
export declare class ElectrumV1Seed extends Seed {
    static hashIterationNumber: number;
    /**
     * Returns the name of this seed type.
     *
     * @returns {string} The string `'Electrum-V1'`.
     */
    static getName(): string;
    /**
     * Derives an Electrum-V1 seed from a mnemonic phrase.
     *
     * The mnemonic is validated using `ElectrumV1Mnemonic.isValid()`.
     * Then, it is decoded to entropy, and hashed 100,000 times with SHA-256,
     * concatenating the entropy at each step to derive the final seed.
     *
     * @param {string | Mnemonic} mnemonic - The Electrum-V1 mnemonic phrase or a Mnemonic instance.
     * @returns {string} The derived Electrum-V1 seed as a hexadecimal string.
     * @throws {MnemonicError} If the provided mnemonic is invalid.
     */
    static fromMnemonic(mnemonic: string | Mnemonic): string;
}
//# sourceMappingURL=v1.d.ts.map