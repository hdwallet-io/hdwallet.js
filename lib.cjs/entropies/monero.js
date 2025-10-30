"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroEntropy = exports.MONERO_ENTROPY_STRENGTHS = void 0;
const entropy_1 = require("./entropy");
exports.MONERO_ENTROPY_STRENGTHS = {
    ONE_HUNDRED_TWENTY_EIGHT: 128,
    TWO_HUNDRED_FIFTY_SIX: 256
};
/**
 * MoneroEntropy class.
 *
 * Uses entropy to generate a mnemonic phrase specific to Monero,
 * ensuring secure account creation with a unique checksum.
 *
 * This class extends `Entropy`, so all base functionality is available.
 *
 * @extends Entropy
 */
class MoneroEntropy extends entropy_1.Entropy {
    /**
     * List of supported entropy strengths for Monero.
     *
     * @type {number[]}
     */
    static strengths = [
        exports.MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        exports.MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    ];
    /**
     * Get the name of this entropy class.
     *
     * @returns {string} The name of the entropy class.
     */
    static getName() {
        return 'Monero';
    }
}
exports.MoneroEntropy = MoneroEntropy;
//# sourceMappingURL=monero.js.map