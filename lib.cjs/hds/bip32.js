"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP32HD = void 0;
const hd_1 = require("./hd");
const cryptocurrencies_1 = require("../cryptocurrencies");
const derivations_1 = require("../derivations");
const eccs_1 = require("../eccs");
const seeds_1 = require("../seeds");
const addresses_1 = require("../addresses");
const consts_1 = require("../consts");
const crypto_1 = require("../crypto");
const wif_1 = require("../wif");
const keys_1 = require("../keys");
const utils_1 = require("../utils");
const exceptions_1 = require("../exceptions");
const base58_1 = require("../libs/base58");
class BIP32HD extends hd_1.HD {
    seed;
    rootPrivateKey;
    rootChainCode;
    rootPublicKey;
    privateKey;
    chainCode;
    publicKey;
    publicKeyType = consts_1.PUBLIC_KEY_TYPES.COMPRESSED;
    wifType = consts_1.WIF_TYPES.WIF_COMPRESSED;
    wifPrefix;
    fingerprint;
    parentFingerprint;
    strict;
    rootDepth = 0;
    rootIndex = 0;
    depth = 0;
    index = 0;
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.publicKeyType = options.publicKeyType ?? consts_1.PUBLIC_KEY_TYPES.COMPRESSED;
        if (this.publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            this.wifType = consts_1.WIF_TYPES.WIF;
        }
        else if (this.publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            this.wifType = consts_1.WIF_TYPES.WIF_COMPRESSED;
        }
        else {
            throw new exceptions_1.BaseError('Invalid public key type', {
                expected: consts_1.PUBLIC_KEY_TYPES.getTypes(), got: this.publicKeyType
            });
        }
        this.wifPrefix = options.wifPrefix;
        this.derivation = new derivations_1.CustomDerivation({
            path: options.path, indexes: options.indexes
        });
    }
    static getName() {
        return 'BIP32';
    }
    fromSeed(seed) {
        try {
            this.seed = (0, utils_1.getBytes)(seed instanceof seeds_1.Seed ? seed.getSeed() : seed);
        }
        catch {
            throw new exceptions_1.SeedError('Invalid seed data');
        }
        if (this.seed.length < 16) {
            throw new exceptions_1.BaseError('Invalid seed length', {
                expected: '< 16',
                got: this.seed.length,
            });
        }
        const hmacHalfLength = 64 / 2;
        let hmacData = this.seed;
        let success = false;
        let hmacResult = new Uint8Array(64);
        while (!success) {
            hmacResult = (0, crypto_1.hmacSha512)((0, utils_1.getHmac)(this.ecc.NAME), hmacData);
            if (this.ecc.NAME === 'Kholaw-Ed25519') {
                success = (hmacResult[31] & 0x20) === 0;
                if (!success)
                    hmacData = hmacResult;
            }
            else {
                const privClass = this.ecc.PRIVATE_KEY;
                success = privClass.isValidBytes(hmacResult.slice(0, hmacHalfLength));
                if (!success)
                    hmacData = hmacResult;
            }
        }
        const tweakMasterKeyBits = (input) => {
            const data = new Uint8Array(input);
            data[0] = (0, utils_1.resetBits)(data[0], 0x07);
            data[31] = (0, utils_1.resetBits)(data[31], 0x80);
            data[31] = (0, utils_1.setBits)(data[31], 0x40);
            return data;
        };
        if (this.ecc.NAME === 'Kholaw-Ed25519') {
            let kl = hmacResult.slice(0, hmacHalfLength);
            const kr = hmacResult.slice(hmacHalfLength);
            kl = tweakMasterKeyBits(kl);
            const chainCode = (0, crypto_1.hmacSha256)((0, utils_1.getHmac)(this.ecc.NAME), (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x01), this.seed));
            this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes((0, utils_1.concatBytes)(kl, kr));
            this.rootChainCode = (0, utils_1.getBytes)(chainCode);
        }
        else {
            const privBytes = hmacResult.slice(0, hmacHalfLength);
            const chainBytes = hmacResult.slice(hmacHalfLength);
            this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(privBytes);
            this.rootChainCode = chainBytes;
        }
        this.privateKey = this.rootPrivateKey;
        this.chainCode = this.rootChainCode;
        this.parentFingerprint = (0, utils_1.integerToBytes)(0x00, 4);
        this.rootPublicKey = this.rootPrivateKey.getPublicKey();
        this.publicKey = this.rootPublicKey;
        this.strict = true;
        this.fromDerivation(this.derivation);
        return this;
    }
    fromXPrivateKey(xprv, encoded = true, strict = false) {
        if (!(0, keys_1.isValidKey)(xprv, encoded)) {
            throw new exceptions_1.XPrivateKeyError('Invalid extended(x) private key');
        }
        const raw = encoded ? (0, base58_1.checkDecode)(xprv) : (0, utils_1.hexToBytes)(xprv);
        if (![78, 110].includes(raw.length)) {
            throw new exceptions_1.XPrivateKeyError('Invalid extended(x) private key');
        }
        if (strict && !(0, keys_1.isRootKey)(xprv, encoded)) {
            throw new exceptions_1.XPrivateKeyError('Invalid root extended(x) private key');
        }
        const [version, depth, parentFingerprint, index, chainCode, key] = (0, keys_1.deserialize)(xprv, encoded);
        this.rootChainCode = chainCode;
        this.rootPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(key.slice(1));
        this.rootPublicKey = this.rootPrivateKey.getPublicKey();
        this.rootDepth = depth;
        this.parentFingerprint = parentFingerprint;
        this.rootIndex = index;
        this.chainCode = this.rootChainCode;
        this.privateKey = this.rootPrivateKey;
        this.publicKey = this.rootPublicKey;
        this.depth = this.rootDepth;
        this.index = this.rootIndex;
        this.strict = (0, keys_1.isRootKey)(xprv, encoded);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromXPublicKey(xpub, encoded = true, strict = false) {
        if (!(0, keys_1.isValidKey)(xpub, encoded)) {
            throw new exceptions_1.XPublicKeyError('Invalid extended(x) public key');
        }
        const raw = encoded ? (0, base58_1.checkDecode)(xpub) : (0, utils_1.hexToBytes)(xpub);
        if (raw.length !== 78) {
            throw new exceptions_1.XPublicKeyError('Invalid extended(x) public key');
        }
        if (strict && !(0, keys_1.isRootKey)(xpub, encoded)) {
            throw new exceptions_1.XPublicKeyError('Invalid root extended(x) public key');
        }
        const [version, depth, parentFingerprint, index, chainCode, key] = (0, keys_1.deserialize)(xpub, encoded);
        this.rootChainCode = chainCode;
        this.rootPublicKey = this.ecc.PUBLIC_KEY.fromBytes(key);
        this.rootDepth = depth;
        this.parentFingerprint = parentFingerprint;
        this.rootIndex = index;
        this.chainCode = this.rootChainCode;
        this.publicKey = this.rootPublicKey;
        this.depth = this.rootDepth;
        this.index = this.rootIndex;
        this.strict = (0, keys_1.isRootKey)(xpub, encoded);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromWIF(wif) {
        if (!this.wifPrefix) {
            throw new exceptions_1.WIFError('WIF prefix is required');
        }
        const wifType = (0, wif_1.getWIFType)(wif, this.wifPrefix);
        if (wifType === 'wif-compressed') {
            this.publicKeyType = consts_1.PUBLIC_KEY_TYPES.COMPRESSED;
            this.wifType = consts_1.WIF_TYPES.WIF_COMPRESSED;
        }
        else {
            this.publicKeyType = consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED;
            this.wifType = consts_1.WIF_TYPES.WIF;
        }
        const privKey = (0, wif_1.wifToPrivateKey)(wif, this.wifPrefix);
        this.fromPrivateKey(privKey);
        this.strict = null;
        return this;
    }
    fromPrivateKey(privateKey) {
        try {
            const bytes = (0, utils_1.getBytes)(privateKey);
            this.privateKey = this.ecc.PRIVATE_KEY.fromBytes(bytes);
            this.publicKey = this.privateKey.getPublicKey();
            this.strict = null;
            return this;
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    fromPublicKey(publicKey) {
        try {
            const bytes = (0, utils_1.getBytes)(publicKey);
            this.publicKey = this.ecc.PUBLIC_KEY.fromBytes(bytes);
            this.strict = null;
            return this;
        }
        catch {
            throw new exceptions_1.PublicKeyError('Invalid public key data');
        }
    }
    fromDerivation(derivation) {
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.Derivation, { errorClass: exceptions_1.DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    updateDerivation(derivation) {
        this.cleanDerivation();
        this.fromDerivation(derivation);
        return this;
    }
    cleanDerivation() {
        if (this.rootPrivateKey) {
            this.privateKey = this.rootPrivateKey;
            this.chainCode = this.rootChainCode;
            this.parentFingerprint = (0, utils_1.integerToBytes)(0, 4);
            this.publicKey = this.privateKey.getPublicKey();
            this.derivation.clean();
            this.depth = 0;
        }
        else if (this.rootPublicKey) {
            this.publicKey = this.rootPublicKey;
            this.chainCode = this.rootChainCode;
            this.parentFingerprint = (0, utils_1.integerToBytes)(0, 4);
            this.derivation.clean();
            this.depth = 0;
        }
        return this;
    }
    drive(index) {
        const hmacHalfLength = 64 / 2; // sha512 output is 64 bytes
        if (this.ecc.NAME === 'Kholaw-Ed25519') {
            const indexBytes = (0, utils_1.integerToBytes)(index, 4, 'little');
            if (this.privateKey) {
                if (index & 0x80000000) {
                    const zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x00, 1), this.privateKey.getRaw(), indexBytes));
                    const hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x01, 1), this.privateKey.getRaw(), indexBytes));
                    const zl = zHmac.slice(0, hmacHalfLength);
                    const zr = zHmac.slice(hmacHalfLength);
                    const kl = this.privateKey.getRaw().slice(0, hmacHalfLength);
                    const kr = this.privateKey.getRaw().slice(hmacHalfLength);
                    const klInt = (0, utils_1.bytesToInteger)(kl, true);
                    const zlInt = (0, utils_1.bytesToInteger)(zl.slice(0, 28), true);
                    const left = zlInt * BigInt(8) + klInt;
                    if (left % this.ecc.ORDER === BigInt(0)) {
                        throw new exceptions_1.BaseError('Computed child key is not valid, very unlucky index');
                    }
                    const TWO_POW_256 = BigInt(1) << BigInt(256);
                    const krInt = ((0, utils_1.bytesToInteger)(zr, true) + (0, utils_1.bytesToInteger)(kr, true)) % TWO_POW_256;
                    const newPrivate = eccs_1.KholawEd25519PrivateKey.fromBytes((0, utils_1.concatBytes)((0, utils_1.integerToBytes)(left, eccs_1.KholawEd25519PrivateKey.getLength() / 2, 'little'), (0, utils_1.integerToBytes)(krInt, eccs_1.KholawEd25519PrivateKey.getLength() / 2, 'little')));
                    this.privateKey = newPrivate;
                    this.chainCode = hmac.slice(hmacHalfLength);
                    this.publicKey = newPrivate.getPublicKey();
                }
                else {
                    const zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x02, 1), this.publicKey.getRawCompressed().slice(1), indexBytes));
                    const hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x03, 1), this.publicKey.getRawCompressed().slice(1), indexBytes));
                    const zlInt = (0, utils_1.bytesToInteger)(zHmac.slice(0, 28), true);
                    const tweak = zlInt * BigInt(8);
                    const newPoint = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(tweak));
                    if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
                        throw new exceptions_1.BaseError('Computed public child key is not valid, very unlucky index');
                    }
                    this.publicKey = this.ecc.PUBLIC_KEY.fromPoint(newPoint);
                    this.chainCode = hmac.slice(hmacHalfLength);
                }
            }
            else {
                if (index & 0x80000000) {
                    throw new exceptions_1.DerivationError('Hardened derivation path is invalid for xpublic key');
                }
                const zHmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x02, 1), this.publicKey.getRawCompressed().slice(1), indexBytes));
                const hmac = (0, crypto_1.hmacSha512)(this.chainCode, (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x03, 1), this.publicKey.getRawCompressed().slice(1), indexBytes));
                const zlInt = (0, utils_1.bytesToInteger)(zHmac.slice(0, 28), true);
                const tweak = zlInt * BigInt(8);
                const newPoint = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(tweak));
                if (newPoint.getX() === BigInt(0) && newPoint.getY() === BigInt(1)) {
                    throw new exceptions_1.BaseError('Computed public child key is not valid, very unlucky index');
                }
                this.publicKey = this.ecc.PUBLIC_KEY.fromPoint(newPoint);
                this.chainCode = hmac.slice(hmacHalfLength);
            }
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            this.depth += 1;
            this.index = index;
            this.fingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            return this;
        }
        else if (['SLIP10-Ed25519', 'SLIP10-Ed25519-Blake2b', 'SLIP10-Ed25519-Monero'].includes(this.ecc.NAME)) {
            if (!this.privateKey) {
                throw new exceptions_1.DerivationError(`On ${this.ecc.NAME} ECC, public key derivation is not supported`);
            }
            const indexBytes = (0, utils_1.integerToBytes)(index, 4, 'big'); // struct.pack(">L", index)
            const data = (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x00, 1), this.privateKey.getRaw(), indexBytes);
            const hmac = (0, crypto_1.hmacSha512)(this.chainCode, data);
            const hmacL = hmac.slice(0, hmacHalfLength);
            const hmacR = hmac.slice(hmacHalfLength);
            const newPrivateKey = this.ecc.PRIVATE_KEY.fromBytes(hmacL);
            this.privateKey = newPrivateKey;
            this.chainCode = hmacR;
            this.publicKey = newPrivateKey.getPublicKey();
            this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            this.depth += 1;
            this.index = index;
            this.fingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            return this;
        }
        else if (['SLIP10-Nist256p1', 'SLIP10-Secp256k1'].includes(this.ecc.NAME)) {
            const indexBytes = (0, utils_1.integerToBytes)(index, 4, 'big');
            if (!this.rootPrivateKey && !this.rootPublicKey) {
                throw new exceptions_1.DerivationError('You can\'t drive this, root/master key are required');
            }
            if (!this.chainCode) {
                throw new exceptions_1.DerivationError('You can\'t drive private_key and private_key');
            }
            let data;
            if (index & 0x80000000) {
                if (!this.privateKey) {
                    throw new exceptions_1.DerivationError('Hardened derivation path is invalid for xpublic key');
                }
                data = (0, utils_1.concatBytes)((0, utils_1.integerToBytes)(0x00, 1), this.privateKey.getRaw(), indexBytes);
            }
            else {
                data = (0, utils_1.concatBytes)(this.publicKey.getRawCompressed(), indexBytes);
            }
            const hmac = (0, crypto_1.hmacSha512)(this.chainCode, data);
            const hmacL = hmac.slice(0, hmacHalfLength);
            const hmacR = hmac.slice(hmacHalfLength);
            const hmacLInt = (0, utils_1.bytesToInteger)(hmacL);
            if (hmacLInt > this.ecc.ORDER) {
                return null;
            }
            if (this.privateKey) {
                const privInt = (0, utils_1.bytesToInteger)(this.privateKey.getRaw());
                const keyInt = (hmacLInt + privInt) % this.ecc.ORDER;
                if (keyInt === BigInt(0)) {
                    return null;
                }
                const newPriv = this.ecc.PRIVATE_KEY.fromBytes((0, utils_1.integerToBytes)(keyInt, 32));
                this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
                this.privateKey = newPriv;
                this.chainCode = hmacR;
                this.publicKey = newPriv.getPublicKey();
            }
            else {
                const tweak = (0, utils_1.bytesToInteger)(hmacL);
                const newPoint = this.publicKey.getPoint().add(this.ecc.GENERATOR.multiply(tweak));
                const newPub = this.ecc.PUBLIC_KEY.fromPoint(newPoint);
                this.parentFingerprint = (0, utils_1.getBytes)(this.getFingerprint());
                this.chainCode = hmacR;
                this.publicKey = newPub;
            }
            this.depth += 1;
            this.index = index;
            this.fingerprint = (0, utils_1.getBytes)(this.getFingerprint());
            return this;
        }
    }
    getSeed() {
        return this.seed ? (0, utils_1.bytesToString)(this.seed) : null;
    }
    getRootXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        if (!this.getRootPrivateKey() || !this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), '00' + this.getRootPrivateKey(), encoded);
    }
    getRootXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH, encoded = true) {
        if (!this.getRootChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.rootDepth, new Uint8Array(4), this.rootIndex, this.getRootChainCode(), this.getRootPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getRootPrivateKey() {
        return this.rootPrivateKey ? (0, utils_1.bytesToString)(this.rootPrivateKey.getRaw()) : null;
    }
    getRootWIF(wifType) {
        if (!this.wifPrefix || !this.getRootPrivateKey())
            return null;
        const type = wifType ?? this.wifType;
        if (!Object.values(consts_1.WIF_TYPES).includes(type)) {
            throw new exceptions_1.BaseError(`Invalid ${this.getName()} WIF type`, {
                expected: Object.values(consts_1.WIF_TYPES),
                got: type
            });
        }
        return (0, wif_1.privateKeyToWIF)(this.getRootPrivateKey(), type, this.wifPrefix);
    }
    getRootChainCode() {
        return this.rootChainCode ? (0, utils_1.bytesToString)(this.rootChainCode) : null;
    }
    getRootPublicKey(publicKeyType = this.publicKeyType) {
        if (!this.rootPublicKey)
            return null;
        if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return (0, utils_1.bytesToString)(this.rootPublicKey.getRawUncompressed());
        }
        else if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            return (0, utils_1.bytesToString)(this.rootPublicKey.getRawCompressed());
        }
        throw new exceptions_1.BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(consts_1.PUBLIC_KEY_TYPES),
            got: publicKeyType
        });
    }
    getXPrivateKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPRIVATE_KEY_VERSIONS.P2PKH, encoded = true) {
        if (!this.getPrivateKey() || !this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), '00' + this.getPrivateKey(), encoded);
    }
    getXPublicKey(version = cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.XPUBLIC_KEY_VERSIONS.P2PKH, encoded = true) {
        if (!this.getChainCode())
            return null;
        return (0, keys_1.serialize)(typeof version === 'number' ? (0, utils_1.integerToBytes)(version) : version, this.depth, this.getParentFingerprint(), this.index, this.getChainCode(), this.getPublicKey(consts_1.PUBLIC_KEY_TYPES.COMPRESSED), encoded);
    }
    getPrivateKey() {
        return this.privateKey ? (0, utils_1.bytesToString)(this.privateKey.getRaw()) : null;
    }
    getWIF(wifType) {
        if (!this.wifPrefix || !this.getPrivateKey())
            return null;
        const type = wifType ?? this.wifType;
        if (!Object.values(consts_1.WIF_TYPES).includes(type)) {
            throw new exceptions_1.BaseError(`Invalid WIF type`, {
                expected: Object.values(consts_1.WIF_TYPES), got: type
            });
        }
        return (0, wif_1.privateKeyToWIF)(this.getPrivateKey(), type, this.wifPrefix);
    }
    getWIFType() {
        return this.getWIF() ? this.wifType : null;
    }
    getChainCode() {
        return this.chainCode ? (0, utils_1.bytesToString)(this.chainCode) : null;
    }
    getPublicKey(publicKeyType = this.publicKeyType) {
        const type = publicKeyType ?? this.publicKeyType;
        if (!Object.values(consts_1.PUBLIC_KEY_TYPES).includes(type)) {
            throw new exceptions_1.BaseError(`Invalid public key type`, {
                expected: Object.values(consts_1.PUBLIC_KEY_TYPES), got: type
            });
        }
        return type === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? this.getUncompressed() : this.getCompressed();
    }
    getPublicKeyType() {
        return this.publicKeyType;
    }
    getCompressed() {
        return (0, utils_1.bytesToString)(this.publicKey.getRawCompressed());
    }
    getUncompressed() {
        return (0, utils_1.bytesToString)(this.publicKey.getRawUncompressed());
    }
    getHash() {
        return (0, utils_1.bytesToString)((0, crypto_1.ripemd160)((0, crypto_1.sha256)(this.getPublicKey())));
    }
    getFingerprint() {
        return this.getHash().slice(0, 8);
    }
    getParentFingerprint() {
        return this.parentFingerprint ? (0, utils_1.bytesToString)(this.parentFingerprint) : null;
    }
    getDepth() {
        return this.depth;
    }
    getPath() {
        return this.derivation.getPath();
    }
    getIndex() {
        return this.index;
    }
    getIndexes() {
        return this.derivation.getIndexes();
    }
    getStrict() {
        return this.strict ?? null;
    }
    getAddress(options = {
        address: cryptocurrencies_1.Bitcoin.ADDRESSES.P2PKH,
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
        scriptAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX,
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        const address = options.address ?? cryptocurrencies_1.Bitcoin.ADDRESSES.P2PKH;
        const publicKeyAddressPrefix = options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX;
        const scriptAddressPrefix = options.scriptAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.SCRIPT_ADDRESS_PREFIX;
        const hrp = options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP;
        const witnessVersion = options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH;
        if (address === addresses_1.P2PKHAddress.getName()) {
            return addresses_1.P2PKHAddress.encode(this.publicKey, {
                publicKeyAddressPrefix: publicKeyAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2SHAddress.getName()) {
            return addresses_1.P2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2TRAddress.getName()) {
            return addresses_1.P2TRAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WPKHAddress.getName()) {
            return addresses_1.P2WPKHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WPKHInP2SHAddress.getName()) {
            return addresses_1.P2WPKHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WSHAddress.getName()) {
            return addresses_1.P2WSHAddress.encode(this.publicKey, {
                hrp: hrp,
                witnessVersion: witnessVersion,
                publicKeyType: this.publicKeyType
            });
        }
        else if (address === addresses_1.P2WSHInP2SHAddress.getName()) {
            return addresses_1.P2WSHInP2SHAddress.encode(this.publicKey, {
                scriptAddressPrefix: scriptAddressPrefix,
                publicKeyType: this.publicKeyType
            });
        }
        throw new exceptions_1.AddressError(`Invalid ${this.getName()} address`, {
            expected: [
                addresses_1.P2PKHAddress.getName(),
                addresses_1.P2SHAddress.getName(),
                addresses_1.P2TRAddress.getName(),
                addresses_1.P2WPKHAddress.getName(),
                addresses_1.P2WPKHInP2SHAddress.getName(),
                addresses_1.P2WSHAddress.getName(),
                addresses_1.P2WSHInP2SHAddress.getName()
            ],
            got: address
        });
    }
}
exports.BIP32HD = BIP32HD;
//# sourceMappingURL=bip32.js.map