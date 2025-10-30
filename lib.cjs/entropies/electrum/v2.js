"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV2Entropy = exports.ELECTRUM_V2_ENTROPY_STRENGTHS = void 0;
const utils_1 = require("../../utils");
const entropy_1 = require("../entropy");
/**
 * Constants representing the allowed entropy strengths for Electrum V2.
 * @readonly
 * @enum {number}
 */
exports.ELECTRUM_V2_ENTROPY_STRENGTHS = {
    ONE_HUNDRED_THIRTY_TWO: 132,
    TWO_HUNDRED_SIXTY_FOUR: 264
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
class ElectrumV2Entropy extends entropy_1.Entropy {
    /**
     * Supported entropy strengths for Electrum V2.
     * @type {number[]}
     */
    static strengths = [
        exports.ELECTRUM_V2_ENTROPY_STRENGTHS.ONE_HUNDRED_THIRTY_TWO,
        exports.ELECTRUM_V2_ENTROPY_STRENGTHS.TWO_HUNDRED_SIXTY_FOUR
    ];
    /**
     * Returns the name of this entropy class.
     * @returns {string} - The name of the entropy type.
     */
    static getName() {
        return 'Electrum-V2';
    }
    /**
     * Generate a random Electrum V2 entropy value.
     *
     * @param {number} strength - Entropy strength in bits (132 or 264).
     * @returns {string} Hex-encoded entropy string.
     * @throws {Error} If the provided strength is not valid.
     */
    static generate(strength) {
        if (!this.strengths.includes(strength)) {
            throw new Error(`Invalid strength ${strength}`);
        }
        const byteLen = Math.ceil(strength / 8);
        const mask = (BigInt(1) << BigInt(strength)) - BigInt(1);
        const rndBuf = (0, utils_1.randomBytes)(byteLen);
        let rnd = BigInt('0x' + (0, utils_1.bytesToString)(rndBuf)) & mask;
        const msbMask = BigInt(1) << BigInt(strength - 1);
        const combined = msbMask | rnd;
        const outBytes = (0, utils_1.integerToBytes)(combined, byteLen);
        return (0, utils_1.bytesToHex)(outBytes);
    }
    /**
     * Validate whether the given entropy string is valid for Electrum V2.
     *
     * @param {string} entropy - The entropy value in hex.
     * @returns {boolean} True if valid, false otherwise.
     */
    static isValid(entropy) {
        return /^[0-9a-fA-F]+$/.test(entropy) && this.areEntropyBitsEnough((0, utils_1.hexToBytes)(entropy));
    }
    /**
     * Check if a given entropy strength is valid for Electrum V2.
     *
     * @param {number} strength - The entropy strength in bits.
     * @returns {boolean} True if the strength is valid, false otherwise.
     */
    static isValidStrength(strength) {
        return this.strengths.some((s) => strength >= s - 11 && strength <= s);
    }
    /**
     * Verify if the provided entropy contains enough bits for Electrum V2.
     *
     * @param {Uint8Array|number} entropy - Entropy bytes or integer value.
     * @returns {boolean} True if enough entropy bits, false otherwise.
     */
    static areEntropyBitsEnough(entropy) {
        let intVal = entropy instanceof Uint8Array ? (0, utils_1.bytesToInteger)(entropy) : BigInt(entropy);
        if (intVal <= BigInt(0))
            return false;
        const entropyStrength = intVal.toString(2).length - 1;
        return this.isValidStrength(entropyStrength);
    }
}
exports.ElectrumV2Entropy = ElectrumV2Entropy;
//# sourceMappingURL=v2.js.map