import { Entropy } from './entropy';
import { AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS } from './algorand';
import { BIP39Entropy, BIP39_ENTROPY_STRENGTHS } from './bip39';
import { ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS } from './electrum/v1';
import { ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS } from './electrum/v2';
import { MoneroEntropy, MONERO_ENTROPY_STRENGTHS } from './monero';
/**
 * A class containing all supported entropy types.
 * @class
 */
export declare class ENTROPIES {
    /**
     * Dictionary of all entropy classes by name.
     * @type {Record<string, typeof Entropy>}
     */
    static dictionary: Record<string, typeof Entropy>;
    /**
     * Return all entropy names.
     * @returns {string[]} Array of entropy names
     */
    static getNames(): string[];
    /**
     * Return all entropy classes.
     * @returns {typeof Entropy[]} Array of entropy classes
     */
    static getClasses(): typeof Entropy[];
    /**
     * Get a specific entropy class by name.
     * @param {string} name - The entropy name
     * @returns {typeof Entropy} The entropy class
     * @throws {EntropyError} If the name is invalid
     */
    static getEntropyClass(name: string): typeof Entropy | any;
    /**
     * Check if a name is a valid entropy.
     * @param {string} name - The entropy name
     * @returns {boolean} True if the entropy exists, false otherwise
     */
    static isEntropy(name: string): boolean;
}
export { Entropy, AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS, BIP39Entropy, BIP39_ENTROPY_STRENGTHS, ElectrumV1Entropy, ELECTRUM_V1_ENTROPY_STRENGTHS, ElectrumV2Entropy, ELECTRUM_V2_ENTROPY_STRENGTHS, MoneroEntropy, MONERO_ENTROPY_STRENGTHS };
//# sourceMappingURL=index.d.ts.map