"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP44HD = void 0;
const derivations_1 = require("../derivations");
const cryptocurrencies_1 = require("../cryptocurrencies");
const addresses_1 = require("../addresses");
const bip32_1 = require("./bip32");
const consts_1 = require("../consts");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
class BIP44HD extends bip32_1.BIP32HD {
    coinType;
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? cryptocurrencies_1.Bitcoin.COIN_TYPE;
        this.derivation = new derivations_1.BIP44Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? derivations_1.CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    static getName() {
        return 'BIP44';
    }
    fromCoinType(coinType) {
        this.cleanDerivation();
        this.derivation.fromCoinType(coinType);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromAccount(account) {
        this.cleanDerivation();
        this.derivation.fromAccount(account);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromChange(change) {
        this.cleanDerivation();
        this.derivation.fromChange(change);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromAddress(address) {
        this.cleanDerivation();
        this.derivation.fromAddress(address);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP44Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    getAddress(options = {
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    }) {
        return addresses_1.P2PKHAddress.encode(this.publicKey, {
            publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.BIP44HD = BIP44HD;
//# sourceMappingURL=bip44.js.map