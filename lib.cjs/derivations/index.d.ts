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
/**
 * A registry for all derivation classes.
 * Provides methods to access, validate, and retrieve derivation class definitions.
 */
export declare class DERIVATIONS {
    /**
     * A dictionary mapping derivation names to their corresponding classes.
     * @type {Record<string, typeof Derivation>}
     */
    static dictionary: Record<string, typeof Derivation>;
    /**
     * Returns all available derivation names.
     * @returns {string[]} List of derivation names.
     */
    static getNames(): string[];
    /**
     * Returns all available derivation classes.
     * @returns {typeof Derivation[]} List of derivation class constructors.
     */
    static getClasses(): typeof Derivation[];
    /**
     * Retrieves a derivation class by name.
     * @param {string} name - The derivation name.
     * @returns {typeof Derivation} The derivation class corresponding to the given name.
     * @throws {DerivationError} If the provided name is not a valid derivation.
     */
    static getDerivationClass(name: string): typeof Derivation | any;
    /**
     * Checks if a derivation name exists in the dictionary.
     * @param {string} name - The derivation name to check.
     * @returns {boolean} True if the derivation name exists, false otherwise.
     */
    static isDerivation(name: string): boolean;
}
export { Derivation, CustomDerivation, BIP44Derivation, CHANGES, BIP49Derivation, BIP84Derivation, BIP86Derivation, CIP1852Derivation, ROLES, ElectrumDerivation, MoneroDerivation, HDWDerivation };
//# sourceMappingURL=index.d.ts.map