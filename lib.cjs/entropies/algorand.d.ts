import { Entropy } from './entropy';
export declare const ALGORAND_ENTROPY_STRENGTHS: {
    readonly TWO_HUNDRED_FIFTY_SIX: 256;
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
export declare class AlgorandEntropy extends Entropy {
    /**
    * List of supported entropy strengths for Algorand.
    *
    * @type {number[]}
    */
    static strengths: 256[];
    /**
    * Get the name of this entropy class.
    *
    * @returns {string} The name of the entropy class.
    */
    static getName(): string;
}
//# sourceMappingURL=algorand.d.ts.map