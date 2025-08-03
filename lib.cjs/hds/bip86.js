"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP86HD = void 0;
const derivations_1 = require("../derivations");
const cryptocurrencies_1 = require("../cryptocurrencies");
const addresses_1 = require("../addresses");
const bip44_1 = require("./bip44");
const consts_1 = require("../consts");
const keys_1 = require("../keys");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
class BIP86HD extends bip44_1.BIP44HD {
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? cryptocurrencies_1.Bitcoin.COIN_TYPE;
        this.derivation = new derivations_1.BIP86Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? derivations_1.CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    static getName() {
        return 'BIP86';
    }
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP86Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    getRootXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2TR, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    getRootXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2TR, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2TR, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    getXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2TR, encoded = true) {
        if (!this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getAddress(options = {
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR
    }) {
        return addresses_1.P2TRAddress.encode(this.publicKey, {
            hrp: options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
            witnessVersion: options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.BIP86HD = BIP86HD;
//# sourceMappingURL=bip86.js.map