"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2WSHAddress = void 0;
const segwit_bech32_1 = require("../libs/segwit-bech32");
const consts_1 = require("../consts");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const p2wpkh_1 = require("./p2wpkh");
class P2WSHAddress extends p2wpkh_1.P2WPKHAddress {
    static witnessVersion = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WSH;
    static getName() {
        return 'P2WSH';
    }
    static encode(publicKey, options = {
        hrp: this.hrp,
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED,
        witnessVersion: this.witnessVersion
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const rawPubBytes = options.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? pk.getRawUncompressed() : pk.getRawCompressed();
        const script = '5121' + (0, utils_1.bytesToString)(rawPubBytes) + '51ae';
        const scriptHash = (0, crypto_1.sha256)((0, utils_1.getBytes)(script));
        const hrp = options.hrp ?? this.hrp;
        const version = options.witnessVersion ?? this.witnessVersion;
        return (0, utils_1.ensureString)((0, segwit_bech32_1.segwitEncode)(hrp, version, scriptHash));
    }
}
exports.P2WSHAddress = P2WSHAddress;
//# sourceMappingURL=p2wsh.js.map