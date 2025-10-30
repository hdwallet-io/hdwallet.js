import { Mnemonic } from './mnemonic';
import { AlgorandMnemonic, ALGORAND_MNEMONIC_WORDS, ALGORAND_MNEMONIC_LANGUAGES } from './algorand/mnemonic';
import { BIP39Mnemonic, BIP39_MNEMONIC_WORDS, BIP39_MNEMONIC_LANGUAGES } from './bip39/mnemonic';
import { ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_WORDS, ELECTRUM_V1_MNEMONIC_LANGUAGES } from './electrum/v1/mnemonic';
import { ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES } from './electrum/v2/mnemonic';
import { MoneroMnemonic, MONERO_MNEMONIC_WORDS, MONERO_MNEMONIC_LANGUAGES } from './monero/mnemonic';
/**
 * Registry for all supported mnemonic schemes.
 *
 * Provides utility functions to:
 *  - List all available mnemonic names (`getNames`).
 *  - Retrieve classes for each mnemonic (`getClasses`).
 *  - Lookup a specific mnemonic implementation by name (`getMnemonicClass`).
 *  - Validate whether a mnemonic name is supported (`isMnemonic`).
 */
export declare class MNEMONICS {
    /**
     * Internal dictionary mapping mnemonic names to their class implementations.
     */
    private static dictionary;
    /**
     * Get the list of all supported mnemonic names.
     *
     * @returns {string[]} Array of mnemonic names, e.g. `["Algorand", "BIP39", "Electrum-V1", "Electrum-V2", "Monero"]`.
     */
    static getNames(): string[];
    /**
     * Get the list of all supported mnemonic classes.
     *
     * @returns {typeof Mnemonic[]} Array of mnemonic class constructors.
     */
    static getClasses(): typeof Mnemonic[];
    /**
     * Lookup a mnemonic class by name.
     *
     * @param {string} name - The mnemonic name to lookup (e.g. `"BIP39"`).
     * @throws {MnemonicError} If the name is invalid or unsupported.
     * @returns {typeof Mnemonic} The corresponding mnemonic class.
     */
    static getMnemonicClass(name: string): typeof Mnemonic | any;
    /**
     * Check if a given name corresponds to a supported mnemonic.
     *
     * @param {string} name - The mnemonic name to check.
     * @returns {boolean} `true` if the name is supported, otherwise `false`.
     */
    static isMnemonic(name: string): boolean;
}
export { Mnemonic, AlgorandMnemonic, ALGORAND_MNEMONIC_WORDS, ALGORAND_MNEMONIC_LANGUAGES, BIP39Mnemonic, BIP39_MNEMONIC_WORDS, BIP39_MNEMONIC_LANGUAGES, ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_WORDS, ELECTRUM_V1_MNEMONIC_LANGUAGES, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES, MoneroMnemonic, MONERO_MNEMONIC_WORDS, MONERO_MNEMONIC_LANGUAGES };
//# sourceMappingURL=index.d.ts.map