import { Seed } from './seed';
import { SeedOptionsInterface } from '../interfaces';
import { Mnemonic } from '../mnemonics';
/**
 * Represents a Cardano seed generator, supporting multiple
 * derivation standards including Byron (Icarus, Ledger, Legacy)
 * and Shelley (Icarus, Ledger).
 */
export declare class CardanoSeed extends Seed {
    /**
     * Creates a new instance of CardanoSeed.
     *
     * @param {string} seed - The hexadecimal seed string.
     * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional seed configuration including the Cardano type.
     * @throws {SeedError} If the provided cardanoType is invalid.
     */
    constructor(seed: string, options?: SeedOptionsInterface);
    /**
     * Returns the name of this seed type.
     *
     * @returns {string} The string `"Cardano"`.
     */
    static getName(): string;
    /**
     * Returns the current Cardano type assigned to this seed instance.
     *
     * @returns {string} The selected Cardano type.
     * @throws {SeedError} If no `cardanoType` is found in the options.
     */
    getCardanoType(): string;
    /**
     * Generates a Cardano seed from a mnemonic phrase, supporting multiple Cardano derivation types.
     *
     * @param {string | Mnemonic} mnemonic - A mnemonic phrase or Mnemonic object.
     * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional parameters including passphrase and cardanoType.
     * @returns {string} A hexadecimal string representing the derived Cardano seed.
     * @throws {MnemonicError} If the mnemonic is invalid.
     * @throws {SeedError} If the Cardano type is invalid.
     */
    static fromMnemonic(mnemonic: string | Mnemonic, options?: SeedOptionsInterface): string;
    /**
     * Generates a Byron-Icarus seed from a valid BIP39 mnemonic.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     * @throws {MnemonicError} If the mnemonic is invalid.
     */
    private static generateByronIcarus;
    /**
     * Generates a Byron-Ledger seed using PBKDF2-HMAC-SHA512.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @param {string | null} [passphrase] - Optional passphrase for additional entropy.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    private static generateByronLedger;
    /**
     * Generates a Byron-Legacy seed by CBOR encoding and hashing the decoded mnemonic.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     * @throws {MnemonicError} If the mnemonic is invalid.
     */
    private static generateByronLegacy;
    /**
     * Generates a Shelley-Icarus seed (same as Byron-Icarus).
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    private static generateShelleyIcarus;
    /**
     * Generates a Shelley-Ledger seed (same as Byron-Ledger).
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @param {string | null} [passphrase] - Optional passphrase.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    private static generateShelleyLedger;
}
//# sourceMappingURL=cardano.d.ts.map