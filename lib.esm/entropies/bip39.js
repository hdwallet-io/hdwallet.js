// SPDX-License-Identifier: MIT
import { Entropy } from './entropy';
/**
 * Constants representing the allowed entropy strengths for BIP39.
 * @readonly
 * @enum {number}
 */
export const BIP39_ENTROPY_STRENGTHS = {
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
export class BIP39Entropy extends Entropy {
    /**
     * Supported entropy strengths for BIP39.
     * @type {number[]}
     */
    static strengths = [
        BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_SIXTY,
        BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_NINETY_TWO,
        BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_TWENTY_FOUR,
        BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    ];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName() {
        return 'BIP39';
    }
}
//# sourceMappingURL=bip39.js.map