"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2WPKHInP2SHAddress = void 0;
const base58_1 = require("../libs/base58");
const consts_1 = require("../consts");
const eccs_1 = require("../eccs");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const p2sh_1 = require("./p2sh");
/**
 * Class representing a P2WPKH-in-P2SH (Pay-to-Witness-Public-Key-Hash nested in P2SH) Bitcoin address.
 * Inherits from P2SHAddress and overrides the encoding method to implement P2WPKH redemption.
 */
class P2WPKHInP2SHAddress extends p2sh_1.P2SHAddress {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WPKH-In-P2SH").
     */
    static getName() {
        return 'P2WPKH-In-P2SH';
    }
    /**
     * Encodes a public key into a P2WPKH-in-P2SH address.
     * This involves hashing the public key (RIPEMD160(SHA256(pubKey))),
     * building the redeem script for P2WPKH, and then hashing it to get the P2SH address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including script prefix, public key type, and alphabet.
     * @returns {string} Base58 encoded P2WPKH-in-P2SH address.
     */
    static encode(publicKey, options = {
        scriptAddressPrefix: this.scriptAddressPrefix,
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
        const prefixBytes = (0, utils_1.integerToBytes)(prefixValue);
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const rawPubBytes = options.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? pk.getRawUncompressed() : pk.getRawCompressed();
        const pubKeyHash = (0, crypto_1.hash160)(rawPubBytes);
        const redeemScript = (0, utils_1.getBytes)('0014' + (0, utils_1.bytesToString)(pubKeyHash));
        const scriptHash = (0, crypto_1.hash160)(redeemScript);
        const alphabet = options.alphabet ?? this.alphabet;
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)((0, utils_1.concatBytes)(prefixBytes, scriptHash), alphabet));
    }
}
exports.P2WPKHInP2SHAddress = P2WPKHInP2SHAddress;
//# sourceMappingURL=p2wpkh-in-p2sh.js.map