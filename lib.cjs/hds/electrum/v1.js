"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV1HD = void 0;
const hd_1 = require("../hd");
const derivations_1 = require("../../derivations");
const cryptocurrencies_1 = require("../../cryptocurrencies");
const eccs_1 = require("../../eccs");
const utils_1 = require("../../utils");
const crypto_1 = require("../../crypto");
const consts_1 = require("../../consts");
const wif_1 = require("../../wif");
const addresses_1 = require("../../addresses");
const exceptions_1 = require("../../exceptions");
const seeds_1 = require("../../seeds");
class ElectrumV1HD extends hd_1.HD {
    seed;
    masterPrivateKey;
    masterPublicKey;
    privateKey;
    publicKey;
    publicKeyType;
    wifType;
    wifPrefix;
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED
    }) {
        super({ ecc: eccs_1.SLIP10Secp256k1ECC, ...options });
        this.publicKeyType = options.publicKeyType ?? consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED;
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
        this.wifPrefix = options.wifPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WIF_PREFIX;
        this.derivation = new derivations_1.ElectrumDerivation({
            change: options.change, address: options.address
        });
    }
    static getName() {
        return 'Electrum-V1';
    }
    fromSeed(seed) {
        try {
            this.seed = (0, utils_1.getBytes)(seed instanceof seeds_1.Seed ? seed.getSeed() : seed);
            return this.fromPrivateKey(this.seed);
        }
        catch {
            throw new exceptions_1.SeedError('Invalid seed data');
        }
    }
    fromPrivateKey(key) {
        try {
            this.masterPrivateKey = eccs_1.SLIP10Secp256k1PrivateKey.fromBytes((0, utils_1.getBytes)(key));
            this.masterPublicKey = this.masterPrivateKey.getPublicKey();
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    fromWIF(wif) {
        if (this.wifPrefix == null)
            throw new exceptions_1.WIFError('WIF prefix is required');
        return this.fromPrivateKey((0, wif_1.wifToPrivateKey)(wif, this.wifPrefix));
    }
    fromPublicKey(key) {
        try {
            this.masterPublicKey = eccs_1.SLIP10Secp256k1PublicKey.fromBytes((0, utils_1.getBytes)(key));
            this.fromDerivation(this.derivation);
            return this;
        }
        catch {
            throw new exceptions_1.PublicKeyError('Invalid public key error');
        }
    }
    fromDerivation(derivation) {
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.ElectrumDerivation, { errorClass: exceptions_1.DerivationError });
        this.drive(derivation.getChange(), derivation.getAddress());
        return this;
    }
    updateDerivation(derivation) {
        return this.fromDerivation(derivation);
    }
    cleanDerivation() {
        this.derivation.clean();
        this.fromDerivation(this.derivation);
        return this;
    }
    drive(changeIndex, addressIndex) {
        const sequence = (0, crypto_1.doubleSha256)((0, utils_1.concatBytes)(new TextEncoder().encode(`${addressIndex}:${changeIndex}:`), this.masterPublicKey.getRawUncompressed().slice(1)));
        if (this.masterPrivateKey) {
            const privateKeyInt = ((0, utils_1.bytesToInteger)(this.masterPrivateKey.getRaw()) + (0, utils_1.bytesToInteger)(sequence)) % eccs_1.SLIP10Secp256k1ECC.ORDER;
            this.privateKey = eccs_1.SLIP10Secp256k1PrivateKey.fromBytes((0, utils_1.integerToBytes)(privateKeyInt, eccs_1.SLIP10Secp256k1PrivateKey.getLength()));
            this.publicKey = this.privateKey.getPublicKey();
        }
        else {
            this.publicKey = eccs_1.SLIP10Secp256k1PublicKey.fromPoint(this.masterPublicKey.getPoint().add(eccs_1.SLIP10Secp256k1ECC.GENERATOR.multiply((0, utils_1.bytesToInteger)(sequence))));
        }
        return this;
    }
    getSeed() {
        return this.seed ? (0, utils_1.bytesToString)(this.seed) : null;
    }
    getMasterPrivateKey() {
        return this.masterPrivateKey ? (0, utils_1.bytesToString)(this.masterPrivateKey.getRaw()) : null;
    }
    getMasterWIF(wifType) {
        if (!this.masterPrivateKey || this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getMasterPrivateKey(), type, this.wifPrefix);
    }
    getMasterPublicKey(publicKeyType = this.publicKeyType) {
        if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return (0, utils_1.bytesToString)(this.masterPublicKey.getRawUncompressed());
        }
        else if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            return (0, utils_1.bytesToString)(this.masterPublicKey.getRawCompressed());
        }
        throw new exceptions_1.BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(consts_1.PUBLIC_KEY_TYPES), got: publicKeyType
        });
    }
    getPrivateKey() {
        return this.privateKey ? (0, utils_1.bytesToString)(this.privateKey.getRaw()) : null;
    }
    getWIF(wifType) {
        if (!this.privateKey || this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getPrivateKey(), type, this.wifPrefix);
    }
    getWIFType() {
        return this.wifType;
    }
    getPublicKey(publicKeyType = this.publicKeyType) {
        if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            return (0, utils_1.bytesToString)(this.publicKey.getRawUncompressed());
        }
        else if (publicKeyType === consts_1.PUBLIC_KEY_TYPES.COMPRESSED) {
            return (0, utils_1.bytesToString)(this.publicKey.getRawCompressed());
        }
        throw new exceptions_1.BaseError(`Invalid ${this.getName()} public key type`, {
            expected: Object.values(consts_1.PUBLIC_KEY_TYPES), got: publicKeyType
        });
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
    getAddress(options = {
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    }) {
        return addresses_1.P2PKHAddress.encode(this.publicKey, {
            publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
exports.ElectrumV1HD = ElectrumV1HD;
//# sourceMappingURL=v1.js.map