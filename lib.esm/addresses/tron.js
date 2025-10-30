// SPDX-License-Identifier: MIT
import { checkEncode, checkDecode } from '../libs/base58';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Tron } from '../cryptocurrencies';
import { keccak256 } from '../crypto';
import { integerToBytes, bytesToString, ensureString, concatBytes, hexToBytes, getBytes, equalBytes, bytesToHex } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing a Tron blockchain address.
 * Provides methods for encoding a public key to a Tron address and decoding a Tron address to its raw hash.
 * Tron addresses are Base58Check encoded with a network-specific prefix.
 */
export class TronAddress extends Address {
    static publicKeyAddressPrefix = Tron.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX;
    static alphabet = Tron.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "Tron".
     */
    static getName() {
        return 'Tron';
    }
    /**
     * Encodes a public key into a Tron address.
     * Uses Keccak-256 on the uncompressed public key (without first byte) and takes the last 20 bytes.
     * Prepends the network prefix and encodes the result in Base58Check format.
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options including address prefix and alphabet.
     * @returns {string} The encoded Tron address as a Base58Check string.
     */
    static encode(publicKey, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        alphabet: this.alphabet
    }) {
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const addressHash = bytesToString(keccak256(pk.getRawUncompressed().slice(1))).slice(-40); // last 20 bytes
        const prefixBytes = integerToBytes(options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix);
        const alphabet = options.alphabet ?? this.alphabet;
        const payload = concatBytes(prefixBytes, hexToBytes(addressHash));
        return ensureString(checkEncode(payload, alphabet));
    }
    /**
     * Decodes a Tron address into its raw public key hash.
     * Validates the address prefix and length before returning the hash.
     * @param {string} address - The Tron address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including address prefix and alphabet.
     * @returns {string} The raw public key hash as a hexadecimal string.
     * @throws {AddressError} If the address has an invalid length or prefix.
     */
    static decode(address, options = {
        publicKeyAddressPrefix: this.publicKeyAddressPrefix,
        alphabet: this.alphabet
    }) {
        const alphabet = options.alphabet ?? this.alphabet;
        const decoded = checkDecode(address, alphabet);
        const prefixValue = integerToBytes(options.publicKeyAddressPrefix ?? this.publicKeyAddressPrefix);
        const prefixBytes = getBytes(prefixValue);
        const expectedLength = 20 + prefixBytes.length;
        if (decoded.length !== expectedLength) {
            throw new AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const prefixGot = decoded.slice(0, prefixBytes.length);
        if (!equalBytes(prefixGot, prefixBytes)) {
            throw new AddressError('Invalid prefix', {
                expected: bytesToHex(prefixBytes), got: bytesToHex(prefixGot)
            });
        }
        return bytesToString(decoded.slice(prefixBytes.length));
    }
}
//# sourceMappingURL=tron.js.map