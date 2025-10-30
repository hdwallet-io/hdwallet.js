"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV2Seed = void 0;
const seed_1 = require("../seed");
const mnemonics_1 = require("../../mnemonics");
const crypto_1 = require("../../crypto");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
/**
 * Represents an Electrum-V2 seed derived from an Electrum V2 mnemonic phrase.
 *
 * Implements the PBKDF2-HMAC-SHA512 key derivation using the salt "electrum"
 * plus an optional passphrase. Compatible with Standard, Segwit, and 2FA mnemonic types.
 */
class ElectrumV2Seed extends seed_1.Seed {
    static seedSaltModifier = 'electrum';
    static seedPbkdf2Rounds = 2048;
    /**
     * Returns the name of this seed type.
     *
     * @returns {string} The seed name, `'Electrum-V2'`.
     */
    static getName() {
        return 'Electrum-V2';
    }
    /**
     * Derives an Electrum-V2 seed from a given mnemonic.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or `Mnemonic` object.
     * @param {SeedOptionsInterface} [options] - Optional parameters including:
     *   - `mnemonicType` (`ELECTRUM_V2_MNEMONIC_TYPES`): The type of Electrum V2 mnemonic.
     *   - `passphrase` (`string`): An optional passphrase for seed derivation.
     * @returns {string} The derived Electrum-V2 seed as a hex string.
     * @throws {MnemonicError} If the mnemonic is invalid for the specified type.
     */
    static fromMnemonic(mnemonic, options = {
        mnemonicType: mnemonics_1.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.ElectrumV2Mnemonic.isValid(phrase, { mnemonicType: options.mnemonicType })) {
            throw new exceptions_1.MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        const saltBase = (this.seedSaltModifier + (options.passphrase ?? '')).normalize('NFKD');
        const seedBytes = (0, crypto_1.pbkdf2HmacSha512)(phrase, saltBase, this.seedPbkdf2Rounds);
        return (0, utils_1.bytesToString)(seedBytes);
    }
    /**
     * Retrieves the mnemonic type from the seed options.
     *
     * @returns {string} The mnemonic type (e.g., `'standard'`, `'segwit'`, `'2fa'`).
     * @throws {SeedError} If the mnemonic type is not set.
     */
    getMnemonicType() {
        if (!this.options?.mnemonicType) {
            throw new exceptions_1.SeedError('mnemonicType is not found');
        }
        return this.options?.mnemonicType;
    }
}
exports.ElectrumV2Seed = ElectrumV2Seed;
//# sourceMappingURL=v2.js.map