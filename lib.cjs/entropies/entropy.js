"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entropy = void 0;
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * Base class for entropy types.
 * @class
 */
class Entropy {
    entropy;
    strength;
    static strengths;
    /**
     * Construct an entropy instance.
     * @param {string} entropy - Entropy hex string
     * @throws {EntropyError} If entropy is invalid or unsupported
     */
    constructor(entropy) {
        const entropyBytes = (0, utils_1.getBytes)(entropy);
        const strength = entropyBytes.length;
        const constructor = this.constructor;
        if (constructor.getName() === 'Electrum-V2') {
            if (!constructor.areEntropyBitsEnough(entropyBytes)) {
                throw new exceptions_1.EntropyError('Entropy bits are not enough');
            }
            this.strength = BigInt((0, utils_1.bytesToInteger)(entropyBytes)).toString(2).length;
        }
        else {
            if (!constructor.isValidBytesStrength(strength))
                throw new exceptions_1.EntropyError('Unsupported entropy strength');
            this.strength = strength * 8;
        }
        this.entropy = (0, utils_1.bytesToHex)(entropyBytes);
    }
    /**
     * Get the class name (to be overridden in subclasses)
     * @returns {string}
     * @throws {Error} If not overridden
     */
    static getName() {
        throw new Error('Must override getName()');
    }
    /**
     * Get the name of this entropy instance.
     * @returns {string}
     */
    getName() {
        return this.constructor.getName();
    }
    /**
     * Get the entropy value as hex.
     * @returns {string} Hex string of entropy
     */
    getEntropy() {
        return this.entropy;
    }
    /**
     * Get the entropy strength in bits.
     * @returns {number} Strength in bits
     */
    getStrength() {
        return this.strength;
    }
    /**
     * Generate a new entropy string.
     * @param {number} strength - Strength in bits
     * @returns {string} Generated entropy as hex
     * @throws {Error} If strength is invalid
     */
    static generate(strength) {
        if (!this.strengths.includes(strength)) {
            throw new Error(`Invalid strength ${strength}`);
        }
        return (0, utils_1.bytesToHex)(crypto.getRandomValues(new Uint8Array(strength / 8)));
    }
    /**
     * Check if a string is a valid entropy.
     * @param {string} entropy - Entropy hex string
     * @returns {boolean} True if valid, false otherwise
     */
    static isValid(entropy) {
        return /^[0-9a-fA-F]+$/.test(entropy) && this.isValidStrength(entropy.length * 4);
    }
    /**
     * Check if a strength in bits is valid.
     * @param {number} strength - Strength in bits
     * @returns {boolean} True if valid, false otherwise
     */
    static isValidStrength(strength) {
        return this.strengths.includes(strength);
    }
    /**
     * Check if a byte-length strength is valid.
     * @param {number} bytesStrength - Strength in bytes
     * @returns {boolean} True if valid, false otherwise
     */
    static isValidBytesStrength(bytesStrength) {
        return this.isValidStrength(bytesStrength * 8);
    }
    /**
     * Check if entropy bits are enough (override in subclasses).
     * @param {Uint8Array | number} entropy - Entropy bytes
     * @returns {boolean}
     * @throws {Error} Not implemented
     */
    static areEntropyBitsEnough(entropy) {
        throw new Error('Not implemented');
    }
}
exports.Entropy = Entropy;
//# sourceMappingURL=entropy.js.map