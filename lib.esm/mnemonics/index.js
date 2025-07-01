// SPDX-License-Identifier: MIT
import { Mnemonic } from './mnemonic';
import { AlgorandMnemonic, ALGORAND_MNEMONIC_WORDS, ALGORAND_MNEMONIC_LANGUAGES } from './algorand/mnemonic';
import { BIP39Mnemonic, BIP39_MNEMONIC_WORDS, BIP39_MNEMONIC_LANGUAGES } from './bip39/mnemonic';
import { ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_WORDS, ELECTRUM_V1_MNEMONIC_LANGUAGES } from './electrum/v1/mnemonic';
import { ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES } from './electrum/v2/mnemonic';
import { MoneroMnemonic, MONERO_MNEMONIC_WORDS, MONERO_MNEMONIC_LANGUAGES } from './monero/mnemonic';
import { MnemonicError } from '../exceptions';
export class MNEMONICS {
    static dictionary = {
        [AlgorandMnemonic.getName()]: AlgorandMnemonic,
        [BIP39Mnemonic.getName()]: BIP39Mnemonic,
        [ElectrumV1Mnemonic.getName()]: ElectrumV1Mnemonic,
        [ElectrumV2Mnemonic.getName()]: ElectrumV2Mnemonic,
        [MoneroMnemonic.getName()]: MoneroMnemonic
    };
    static getNames() {
        return Object.keys(this.dictionary);
    }
    static getClasses() {
        return Object.values(this.dictionary);
    }
    static getMnemonicClass(name) {
        if (!this.isMnemonic(name)) {
            throw new MnemonicError('Invalid Mnemonic name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    static isMnemonic(name) {
        return this.getNames().includes(name);
    }
}
export { Mnemonic, AlgorandMnemonic, ALGORAND_MNEMONIC_WORDS, ALGORAND_MNEMONIC_LANGUAGES, BIP39Mnemonic, BIP39_MNEMONIC_WORDS, BIP39_MNEMONIC_LANGUAGES, ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_WORDS, ELECTRUM_V1_MNEMONIC_LANGUAGES, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES, MoneroMnemonic, MONERO_MNEMONIC_WORDS, MONERO_MNEMONIC_LANGUAGES };
//# sourceMappingURL=index.js.map