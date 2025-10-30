import { Entropy } from './entropy';
export declare const MONERO_ENTROPY_STRENGTHS: {
    readonly ONE_HUNDRED_TWENTY_EIGHT: 128;
    readonly TWO_HUNDRED_FIFTY_SIX: 256;
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
export declare class MoneroEntropy extends Entropy {
    /**
     * List of supported entropy strengths for Monero.
     *
     * @type {number[]}
     */
    static strengths: (256 | 128)[];
    /**
     * Get the name of this entropy class.
     *
     * @returns {string} The name of the entropy class.
     */
    static getName(): string;
}
//# sourceMappingURL=monero.d.ts.map