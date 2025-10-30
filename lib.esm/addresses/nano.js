// SPDX-License-Identifier: MIT
import { Nano } from '../cryptocurrencies';
import { AddressError } from '../exceptions';
import { decode as base32Decode, encodeNoPadding } from '../libs/base32';
import { blake2b40 } from '../crypto';
import { SLIP10Ed25519Blake2bPublicKey, validateAndGetPublicKey } from '../eccs';
import { bytesToString, bytesReverse, getBytes, concatBytes, equalBytes } from '../utils';
import { Address } from './address';
/**
 * Class representing a Nano (formerly RaiBlocks) blockchain address.
 * Supports encoding and decoding using a modified Base32 scheme and Blake2b checksums.
 */
export class NanoAddress extends Address {
    static addressPrefix = Nano.PARAMS.ADDRESS_PREFIX;
    static alphabet = Nano.PARAMS.ALPHABET;
    static payloadPaddingDecoded = getBytes(Nano.PARAMS.PAYLOAD_PADDING_DECODED);
    static payloadPaddingEncoded = Nano.PARAMS.PAYLOAD_PADDING_ENCODED;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName() {
        return 'Nano';
    }
    /**
     * Computes the Nano checksum for a given public key.
     * Uses Blake2b (40-bit) and reverses the byte order.
     *
     * @param {Uint8Array} publicKey - The public key bytes.
     * @returns {Uint8Array} The checksum bytes.
     */
    static computeChecksum(publicKey) {
        return bytesReverse(blake2b40(publicKey));
    }
    /**
     * Encodes a public key into a Nano address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @returns {string} The encoded Nano address.
     * @throws {AddressError} If the public key is invalid.
     */
    static encode(publicKey) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Ed25519Blake2bPublicKey);
        const raw = pk.getRawCompressed().subarray(1);
        const checksum = this.computeChecksum(getBytes(raw));
        const payload = concatBytes(this.payloadPaddingDecoded, raw, checksum);
        const b32 = encodeNoPadding(bytesToString(payload), this.alphabet);
        return this.addressPrefix + b32.slice(this.payloadPaddingEncoded.length);
    }
    /**
     * Decodes a Nano address back into the public key bytes.
     * Verifies the address prefix, Base32 decoding, and checksum.
     *
     * @param {string} address - The Nano address to decode.
     * @returns {string} The public key bytes as a string.
     * @throws {AddressError} If the address is invalid or checksum verification fails.
     */
    static decode(address) {
        const prefix = address.slice(0, this.addressPrefix.length);
        if (prefix !== this.addressPrefix) {
            throw new AddressError('Invalid prefix', { expected: this.addressPrefix, got: prefix });
        }
        const body = address.slice(this.addressPrefix.length);
        const fullEncoded = this.payloadPaddingEncoded + body;
        const decoded = getBytes(base32Decode(fullEncoded, this.alphabet));
        const expectedLen = this.payloadPaddingDecoded.length + SLIP10Ed25519Blake2bPublicKey.getCompressedLength() - 1 + 5;
        if (decoded.length !== expectedLen) {
            throw new AddressError('Invalid decoded length', { expected: expectedLen, got: decoded.length });
        }
        const data = decoded.subarray(this.payloadPaddingDecoded.length);
        const pubkey = data.subarray(0, data.length - 5);
        const checksum = data.subarray(-5);
        const gotChecksum = this.computeChecksum(pubkey);
        if (!equalBytes(checksum, gotChecksum)) {
            throw new AddressError('Invalid checksum', {
                expected: bytesToString(checksum), got: bytesToString(gotChecksum)
            });
        }
        if (!SLIP10Ed25519Blake2bPublicKey.isValidBytes(pubkey)) {
            throw new AddressError('Invalid public key');
        }
        return bytesToString(pubkey);
    }
}
//# sourceMappingURL=nano.js.map