// SPDX-License-Identifier: MIT
import { BIP49Derivation, CHANGES } from '../derivations';
import { Bitcoin } from '../cryptocurrencies';
import { P2WPKHInP2SHAddress } from '../addresses';
import { BIP44HD } from './bip44';
import { PUBLIC_KEY_TYPES } from '../consts';
import { serialize } from '../keys';
import { integerToBytes, ensureTypeMatch } from '../utils';
import { DerivationError } from '../exceptions';
/**
 * Implements the BIP49 hierarchical deterministic (HD) wallet standard.
 * Extends BIP44HD to support P2WPKH-in-P2SH addresses (SegWit wrapped in P2SH).
 * Provides methods to derive keys, generate extended keys, and encode addresses according to BIP49.
 *
 */
export class BIP49HD extends BIP44HD {
    /**
     * Create a new BIP49HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     * @param options.publicKeyType Type of public key (compressed/uncompressed)
     * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
     * @param options.account Account index (default: 0)
     * @param options.change Change chain (0: external, 1: internal, default: external)
     * @param options.address Address index (default: 0)
     */
    constructor(options = {
        publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? Bitcoin.COIN_TYPE;
        this.derivation = new BIP49Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP49'
     */
    static getName() {
        return 'BIP49';
    }
    /**
     * Apply a full BIP49 derivation path to the HD instance.
     * @param derivation BIP49Derivation instance
     * @returns {this} Current BIP49HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = ensureTypeMatch(derivation, BIP49Derivation, { errorClass: DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    /**
     * Get the root extended private key (xprv) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended private key or null if unavailable
     */
    getRootXPrivateKey(version = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return serialize(typeof version === 'number' ? integerToBytes(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    /**
     * Get the root extended public key (xpub) for BIP49 with optional version and encoding.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized root extended public key or null if unavailable
     */
    getRootXPublicKey(version = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return serialize(typeof version === 'number' ? integerToBytes(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Get the extended private key (xprv) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended private key or null if unavailable
     */
    getXPrivateKey(version = Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return serialize(typeof version === 'number' ? integerToBytes(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    /**
     * Get the extended public key (xpub) for the current derivation path.
     * @param version Version bytes or number (default: Bitcoin mainnet P2WPKH-in-P2SH)
     * @param encoded Whether to return a base58-encoded string (default: true)
     * @returns {string | null} Serialized extended public key or null if unavailable
     */
    getXPublicKey(version = Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2WPKH_IN_P2SH, encoded = true) {
        if (!this.getChainCode())
            return null;
        return serialize(typeof version === 'number' ? integerToBytes(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    /**
     * Generate a P2WPKH-in-P2SH address from the current public key.
     * @param options Address generation options
     * @param options.scriptAddressPrefix Prefix for the P2SH script address (default: Bitcoin mainnet)
     * @returns {string} Encoded P2WPKH-in-P2SH address
     */
    getAddress(options = {
        scriptAddressPrefix: Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX
    }) {
        return P2WPKHInP2SHAddress.encode(this.publicKey, {
            scriptAddressPrefix: options.scriptAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
//# sourceMappingURL=bip49.js.map