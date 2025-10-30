import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a Monero blockchain address.
 * Supports standard, integrated, and sub-address types across mainnet, stagenet, and testnet.
 */
export declare class MoneroAddress extends Address {
    static checksumLength: number;
    static paymentIDLength: number;
    static network: string;
    static addressType: string;
    static networks: Record<string, {
        addressTypes: Record<string, number>;
    }>;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type.
     */
    static getName(): string;
    /**
     * Computes a Monero address checksum using Keccak256.
     * @param {Uint8Array} data - Data to hash for checksum.
     * @returns {Uint8Array} Checksum bytes.
     */
    static computeChecksum(data: Uint8Array): Uint8Array;
    /**
     * Encodes Monero spend and view public keys into a Monero address.
     * Supports optional payment ID for integrated addresses.
     *
     * @param {object} publicKeys - Spend and view public keys.
     * @param {Uint8Array | string | PublicKey} publicKeys.spendPublicKey - Spend public key.
     * @param {Uint8Array | string | PublicKey} publicKeys.viewPublicKey - View public key.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.network=this.network] - Network type (mainnet, stagenet, testnet).
     * @param {string} [options.addressType=this.addressType] - Address type (standard, integrated, sub-address).
     * @param {Uint8Array | string} [options.paymentID] - Optional payment ID for integrated addresses.
     * @returns {string} Monero address.
     * @throws {BaseError|AddressError} If keys, payment ID, or network/version are invalid.
     */
    static encode(publicKeys: {
        spendPublicKey: Uint8Array | string | PublicKey;
        viewPublicKey: Uint8Array | string | PublicKey;
    }, options?: AddressOptionsInterface): string;
    /**
     * Decodes a Monero address into its spend and view public keys.
     * Verifies checksum, network, address type, and optional payment ID.
     *
     * @param {string} address - Monero address to decode.
     * @param {AddressOptionsInterface} [options] - Optional parameters.
     * @param {string} [options.network=this.network] - Network type (mainnet, stagenet, testnet).
     * @param {string} [options.addressType=this.addressType] - Address type (standard, integrated, sub-address).
     * @param {Uint8Array | string} [options.paymentID] - Optional payment ID for integrated addresses.
     * @returns {[string, string]} Tuple containing spend and view public key bytes as strings.
     * @throws {BaseError|AddressError} If checksum, version, payload length, or keys are invalid.
     */
    static decode(address: string, options?: AddressOptionsInterface): [string, string];
}
//# sourceMappingURL=monero.d.ts.map