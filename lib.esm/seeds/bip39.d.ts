import { Seed } from './seed';
import { Mnemonic } from '../mnemonics';
import { SeedOptionsInterface } from '../interfaces';
/**
 * BIP39Seed provides functionality for deriving a cryptographic seed
 * from a valid BIP39 mnemonic phrase using PBKDF2 with HMAC-SHA512.
 */
export declare class BIP39Seed extends Seed {
    static seedSaltModifier: string;
    static seedPbkdf2Rounds: number;
    /**
     * Returns the name of this seed type.
     *
     * @returns {string}
     */
    static getName(): string;
    /**
     * Derives a cryptographic seed from a BIP39 mnemonic phrase.
     *
     * @param {string | Mnemonic} mnemonic - The mnemonic phrase or Mnemonic instance.
     * @param {SeedOptionsInterface} [options={}] - Optional derivation parameters.
     * @returns {string} The derived seed as a hexadecimal string.
     */
    static fromMnemonic(mnemonic: string | Mnemonic, options?: SeedOptionsInterface): string;
}
//# sourceMappingURL=bip39.d.ts.map