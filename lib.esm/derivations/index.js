// SPDX-License-Identifier: MIT
import { Derivation } from './derivation';
import { CustomDerivation } from './custom';
import { BIP44Derivation, CHANGES } from './bip44';
import { BIP49Derivation } from './bip49';
import { BIP84Derivation } from './bip84';
import { BIP86Derivation } from './bip86';
import { CIP1852Derivation, ROLES } from './cip1852';
import { ElectrumDerivation } from './electrum';
import { MoneroDerivation } from './monero';
import { HDWDerivation } from './hdw';
import { DerivationError } from '../exceptions';
/**
 * A registry for all derivation classes.
 * Provides methods to access, validate, and retrieve derivation class definitions.
 */
export class DERIVATIONS {
    /**
     * A dictionary mapping derivation names to their corresponding classes.
     * @type {Record<string, typeof Derivation>}
     */
    static dictionary = {
        [CustomDerivation.getName()]: CustomDerivation,
        [BIP44Derivation.getName()]: BIP44Derivation,
        [BIP49Derivation.getName()]: BIP49Derivation,
        [BIP84Derivation.getName()]: BIP84Derivation,
        [BIP86Derivation.getName()]: BIP86Derivation,
        [CIP1852Derivation.getName()]: CIP1852Derivation,
        [ElectrumDerivation.getName()]: ElectrumDerivation,
        [MoneroDerivation.getName()]: MoneroDerivation,
        [HDWDerivation.getName()]: HDWDerivation
    };
    /**
     * Returns all available derivation names.
     * @returns {string[]} List of derivation names.
     */
    static getNames() {
        return Object.keys(this.dictionary);
    }
    /**
     * Returns all available derivation classes.
     * @returns {typeof Derivation[]} List of derivation class constructors.
     */
    static getClasses() {
        return Object.values(this.dictionary);
    }
    /**
     * Retrieves a derivation class by name.
     * @param {string} name - The derivation name.
     * @returns {typeof Derivation} The derivation class corresponding to the given name.
     * @throws {DerivationError} If the provided name is not a valid derivation.
     */
    static getDerivationClass(name) {
        if (!this.isDerivation(name)) {
            throw new DerivationError('Invalid derivation name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    /**
     * Checks if a derivation name exists in the dictionary.
     * @param {string} name - The derivation name to check.
     * @returns {boolean} True if the derivation name exists, false otherwise.
     */
    static isDerivation(name) {
        return this.dictionary.hasOwnProperty(name);
    }
}
export { Derivation, CustomDerivation, BIP44Derivation, CHANGES, BIP49Derivation, BIP84Derivation, BIP86Derivation, CIP1852Derivation, ROLES, ElectrumDerivation, MoneroDerivation, HDWDerivation };
//# sourceMappingURL=index.js.map