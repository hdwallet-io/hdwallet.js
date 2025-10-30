"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV1Seed = void 0;
const seed_1 = require("../seed");
const mnemonics_1 = require("../../mnemonics");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
/**
 * Represents the Electrum-V1 seed generation process.
 *
 * This class is responsible for creating a seed from an Electrum-V1 mnemonic phrase.
 * The mnemonic is validated and decoded, and the resulting entropy is hashed iteratively
 * using SHA-256 to derive the final Electrum-V1 seed.
 */
class ElectrumV1Seed extends seed_1.Seed {
    static hashIterationNumber = 10 ** 5;
    /**
     * Returns the name of this seed type.
     *
     * @returns {string} The string `'Electrum-V1'`.
     */
    static getName() {
        return 'Electrum-V1';
    }
    /**
     * Derives an Electrum-V1 seed from a mnemonic phrase.
     *
     * The mnemonic is validated using `ElectrumV1Mnemonic.isValid()`.
     * Then, it is decoded to entropy, and hashed 100,000 times with SHA-256,
     * concatenating the entropy at each step to derive the final seed.
     *
     * @param {string | Mnemonic} mnemonic - The Electrum-V1 mnemonic phrase or a Mnemonic instance.
     * @returns {string} The derived Electrum-V1 seed as a hexadecimal string.
     * @throws {MnemonicError} If the provided mnemonic is invalid.
     */
    static fromMnemonic(mnemonic) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.ElectrumV1Mnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        const entropy = mnemonics_1.ElectrumV1Mnemonic.decode(phrase);
        const entropyBuffer = (0, utils_1.toBuffer)(entropy, 'utf8');
        let entropyHash = entropyBuffer;
        for (let i = 0; i < this.hashIterationNumber; i++) {
            entropyHash = (0, crypto_1.sha256)((0, utils_1.concatBytes)(entropyHash, entropyBuffer));
        }
        return (0, utils_1.bytesToString)(entropyHash);
    }
}
exports.ElectrumV1Seed = ElectrumV1Seed;
//# sourceMappingURL=v1.js.map