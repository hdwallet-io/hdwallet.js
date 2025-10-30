"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvalancheAddress = void 0;
const cosmos_1 = require("./cosmos");
const cryptocurrencies_1 = require("../cryptocurrencies");
const address_1 = require("./address");
const exceptions_1 = require("../exceptions");
/**
 * Class representing Avalanche blockchain addresses.
 * Extends the abstract Address class and provides Avalanche-specific encoding and decoding.
 */
class AvalancheAddress extends address_1.Address {
    static hrp = cryptocurrencies_1.Avalanche.NETWORKS.MAINNET.HRP;
    static addressType = cryptocurrencies_1.Avalanche.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        'p-chain': cryptocurrencies_1.Avalanche.PARAMS.ADDRESS_TYPES.P_CHAIN,
        'x-chain': cryptocurrencies_1.Avalanche.PARAMS.ADDRESS_TYPES.X_CHAIN
    };
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Avalanche'
     */
    static getName() {
        return 'Avalanche';
    }
    /**
     * Encodes a public key into an Avalanche address.
     *
     * @param publicKey The public key to encode (Uint8Array, string, or PublicKey object)
     * @param options Optional parameters including hrp and addressType
     * @throws {AddressError} If the addressType is invalid
     * @returns {string} Encoded Avalanche address
     */
    static encode(publicKey, options = {
        hrp: this.hrp, addressType: this.addressType
    }) {
        const typeKey = options.addressType ?? this.addressType;
        const addressType = AvalancheAddress.addressTypes[typeKey];
        if (!addressType) {
            throw new exceptions_1.AddressError('Invalid Avalanche address type', {
                expected: Object.keys(AvalancheAddress.addressTypes), got: typeKey
            });
        }
        const base = cosmos_1.CosmosAddress.encode(publicKey, {
            hrp: options.hrp ?? this.hrp
        });
        return addressType + base;
    }
    /**
     * Decodes an Avalanche address back into its raw public key.
     *
     * @param address The Avalanche address string to decode
     * @param options Optional parameters including addressType and hrp
     * @throws {AddressError} If the prefix or addressType is invalid
     * @returns {string} Decoded raw public key string
     */
    static decode(address, options = {
        addressType: this.addressType
    }) {
        const typeKey = options.addressType ?? this.addressType;
        const addressType = AvalancheAddress.addressTypes[typeKey];
        if (!addressType) {
            throw new exceptions_1.AddressError('Invalid Avalanche address type', {
                expected: Object.keys(AvalancheAddress.addressTypes), got: typeKey
            });
        }
        const prefix = address.slice(0, addressType.length);
        if (prefix !== addressType) {
            throw new exceptions_1.AddressError('Invalid prefix', {
                expected: addressType, got: prefix
            });
        }
        const rest = address.slice(addressType.length);
        return cosmos_1.CosmosAddress.decode(rest, { hrp: options.hrp ?? this.hrp });
    }
}
exports.AvalancheAddress = AvalancheAddress;
//# sourceMappingURL=avalanche.js.map