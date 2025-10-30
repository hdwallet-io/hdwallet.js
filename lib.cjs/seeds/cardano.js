"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardanoSeed = void 0;
const cbor2_1 = require("cbor2");
const seed_1 = require("./seed");
const bip39_1 = require("./bip39");
const cryptocurrencies_1 = require("../cryptocurrencies");
const mnemonics_1 = require("../mnemonics");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
/**
 * Represents a Cardano seed generator, supporting multiple
 * derivation standards including Byron (Icarus, Ledger, Legacy)
 * and Shelley (Icarus, Ledger).
 */
class CardanoSeed extends seed_1.Seed {
    /**
     * Creates a new instance of CardanoSeed.
     *
     * @param {string} seed - The hexadecimal seed string.
     * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional seed configuration including the Cardano type.
     * @throws {SeedError} If the provided cardanoType is invalid.
     */
    constructor(seed, options = {
        cardanoType: cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS
    }) {
        if (options.cardanoType && !cryptocurrencies_1.Cardano.TYPES.isCardanoType(options.cardanoType)) {
            throw new exceptions_1.SeedError('Invalid Cardano type', {
                expected: cryptocurrencies_1.Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
            });
        }
        super(seed, options);
    }
    /**
     * Returns the name of this seed type.
     *
     * @returns {string} The string `"Cardano"`.
     */
    static getName() {
        return 'Cardano';
    }
    /**
     * Returns the current Cardano type assigned to this seed instance.
     *
     * @returns {string} The selected Cardano type.
     * @throws {SeedError} If no `cardanoType` is found in the options.
     */
    getCardanoType() {
        if (!this.options?.cardanoType) {
            throw new exceptions_1.SeedError('cardanoType is not found');
        }
        return this.options?.cardanoType;
    }
    /**
     * Generates a Cardano seed from a mnemonic phrase, supporting multiple Cardano derivation types.
     *
     * @param {string | Mnemonic} mnemonic - A mnemonic phrase or Mnemonic object.
     * @param {SeedOptionsInterface} [options={ cardanoType: Cardano.TYPES.BYRON_ICARUS }] - Optional parameters including passphrase and cardanoType.
     * @returns {string} A hexadecimal string representing the derived Cardano seed.
     * @throws {MnemonicError} If the mnemonic is invalid.
     * @throws {SeedError} If the Cardano type is invalid.
     */
    static fromMnemonic(mnemonic, options = {
        cardanoType: cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS
    }) {
        switch (options.cardanoType) {
            case cryptocurrencies_1.Cardano.TYPES.BYRON_ICARUS:
                return this.generateByronIcarus(mnemonic);
            case cryptocurrencies_1.Cardano.TYPES.BYRON_LEDGER:
                return this.generateByronLedger(mnemonic, options.passphrase);
            case cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY:
                return this.generateByronLegacy(mnemonic);
            case cryptocurrencies_1.Cardano.TYPES.SHELLEY_ICARUS:
                return this.generateShelleyIcarus(mnemonic);
            case cryptocurrencies_1.Cardano.TYPES.SHELLEY_LEDGER:
                return this.generateShelleyLedger(mnemonic, options.passphrase);
            default:
                throw new exceptions_1.SeedError('Invalid Cardano type', {
                    expected: cryptocurrencies_1.Cardano.TYPES.getCardanoTypes(), got: options.cardanoType
                });
        }
    }
    /**
     * Generates a Byron-Icarus seed from a valid BIP39 mnemonic.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     * @throws {MnemonicError} If the mnemonic is invalid.
     */
    static generateByronIcarus(mnemonic) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.BIP39Mnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid Cardano mnemonic words`);
        }
        return mnemonics_1.BIP39Mnemonic.decode(phrase);
    }
    /**
     * Generates a Byron-Ledger seed using PBKDF2-HMAC-SHA512.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @param {string | null} [passphrase] - Optional passphrase for additional entropy.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    static generateByronLedger(mnemonic, passphrase) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        return bip39_1.BIP39Seed.fromMnemonic(phrase, { passphrase: passphrase });
    }
    /**
     * Generates a Byron-Legacy seed by CBOR encoding and hashing the decoded mnemonic.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     * @throws {MnemonicError} If the mnemonic is invalid.
     */
    static generateByronLegacy(mnemonic) {
        const phrase = typeof mnemonic === 'string' ? mnemonic : mnemonic.getMnemonic();
        if (!mnemonics_1.BIP39Mnemonic.isValid(phrase)) {
            throw new exceptions_1.MnemonicError(`Invalid Cardano mnemonic words`);
        }
        const decoded = mnemonics_1.BIP39Mnemonic.decode(phrase);
        const rawBytes = (0, utils_1.hexToBytes)(decoded);
        const cborBytes = (0, cbor2_1.encode)(rawBytes);
        const hash = (0, crypto_1.blake2b256)(cborBytes);
        return (0, utils_1.bytesToString)(hash);
    }
    /**
     * Generates a Shelley-Icarus seed (same as Byron-Icarus).
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    static generateShelleyIcarus(mnemonic) {
        return this.generateByronIcarus(mnemonic);
    }
    /**
     * Generates a Shelley-Ledger seed (same as Byron-Ledger).
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase.
     * @param {string | null} [passphrase] - Optional passphrase.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    static generateShelleyLedger(mnemonic, passphrase) {
        return this.generateByronLedger(mnemonic, passphrase);
    }
}
exports.CardanoSeed = CardanoSeed;
//# sourceMappingURL=cardano.js.map