"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorandHD = void 0;
const crypto_1 = require("../crypto");
const utils_1 = require("../utils");
const eccs_1 = require("../eccs");
const exceptions_1 = require("../exceptions");
const addresses_1 = require("../addresses");
const cryptocurrencies_1 = require("../cryptocurrencies");
const bip32_1 = require("./bip32");
/**
 * Hierarchical Deterministic (HD) wallet implementation for the **Algorand** blockchain.
 *
 * Extends the base class but uses the **KholawEd25519ECC** curve and Algorand-specific
 * key derivation logic. Implements a variant of SLIP-0010 style derivation with additional clamping
 * and key validation for the Ed25519 curve used by Algorand.
 *
 */
class AlgorandHD extends bip32_1.BIP32HD {
    constructor() {
        super({ ecc: eccs_1.KholawEd25519ECC });
    }
    /**
     * Returns the human-readable name of this HD scheme.
     *
     * @returns {string} The name `"Algorand"`.
     */
    static getName() {
        return 'Algorand';
    }
    /**
     * Initializes this HD wallet instance from a given seed.
     *
     * @param {string | Uint8Array | Seed} seed - The input seed (hex string, byte array, or Seed instance).
     * @throws {SeedError} If the seed length is less than 16 bytes.
     * @returns {this} The initialized AlgorandHD instance.
     */
    fromSeed(seed) {
        const rawSeed = (0, utils_1.getBytes)(seed.getSeed?.() ?? seed);
        if (rawSeed.length < 16) {
            throw new exceptions_1.SeedError('Invalid seed length: expected >= 16 bytes');
        }
        const k = (0, crypto_1.sha512)(rawSeed);
        let kL = new Uint8Array(k.slice(0, 32));
        let kR = k.slice(32, 64);
        const clampKL = (kL) => {
            kL[0] &= 0b11111000;
            kL[31] &= 0b01111111;
            kL[31] |= 0b01000000;
            return kL;
        };
        while ((kL[31] & 0b00100000) !== 0) {
            const updated = (0, crypto_1.hmacSha512)(kL, kR);
            kL = new Uint8Array(updated.slice(0, 32));
            kR = updated.slice(32, 64);
        }
        kL = new Uint8Array(clampKL(kL));
        const chainCode = (0, crypto_1.sha256)(Uint8Array.from([0x01, ...rawSeed]));
        this.seed = rawSeed;
        this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(new Uint8Array([...kL, ...kR]));
        this.rootChainCode = chainCode;
        this.privateKey = this.rootPrivateKey;
        this.chainCode = chainCode;
        this.parentFingerprint = new Uint8Array(4); // 0x00000000
        this.rootPublicKey = this.privateKey.getPublicKey();
        this.publicKey = this.rootPublicKey;
        this.strict = true;
        return this;
    }
    /**
     * Derives a child key at the given index according to Algorand's modified SLIP-0010 algorithm.
     *
     * Supports both hardened and non-hardened derivation.
     *
     * @param {number} index - The index of the child key to derive.
     * @throws {DerivationError} If the chain code or required keys are not set or derivation fails.
     * @returns {this} The derived child HD instance.
     */
    drive(index) {
        const G = 9;
        const indexBytes = (0, utils_1.integerToBytes)(index, 4, 'little');
        const cc = this.chainCode;
        if (!cc)
            throw new exceptions_1.DerivationError('Chain code is not set');
        const trunc256MinusGBits = (buf, g) => {
            const out = buf.slice();
            let remaining = g;
            for (let i = out.length - 1; i >= 0 && remaining > 0; i--) {
                if (remaining >= 8) {
                    out[i] = 0;
                    remaining -= 8;
                }
                else {
                    out[i] &= 0xff >> remaining;
                    break;
                }
            }
            return out;
        };
        let childCC;
        // Hardened
        if (index & 0x80000000) {
            if (!this.privateKey)
                throw new exceptions_1.DerivationError('Private key required for hardened derivation');
            const rawKey = this.privateKey.getRaw();
            const kL = rawKey.slice(0, 32);
            const kR = rawKey.slice(32);
            const z = (0, crypto_1.hmacSha512)(cc, Uint8Array.from([0x00, ...kL, ...kR, ...indexBytes]));
            const zL = trunc256MinusGBits(z.slice(0, 32), G);
            const zR = z.slice(32);
            childCC = (0, crypto_1.hmacSha512)(cc, Uint8Array.from([0x01, ...kL, ...kR, ...indexBytes])).slice(32);
            const kLInt = (0, utils_1.bytesToInteger)(kL, true);
            const zLInt = (0, utils_1.bytesToInteger)(zL, true);
            const newKL = (0, utils_1.integerToBytes)(kLInt + BigInt(8) * zLInt, 32, 'little');
            const newKR = (0, utils_1.integerToBytes)(((0, utils_1.bytesToInteger)(kR, true) + (0, utils_1.bytesToInteger)(zR, true)) % BigInt(2 ** 256), 32, 'little');
            if ((0, utils_1.bytesToInteger)(newKL, true) >= 2 ** 255) {
                throw new exceptions_1.DerivationError('zL * 8 + kL exceeds Ed25519 scalar limit');
            }
            const childKey = this.ecc.PRIVATE_KEY.fromBytes(new Uint8Array([...newKL, ...newKR]));
            this.privateKey = childKey;
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            this.publicKey = childKey.getPublicKey();
        }
        else {
            if (!this.publicKey)
                throw new exceptions_1.DerivationError('Public key required for non-hardened derivation');
            const A = this.publicKey.getRawCompressed().slice(1);
            const z = (0, crypto_1.hmacSha512)(cc, Uint8Array.from([0x02, ...A, ...indexBytes]));
            const zL = trunc256MinusGBits(z.slice(0, 32), G);
            childCC = (0, crypto_1.hmacSha512)(cc, Uint8Array.from([0x03, ...A, ...indexBytes])).slice(32);
            const scalar = BigInt(8) * (0, utils_1.bytesToInteger)(zL, true);
            const point = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(scalar));
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            this.publicKey = this.ecc.PUBLIC_KEY.fromPoint(point);
        }
        this.chainCode = childCC;
        this.depth += 1;
        this.index = index;
        this.fingerprint = (0, utils_1.getBytes)(this.getFingerprint());
        return this;
    }
    /**
     * Returns the root extended private key (xprv) encoded using Algorand's version bytes.
     *
     * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
     *   The version prefix to use for encoding.
     * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
     * @returns {string | null} The root xprv or `null` if unavailable.
     */
    getRootXPrivateKey(version = cryptocurrencies_1.Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getRootXPrivateKey(version, encoded);
    }
    /**
     * Returns the current extended private key (xprv) of the HD node.
     *
     * @param {number | Uint8Array} [version=Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH]
     *   The version prefix to use for encoding.
     * @param {boolean} [encoded=true] Whether to return the base58-encoded key string.
     * @returns {string | null} The xprv string or `null` if not set.
     */
    getXPrivateKey(version = cryptocurrencies_1.Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getXPrivateKey(version, encoded);
    }
    /**
     * Derives and returns the Algorand address associated with the current public key.
     *
     * @returns {string} The encoded Algorand address.
     */
    getAddress() {
        return addresses_1.AlgorandAddress.encode(this.publicKey);
    }
}
exports.AlgorandHD = AlgorandHD;
//# sourceMappingURL=algorand.js.map