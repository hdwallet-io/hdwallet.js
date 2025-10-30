import { PublicKey, SLIP10Secp256k1Point } from '../eccs';
import { AddressOptionsInterface } from '../interfaces';
import { Address } from './address';
/**
 * Class representing a Bitcoin P2TR (Pay-to-Taproot) address.
 * Implements Taproot address generation, tweaking, encoding, and decoding according to BIP-341.
 */
export declare class P2TRAddress extends Address {
    static hrp: string;
    static fieldSize: bigint;
    static tapTweakTagHash: Uint8Array;
    static witnessVersion: number;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2TR").
     */
    static getName(): string;
    /**
     * Computes a tagged SHA256 hash.
     * @param {string | Uint8Array} tag - Tag as string or byte array.
     * @param {Uint8Array} data - Data to hash.
     * @returns {Uint8Array} Resulting tagged hash.
     */
    static taggedHash(tag: string | Uint8Array, data: Uint8Array): Uint8Array;
    /**
     * Computes the Taproot tweak for a given public key.
     * @param {PublicKey} pubKey - Public key to tweak.
     * @returns {Uint8Array} Tweaked public key bytes.
     */
    static hashTapTweak(pubKey: PublicKey): Uint8Array;
    /**
     * Lifts an X-coordinate to a secp256k1 point on the curve.
     * @param {PublicKey} pubKey - Public key whose X-coordinate to lift.
     * @returns {SLIP10Secp256k1Point} Lifted point.
     * @throws {Error} If the point cannot be computed.
     */
    static liftX(pubKey: PublicKey): SLIP10Secp256k1Point;
    /**
     * Tweaks a secp256k1 public key for Taproot addresses.
     * @param {PublicKey} pubKey - Public key to tweak.
     * @returns {Uint8Array} Tweaked X-coordinate of the public key.
     */
    static tweakPublicKey(pubKey: PublicKey): Uint8Array;
    /**
     * Encodes a public key into a P2TR Bech32 address.
     * @param {string | Uint8Array | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional HRP and witness version.
     * @returns {string} Bech32 encoded P2TR address.
     */
    static encode(publicKey: string | Uint8Array | PublicKey, options?: AddressOptionsInterface): string;
    /**
     * Decodes a P2TR Bech32 address into its tweaked public key bytes.
     * @param {string} address - Bech32 encoded P2TR address.
     * @param {AddressOptionsInterface} options - Optional HRP.
     * @returns {string} Hex string of the tweaked public key.
     * @throws {Error} If the address is invalid or length/witness version mismatch occurs.
     */
    static decode(address: string, options?: AddressOptionsInterface): string;
    /**
    * Computes modular exponentiation (base^exponent mod modulus).
    * @private
    */
    private static modPow;
    /**
     * Computes modular square root using exponentiation method.
     * @private
     */
    private static modularSqrt;
}
//# sourceMappingURL=p2tr.d.ts.map