"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2PKHAddress = void 0;
const base58_1 = require("../libs/base58");
const consts_1 = require("../consts");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const utils_1 = require("../utils");
const crypto_1 = require("../crypto");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
class P2PKHAddress extends address_1.Address {
    static publicKeyAddressPrefix = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX;
    static alphabet = cryptocurrencies_1.Bitcoin.PARAMS.ALPHABET;
    static getName() {
        return 'P2PKH';
    }
    static encode(publicKey, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix;
        const prefixBytes = (0, utils_1.integerToBytes)(prefixValue);
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const rawPubBytes = options.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? pk.getRawUncompressed() : pk.getRawCompressed();
        const pubKeyHash = (0, crypto_1.hash160)((0, utils_1.getBytes)(rawPubBytes));
        const payload = (0, utils_1.concatBytes)(prefixBytes, pubKeyHash);
        const alphabet = options.alphabet ?? this.alphabet;
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)(payload, alphabet));
    }
    static decode(address, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix;
        const prefixBytes = (0, utils_1.getBytes)((0, utils_1.integerToBytes)(prefixValue));
        const alphabet = options.alphabet ?? this.alphabet;
        const decoded = (0, base58_1.checkDecode)(address, alphabet);
        const expectedLen = prefixBytes.length + 20;
        if (decoded.length !== expectedLen) {
            throw new exceptions_1.AddressError('Invalid length', { expected: expectedLen, got: decoded.length });
        }
        const gotPrefix = decoded.slice(0, prefixBytes.length);
        if (!(0, utils_1.equalBytes)(prefixBytes, gotPrefix)) {
            throw new exceptions_1.AddressError('Invalid prefix', { expected: (0, utils_1.bytesToHex)(prefixBytes), got: (0, utils_1.bytesToHex)(gotPrefix) });
        }
        const pubKeyHash = decoded.slice(prefixBytes.length);
        return (0, utils_1.bytesToString)(pubKeyHash);
    }
}
exports.P2PKHAddress = P2PKHAddress;
//# sourceMappingURL=p2pkh.js.map