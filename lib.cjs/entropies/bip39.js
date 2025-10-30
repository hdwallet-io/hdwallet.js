"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP39Entropy = exports.BIP39_ENTROPY_STRENGTHS = void 0;
const entropy_1 = require("./entropy");
/**
 * Constants representing the allowed entropy strengths for BIP39.
 * @readonly
 * @enum {number}
 */
exports.BIP39_ENTROPY_STRENGTHS = {
    ONE_HUNDRED_TWENTY_EIGHT: 128,
    ONE_HUNDRED_SIXTY: 160,
    ONE_HUNDRED_NINETY_TWO: 192,
    TWO_HUNDRED_TWENTY_FOUR: 224,
    TWO_HUNDRED_FIFTY_SIX: 256
};
/**
 * BIP39Entropy class for generating mnemonic phrases according to the BIP39 standard.
 *
 * Uses entropy to generate a mnemonic phrase specific to BIP39, ensuring secure wallet
 * creation with a checksum.
 *
 * This class inherits from the `Entropy` base class, so all base functionality
 * (entropy validation, generation, etc.) is available.
 */
class BIP39Entropy extends entropy_1.Entropy {
    /**
     * Supported entropy strengths for BIP39.
     * @type {number[]}
     */
    static strengths = [
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_SIXTY,
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_NINETY_TWO,
        exports.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_TWENTY_FOUR,
        exports.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    ];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName() {
        return 'BIP39';
    }
}
exports.BIP39Entropy = BIP39Entropy;
//# sourceMappingURL=bip39.js.map