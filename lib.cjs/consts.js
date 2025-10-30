"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODES = exports.SEMANTICS = exports.WIF_TYPES = exports.PUBLIC_KEY_TYPES = exports.XPublicKeyVersions = exports.XPrivateKeyVersions = exports.ExtendedKeyVersions = exports.Params = exports.Networks = exports.AddressPrefixes = exports.AddressTypes = exports.Addresses = exports.HDs = exports.Seeds = exports.Mnemonics = exports.Entropies = exports.WitnessVersions = exports.Info = exports.SLIP10_SECP256K1_CONST = exports.KHOLAW_ED25519_CONST = exports.SLIP10_ED25519_CONST = exports.NestedNamespace = void 0;
const exceptions_1 = require("./exceptions");
const utils_1 = require("./utils");
/**
 * Represents a nested namespace allowing dynamic hierarchical property access.
 * @param {Set<string> | any[] | Record<string, any>} data - Data to initialize the namespace with.
 */
class NestedNamespace {
    constructor(data) {
        if (data instanceof Set) {
            data.forEach(item => {
                this[item] = item;
            });
        }
        else if (Array.isArray(data)) {
            data.forEach(item => {
                if (item != null && typeof item === 'object' && !Array.isArray(item)) {
                    Object.entries(item).forEach(([key, value]) => {
                        this[key] = (value != null && typeof value === 'object')
                            ? new NestedNamespace(value)
                            : value;
                    });
                }
                else {
                    this[item] = item;
                }
            });
        }
        else {
            Object.entries(data).forEach(([key, value]) => {
                this[key] = (value != null && typeof value === 'object')
                    ? new NestedNamespace(value)
                    : value;
            });
        }
    }
}
exports.NestedNamespace = NestedNamespace;
/** SLIP10 constants for Ed25519 curve. */
exports.SLIP10_ED25519_CONST = {
    PRIVATE_KEY_BYTE_LENGTH: 32,
    PUBLIC_KEY_PREFIX: (0, utils_1.integerToBytes)(0x00),
    PUBLIC_KEY_BYTE_LENGTH: 32
};
/** KHOLAW constants for Ed25519 curve. */
exports.KHOLAW_ED25519_CONST = {
    ...exports.SLIP10_ED25519_CONST,
    PRIVATE_KEY_BYTE_LENGTH: 64
};
/** SLIP10 constants for SECP256K1 curve. */
exports.SLIP10_SECP256K1_CONST = {
    POINT_COORDINATE_BYTE_LENGTH: 32,
    PRIVATE_KEY_BYTE_LENGTH: 32,
    PRIVATE_KEY_UNCOMPRESSED_PREFIX: 0x00,
    PRIVATE_KEY_COMPRESSED_PREFIX: 0x01,
    PUBLIC_KEY_UNCOMPRESSED_PREFIX: (0, utils_1.integerToBytes)(0x04),
    PUBLIC_KEY_COMPRESSED_BYTE_LENGTH: 33,
    PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH: 65,
    CHECKSUM_BYTE_LENGTH: 4
};
/**
 * Stores cryptocurrency metadata such as source, whitepaper, and websites.
 * @param {Record<string, any>} data - Metadata values.
 */
class Info extends NestedNamespace {
    SOURCE_CODE;
    WHITEPAPER;
    WEBSITES;
    constructor(data) {
        super(data);
    }
}
exports.Info = Info;
/**
 * Manages witness versions for blockchain addresses.
 */
class WitnessVersions extends NestedNamespace {
    /**
     * Gets witness version for a given address.
     * @param {string} address - Address string.
     * @returns {number | undefined} Witness version or undefined.
     */
    getWitnessVersion(address) {
        return this[address.toUpperCase()];
    }
}
exports.WitnessVersions = WitnessVersions;
/**
 * Manages entropy values.
 */
