// SPDX-License-Identifier: MIT
import { NetworkError } from './exceptions';
import { integerToBytes, bytesToInteger } from './utils';
/**
 * Represents a nested namespace allowing dynamic hierarchical property access.
 * @param {Set<string> | any[] | Record<string, any>} data - Data to initialize the namespace with.
 */
export class NestedNamespace {
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
/** SLIP10 constants for Ed25519 curve. */
export const SLIP10_ED25519_CONST = {
    PRIVATE_KEY_BYTE_LENGTH: 32,
    PUBLIC_KEY_PREFIX: integerToBytes(0x00),
    PUBLIC_KEY_BYTE_LENGTH: 32
};
/** KHOLAW constants for Ed25519 curve. */
export const KHOLAW_ED25519_CONST = {
    ...SLIP10_ED25519_CONST,
    PRIVATE_KEY_BYTE_LENGTH: 64
};
/** SLIP10 constants for SECP256K1 curve. */
export const SLIP10_SECP256K1_CONST = {
    POINT_COORDINATE_BYTE_LENGTH: 32,
    PRIVATE_KEY_BYTE_LENGTH: 32,
    PRIVATE_KEY_UNCOMPRESSED_PREFIX: 0x00,
    PRIVATE_KEY_COMPRESSED_PREFIX: 0x01,
    PUBLIC_KEY_UNCOMPRESSED_PREFIX: integerToBytes(0x04),
    PUBLIC_KEY_COMPRESSED_BYTE_LENGTH: 33,
    PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH: 65,
    CHECKSUM_BYTE_LENGTH: 4
};
/**
 * Stores cryptocurrency metadata such as source, whitepaper, and websites.
 * @param {Record<string, any>} data - Metadata values.
 */
export class Info extends NestedNamespace {
    SOURCE_CODE;
    WHITEPAPER;
    WEBSITES;
    constructor(data) {
        super(data);
    }
}
/**
 * Manages witness versions for blockchain addresses.
 */
export class WitnessVersions extends NestedNamespace {
    /**
     * Gets witness version for a given address.
     * @param {string} address - Address string.
     * @returns {number | undefined} Witness version or undefined.
     */
    getWitnessVersion(address) {
        return this[address.toUpperCase()];
    }
}
/**
 * Manages entropy values.
 */
export class Entropies extends NestedNamespace {
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
/**
 * Manages mnemonic phrases.
 */
export class Mnemonics extends NestedNamespace {
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
/**
 * Manages seed values.
 */
export class Seeds extends NestedNamespace {
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
/**
 * Manages hierarchical deterministic wallet identifiers.
 */
export class HDs extends NestedNamespace {
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
/**
 * Manages cryptocurrency addresses.
 */
export class Addresses extends NestedNamespace {
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
/**
 * Manages address types.
 */
export class AddressTypes extends NestedNamespace {
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
/**
 * Manages address prefixes.
 */
export class AddressPrefixes extends NestedNamespace {
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
/**
 * Manages blockchain network configurations.
 */
export class Networks extends NestedNamespace {
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
            throw new NetworkError(`${network} network is not available`);
        }
        return this[network.toUpperCase()];
    }
}
/**
 * Stores parameter values for networks or cryptos.
 */
export class Params extends NestedNamespace {
}
/**
 * Manages extended key version constants.
 */
export class ExtendedKeyVersions extends NestedNamespace {
    /**
     * Checks if a version exists.
     * @param {Uint8Array} version - Version bytes.
     * @returns {boolean} True if exists, otherwise false.
     */
    isVersion(version) {
        return Object.values(this).includes(Number(bytesToInteger(version)));
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
        const intVer = bytesToInteger(version);
        return Object.entries(this).find(([, v]) => v === intVer)?.[0];
    }
}
/** Extended private key version manager. */
export class XPrivateKeyVersions extends ExtendedKeyVersions {
}
/** Extended public key version manager. */
export class XPublicKeyVersions extends ExtendedKeyVersions {
}
/**
 * Enum-like class for public key types.
 */
export class PUBLIC_KEY_TYPES {
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
/**
 * Enum-like class for WIF key types.
 */
export class WIF_TYPES {
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
/**
 * Enum-like class for Bitcoin address semantics.
 */
export class SEMANTICS {
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
/**
 * Enum-like class for operational modes.
 */
export class MODES {
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
//# sourceMappingURL=consts.js.map