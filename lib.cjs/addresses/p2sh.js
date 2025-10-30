"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.P2SHAddress = void 0;
const base58_1 = require("../libs/base58");
const consts_1 = require("../consts");
const eccs_1 = require("../eccs");
const cryptocurrencies_1 = require("../cryptocurrencies");
const crypto_1 = require("../crypto");
const exceptions_1 = require("../exceptions");
const utils_1 = require("../utils");
const address_1 = require("./address");
/**
 * Class representing a Bitcoin P2SH (Pay-to-Script-Hash) address.
 * Provides methods for encoding public keys to P2SH addresses and decoding P2SH addresses back to the script hash.
 */
class P2SHAddress extends address_1.Address {
    static scriptAddressPrefix = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
    static alphabet = cryptocurrencies_1.Bitcoin.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2SH").
     */
    static getName() {
        return 'P2SH';
    }
    /**
     * Encodes a public key into a Bitcoin P2SH address.
     * The method generates a standard P2PKH redeem script, computes its hash, and encodes it with the script address prefix.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options:
     *   - scriptAddressPrefix: prefix byte for the address
     *   - publicKeyType: whether to use compressed or uncompressed public key
     *   - alphabet: Base58 alphabet
     * @returns {string} Base58-encoded P2SH address.
     */
    static encode(publicKey, options = {
        scriptAddressPrefix: this.scriptAddressPrefix,
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
        const prefixBytes = (0, utils_1.integerToBytes)(prefixValue);
        const pk = (0, eccs_1.validateAndGetPublicKey)(publicKey, eccs_1.SLIP10Secp256k1PublicKey);
        const rawBytes = options.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? pk.getRawUncompressed() : pk.getRawCompressed();
        const pubKeyHash = (0, crypto_1.hash160)(rawBytes);
        const redeemScriptHex = '76a914' + (0, utils_1.bytesToString)(pubKeyHash) + '88ac';
        const redeemScript = (0, utils_1.getBytes)(redeemScriptHex);
        const scriptHash = (0, crypto_1.hash160)(redeemScript);
        const payload = (0, utils_1.concatBytes)(prefixBytes, scriptHash);
        const alphabet = options.alphabet ?? this.alphabet;
        return (0, utils_1.ensureString)((0, base58_1.checkEncode)(payload, alphabet));
    }
    /**
     * Decodes a Bitcoin P2SH address into its script hash.
     *
     * @param {string} address - The P2SH address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options:
     *   - scriptAddressPrefix: expected prefix byte
     *   - alphabet: Base58 alphabet
     * @returns {string} The script hash extracted from the address.
     * @throws {AddressError} If the address has invalid length or prefix.
     */
    static decode(address, options = {
        scriptAddressPrefix: this.scriptAddressPrefix,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
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
        const scriptHash = decoded.slice(prefixBytes.length);
        return (0, utils_1.bytesToString)(scriptHash);
    }
}
exports.P2SHAddress = P2SHAddress;
//# sourceMappingURL=p2sh.js.map