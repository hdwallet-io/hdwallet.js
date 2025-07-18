"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solana = exports.Mainnet = void 0;
const slip44_1 = require("../slip44");
const eccs_1 = require("../eccs");
const consts_1 = require("../consts");
const cryptocurrency_1 = require("./cryptocurrency");
class Mainnet extends cryptocurrency_1.Network {
    static NAME = 'mainnet';
    static XPRIVATE_KEY_VERSIONS = new consts_1.XPrivateKeyVersions({
        P2PKH: 0x0488ade4
    });
    static XPUBLIC_KEY_VERSIONS = new consts_1.XPublicKeyVersions({
        P2PKH: 0x0488b21e
    });
}
exports.Mainnet = Mainnet;
class Solana extends cryptocurrency_1.Cryptocurrency {
    static NAME = 'Solana';
    static SYMBOL = 'SOL';
    static INFO = new consts_1.Info({
        SOURCE_CODE: 'https://github.com/solana-labs/solana',
        WHITEPAPER: 'https://solana.com/solana-whitepaper.pdf',
        WEBSITES: [
            'https://solana.com'
        ]
    });
    static ECC = eccs_1.SLIP10Ed25519ECC;
    static COIN_TYPE = slip44_1.CoinTypes.Solana;
    static SUPPORT_BIP38 = false;
    static NETWORKS = new consts_1.Networks({
        MAINNET: Mainnet
    });
    static DEFAULT_NETWORK = Solana.NETWORKS.MAINNET;
    static ENTROPIES = new consts_1.Entropies([
        'BIP39'
    ]);
    static MNEMONICS = new consts_1.Mnemonics([
        'BIP39'
    ]);
    static SEEDS = new consts_1.Seeds([
        'BIP39'
    ]);
    static HDS = new consts_1.HDs([
        'BIP32',
        'BIP44'
    ]);
    static DEFAULT_HD = Solana.HDS.BIP44;
    static DEFAULT_PATH = `m/44'/${Solana.COIN_TYPE}'/0'/0'`;
    static ADDRESSES = new consts_1.Addresses({
        SOLANA: 'Solana'
    });
    static DEFAULT_ADDRESS = Solana.ADDRESSES.SOLANA;
    static SEMANTICS = ['p2pkh'];
    static DEFAULT_SEMANTIC = 'p2pkh';
    static PARAMS = new consts_1.Params({
        ALPHABET: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    });
}
exports.Solana = Solana;
//# sourceMappingURL=solana.js.map