import { PublicKey } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing Avalanche blockchain addresses.
 * Extends the abstract Address class and provides Avalanche-specific encoding and decoding.
 */
export declare class AvalancheAddress extends Address {
    static hrp: string;
    static addressType: string;
    static addressTypes: Record<string, string>;
    /**
     * Returns the name of the address implementation.
     *
     * @returns {string} 'Avalanche'
     */
    static getName(): string;
    /**
     * Encodes a public key into an Avalanche address.
     *
     * @param publicKey The public key to encode (Uint8Array, string, or PublicKey object)
     * @param options Optional parameters including hrp and addressType
     * @throws {AddressError} If the addressType is invalid
     * @returns {string} Encoded Avalanche address
     */
    static encode(publicKey: Uint8Array | string | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes an Avalanche address back into its raw public key.
     *
     * @param address The Avalanche address string to decode
     * @param options Optional parameters including addressType and hrp
     * @throws {AddressError} If the prefix or addressType is invalid
     * @returns {string} Decoded raw public key string
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
}
//# sourceMappingURL=avalanche.d.ts.map