// SPDX-License-Identifier: MIT
import { Seed } from './seed';
import { SeedError } from '../exceptions';
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
export class SEEDS {
    static dictionary = {
        [AlgorandSeed.getName()]: AlgorandSeed,
        [BIP39Seed.getName()]: BIP39Seed,
        [CardanoSeed.getName()]: CardanoSeed,
        [ElectrumV1Seed.getName()]: ElectrumV1Seed,
        [ElectrumV2Seed.getName()]: ElectrumV2Seed,
        [MoneroSeed.getName()]: MoneroSeed
    };
    /**
     * Returns the names of all available seed classes.
     *
     * @returns {string[]} Array of seed class names.
     */
    static getNames() {
        return Object.keys(this.dictionary);
    }
    /**
     * Returns all seed class constructors.
     *
     * @returns {typeof Seed[]} Array of seed class constructors.
     */
    static getClasses() {
        return Object.values(this.dictionary);
    }
    /**
     * Retrieves a specific seed class by name.
     *
     * @param {string} name - The name of the seed class.
     * @returns {typeof Seed} The corresponding seed class.
     * @throws {SeedError} If the provided seed name is invalid.
     */
    static getSeedClass(name) {
        if (!this.isSeed(name)) {
            throw new SeedError('Invalid seed name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    /**
     * Checks if a given name corresponds to a valid registered seed type.
     *
     * @param {string} name - The seed name to check.
     * @returns {boolean} `true` if valid, otherwise `false`.
     */
    static isSeed(name) {
        return this.getNames().includes(name);
    }
}
export { Seed, AlgorandSeed, BIP39Seed, CardanoSeed, ElectrumV1Seed, ElectrumV2Seed, MoneroSeed };
//# sourceMappingURL=index.js.map