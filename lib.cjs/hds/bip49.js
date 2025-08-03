"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP49HD = void 0;
const derivations_1 = require("../derivations");
const cryptocurrencies_1 = require("../cryptocurrencies");
const addresses_1 = require("../addresses");
const bip44_1 = require("./bip44");
const consts_1 = require("../consts");
const keys_1 = require("../keys");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
class BIP49HD extends bip44_1.BIP44HD {
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? cryptocurrencies_1.Bitcoin.COIN_TYPE;
        this.derivation = new derivations_1.BIP49Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? derivations_1.CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    static getName() {
        return 'BIP49';
    }
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP49Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    getRootXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    getRootXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    getXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getAddress(options = {
        scriptAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    }) {
        return addresses_1.P2WPKHInP2SHAddress.encode(this.publicKey, {
            scriptAddressPrefix: options.scriptAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.BIP49HD = BIP49HD;
//# sourceMappingURL=bip49.js.map