"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP39Seed = void 0;
const seed_1 = require("./seed");
const mnemonics_1 = require("../mnemonics");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * BIP39Seed provides functionality for deriving a cryptographic seed
 * from a valid BIP39 mnemonic phrase using PBKDF2 with HMAC-SHA512.
 */
class BIP39Seed extends seed_1.Seed {
    static seedSaltModifier = 'mnemonic';
    static seedPbkdf2Rounds = 2048;
    /**
     * Returns the name of this seed type.
     *
     * @returns {string}
     */
    static getName() {
        return 'BIP39';
    }
    /**
     * Derives a cryptographic seed from a BIP39 mnemonic phrase.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or Mnemonic instance.
     * @param {SeedOptionsInterface} [options={}] - Optional derivation parameters.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    static fromMnemonic(mnemonic, options = {}) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.BIP39Mnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        const saltBase = this.seedSaltModifier + (options.passphrase ?? '');
        const salt = saltBase.normalize('NFKD');
        const seedBytes = (0, crypto_1.pbkdf2HmacSha512)(phrase, salt, this.seedPbkdf2Rounds);
        return (0, utils_1.bytesToString)(seedBytes);
    }
}
exports.BIP39Seed = BIP39Seed;
//# sourceMappingURL=bip39.js.map