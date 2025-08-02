"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroHD = exports.ElectrumV2HD = exports.ElectrumV1HD = exports.CardanoHD = exports.BIP141HD = exports.BIP86HD = exports.BIP84HD = exports.BIP49HD = exports.BIP44HD = exports.BIP32HD = exports.AlgorandHD = exports.HD = exports.HDS = void 0;
const hd_1 = require("./hd");
Object.defineProperty(exports, "HD", { enumerable: true, get: function () { return hd_1.HD; } });
const exceptions_1 = require("../exceptions");
const algorand_1 = require("./algorand");
Object.defineProperty(exports, "AlgorandHD", { enumerable: true, get: function () { return algorand_1.AlgorandHD; } });
const bip32_1 = require("./bip32");
Object.defineProperty(exports, "BIP32HD", { enumerable: true, get: function () { return bip32_1.BIP32HD; } });
const bip44_1 = require("./bip44");
Object.defineProperty(exports, "BIP44HD", { enumerable: true, get: function () { return bip44_1.BIP44HD; } });
const bip49_1 = require("./bip49");
Object.defineProperty(exports, "BIP49HD", { enumerable: true, get: function () { return bip49_1.BIP49HD; } });
const bip84_1 = require("./bip84");
Object.defineProperty(exports, "BIP84HD", { enumerable: true, get: function () { return bip84_1.BIP84HD; } });
const bip141_1 = require("./bip141");
Object.defineProperty(exports, "BIP141HD", { enumerable: true, get: function () { return bip141_1.BIP141HD; } });
const bip86_1 = require("./bip86");
Object.defineProperty(exports, "BIP86HD", { enumerable: true, get: function () { return bip86_1.BIP86HD; } });
const cardano_1 = require("./cardano");
Object.defineProperty(exports, "CardanoHD", { enumerable: true, get: function () { return cardano_1.CardanoHD; } });
const v1_1 = require("./electrum/v1");
Object.defineProperty(exports, "ElectrumV1HD", { enumerable: true, get: function () { return v1_1.ElectrumV1HD; } });
const v2_1 = require("./electrum/v2");
Object.defineProperty(exports, "ElectrumV2HD", { enumerable: true, get: function () { return v2_1.ElectrumV2HD; } });
const monero_1 = require("./monero");
Object.defineProperty(exports, "MoneroHD", { enumerable: true, get: function () { return monero_1.MoneroHD; } });
class HDS {
    static dictionary = {
        [algorand_1.AlgorandHD.getName()]: algorand_1.AlgorandHD,
        [bip32_1.BIP32HD.getName()]: bip32_1.BIP32HD,
        [bip44_1.BIP44HD.getName()]: bip44_1.BIP44HD,
        [bip49_1.BIP49HD.getName()]: bip49_1.BIP49HD,
        [bip84_1.BIP84HD.getName()]: bip84_1.BIP84HD,
        [bip86_1.BIP86HD.getName()]: bip86_1.BIP86HD,
        [bip141_1.BIP141HD.getName()]: bip141_1.BIP141HD,
        [cardano_1.CardanoHD.getName()]: cardano_1.CardanoHD,
        [v1_1.ElectrumV1HD.getName()]: v1_1.ElectrumV1HD,
        [v2_1.ElectrumV2HD.getName()]: v2_1.ElectrumV2HD,
        [monero_1.MoneroHD.getName()]: monero_1.MoneroHD
    };
    static getNames() {
        return Object.keys(this.dictionary);
    }
    static getClasses() {
        return Object.values(this.dictionary);
    }
    static getHDClass(name) {
        if (!this.isHD(name)) {
            throw new exceptions_1.BaseError('Invalid HD name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    static isHD(name) {
        return this.getNames().includes(name);
    }
}
exports.HDS = HDS;
//# sourceMappingURL=index.js.map