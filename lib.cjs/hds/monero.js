"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneroHD = void 0;
const seeds_1 = require("../seeds");
const cryptocurrencies_1 = require("../cryptocurrencies");
const ed25519_utils_1 = require("../libs/ed25519-utils");
const crypto_1 = require("../crypto");
const eccs_1 = require("../eccs");
const utils_1 = require("../utils");
const derivations_1 = require("../derivations");
const exceptions_1 = require("../exceptions");
const cryptocurrency_1 = require("../cryptocurrencies/cryptocurrency");
const addresses_1 = require("../addresses");
const hd_1 = require("./hd");
class MoneroHD extends hd_1.HD {
    network;
    seed;
    privateKeyRaw;
    paymentID;
    spendPrivateKey;
    viewPrivateKey;
    spendPublicKey;
    viewPublicKey;
    constructor(options = {
        minor: 1, major: 0
    }) {
        super(options);
        const network = (0, utils_1.ensureTypeMatch)(options.network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkType = network.isValid ? network.value.NAME : options.network;
        if (!cryptocurrencies_1.Monero.NETWORKS.isNetwork(networkType)) {
            throw new exceptions_1.NetworkError(`Wrong Monero network`, {
                expected: cryptocurrencies_1.Monero.NETWORKS.getNetworks(), got: options.network
            });
        }
        this.paymentID = options.paymentID;
        this.network = cryptocurrencies_1.Monero.NETWORKS.getNetwork(networkType);
        this.derivation = new derivations_1.MoneroDerivation({
            minor: options.minor ?? 1,
            major: options.major ?? 0
        });
    }
    static getName() {
        return 'Monero';
    }
    fromSeed(seed) {
        try {
            this.seed = (0, utils_1.getBytes)(seed instanceof seeds_1.Seed ? seed.getSeed() : seed);
            const spendPrivateKey = this.seed.length === eccs_1.SLIP10Ed25519MoneroPrivateKey.getLength()
                ? this.seed : (0, crypto_1.keccak256)(this.seed);
            return this.fromSpendPrivateKey((0, ed25519_utils_1.scalarReduce)(spendPrivateKey));
        }
        catch {
            throw new exceptions_1.SeedError('Invalid seed data');
        }
    }
    fromPrivateKey(privateKey) {
        try {
            this.privateKeyRaw = (0, utils_1.getBytes)(privateKey);
            return this.fromSpendPrivateKey((0, ed25519_utils_1.scalarReduce)((0, crypto_1.keccak256)(this.privateKeyRaw)));
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    fromDerivation(derivation) {
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.MoneroDerivation, { errorClass: exceptions_1.DerivationError });
        return this;
    }
    updateDerivation(derivation) {
        return this.fromDerivation(derivation);
    }
    cleanDerivation() {
        this.derivation.clean();
        return this.fromDerivation(this.derivation);
    }
    fromSpendPrivateKey(spendPrivateKey) {
        const spendKey = eccs_1.SLIP10Ed25519MoneroPrivateKey.fromBytes((0, utils_1.getBytes)(spendPrivateKey));
        const viewKey = eccs_1.SLIP10Ed25519MoneroPrivateKey.fromBytes((0, ed25519_utils_1.scalarReduce)((0, crypto_1.keccak256)(spendKey.getRaw())));
        this.spendPrivateKey = spendKey;
        this.viewPrivateKey = viewKey;
        this.spendPublicKey = spendKey.getPublicKey();
        this.viewPublicKey = viewKey.getPublicKey();
        return this;
    }
    fromWatchOnly(viewPrivateKey, spendPublicKey) {
        let viewKey;
        let spendKey;
        try {
            viewKey = eccs_1.SLIP10Ed25519MoneroPrivateKey.fromBytes((0, utils_1.getBytes)(viewPrivateKey));
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid view private key data');
        }
        try {
            spendKey = eccs_1.SLIP10Ed25519MoneroPublicKey.fromBytes((0, utils_1.getBytes)(spendPublicKey));
        }
        catch {
            throw new exceptions_1.PublicKeyError('Invalid spend public key data');
        }
        this.spendPrivateKey = null;
        this.viewPrivateKey = viewKey;
        this.spendPublicKey = spendKey;
        this.viewPublicKey = viewKey.getPublicKey();
        return this;
    }
    drive(minorIndex, majorIndex) {
        const max = 2 ** 32 - 1;
        if (minorIndex < 0 || minorIndex > max) {
            throw new exceptions_1.DerivationError(`Invalid minor index range`, {
                expected: `0-${max}`, got: minorIndex
            });
        }
        if (majorIndex < 0 || majorIndex > max) {
            throw new exceptions_1.DerivationError(`Invalid major index range`, {
                expected: `0-${max}`, got: majorIndex
            });
        }
        if (minorIndex === 0 && majorIndex === 0) {
            return [this.spendPublicKey, this.viewPublicKey];
        }
        const m = (0, ed25519_utils_1.intDecode)((0, ed25519_utils_1.scalarReduce)((0, crypto_1.keccak256)((0, utils_1.concatBytes)((0, utils_1.toBuffer)('SubAddr\x00', 'utf8'), this.viewPrivateKey.getRaw(), (0, utils_1.integerToBytes)(majorIndex, 4, 'little'), (0, utils_1.integerToBytes)(minorIndex, 4, 'little')))));
        const subAddressSpendPoint = this.spendPublicKey.getPoint().add(eccs_1.SLIP10Ed25519MoneroECC.GENERATOR.multiply(m));
        const subAddressViewPoint = subAddressSpendPoint.multiply((0, utils_1.bytesToInteger)(this.viewPrivateKey.getRaw(), true));
        return [
            eccs_1.SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressSpendPoint),
            eccs_1.SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressViewPoint)
        ];
    }
    getSeed() {
        return this.seed ? (0, utils_1.bytesToString)(this.seed) : null;
    }
    getPrivateKey() {
        return this.privateKeyRaw ? (0, utils_1.bytesToString)(this.privateKeyRaw) : null;
    }
    getSpendPrivateKey() {
        return this.spendPrivateKey ? (0, utils_1.bytesToString)(this.spendPrivateKey.getRaw()) : null;
    }
    getViewPrivateKey() {
        return (0, utils_1.bytesToString)(this.viewPrivateKey.getRaw());
    }
    getSpendPublicKey() {
        return (0, utils_1.bytesToString)(this.spendPublicKey.getRawCompressed());
    }
    getViewPublicKey() {
        return (0, utils_1.bytesToString)(this.viewPublicKey.getRawCompressed());
    }
    getPrimaryAddress() {
        return addresses_1.MoneroAddress.encode({
            spendPublicKey: this.spendPublicKey,
            viewPublicKey: this.viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: cryptocurrencies_1.Monero.ADDRESS_TYPES.STANDARD
        });
    }
    getIntegratedAddress(paymentID) {
        if (!paymentID && !this.paymentID)
            return null;
        return addresses_1.MoneroAddress.encode({
            spendPublicKey: this.spendPublicKey,
            viewPublicKey: this.viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: cryptocurrencies_1.Monero.ADDRESS_TYPES.INTEGRATED,
            paymentID: paymentID ?? this.paymentID
        });
    }
    getSubAddress(minor = this.derivation.getMinor(), major = this.derivation.getMajor()) {
        if (minor === 0 && major === 0) {
            return this.getPrimaryAddress();
        }
        const [spendPublicKey, viewPublicKey] = this.drive(minor, major);
        return addresses_1.MoneroAddress.encode({
            spendPublicKey: spendPublicKey,
            viewPublicKey: viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: cryptocurrencies_1.Monero.ADDRESS_TYPES.SUB_ADDRESS
        });
    }
    getAddress(options = {
        addressType: cryptocurrencies_1.Monero.ADDRESS_TYPES.STANDARD
    }) {
        if (options.addressType === cryptocurrencies_1.Monero.ADDRESS_TYPES.STANDARD) {
            return this.getPrimaryAddress();
        }
        else if (options.addressType === cryptocurrencies_1.Monero.ADDRESS_TYPES.INTEGRATED) {
            return this.getIntegratedAddress(options.paymentID);
        }
        else if (options.addressType === cryptocurrencies_1.Monero.ADDRESS_TYPES.SUB_ADDRESS) {
            return this.getSubAddress(options.minor ?? this.derivation.getMinor(), options.major ?? this.derivation.getMajor());
        }
        throw new exceptions_1.AddressError(`Invalid ${this.getName()} address type`, {
            expected: cryptocurrencies_1.Monero.ADDRESS_TYPES.getAddressTypes(),
            got: options.addressType
        });
    }
}
exports.MoneroHD = MoneroHD;
//# sourceMappingURL=monero.js.map