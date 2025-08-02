// SPDX-License-Identifier: MIT
import { hmacSha512, sha256, sha512 } from '../crypto';
import { bytesToInteger, getBytes, integerToBytes } from '../utils';
import { KholawEd25519ECC } from '../eccs';
import { DerivationError, SeedError } from '../exceptions';
import { AlgorandAddress } from '../addresses';
import { Algorand } from '../cryptocurrencies';
import { BIP32HD } from './bip32';
export class AlgorandHD extends BIP32HD {
    constructor() {
        super({ ecc: KholawEd25519ECC });
    }
    static getName() {
        return 'Algorand';
    }
    fromSeed(seed) {
        const rawSeed = getBytes(seed.getSeed?.() ?? seed);
        if (rawSeed.length < 16) {
            throw new SeedError('Invalid seed length: expected >= 16 bytes');
        }
        const k = sha512(rawSeed);
        let kL = new Uint8Array(k.slice(0, 32));
        let kR = k.slice(32, 64);
        const clampKL = (kL) => {
            kL[0] &= 0b11111000;
            kL[31] &= 0b01111111;
            kL[31] |= 0b01000000;
            return kL;
        };
        while ((kL[31] & 0b00100000) !== 0) {
            const updated = hmacSha512(kL, kR);
            kL = new Uint8Array(updated.slice(0, 32));
            kR = updated.slice(32, 64);
        }
        kL = clampKL(kL);
        const chainCode = sha256(Uint8Array.from([0x01, ...rawSeed]));
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
    drive(index) {
        const G = 9;
        const indexBytes = integerToBytes(index, 4, 'little');
        const cc = this.chainCode;
        if (!cc)
            throw new DerivationError('Chain code is not set');
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
                throw new DerivationError('Private key required for hardened derivation');
            const rawKey = this.privateKey.getRaw();
            const kL = rawKey.slice(0, 32);
            const kR = rawKey.slice(32);
            const z = hmacSha512(cc, Uint8Array.from([0x00, ...kL, ...kR, ...indexBytes]));
            const zL = trunc256MinusGBits(z.slice(0, 32), G);
            const zR = z.slice(32);
            childCC = hmacSha512(cc, Uint8Array.from([0x01, ...kL, ...kR, ...indexBytes])).slice(32);
            const kLInt = bytesToInteger(kL, true);
            const zLInt = bytesToInteger(zL, true);
            const newKL = integerToBytes(kLInt + BigInt(8) * zLInt, 32, 'little');
            const newKR = integerToBytes((bytesToInteger(kR, true) + bytesToInteger(zR, true)) % BigInt(2 ** 256), 32, 'little');
            if (bytesToInteger(newKL, true) >= 2 ** 255) {
                throw new DerivationError('zL * 8 + kL exceeds Ed25519 scalar limit');
            }
            const childKey = this.ecc.PRIVATE_KEY.fromBytes(new Uint8Array([...newKL, ...newKR]));
            this.privateKey = childKey;
            this.parentFingerprint = getBytes(this.getFingerprint());
            this.publicKey = childKey.getPublicKey();
        }
        else {
            if (!this.publicKey)
                throw new DerivationError('Public key required for non-hardened derivation');
            const A = this.publicKey.getRawCompressed().slice(1);
            const z = hmacSha512(cc, Uint8Array.from([0x02, ...A, ...indexBytes]));
            const zL = trunc256MinusGBits(z.slice(0, 32), G);
            childCC = hmacSha512(cc, Uint8Array.from([0x03, ...A, ...indexBytes])).slice(32);
            const scalar = BigInt(8) * bytesToInteger(zL, true);
            const point = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(scalar));
            this.parentFingerprint = getBytes(this.getFingerprint());
            this.publicKey = this.ecc.PUBLIC_KEY.fromPoint(point);
        }
        this.chainCode = childCC;
        this.depth += 1;
        this.index = index;
        this.fingerprint = getBytes(this.getFingerprint());
        return this;
    }
    getRootXPrivateKey(version = Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getRootXPrivateKey(version, encoded);
    }
    getXPrivateKey(version = Algorand.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        return super.getXPrivateKey(version, encoded);
    }
    getAddress() {
        return AlgorandAddress.encode(this.publicKey);
    }
}
//# sourceMappingURL=algorand.js.map