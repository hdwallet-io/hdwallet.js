// SPDX-License-Identifier: MIT
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Cosmos } from '../cryptocurrencies';
import { sha256, ripemd160 } from '../crypto';
import { bytesToString } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing Cosmos blockchain addresses.
 * Provides encoding and decoding of public keys using Bech32 format.
 * Extends the abstract Address class.
 */
export class CosmosAddress extends Address {
    static hrp = Cosmos.NETWORKS.MAINNET.HRP;
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Cosmos'
     */
    static getName() {
        return 'Cosmos';
    }
    /**
     * Encodes a public key into a Cosmos address.
     * The public key is first hashed using SHA256, then RIPEMD160, and finally encoded in Bech32 format.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey object)
     * @param options Address options including HRP prefix
     * @throws {AddressError} If Bech32 encoding fails
     * @returns {string} Encoded Cosmos address
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const hash = ripemd160(sha256(pk.getRawCompressed()));
        const hrp = options.hrp ?? this.hrp;
        const encoded = bech32Encode(hrp, hash);
        if (encoded === null) {
            throw new AddressError('Failed to encode Bech32 address');
        }
        return encoded;
    }
    /**
     * Decodes a Cosmos address into its raw public key bytes.
     * Validates that the HRP prefix matches the expected network prefix.
     *
     * @param address Cosmos address to decode
     * @param options Address options including HRP prefix
     * @throws {AddressError} If HRP prefix is invalid or decoding fails
     * @returns {string} Decoded raw public key bytes as a string
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [gotHrp, decoded] = bech32Decode(hrp, address);
        if (typeof gotHrp !== 'string' || gotHrp !== hrp) {
            throw new AddressError('Invalid HRP prefix or decode failure', {
                expected: hrp, got: gotHrp
            });
        }
        return bytesToString(decoded);
    }
}
//# sourceMappingURL=cosmos.js.map