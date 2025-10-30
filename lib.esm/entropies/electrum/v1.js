// SPDX-License-Identifier: MIT
import { Entropy } from '../entropy';
/**
 * Constants representing the allowed entropy strengths for Electrum V1.
 * @readonly
 * @enum {number}
 */
export const ELECTRUM_V1_ENTROPY_STRENGTHS = {
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
export class ElectrumV1Entropy extends Entropy {
    /**
     * Supported entropy strengths for Electrum V1.
     * @type {number[]}
     */
    static strengths = [
        ELECTRUM_V1_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
    ];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName() {
        return 'Electrum-V1';
    }
}
//# sourceMappingURL=v1.js.map