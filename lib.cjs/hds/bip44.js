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
/**
 * Implements the BIP44 hierarchical deterministic (HD) wallet standard.
 * Extends BIP32HD to provide multi-account, multi-coin, and change/address-level derivations.
 * Provides methods to derive keys and generate P2PKH addresses according to BIP44.
 *
 */
class BIP44HD extends bip32_1.BIP32HD {
    coinType;
    /**
     * Create a new BIP44HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     * @param options.publicKeyType Type of public key (compressed/uncompressed)
     * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
     * @param options.account Account index (default: 0)
     * @param options.change Change chain (0: external, 1: internal, default: external)
     * @param options.address Address index (default: 0)
     */
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
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP44'
     */
    static getName() {
        return 'BIP44';
    }
    /**
     * Set derivation to a specific coin type.
     * @param coinType Coin type index
     * @returns {this} Current BIP44HD instance
     */
    fromCoinType(coinType) {
        this.cleanDerivation();
        this.derivation.fromCoinType(coinType);
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Set derivation to a specific account or account range.
     * @param account Single account index or a tuple [start, end]
     * @returns {this} Current BIP44HD instance
     */
    fromAccount(account) {
        this.cleanDerivation();
        this.derivation.fromAccount(account);
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Set derivation to a specific change chain.
     * @param change Change index or string (0: external, 1: internal)
     * @returns {this} Current BIP44HD instance
     */
    fromChange(change) {
        this.cleanDerivation();
        this.derivation.fromChange(change);
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Set derivation to a specific address index or range.
     * @param address Single address index or a tuple [start, end]
     * @returns {this} Current BIP44HD instance
     */
    fromAddress(address) {
        this.cleanDerivation();
        this.derivation.fromAddress(address);
        this.fromDerivation(this.derivation);
        return this;
    }
    /**
     * Apply a full BIP44 derivation path to the HD instance.
     * @param derivation BIP44Derivation instance
     * @returns {this} Current BIP44HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.BIP44Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    /**
     * Generate a P2PKH cryptocurrency address from the current public key.
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Prefix for the public key address (default: Bitcoin mainnet)
     * @returns {string} Encoded P2PKH address
     */
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