"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.TronAddress = void 0;
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
class TronAddress extends address_1.Address {
    static publicKeyAddressPrefix = cryptocurrencies_1.Tron.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX;
    static alphabet = cryptocurrencies_1.Tron.PARAMS.ALPHABET;
    static getName() {
        return 'Tron';
    }
    static encode(publicKey, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        alphabet: this.alphabet
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const addressHash = (0, utils_1.bytesToString)((0, crypto_1.keccak256)(pk.getRawUncompressed().slice(1))).slice(-40); // last 20 bytes
        const prefixBytes = (0, utils_1.integerToBytes)(options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix);
        const alphabet = options.alphabet ?? this.alphabet;
        const payload = (0, utils_1.concatBytes)(prefixBytes, (0, utils_1.hexToBytes)(addressHash));
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)(payload, alphabet));
    }
    static decode(address, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        alphabet: this.alphabet
    }) {
        const alphabet = options.alphabet ?? this.alphabet;
        const decoded = (0, base58_1.checkDecode)(address, alphabet);
        const prefixValue = (0, utils_1.integerToBytes)(options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix);
        const prefixBytes = (0, utils_1.getBytes)(prefixValue);
        const expectedLength = 20 + prefixBytes.length;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const prefixGot = decoded.slice(0, prefixBytes.length);
        if (!(0, utils_1.equalBytes)(prefixGot, prefixBytes)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: (0, utils_1.bytesToHex)(prefixBytes), got: (0, utils_1.bytesToHex)(prefixGot)
            });
        }
        return (0, utils_1.bytesToString)(decoded.slice(prefixBytes.length));
    }
}
exports.TronAddress = TronAddress;
//# sourceMappingURL=tron.js.map