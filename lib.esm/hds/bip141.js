// SPDX-License-Identifier: MIT
import { Bitcoin } from '../cryptocurrencies';
import { PUBLIC_KEY_TYPES, SEMANTICS } from '../consts';
import { P2WPKHAddress, P2WPKHInP2SHAddress, P2WSHAddress, P2WSHInP2SHAddress } from '../addresses';
import { AddressError, SemanticError } from '../exceptions';
import { BIP32HD } from './bip32';
/**
 * Implements BIP141 hierarchical deterministic wallet functionality.
 */
export class BIP141HD extends BIP32HD {
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
        publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        if (!options.semantic) {
            throw new SemanticError('Semantic is required');
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
        if (!SEMANTICS.getTypes().includes(semantic)) {
            throw new SemanticError(`Invalid semantic type`, {
                expected: SEMANTICS.getTypes(), got: semantic
            });
        }
        this.semantic = semantic;
        if (semantic === SEMANTICS.P2WPKH) {
            this.address = P2WPKHAddress.getName();
            this.xprivateKeyVersion = options.p2wpkhXPrivateKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH;
            this.xpublicKeyVersion = options.p2wpkhXPublicKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH;
        }
        else if (semantic === SEMANTICS.P2WPKH_IN_P2SH) {
            this.address = P2WPKHInP2SHAddress.getName();
            this.xprivateKeyVersion = options.p2wpkhInP2SHXPrivateKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH;
            this.xpublicKeyVersion = options.p2wpkhInP2SHXPublicKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH;
        }
        else if (semantic === SEMANTICS.P2WSH) {
            this.address = P2WSHAddress.getName();
            this.xprivateKeyVersion = options.p2wshXPrivateKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WSH;
            this.xpublicKeyVersion = options.p2wshXPublicKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WSH;
        }
        else if (semantic === SEMANTICS.P2WSH_IN_P2SH) {
            this.address = P2WSHInP2SHAddress.getName();
            this.xprivateKeyVersion = options.p2wshInP2SHXPrivateKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WSH_IN_P2SH;
            this.xpublicKeyVersion = options.p2wshInP2SHXPublicKeyVersion ?? Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WSH_IN_P2SH;
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
        scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
        hrp: Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        const address = options?.address ?? this.address;
        const scriptAddressPrefix = options.scriptAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
        const hrp = options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP;
        const witnessVersion = options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH;
        if (address === P2WPKHAddress.getName()) {
            return P2WPKHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === P2WPKHInP2SHAddress.getName()) {
            return P2WPKHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === P2WSHAddress.getName()) {
            return P2WSHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === P2WSHInP2SHAddress.getName()) {
            return P2WSHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        throw new AddressError(`Invalid ${BIP141HD.getName()} address`, {
            expected: [
                P2WPKHAddress.getName(),
                P2WPKHInP2SHAddress.getName(),
                P2WSHAddress.getName(),
                P2WSHInP2SHAddress.getName()
            ],
            got: address
        });
    }
}
//# sourceMappingURL=bip141.js.map