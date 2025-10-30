import { Seed } from './seed';
import { AlgorandSeed } from './algorand';
import { BIP39Seed } from './bip39';
import { CardanoSeed } from './cardano';
import { ElectrumV1Seed, ElectrumV2Seed } from './electrum';
import { MoneroSeed } from './monero';
/**
 * The SEEDS class acts as a centralized registry for all supported seed types.
 *
 * It provides a unified interface for accessing, validating, and retrieving seed classes
 * (such as Algorand, BIP39, Cardano, Electrum, and Monero).
 *
 * Each seed class implements the `Seed` base class and defines its own derivation logic.
 */
export declare class SEEDS {
    private static dictionary;
    /**
     * Returns the names of all available seed classes.
     *
     * @returns {string[]} Array of seed class names.
     */
    static getNames(): string[];
    /**
     * Returns all seed class constructors.
     *
     * @returns {typeof Seed[]} Array of seed class constructors.
     */
    static getClasses(): typeof Seed[];
    /**
     * Retrieves a specific seed class by name.
     *
     * @param {string} name - The name of the seed class.
     * @returns {typeof Seed} The corresponding seed class.
     * @throws {SeedError} If the provided seed name is invalid.
     */
    static getSeedClass(name: string): typeof Seed | any;
    /**
     * Checks if a given name corresponds to a valid registered seed type.
     *
     * @param {string} name - The seed name to check.
     * @returns {boolean} `true` if valid, otherwise `false`.
     */
    static isSeed(name: string): boolean;
}
export { Seed, AlgorandSeed, BIP39Seed, CardanoSeed, ElectrumV1Seed, ElectrumV2Seed, MoneroSeed };
//# sourceMappingURL=index.d.ts.map