"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorandEntropy = exports.ALGORAND_ENTROPY_STRENGTHS = void 0;
const entropy_1 = require("./entropy");
exports.ALGORAND_ENTROPY_STRENGTHS = {
    TWO_HUNDRED_FIFTY_SIX: 256
};
/**
 * AlgorandEntropy class.
 *
 * Uses entropy to generate a mnemonic phrase specific to Algorand,
 * ensuring secure account creation with a unique checksum.
 *
 * This class extends `Entropy`, so all base functionality is available.
 *
 * @extends Entropy
 */
class AlgorandEntropy extends entropy_1.Entropy {
    /**
    * List of supported entropy strengths for Algorand.
    *
    * @type {number[]}
    */
    static strengths = [
        exports.ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    ];
    /**
    * Get the name of this entropy class.
    *
    * @returns {string} The name of the entropy class.
    */
    static getName() {
        return 'Algorand';
    }
}
exports.AlgorandEntropy = AlgorandEntropy;
//# sourceMappingURL=algorand.js.map