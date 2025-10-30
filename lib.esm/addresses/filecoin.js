// SPDX-License-Identifier: MIT
import { encodeNoPadding, decode } from '../libs/base32';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Filecoin } from '../cryptocurrencies';
import { blake2b160, blake2b32 } from '../crypto';
import { integerToBytes, bytesToString, getBytes, concatBytes, equalBytes, bytesToHex } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing Filecoin blockchain addresses.
 * Provides encoding and decoding of public keys into Filecoin addresses.
 * Supports SECP256K1 and BLS address types and computes checksums using Blake2b.
 * Extends the abstract Address class.
 */
export class FilecoinAddress extends Address {
    static alphabet = Filecoin.PARAMS.ALPHABET;
    static addressPrefix = Filecoin.PARAMS.ADDRESS_PREFIX;
    static addressType = Filecoin.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        secp256k1: Filecoin.PARAMS.ADDRESS_TYPES.SECP256K1,
        bls: Filecoin.PARAMS.ADDRESS_TYPES.BLS
    };
    /**
     * Returns the name of the address implementation.
     * @returns {string} 'Filecoin'
     */
    static getName() {
        return 'Filecoin';
    }
    /**
     * Computes the checksum for a Filecoin address.
     * Uses Blake2b-32 on the concatenation of address type and public key hash.
     *
     * @param pubKeyHash Public key hash bytes (20-byte Blake2b-160 hash)
     * @param addressType Numeric address type
     * @returns {Uint8Array} Checksum bytes (4 bytes)
     */
    static computeChecksum(pubKeyHash, addressType) {
        return blake2b32(concatBytes(integerToBytes(addressType), pubKeyHash));
    }
    /**
     * Encodes a public key into a Filecoin address.
     * Combines the public key hash, address type, and checksum into a base32 string with prefix.
     *
     * @param publicKey Public key to encode (Uint8Array, string, or PublicKey)
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If public key or address type is invalid
     * @returns {string} Encoded Filecoin address
     */
    static encode(publicKey, options = {
        addressPrefix: this.addressPrefix,
        addressType: this.addressType
    }) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const pubKeyHash = blake2b160(pk.getRawUncompressed());
        const typeKey = options.addressType ?? this.addressType;
        const addressType = this.addressTypes[typeKey];
        if (addressType === undefined) {
            throw new AddressError('Invalid Filecoin address type', {
                expected: Object.keys(FilecoinAddress.addressTypes),
                got: typeKey
            });
        }
        const checksum = FilecoinAddress.computeChecksum(pubKeyHash, addressType);
        const base32Encoded = encodeNoPadding(bytesToString(concatBytes(pubKeyHash, checksum)), FilecoinAddress.alphabet);
        return FilecoinAddress.addressPrefix + String.fromCharCode(addressType + '0'.charCodeAt(0)) + base32Encoded;
    }
    /**
     * Decodes a Filecoin address back to its public key hash.
     * Validates prefix, address type, length, and checksum.
     *
     * @param address Filecoin address string to decode
     * @param options Address options including addressPrefix and addressType
     * @throws {AddressError} If prefix, address type, length, or checksum is invalid
     * @returns {string} Decoded public key hash (20-byte hex string)
     */
    static decode(address, options = {
        addressPrefix: this.addressPrefix,
        addressType: this.addressType
    }) {
        const prefix = FilecoinAddress.addressPrefix;
        if (!address.startsWith(prefix)) {
            throw new AddressError('Invalid prefix', {
                expected: prefix,
                got: address.slice(0, prefix.length)
            });
        }
        const addressBody = address.slice(prefix.length);
        const typeKey = options.addressType ?? this.addressType;
        const expectedType = FilecoinAddress.addressTypes[typeKey];
        if (expectedType === undefined) {
            throw new AddressError('Invalid Filecoin address type', {
                expected: Object.keys(FilecoinAddress.addressTypes),
                got: typeKey
            });
        }
        const actualType = addressBody.charCodeAt(0) - '0'.charCodeAt(0);
        if (expectedType !== actualType) {
            throw new AddressError('Invalid address type', {
                expected: expectedType,
                got: actualType
            });
        }
        const payloadBytes = getBytes(decode(addressBody.slice(1), FilecoinAddress.alphabet));
        if (payloadBytes.length !== 24) {
            throw new AddressError('Invalid length', {
                expected: 24, got: payloadBytes.length
            });
        }
        const publicKeyHash = payloadBytes.slice(0, 20);
        const checksum = payloadBytes.slice(20);
        const expectedChecksum = FilecoinAddress.computeChecksum(publicKeyHash, expectedType);
        if (!equalBytes(checksum, expectedChecksum)) {
            throw new AddressError('Invalid checksum', {
                expected: bytesToHex(expectedChecksum), got: bytesToHex(checksum)
            });
        }
        return bytesToString(publicKeyHash);
    }
}
//# sourceMappingURL=filecoin.js.map