import { Entropy } from '../entropy';
/**
 * Constants representing the allowed entropy strengths for Electrum V2.
 * @readonly
 * @enum {number}
 */
export declare const ELECTRUM_V2_ENTROPY_STRENGTHS: {
    readonly ONE_HUNDRED_THIRTY_TWO: 132;
    readonly TWO_HUNDRED_SIXTY_FOUR: 264;
};
/**
 * ElectrumV2Entropy class for handling entropy used in Electrum V2 wallets.
 *
 * Electrum V2 supports variable entropy sizes (132 or 264 bits), unlike V1.
 * This ensures compatibility with the Electrum V2 mnemonic scheme.
 *
 * Inherits core functionality such as entropy validation and generation
 * from the Entropy base class.
 */
export declare class ElectrumV2Entropy extends Entropy {
    /**
     * Supported entropy strengths for Electrum V2.
     * @type {number[]}
     */
    static strengths: number[];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName(): string;
    /**
     * Generate a random Electrum V2 entropy value.
     *
     * @param {number} strength - Entropy strength in bits (132 or 264).
     * @returns {string} Hex-encoded entropy string.
     * @throws {Error} If the provided strength is not valid.
     */
    static generate(strength: number): string;
    /**
     * Validate whether the given entropy string is valid for Electrum V2.
     *
     * @param {string} entropy - The entropy value in hex.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValid(entropy: string): boolean;
    /**
     * Check if a given entropy strength is valid for Electrum V2.
     *
     * @param {number} strength - The entropy strength in bits.
     * @returns {boolean} True if the strength is valid, false otherwise.
     */
    static isValidStrength(strength: number): boolean;
    /**
     * Verify if the provided entropy contains enough bits for Electrum V2.
     *
     * @param {Uint8Array|number} entropy - Entropy bytes or integer value.
     * @returns {boolean} True if enough entropy bits, false otherwise.
     */
    static areEntropyBitsEnough(entropy: Uint8Array | number): boolean;
}
//# sourceMappingURL=v2.d.ts.map