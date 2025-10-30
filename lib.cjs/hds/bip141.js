"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP141HD = void 0;
const cryptocurrencies_1 = require("../cryptocurrencies");
const consts_1 = require("../consts");
const addresses_1 = require("../addresses");
const exceptions_1 = require("../exceptions");
const bip32_1 = require("./bip32");
/**
 * Implements BIP141 hierarchical deterministic wallet functionality.
 */
class BIP141HD extends bip32_1.BIP32HD {
    address;
    xprivateKeyVersion;
    xpublicKeyVersion;
    semantic;
    /**
     * Creates a new BIP141HD instance with semantic validation.
     * @param {HDOptionsInterface} [options={publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED}] - The HD wallet configuration options.
     * @throws {SemanticError} If semantic type is missing.
     */
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        if (!options.semantic) {
            throw new exceptions_1.SemanticError('Semantic is required');
        }
        this.fromSemantic(options.semantic, options);
    }
    /**
     * Returns the BIP standard name.
     * @returns {string} The name "BIP141".
     */
    static getName() {
        return 'BIP141';
    }
    /**
     * Retrieves the semantic type of the HD wallet.
     * @returns {string} The semantic type.
     */
    getSemantic() {
        return this.semantic;
    }
    /**
     * Initializes the HD wallet based on semantic type.
     * @param {string} semantic - The semantic standard type (e.g., P2WPKH, P2WSH).
     * @param {BIP141HDSemanticOptionsInterface} [options={}] - Optional BIP141-specific configuration.
     * @returns {this} The initialized BIP141HD instance.
     * @throws {SemanticError} If the semantic type is invalid.
     */
    fromSemantic(semantic, options = {}) {
        if (!consts_1.SEMANTICS.getTypes().includes(semantic)) {
            throw new exceptions_1.SemanticError(`Invalid semantic type`, {
                expected: consts_1.SEMANTICS.getTypes(), got: semantic
            });
        }
        this.semantic = semantic;
        if (semantic === consts_1.SEMANTICS.P2WPKH) {
            this.address = addresses_1.P2WPKHAddress.getName();
            this.xprivateKeyVersion = options.p2wpkhXPrivateKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH;
            this.xpublicKeyVersion = options.p2wpkhXPublicKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH;
        }
        else if (semantic === consts_1.SEMANTICS.P2WPKH_IN_P2SH) {
            this.address = addresses_1.P2WPKHInP2SHAddress.getName();
            this.xprivateKeyVersion = options.p2wpkhInP2SHXPrivateKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH;
            this.xpublicKeyVersion = options.p2wpkhInP2SHXPublicKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH;
        }
        else if (semantic === consts_1.SEMANTICS.P2WSH) {
            this.address = addresses_1.P2WSHAddress.getName();
            this.xprivateKeyVersion = options.p2wshXPrivateKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WSH;
            this.xpublicKeyVersion = options.p2wshXPublicKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WSH;
        }
        else if (semantic === consts_1.SEMANTICS.P2WSH_IN_P2SH) {
            this.address = addresses_1.P2WSHInP2SHAddress.getName();
            this.xprivateKeyVersion = options.p2wshInP2SHXPrivateKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WSH_IN_P2SH;
            this.xpublicKeyVersion = options.p2wshInP2SHXPublicKeyVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WSH_IN_P2SH;
        }
        return this;
    }
    /**
     * Returns the root extended private key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The root extended private key or null.
     */
    getRootXPrivateKey(version, encoded = true) {
        return super.getRootXPrivateKey(version ?? this.xprivateKeyVersion, encoded);
    }
    /**
     * Returns the root extended public key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The root extended public key or null.
     */
    getRootXPublicKey(version, encoded = true) {
        return super.getRootXPublicKey(version ?? this.xpublicKeyVersion, encoded);
    }
    /**
     * Returns the derived extended private key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The derived extended private key or null.
     */
    getXPrivateKey(version, encoded = true) {
        return super.getXPrivateKey(version ?? this.xprivateKeyVersion, encoded);
    }
    /**
     * Returns the derived extended public key.
     * @param {number | Uint8Array} [version] - The key version or prefix.
     * @param {boolean} [encoded=true] - Whether to return the encoded key string.
     * @returns {string | null} The derived extended public key or null.
     */
    getXPublicKey(version, encoded = true) {
        return super.getXPublicKey(version ?? this.xpublicKeyVersion, encoded);
    }
    /**
     * Encodes and returns the wallet address based on the selected semantic type.
     * @param {HDAddressOptionsInterface} [options] - Address generation options such as prefix, HRP, and witness version.
     * @returns {string} The encoded Bitcoin SegWit address.
     * @throws {AddressError} If the address type is invalid.
     */
    getAddress(options = {
        address: this.address,
        scriptAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        const address = options?.address ?? this.address;
        const scriptAddressPrefix = options.scriptAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
        const hrp = options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP;
        const witnessVersion = options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH;
        if (address === addresses_1.P2WPKHAddress.getName()) {
            return addresses_1.P2WPKHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WPKHInP2SHAddress.getName()) {
            return addresses_1.P2WPKHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WSHAddress.getName()) {
            return addresses_1.P2WSHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WSHInP2SHAddress.getName()) {
            return addresses_1.P2WSHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        throw new exceptions_1.AddressError(`Invalid ${BIP141HD.getName()} address`, {
            expected: [
                addresses_1.P2WPKHAddress.getName(),
                addresses_1.P2WPKHInP2SHAddress.getName(),
                addresses_1.P2WSHAddress.getName(),
                addresses_1.P2WSHInP2SHAddress.getName()
            ],
            got: address
        });
    }
}
exports.BIP141HD = BIP141HD;
//# sourceMappingURL=bip141.js.map