class Entropies extends NestedNamespace {
    /**
     * Checks if a given entropy exists.
     * @param {string} entropy - Entropy to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isEntropy(entropy) {
        return this.getEntropies().includes(entropy);
    }
    /**
     * Gets all stored entropies.
     * @returns {string[]} List of entropies.
     */
    getEntropies() {
        return Object.values(this);
    }
}
exports.Entropies = Entropies;
/**
 * Manages mnemonic phrases.
 */
class Mnemonics extends NestedNamespace {
    /**
     * Checks if a given mnemonic exists.
     * @param {string} mnemonic - Mnemonic to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isMnemonic(mnemonic) {
        return this.getMnemonics().includes(mnemonic);
    }
    /**
     * Gets all stored mnemonics.
     * @returns {string[]} List of mnemonics.
     */
    getMnemonics() {
        return Object.values(this);
    }
}
exports.Mnemonics = Mnemonics;
/**
 * Manages seed values.
 */
class Seeds extends NestedNamespace {
    /**
     * Checks if a given seed exists.
     * @param {string} seed - Seed to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isSeed(seed) {
        return this.getSeeds().includes(seed);
    }
    /**
     * Gets all stored seeds.
     * @returns {string[]} List of seeds.
     */
    getSeeds() {
        return Object.values(this);
    }
}
exports.Seeds = Seeds;
/**
 * Manages hierarchical deterministic wallet identifiers.
 */
class HDs extends NestedNamespace {
    /**
     * Checks if a given HD type exists.
     * @param {string} hd - HD identifier.
     * @returns {boolean} True if exists, otherwise false.
     */
    isHD(hd) {
        return this.getHDS().includes(hd);
    }
    /**
     * Gets all HD types.
     * @returns {string[]} List of HD identifiers.
     */
    getHDS() {
        return Object.values(this);
    }
}
exports.HDs = HDs;
/**
 * Manages cryptocurrency addresses.
 */
class Addresses extends NestedNamespace {
    /**
     * Checks if a given address exists.
     * @param {string} address - Address to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddress(address) {
        return this.getAddresses().includes(address);
    }
    /**
     * Gets all stored addresses.
     * @returns {string[]} List of addresses.
     */
    getAddresses() {
        return Object.values(this);
    }
    /**
     * Gets total number of addresses.
     * @returns {number} Number of addresses.
     */
    length() {
        return this.getAddresses().length;
    }
}
exports.Addresses = Addresses;
/**
 * Manages address types.
 */
class AddressTypes extends NestedNamespace {
    /**
     * Checks if an address type exists.
     * @param {string} addressType - Address type.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddressType(addressType) {
        return this.getAddressTypes().includes(addressType);
    }
    /**
     * Gets all address types.
     * @returns {string[]} List of address types.
     */
    getAddressTypes() {
        return Object.values(this);
    }
}
exports.AddressTypes = AddressTypes;
/**
 * Manages address prefixes.
 */
class AddressPrefixes extends NestedNamespace {
    /**
     * Checks if an address prefix exists.
     * @param {string} addressPrefix - Address prefix.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddressPrefix(addressPrefix) {
        return this.getAddressPrefixes().includes(addressPrefix);
    }
    /**
     * Gets all address prefixes.
     * @returns {string[]} List of address prefixes.
     */
    getAddressPrefixes() {
        return Object.values(this);
    }
}
exports.AddressPrefixes = AddressPrefixes;
/**
 * Manages blockchain network configurations.
 */
class Networks extends NestedNamespace {
    /**
     * Checks if a network exists.
     * @param {string} network - Network name.
     * @returns {boolean} True if exists, otherwise false.
     */
    isNetwork(network) {
        return this.getNetworks().includes(network.toLowerCase());
    }
    /**
     * Gets all networks.
     * @returns {string[]} List of network names.
     */
    getNetworks() {
        return Object.keys(this).map(k => k.toLowerCase());
    }
    /**
     * Gets network data by name.
     * @param {string} network - Network name.
     * @returns {any} Network configuration data.
     * @throws {NetworkError} If the network does not exist.
     */
    getNetwork(network) {
        if (!this.isNetwork(network)) {
            throw new exceptions_1.NetworkError(`${network} network is not available`);
        }
        return this[network.toUpperCase()];
    }
}
exports.Networks = Networks;
/**
 * Stores parameter values for networks or cryptos.
 */
