"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV1Entropy = exports.ELECTRUM_V1_ENTROPY_STRENGTHS = void 0;
const entropy_1 = require("../entropy");
/**
 * Constants representing the allowed entropy strengths for Electrum V1.
 * @readonly
 * @enum {number}
 */
exports.ELECTRUM_V1_ENTROPY_STRENGTHS = {
    ONE_HUNDRED_TWENTY_EIGHT: 128
};
/**
 * ElectrumV1Entropy class for generating mnemonic phrases according to the
 * Electrum V1 standard.
 *
 * Uses 128-bit entropy to generate mnemonic phrases specific to Electrum V1.
 *
 * This class inherits from the `Entropy` base class, so all base functionality
 * (entropy validation, generation, etc.) is available.
 */
class ElectrumV1Entropy extends entropy_1.Entropy {
    /**
     * Supported entropy strengths for Electrum V1.
     * @type {number[]}
     */
    static strengths = [
        exports.ELECTRUM_V1_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
    ];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName() {
        return 'Electrum-V1';
    }
}
exports.ElectrumV1Entropy = ElectrumV1Entropy;
//# sourceMappingURL=v1.js.map