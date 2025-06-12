"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOSAddress = void 0;
const base58_1 = require("../libs/base58");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
class EOSAddress extends address_1.Address {
    static addressPrefix = cryptocurrencies_1.EOS.PARAMS.ADDRESS_PREFIX;
    static checksumLength = cryptocurrencies_1.EOS.PARAMS.CHECKSUM_LENGTH;
    static getName() {
        return 'EOS';
    }
    static computeChecksum(pubKeyBytes) {
        return (0, crypto_1.ripemd160)(pubKeyBytes).slice(0, this.checksumLength);
    }
    static encode(publicKey, options = {
        addressPrefix: this.addressPrefix
    }) {
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const raw = (0, utils_1.getBytes)(pk.getRawCompressed());
        const checksum = this.computeChecksum(raw);
        const prefix = options.addressPrefix ?? this.addressPrefix;
        return prefix + (0, utils_1.ensureString)((0, base58_1.encode)((0, utils_1.concatBytes)(raw, checksum)));
    }
    static decode(address, options = {
        addressPrefix: this.addressPrefix
    }) {
        const prefix = options.addressPrefix ?? this.addressPrefix;
        if (!address.startsWith(prefix)) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: prefix, got: address.slice(0, prefix.length)
            });
        }
        const withoutPrefix = address.slice(prefix.length);
        const decoded = (0, base58_1.decode)(withoutPrefix);
        const expectedLength = eccs_1.SLIP10Secp256k1PublicKey.getCompressedLength() + this.checksumLength;
        if (decoded.length !== expectedLength) {
            throw new exceptions_1.AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const publicKeyBytes = decoded.slice(0, -this.checksumLength);
        const checksum = decoded.slice(-this.checksumLength);
        const computedChecksum = this.computeChecksum(publicKeyBytes);
        if (!(0, utils_1.equalBytes)(checksum, computedChecksum)) {
            throw new exceptions_1.AddressError('Invalid checksum', {
                expected: (0, utils_1.bytesToHex)(computedChecksum), got: (0, utils_1.bytesToHex)(checksum)
            });
        }
        if (!eccs_1.SLIP10Secp256k1PublicKey.isValidBytes(publicKeyBytes)) {
            throw new exceptions_1.AddressError('Invalid public key bytes', {
                got: (0, utils_1.bytesToHex)(publicKeyBytes)
            });
        }
        return (0, utils_1.bytesToString)(publicKeyBytes);
    }
}
exports.EOSAddress = EOSAddress;
//# sourceMappingURL=eos.js.map