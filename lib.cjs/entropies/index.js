"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONERO_ENTROPY_STRENGTHS = exports.MoneroEntropy = exports.ELECTRUM_V2_ENTROPY_STRENGTHS = exports.ElectrumV2Entropy = exports.ELECTRUM_V1_ENTROPY_STRENGTHS = exports.ElectrumV1Entropy = exports.BIP39_ENTROPY_STRENGTHS = exports.BIP39Entropy = exports.ALGORAND_ENTROPY_STRENGTHS = exports.AlgorandEntropy = exports.Entropy = exports.ENTROPIES = void 0;
const entropy_1 = require("./entropy");
Object.defineProperty(exports, "Entropy", { enumerable: true, get: function () { return entropy_1.Entropy; } });
const algorand_1 = require("./algorand");
Object.defineProperty(exports, "AlgorandEntropy", { enumerable: true, get: function () { return algorand_1.AlgorandEntropy; } });
Object.defineProperty(exports, "ALGORAND_ENTROPY_STRENGTHS", { enumerable: true, get: function () { return algorand_1.ALGORAND_ENTROPY_STRENGTHS; } });
const bip39_1 = require("./bip39");
Object.defineProperty(exports, "BIP39Entropy", { enumerable: true, get: function () { return bip39_1.BIP39Entropy; } });
Object.defineProperty(exports, "BIP39_ENTROPY_STRENGTHS", { enumerable: true, get: function () { return bip39_1.BIP39_ENTROPY_STRENGTHS; } });
const v1_1 = require("./electrum/v1");
Object.defineProperty(exports, "ElectrumV1Entropy", { enumerable: true, get: function () { return v1_1.ElectrumV1Entropy; } });
Object.defineProperty(exports, "ELECTRUM_V1_ENTROPY_STRENGTHS", { enumerable: true, get: function () { return v1_1.ELECTRUM_V1_ENTROPY_STRENGTHS; } });
const v2_1 = require("./electrum/v2");
Object.defineProperty(exports, "ElectrumV2Entropy", { enumerable: true, get: function () { return v2_1.ElectrumV2Entropy; } });
Object.defineProperty(exports, "ELECTRUM_V2_ENTROPY_STRENGTHS", { enumerable: true, get: function () { return v2_1.ELECTRUM_V2_ENTROPY_STRENGTHS; } });
const monero_1 = require("./monero");
Object.defineProperty(exports, "MoneroEntropy", { enumerable: true, get: function () { return monero_1.MoneroEntropy; } });
Object.defineProperty(exports, "MONERO_ENTROPY_STRENGTHS", { enumerable: true, get: function () { return monero_1.MONERO_ENTROPY_STRENGTHS; } });
const exceptions_1 = require("../exceptions");
/**
 * A class containing all supported entropy types.
 * @class
 */
class ENTROPIES {
    /**
     * Dictionary of all entropy classes by name.
     * @type {Record<string, typeof Entropy>}
     */
    static dictionary = {
        [algorand_1.AlgorandEntropy.getName()]: algorand_1.AlgorandEntropy,
        [bip39_1.BIP39Entropy.getName()]: bip39_1.BIP39Entropy,
        [v1_1.ElectrumV1Entropy.getName()]: v1_1.ElectrumV1Entropy,
        [v2_1.ElectrumV2Entropy.getName()]: v2_1.ElectrumV2Entropy,
        [monero_1.MoneroEntropy.getName()]: monero_1.MoneroEntropy
    };
    /**
     * Return all entropy names.
     * @returns {string[]} Array of entropy names
     */
    static getNames() {
        return Object.keys(this.dictionary);
    }
    /**
     * Return all entropy classes.
     * @returns {typeof Entropy[]} Array of entropy classes
     */
    static getClasses() {
        return Object.values(this.dictionary);
    }
    /**
     * Get a specific entropy class by name.
     * @param {string} name - The entropy name
     * @returns {typeof Entropy} The entropy class
     * @throws {EntropyError} If the name is invalid
     */
    static getEntropyClass(name) {
        if (!this.isEntropy(name)) {
            throw new exceptions_1.EntropyError('Invalid Entropy name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    /**
     * Check if a name is a valid entropy.
     * @param {string} name - The entropy name
     * @returns {boolean} True if the entropy exists, false otherwise
     */
    static isEntropy(name) {
        return this.getNames().includes(name);
    }
}
exports.ENTROPIES = ENTROPIES;
//# sourceMappingURL=index.js.map