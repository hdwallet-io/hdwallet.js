import { Entropy } from './entropy';
/**
 * Constants representing the allowed entropy strengths for BIP39.
 * @readonly
 * @enum {number}
 */
export declare const BIP39_ENTROPY_STRENGTHS: {
    readonly ONE_HUNDRED_TWENTY_EIGHT: 128;
    readonly ONE_HUNDRED_SIXTY: 160;
    readonly ONE_HUNDRED_NINETY_TWO: 192;
    readonly TWO_HUNDRED_TWENTY_FOUR: 224;
    readonly TWO_HUNDRED_FIFTY_SIX: 256;
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
export declare class BIP39Entropy extends Entropy {
    /**
     * Supported entropy strengths for BIP39.
     * @type {number[]}
     */
    static strengths: (256 | 128 | 160 | 192 | 224)[];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName(): string;
}
//# sourceMappingURL=bip39.d.ts.map