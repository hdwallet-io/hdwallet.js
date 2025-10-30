// SPDX-License-Identifier: MIT
import { segwitEncode, segwitDecode } from '../libs/segwit-bech32';
import { SLIP10Secp256k1ECC, SLIP10Secp256k1Point, SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Bitcoin } from '../cryptocurrencies';
import { sha256 } from '../crypto';
import { getBytes, integerToBytes, bytesToInteger, bytesToString } from '../utils';
import { Address } from './address';
/**
 * Class representing a Bitcoin P2TR (Pay-to-Taproot) address.
 * Implements Taproot address generation, tweaking, encoding, and decoding according to BIP-341.
 */
export class P2TRAddress extends Address {
    static hrp = Bitcoin.NETWORKS.MAINNET.HRP;
    static fieldSize = BigInt(Bitcoin.PARAMS.FIELD_SIZE);
    static tapTweakTagHash = getBytes(Bitcoin.PARAMS.TAP_TWEAK_SHA256);
    static witnessVersion = Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2TR;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2TR").
     */
    static getName() {
        return 'P2TR';
    }
    /**
     * Computes a tagged SHA256 hash.
     * @param {string | Uint8Array} tag - Tag as string or byte array.
     * @param {Uint8Array} data - Data to hash.
     * @returns {Uint8Array} Resulting tagged hash.
     */
    static taggedHash(tag, data) {
        const tagHash = typeof tag === 'string' ? sha256(tag) : tag;
        return sha256(new Uint8Array([...tagHash, ...tagHash, ...data]));
    }
    /**
     * Computes the Taproot tweak for a given public key.
     * @param {PublicKey} pubKey - Public key to tweak.
     * @returns {Uint8Array} Tweaked public key bytes.
     */
    static hashTapTweak(pubKey) {
        const x = BigInt(pubKey.getPoint().getX());
        return this.taggedHash(this.tapTweakTagHash, integerToBytes(x));
    }
    /**
     * Lifts an X-coordinate to a secp256k1 point on the curve.
     * @param {PublicKey} pubKey - Public key whose X-coordinate to lift.
     * @returns {SLIP10Secp256k1Point} Lifted point.
     * @throws {Error} If the point cannot be computed.
     */
    static liftX(pubKey) {
        const p = this.fieldSize;
        const x = BigInt(pubKey.getPoint().getX());
        if (x >= p)
            throw new Error('Unable to compute LiftX point');
        const xCubed = this.modPow(x, BigInt(3), p);
        const c = (xCubed + BigInt(7)) % p;
        const y = this.modularSqrt(c, p);
        const ySquared = this.modPow(y, BigInt(2), p);
        if (ySquared !== c)
            throw new Error('Unable to compute LiftX point');
        const evenY = y % BigInt(2) === BigInt(0) ? y : p - y;
        return SLIP10Secp256k1Point.fromCoordinates(x, evenY);
    }
    /**
     * Tweaks a secp256k1 public key for Taproot addresses.
     * @param {PublicKey} pubKey - Public key to tweak.
     * @returns {Uint8Array} Tweaked X-coordinate of the public key.
     */
    static tweakPublicKey(pubKey) {
        const tweak = BigInt(bytesToInteger(this.hashTapTweak(pubKey)));
        const lifted = this.liftX(pubKey);
        const tweaked = lifted.add(SLIP10Secp256k1ECC.GENERATOR.multiply(tweak));
        return integerToBytes(BigInt(tweaked.getX()));
    }
    /**
     * Encodes a public key into a P2TR Bech32 address.
     * @param {string | Uint8Array | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional HRP and witness version.
     * @returns {string} Bech32 encoded P2TR address.
     */
    static encode(publicKey, options = {
        hrp: this.hrp,
        witnessVersion: this.witnessVersion
    }) {
        const pubKey = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        return segwitEncode(options.hrp ?? this.hrp, options.witnessVersion ?? this.witnessVersion, this.tweakPublicKey(pubKey));
    }
    /**
     * Decodes a P2TR Bech32 address into its tweaked public key bytes.
     * @param {string} address - Bech32 encoded P2TR address.
     * @param {AddressOptionsInterface} options - Optional HRP.
     * @returns {string} Hex string of the tweaked public key.
     * @throws {Error} If the address is invalid or length/witness version mismatch occurs.
     */
    static decode(address, options = { hrp: this.hrp }) {
        const [witnessVersion, data] = segwitDecode(options.hrp ?? this.hrp, address);
        const expectedLength = SLIP10Secp256k1PublicKey.getCompressedLength() - 1;
        if (data?.length !== expectedLength) {
            throw new Error(`Invalid length (expected: ${expectedLength}, got: ${data?.length})`);
        }
        if (witnessVersion !== this.witnessVersion) {
            throw new Error(`Invalid witness version (expected: ${this.witnessVersion}, got: ${witnessVersion})`);
        }
        return bytesToString(data);
    }
    /**
    * Computes modular exponentiation (base^exponent mod modulus).
    * @private
    */
    static modPow(base, exponent, modulus) {
        if (modulus === BigInt(1))
            return BigInt(0);
        let result = BigInt(1);
        base = base % modulus;
        while (exponent > BigInt(0)) {
            if (exponent % BigInt(2) === BigInt(1)) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> BigInt(1);
            base = (base * base) % modulus;
        }
        return result;
    }
    /**
     * Computes modular square root using exponentiation method.
     * @private
     */
    static modularSqrt(a, p) {
        const exponent = (p + BigInt(1)) / BigInt(4);
        return this.modPow(a, exponent, p);
    }
}
//# sourceMappingURL=p2tr.js.map