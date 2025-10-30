// SPDX-License-Identifier: MIT
import { CosmosAddress } from './cosmos';
import { Avalanche } from '../cryptocurrencies';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing Avalanche blockchain addresses.
 * Extends the abstract Address class and provides Avalanche-specific encoding and decoding.
 */
export class AvalancheAddress extends Address {
    static hrp = Avalanche.NETWORKS.MAINNET.HRP;
    static addressType = Avalanche.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        'p-chain': Avalanche.PARAMS.ADDRESS_TYPES.P_CHAIN,
        'x-chain': Avalanche.PARAMS.ADDRESS_TYPES.X_CHAIN
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
            throw new AddressError('Invalid Avalanche address type', {
                expected: Object.keys(AvalancheAddress.addressTypes), got: typeKey
            });
        }
        const base = CosmosAddress.encode(publicKey, {
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
            throw new AddressError('Invalid Avalanche address type', {
                expected: Object.keys(AvalancheAddress.addressTypes), got: typeKey
            });
        }
        const prefix = address.slice(0, addressType.length);
        if (prefix !== addressType) {
            throw new AddressError('Invalid prefix', {
                expected: addressType, got: prefix
            });
        }
        const rest = address.slice(addressType.length);
        return CosmosAddress.decode(rest, { hrp: options.hrp ?? this.hrp });
    }
}
//# sourceMappingURL=avalanche.js.map