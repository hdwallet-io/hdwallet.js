"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2WSHInP2SHAddress = void 0;
const base58_1 = require("../libs/base58");
const consts_1 = require("../consts");
const eccs_1 = require("../eccs");
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const p2sh_1 = require("./p2sh");
/**
 * Class representing a P2WSH-in-P2SH (Pay-to-Witness-Script-Hash nested in Pay-to-Script-Hash) Bitcoin address.
 * Implements encoding of a compressed or uncompressed public key into a P2WSH-in-P2SH address.
 */
class P2WSHInP2SHAddress extends p2sh_1.P2SHAddress {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WSH-In-P2SH").
     */
    static getName() {
        return 'P2WSH-In-P2SH';
    }
    /**
     * Encodes a public key into a P2WSH-in-P2SH Bitcoin address.
     * Constructs the redeem script using a SegWit witness script hash nested in a P2SH structure.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including P2SH prefix, public key type, and alphabet.
     * @returns {string} Base58Check encoded P2WSH-in-P2SH address.
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
        const redeemScript = (0, utils_1.getBytes)('5121' + (0, utils_1.bytesToString)(rawPubBytes) + '51ae');
        const sha = (0, crypto_1.sha256)(redeemScript);
        const witnessScript = (0, utils_1.getBytes)('0020' + (0, utils_1.bytesToString)(sha));
        const scriptHash = (0, crypto_1.hash160)(witnessScript);
        const alphabet = options.alphabet ?? this.alphabet;
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)((0, utils_1.concatBytes)(prefixBytes, scriptHash), alphabet));
    }
}
exports.P2WSHInP2SHAddress = P2WSHInP2SHAddress;
//# sourceMappingURL=p2wsh-in-p2sh.js.map