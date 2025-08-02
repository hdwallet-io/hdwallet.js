"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.Algorand = exports.Mainnet = void 0;
const slip44_1 = require("../slip44");
const eccs_1 = require("../eccs");
const consts_1 = require("../consts");
const cryptocurrency_1 = require("./cryptocurrency");
class Mainnet extends cryptocurrency_1.Network {
    static NAME = 'mainnet';
    static XPRIVATE_KEY_VERSIONS = new consts_1.XPrivateKeyVersions({
        P2PKH: 0x0f4331d4
    });
    static XPUBLIC_KEY_VERSIONS = new consts_1.XPublicKeyVersions({
        P2PKH: 0x0488b21e
    });
}
exports.Mainnet = Mainnet;
class Algorand extends cryptocurrency_1.Cryptocurrency {
    static NAME = 'Algorand';
    static SYMBOL = 'ALGO';
    static INFO = new consts_1.Info({
        SOURCE_CODE: 'https://github.com/algorand/go-algorand',
        WHITEPAPER: 'https://www.algorand.com/resources/white-papers',
        WEBSITES: [
            'http://algorand.foundation',
            'https://www.algorand.com'
        ]
    });
    static ECC = eccs_1.KholawEd25519ECC;
    static COIN_TYPE = slip44_1.CoinTypes.Algorand;
    static SUPPORT_BIP38 = false;
    static NETWORKS = new consts_1.Networks({
        MAINNET: Mainnet
    });
    static DEFAULT_NETWORK = Algorand.NETWORKS.MAINNET;
    static ENTROPIES = new consts_1.Entropies([
        { ALGORAND: 'Algorand' },
        'BIP39'
    ]);
    static MNEMONICS = new consts_1.Mnemonics([
        { ALGORAND: 'Algorand' },
        'BIP39'
    ]);
    static SEEDS = new consts_1.Seeds([
        { ALGORAND: 'Algorand' },
        'BIP39'
    ]);
    static HDS = new consts_1.HDs([
        { ALGORAND: 'Algorand' },
        'BIP32',
        'BIP44'
    ]);
    static DEFAULT_HD = Algorand.HDS.ALGORAND;
    static DEFAULT_PATH = `m/44'/${Algorand.COIN_TYPE}'/0'/0/0`;
    static ADDRESSES = new consts_1.Addresses({
        ALGORAND: 'Algorand'
    });
    static DEFAULT_ADDRESS = Algorand.ADDRESSES.ALGORAND;
    static SEMANTICS = ['p2pkh'];
    static DEFAULT_SEMANTIC = 'p2pkh';
    static PARAMS = new consts_1.Params({
        CHECKSUM_LENGTH: 0x04
    });
}
exports.Algorand = Algorand;
//# sourceMappingURL=algorand.js.map