class Params extends NestedNamespace {
}
exports.Params = Params;
/**
 * Manages extended key version constants.
 */
class ExtendedKeyVersions extends NestedNamespace {
    /**
     * Checks if a version exists.
     * @param {Uint8Array} version - Version bytes.
     * @returns {boolean} True if exists, otherwise false.
     */
    isVersion(version) {
        return Object.values(this).includes(Number((0, utils_1.bytesToInteger)(version)));
    }
    /**
     * Gets all version names.
     * @returns {string[]} List of version names.
     */
    getVersions() {
        return Object.keys(this).map(k => k.toLowerCase().replace(/_/g, '-'));
    }
    /**
     * Gets version value by name.
     * @param {string} name - Version name.
     * @returns {number | string | Uint8Array} Version value.
     */
    getVersion(name) {
        return this[name.toUpperCase().replace(/-/g, '_')];
    }
    /**
     * Gets version name by version bytes.
     * @param {Uint8Array} version - Version bytes.
     * @returns {string | undefined} Version name or undefined.
     */
    getName(version) {
        const intVer = (0, utils_1.bytesToInteger)(version);
        return Object.entries(this).find(([, v]) => v === intVer)?.[0];
    }
}
exports.ExtendedKeyVersions = ExtendedKeyVersions;
/** Extended private key version manager. */
class XPrivateKeyVersions extends ExtendedKeyVersions {
}
exports.XPrivateKeyVersions = XPrivateKeyVersions;
/** Extended public key version manager. */
class XPublicKeyVersions extends ExtendedKeyVersions {
}
exports.XPublicKeyVersions = XPublicKeyVersions;
/**
 * Enum-like class for public key types.
 */
class PUBLIC_KEY_TYPES {
    static UNCOMPRESSED = 'uncompressed';
    static COMPRESSED = 'compressed';
    /**
     * Gets all public key types.
     * @returns {string[]} List of public key types.
     */
    static getTypes() {
        return [this.UNCOMPRESSED, this.COMPRESSED];
    }
}
exports.PUBLIC_KEY_TYPES = PUBLIC_KEY_TYPES;
/**
 * Enum-like class for WIF key types.
 */
class WIF_TYPES {
    static WIF = 'wif';
    static WIF_COMPRESSED = 'wif-compressed';
    /**
     * Gets all WIF types.
     * @returns {string[]} List of WIF types.
     */
    static getTypes() {
        return [this.WIF, this.WIF_COMPRESSED];
    }
}
exports.WIF_TYPES = WIF_TYPES;
/**
 * Enum-like class for Bitcoin address semantics.
 */
class SEMANTICS {
    static P2WPKH = 'p2wpkh';
    static P2WPKH_IN_P2SH = 'p2wpkh-in-p2sh';
    static P2WSH = 'p2wsh';
    static P2WSH_IN_P2SH = 'p2wsh-in-p2sh';
    /**
     * Gets all semantic types.
     * @returns {string[]} List of semantic types.
     */
    static getTypes() {
        return [this.P2WPKH, this.P2WPKH_IN_P2SH, this.P2WSH, this.P2WSH_IN_P2SH];
    }
}
exports.SEMANTICS = SEMANTICS;
/**
 * Enum-like class for operational modes.
 */
class MODES {
    static STANDARD = 'standard';
    static SEGWIT = 'segwit';
    /**
     * Gets all mode types.
     * @returns {string[]} List of mode types.
     */
    static getTypes() {
        return [this.STANDARD, this.SEGWIT];
    }
}
exports.MODES = MODES;
//# sourceMappingURL=consts.js.map