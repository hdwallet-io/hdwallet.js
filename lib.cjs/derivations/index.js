"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWDerivation = exports.MoneroDerivation = exports.ElectrumDerivation = exports.ROLES = exports.CIP1852Derivation = exports.BIP86Derivation = exports.BIP84Derivation = exports.BIP49Derivation = exports.CHANGES = exports.BIP44Derivation = exports.CustomDerivation = exports.Derivation = exports.DERIVATIONS = void 0;
const derivation_1 = require("./derivation");
Object.defineProperty(exports, "Derivation", { enumerable: true, get: function () { return derivation_1.Derivation; } });
const custom_1 = require("./custom");
Object.defineProperty(exports, "CustomDerivation", { enumerable: true, get: function () { return custom_1.CustomDerivation; } });
const bip44_1 = require("./bip44");
Object.defineProperty(exports, "BIP44Derivation", { enumerable: true, get: function () { return bip44_1.BIP44Derivation; } });
Object.defineProperty(exports, "CHANGES", { enumerable: true, get: function () { return bip44_1.CHANGES; } });
const bip49_1 = require("./bip49");
Object.defineProperty(exports, "BIP49Derivation", { enumerable: true, get: function () { return bip49_1.BIP49Derivation; } });
const bip84_1 = require("./bip84");
Object.defineProperty(exports, "BIP84Derivation", { enumerable: true, get: function () { return bip84_1.BIP84Derivation; } });
const bip86_1 = require("./bip86");
Object.defineProperty(exports, "BIP86Derivation", { enumerable: true, get: function () { return bip86_1.BIP86Derivation; } });
const cip1852_1 = require("./cip1852");
Object.defineProperty(exports, "CIP1852Derivation", { enumerable: true, get: function () { return cip1852_1.CIP1852Derivation; } });
Object.defineProperty(exports, "ROLES", { enumerable: true, get: function () { return cip1852_1.ROLES; } });
const electrum_1 = require("./electrum");
Object.defineProperty(exports, "ElectrumDerivation", { enumerable: true, get: function () { return electrum_1.ElectrumDerivation; } });
const monero_1 = require("./monero");
Object.defineProperty(exports, "MoneroDerivation", { enumerable: true, get: function () { return monero_1.MoneroDerivation; } });
const hdw_1 = require("./hdw");
Object.defineProperty(exports, "HDWDerivation", { enumerable: true, get: function () { return hdw_1.HDWDerivation; } });
const exceptions_1 = require("../exceptions");
/**
 * A registry for all derivation classes.
 * Provides methods to access, validate, and retrieve derivation class definitions.
 */
class DERIVATIONS {
    /**
     * A dictionary mapping derivation names to their corresponding classes.
     * @type {Record<string, typeof Derivation>}
     */
    static dictionary = {
        [custom_1.CustomDerivation.getName()]: custom_1.CustomDerivation,
        [bip44_1.BIP44Derivation.getName()]: bip44_1.BIP44Derivation,
        [bip49_1.BIP49Derivation.getName()]: bip49_1.BIP49Derivation,
        [bip84_1.BIP84Derivation.getName()]: bip84_1.BIP84Derivation,
        [bip86_1.BIP86Derivation.getName()]: bip86_1.BIP86Derivation,
        [cip1852_1.CIP1852Derivation.getName()]: cip1852_1.CIP1852Derivation,
        [electrum_1.ElectrumDerivation.getName()]: electrum_1.ElectrumDerivation,
        [monero_1.MoneroDerivation.getName()]: monero_1.MoneroDerivation,
        [hdw_1.HDWDerivation.getName()]: hdw_1.HDWDerivation
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
            throw new exceptions_1.DerivationError('Invalid derivation name', { expected: this.getNames(), got: name });
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
exports.DERIVATIONS = DERIVATIONS;
//# sourceMappingURL=index.js.map