import { Entropy } from '../entropy';
/**
 * Constants representing the allowed entropy strengths for Electrum V1.
 * @readonly
 * @enum {number}
 */
export declare const ELECTRUM_V1_ENTROPY_STRENGTHS: {
    readonly ONE_HUNDRED_TWENTY_EIGHT: 128;
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
export declare class ElectrumV1Entropy extends Entropy {
    /**
     * Supported entropy strengths for Electrum V1.
     * @type {number[]}
     */
    static strengths: 128[];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName(): string;
}
//# sourceMappingURL=v1.d.ts.map