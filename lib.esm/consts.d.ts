/**
 * Represents a nested namespace allowing dynamic hierarchical property access.
 * @param {Set<string> | any[] | Record<string, any>} data - Data to initialize the namespace with.
 */
export declare class NestedNamespace {
    [key: string]: any;
    constructor(data: Set<string> | any[] | Record<string, any>);
}
/** SLIP10 constants for Ed25519 curve. */
export declare const SLIP10_ED25519_CONST: Record<string, any>;
/** KHOLAW constants for Ed25519 curve. */
export declare const KHOLAW_ED25519_CONST: Record<string, any>;
/** SLIP10 constants for SECP256K1 curve. */
export declare const SLIP10_SECP256K1_CONST: Record<string, any>;
/**
 * Stores cryptocurrency metadata such as source, whitepaper, and websites.
 * @param {Record<string, any>} data - Metadata values.
 */
export declare class Info extends NestedNamespace {
    SOURCE_CODE?: string;
    WHITEPAPER?: string;
    WEBSITES: string[];
    constructor(data: Record<string, any>);
}
/**
 * Manages witness versions for blockchain addresses.
 */
export declare class WitnessVersions extends NestedNamespace {
    /**
     * Gets witness version for a given address.
     * @param {string} address - Address string.
     * @returns {number | undefined} Witness version or undefined.
     */
    getWitnessVersion(address: string): number | undefined;
}
/**
 * Manages entropy values.
 */
export declare class Entropies extends NestedNamespace {
    /**
     * Checks if a given entropy exists.
     * @param {string} entropy - Entropy to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isEntropy(entropy: string): boolean;
    /**
     * Gets all stored entropies.
     * @returns {string[]} List of entropies.
     */
    getEntropies(): string[];
}
/**
 * Manages mnemonic phrases.
 */
export declare class Mnemonics extends NestedNamespace {
    /**
     * Checks if a given mnemonic exists.
     * @param {string} mnemonic - Mnemonic to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isMnemonic(mnemonic: string): boolean;
    /**
     * Gets all stored mnemonics.
     * @returns {string[]} List of mnemonics.
     */
    getMnemonics(): string[];
}
/**
 * Manages seed values.
 */
export declare class Seeds extends NestedNamespace {
    /**
     * Checks if a given seed exists.
     * @param {string} seed - Seed to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isSeed(seed: string): boolean;
    /**
     * Gets all stored seeds.
     * @returns {string[]} List of seeds.
     */
    getSeeds(): string[];
}
/**
 * Manages hierarchical deterministic wallet identifiers.
 */
export declare class HDs extends NestedNamespace {
    /**
     * Checks if a given HD type exists.
     * @param {string} hd - HD identifier.
     * @returns {boolean} True if exists, otherwise false.
     */
    isHD(hd: string): boolean;
    /**
     * Gets all HD types.
     * @returns {string[]} List of HD identifiers.
     */
    getHDS(): string[];
}
/**
 * Manages cryptocurrency addresses.
 */
export declare class Addresses extends NestedNamespace {
    /**
     * Checks if a given address exists.
     * @param {string} address - Address to check.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddress(address: string): boolean;
    /**
     * Gets all stored addresses.
     * @returns {string[]} List of addresses.
     */
    getAddresses(): string[];
    /**
     * Gets total number of addresses.
     * @returns {number} Number of addresses.
     */
    length(): number;
}
/**
 * Manages address types.
 */
export declare class AddressTypes extends NestedNamespace {
    /**
     * Checks if an address type exists.
     * @param {string} addressType - Address type.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddressType(addressType: string): boolean;
    /**
     * Gets all address types.
     * @returns {string[]} List of address types.
     */
    getAddressTypes(): string[];
}
/**
 * Manages address prefixes.
 */
export declare class AddressPrefixes extends NestedNamespace {
    /**
     * Checks if an address prefix exists.
     * @param {string} addressPrefix - Address prefix.
     * @returns {boolean} True if exists, otherwise false.
     */
    isAddressPrefix(addressPrefix: string): boolean;
    /**
     * Gets all address prefixes.
     * @returns {string[]} List of address prefixes.
     */
    getAddressPrefixes(): string[];
}
/**
 * Manages blockchain network configurations.
 */
export declare class Networks extends NestedNamespace {
    /**
     * Checks if a network exists.
     * @param {string} network - Network name.
     * @returns {boolean} True if exists, otherwise false.
     */
    isNetwork(network: string): boolean;
    /**
     * Gets all networks.
     * @returns {string[]} List of network names.
     */
    getNetworks(): string[];
    /**
     * Gets network data by name.
     * @param {string} network - Network name.
     * @returns {any} Network configuration data.
     * @throws {NetworkError} If the network does not exist.
     */
    getNetwork(network: string): any;
}
/**
 * Stores parameter values for networks or cryptos.
 */
export declare class Params extends NestedNamespace {
}
/**
 * Manages extended key version constants.
 */
export declare class ExtendedKeyVersions extends NestedNamespace {
    /**
     * Checks if a version exists.
     * @param {Uint8Array} version - Version bytes.
     * @returns {boolean} True if exists, otherwise false.
     */
    isVersion(version: Uint8Array): boolean;
    /**
     * Gets all version names.
     * @returns {string[]} List of version names.
     */
    getVersions(): string[];
    /**
     * Gets version value by name.
     * @param {string} name - Version name.
     * @returns {number | string | Uint8Array} Version value.
     */
    getVersion(name: string): number | string | Uint8Array;
    /**
     * Gets version name by version bytes.
     * @param {Uint8Array} version - Version bytes.
     * @returns {string | undefined} Version name or undefined.
     */
    getName(version: Uint8Array): string | undefined;
}
/** Extended private key version manager. */
export declare class XPrivateKeyVersions extends ExtendedKeyVersions {
}
/** Extended public key version manager. */
export declare class XPublicKeyVersions extends ExtendedKeyVersions {
}
/**
 * Enum-like class for public key types.
 */
export declare class PUBLIC_KEY_TYPES {
    static readonly UNCOMPRESSED: string;
    static readonly COMPRESSED: string;
    /**
     * Gets all public key types.
     * @returns {string[]} List of public key types.
     */
    static getTypes(): string[];
}
/**
 * Enum-like class for WIF key types.
 */
export declare class WIF_TYPES {
    static readonly WIF: string;
    static readonly WIF_COMPRESSED: string;
    /**
     * Gets all WIF types.
     * @returns {string[]} List of WIF types.
     */
    static getTypes(): string[];
}
/**
 * Enum-like class for Bitcoin address semantics.
 */
export declare class SEMANTICS {
    static readonly P2WPKH: string;
    static readonly P2WPKH_IN_P2SH: string;
    static readonly P2WSH: string;
    static readonly P2WSH_IN_P2SH: string;
    /**
     * Gets all semantic types.
     * @returns {string[]} List of semantic types.
     */
    static getTypes(): string[];
}
/**
 * Enum-like class for operational modes.
 */
export declare class MODES {
    static readonly STANDARD: string;
    static readonly SEGWIT: string;
    /**
     * Gets all mode types.
     * @returns {string[]} List of mode types.
     */
    static getTypes(): string[];
}
//# sourceMappingURL=consts.d.ts.map