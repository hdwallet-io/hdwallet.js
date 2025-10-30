/**
 * Base class for entropy types.
 * @class
 */
export declare class Entropy {
    protected entropy: string;
    protected strength: number;
    static strengths: number[];
    /**
     * Construct an entropy instance.
     * @param {string} entropy - Entropy hex string
     * @throws {EntropyError} If entropy is invalid or unsupported
     */
    constructor(entropy: string);
    /**
     * Get the class name (to be overridden in subclasses)
     * @returns {string}
     * @throws {Error} If not overridden
     */
    static getName(): string;
    /**
     * Get the name of this entropy instance.
     * @returns {string}
     */
    getName(): string;
    /**
     * Get the entropy value as hex.
     * @returns {string} Hex string of entropy
     */
    getEntropy(): string;
    /**
     * Get the entropy strength in bits.
     * @returns {number} Strength in bits
     */
    getStrength(): number;
    /**
     * Generate a new entropy string.
     * @param {number} strength - Strength in bits
     * @returns {string} Generated entropy as hex
     * @throws {Error} If strength is invalid
     */
    static generate(strength: number): string;
    /**
     * Check if a string is a valid entropy.
     * @param {string} entropy - Entropy hex string
     * @returns {boolean} True if valid, false otherwise
     */
    static isValid(entropy: string): boolean;
    /**
     * Check if a strength in bits is valid.
     * @param {number} strength - Strength in bits
     * @returns {boolean} True if valid, false otherwise
     */
    static isValidStrength(strength: number): boolean;
    /**
     * Check if a byte-length strength is valid.
     * @param {number} bytesStrength - Strength in bytes
     * @returns {boolean} True if valid, false otherwise
     */
    static isValidBytesStrength(bytesStrength: number): boolean;
    /**
     * Check if entropy bits are enough (override in subclasses).
     * @param {Uint8Array | number} entropy - Entropy bytes
     * @returns {boolean}
     * @throws {Error} Not implemented
     */
    static areEntropyBitsEnough(entropy: Uint8Array | number): boolean;
}
//# sourceMappingURL=entropy.d.ts.map