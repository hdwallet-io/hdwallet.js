import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing an OKT-Chain blockchain address.
 * Uses Ethereum-style addresses as the base and encodes them in Bech32 format for OKT-Chain.
 */
export declare class OKTChainAddress extends Address {
    static hrp: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("OKT-Chain").
     */
    static getName(): string;
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
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Bech32-encoded OKTChain address back into an Ethereum-style address string.
     *
     * @param {string} address - The Bech32 OKTChain address to decode.
     * @param {AddressOptionsInterface} options - Optional decoding options including HRP.
     * @returns {string} Decoded Ethereum-style address (hex string with "0x" prefix).
     * @throws {AddressError} If Bech32 decoding fails.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=okt-chain.d.ts.map