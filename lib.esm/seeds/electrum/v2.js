// SPDX-License-Identifier: MIT
import { Seed } from '../seed';
import { ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_TYPES } from '../../mnemonics';
import { pbkdf2HmacSha512 } from '../../crypto';
import { bytesToString } from '../../utils';
import { MnemonicError, SeedError } from '../../exceptions';
/**
 * Represents an Electrum-V2 seed derived from an Electrum V2 mnemonic phrase.
 *
 * Implements the PBKDF2-HMAC-SHA512 key derivation using the salt "electrum"
 * plus an optional passphrase. Compatible with Standard, Segwit, and 2FA mnemonic types.
 */
export class ElectrumV2Seed extends Seed {
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
        mnemonicType: ELECTRUM_V2_MNEMONIC_TYPES.STANDARD
    }) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!ElectrumV2Mnemonic.isValid(phrase, { mnemonicType: options.mnemonicType })) {
            throw new MnemonicError(`Invalid ${this.getName()} mnemonic words`);
        }
        const saltBase = (this.seedSaltModifier + (options.passphrase ?? '')).normalize('NFKD');
        const seedBytes = pbkdf2HmacSha512(phrase, saltBase, this.seedPbkdf2Rounds);
        return bytesToString(seedBytes);
    }
    /**
     * Retrieves the mnemonic type from the seed options.
     *
     * @returns {string} The mnemonic type (e.g., `'standard'`, `'segwit'`, `'2fa'`).
     * @throws {SeedError} If the mnemonic type is not set.
     */
    getMnemonicType() {
        if (!this.options?.mnemonicType) {
            throw new SeedError('mnemonicType is not found');
        }
        return this.options?.mnemonicType;
    }
}
//# sourceMappingURL=v2.js.map