// SPDX-License-Identifier: MIT
import { EthereumAddress } from './ethereum';
import { bech32Encode, bech32Decode } from '../libs/bech32';
import { OKTChain } from '../cryptocurrencies';
import { bytesToString, getBytes } from '../utils';
import { Address } from './address';
import { AddressError } from '../exceptions';
/**
 * Class representing an OKT-Chain blockchain address.
 * Uses Ethereum-style addresses as the base and encodes them in Bech32 format for OKT-Chain.
 */
export class OKTChainAddress extends Address {
    static hrp = OKTChain.NETWORKS.MAINNET.HRP;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("OKT-Chain").
     */
    static getName() {
        return 'OKT-Chain';
    }
    /**
     * Encodes a given public key into an OKTChain Bech32 address.
     * The process involves Ethereum-style address derivation, stripping the "0x" prefix,
     * and then Bech32 encoding using the specified HRP.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - The public key to encode.
     * @param {AddressOptionsInterface} options - Optional encoding options including HRP.
     * @returns {string} Bech32-encoded OKTChain address.
     * @throws {AddressError} If Bech32 encoding fails.
     */
    static encode(publicKey, options = {
        hrp: this.hrp
    }) {
        const baseEth = EthereumAddress.encode(publicKey, {
            skipChecksumEncode: true
        });
        const ethHexWithoutPrefix = baseEth.slice(2); // strip "0x"
        const bytes = getBytes(ethHexWithoutPrefix);
        const hrp = options.hrp ?? this.hrp;
        const encoded = bech32Encode(hrp, bytes);
        if (!encoded) {
            throw new AddressError('Failed to encode OKTChain Bech32 address');
        }
        return encoded;
    }
    /**
     * Decodes a Bech32-encoded OKTChain address back into an Ethereum-style address string.
     *
     * @param {string} address - The Bech32 OKTChain address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including HRP.
     * @returns {string} Decoded Ethereum-style address (hex string with "0x" prefix).
     * @throws {AddressError} If Bech32 decoding fails.
     */
    static decode(address, options = {
        hrp: this.hrp
    }) {
        const hrp = options.hrp ?? this.hrp;
        const [decodedHrp, data] = bech32Decode(hrp, address);
        if (!decodedHrp || !data) {
            throw new AddressError('Failed to decode OKTChain Bech32 address');
        }
        const ethHex = EthereumAddress.addressPrefix + bytesToString(data);
        return EthereumAddress.decode(ethHex, {
            skipChecksumEncode: true
        });
    }
}
//# sourceMappingURL=okt-chain.js.map