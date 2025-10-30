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
/**
 * Implements hierarchical deterministic (HD) wallet logic for Monero.
 * Supports primary, integrated, and subaddresses according to Monero's key derivation rules.
 * Provides methods to initialize from seed, private key, derivation, or watch-only mode.
 *
 */
class MoneroHD extends hd_1.HD {
    network;
    seed;
    privateKeyRaw;
    paymentID;
    spendPrivateKey;
    viewPrivateKey;
    spendPublicKey;
    viewPublicKey;
    /**
     * Creates a new MoneroHD instance.
     * @param options HD wallet configuration options
     * @param options.network Monero network (mainnet/testnet/stagenet)
     * @param options.paymentID Optional payment ID for integrated addresses
     * @param options.minor Derivation minor index (default: 1)
     * @param options.major Derivation major index (default: 0)
     * @throws {NetworkError} If network is invalid
     */
    constructor(options = {
        minor: 1, major: 0
    }) {
        super({ ecc: eccs_1.SLIP10Ed25519MoneroECC, ...options });
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
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'Monero'
     */
    static getName() {
        return 'Monero';
    }
    /**
     * Initializes wallet from a seed.
     * Automatically derives spend and view keys.
     * @param seed Seed as Uint8Array, string, or Seed instance
     * @returns {this} Current MoneroHD instance
     * @throws {SeedError} If seed is invalid
     */
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
    /**
     * Initializes wallet from a raw private key.
     * @param privateKey Private key string
     * @returns {this} Current MoneroHD instance
     * @throws {PrivateKeyError} If private key is invalid
     */
    fromPrivateKey(privateKey) {
        try {
            this.privateKeyRaw = (0, utils_1.getBytes)(privateKey);
            return this.fromSpendPrivateKey((0, ed25519_utils_1.scalarReduce)((0, crypto_1.keccak256)(this.privateKeyRaw)));
        }
        catch {
            throw new exceptions_1.PrivateKeyError('Invalid private key data');
        }
    }
    /**
     * Sets the derivation path.
     * @param derivation MoneroDerivation instance
     * @returns {this} Current MoneroHD instance
     * @throws {DerivationError} If derivation is invalid
     */
    fromDerivation(derivation) {
        this.derivation = (0, utils_1.ensureTypeMatch)(derivation, derivations_1.MoneroDerivation, { errorClass: exceptions_1.DerivationError });
        return this;
    }
    /**
     * Updates derivation path, cleaning previous derivation state.
     * @param derivation MoneroDerivation instance
     * @returns {this} Current MoneroHD instance
     */
    updateDerivation(derivation) {
        this.cleanDerivation();
        return this.fromDerivation(derivation);
    }
    /**
     * Resets derivation state to initial.
     * @returns {this} Current MoneroHD instance
     */
    cleanDerivation() {
        this.derivation.clean();
        return this.fromDerivation(this.derivation);
    }
    /**
     * Initializes HD wallet from a spend private key.
     * Automatically derives the corresponding view key.
     * @param spendPrivateKey Spend private key as string or Uint8Array
     * @returns {this} Current MoneroHD instance
     */
    fromSpendPrivateKey(spendPrivateKey) {
        const spendKey = eccs_1.SLIP10Ed25519MoneroPrivateKey.fromBytes((0, utils_1.getBytes)(spendPrivateKey));
        const viewKey = eccs_1.SLIP10Ed25519MoneroPrivateKey.fromBytes((0, ed25519_utils_1.scalarReduce)((0, crypto_1.keccak256)(spendKey.getRaw())));
        this.spendPrivateKey = spendKey;
        this.viewPrivateKey = viewKey;
        this.spendPublicKey = spendKey.getPublicKey();
        this.viewPublicKey = viewKey.getPublicKey();
        return this;
    }
    /**
     * Initializes wallet in watch-only mode.
     * Only view private key and spend public key are required.
     * @param viewPrivateKey View private key string
     * @param spendPublicKey Spend public key string
     * @returns {this} Current MoneroHD instance
     * @throws {PrivateKeyError|PublicKeyError} If keys are invalid
     */
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
    /**
     * Derives subaddress public keys at given minor and major indices.
     * @param minorIndex Minor index
     * @param majorIndex Major index
     * @returns {[PublicKey, PublicKey]} Tuple of [subaddress spend key, subaddress view key]
     * @throws {DerivationError} If indices are invalid
     */
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
    /**
     * Returns the raw seed as string.
     * @returns {string|null} Seed string or null if not set
     */
    getSeed() {
        return this.seed ? (0, utils_1.bytesToString)(this.seed) : null;
    }
    /**
     * Returns the raw private key as string.
     * @returns {string|null} Private key string or null if not set
     */
    getPrivateKey() {
        return this.privateKeyRaw ? (0, utils_1.bytesToString)(this.privateKeyRaw) : null;
    }
    /**
     * Returns spend private key as string.
     * @returns {string|null} Spend private key string
     */
    getSpendPrivateKey() {
        return this.spendPrivateKey ? (0, utils_1.bytesToString)(this.spendPrivateKey.getRaw()) : null;
    }
    /**
     * Returns view private key as string.
     * @returns {string} View private key string
     */
    getViewPrivateKey() {
        return (0, utils_1.bytesToString)(this.viewPrivateKey.getRaw());
    }
    /**
     * Returns spend public key as string.
     * @returns {string} Spend public key string
     */
    getSpendPublicKey() {
        return (0, utils_1.bytesToString)(this.spendPublicKey.getRawCompressed());
    }
    /**
     * Returns view public key as string.
     * @returns {string} View public key string
     */
    getViewPublicKey() {
        return (0, utils_1.bytesToString)(this.viewPublicKey.getRawCompressed());
    }
    /**
     * Generates the primary Monero address.
     * @returns {string} Encoded primary address
     */
    getPrimaryAddress() {
        return addresses_1.MoneroAddress.encode({
            spendPublicKey: this.spendPublicKey,
            viewPublicKey: this.viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: cryptocurrencies_1.Monero.ADDRESS_TYPES.STANDARD
        });
    }
    /**
     * Generates an integrated Monero address with optional payment ID.
     * @param paymentID Optional payment ID
     * @returns {string|null} Encoded integrated address or null if no payment ID
     */
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
    /**
     * Generates a subaddress for given minor and major indices.
     * Defaults to current derivation indices.
     * @param minor Minor index
     * @param major Major index
     * @returns {string} Encoded subaddress
     */
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
    /**
     * Generates a Monero address of the specified type.
     * Supports standard, integrated, and subaddress types.
     * @param options Address generation options
     * @param options.addressType Type of address (STANDARD, INTEGRATED, SUB_ADDRESS)
     * @param options.paymentID Payment ID for integrated addresses
     * @param options.minor Minor index for subaddresses
     * @param options.major Major index for subaddresses
     * @returns {string|null} Encoded Monero address
     * @throws {AddressError} If address type is invalid
     */
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