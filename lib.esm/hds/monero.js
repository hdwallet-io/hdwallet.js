// SPDX-License-Identifier: MIT
import { Seed } from '../seeds';
import { Monero } from '../cryptocurrencies';
import { scalarReduce, intDecode } from '../libs/ed25519-utils';
import { keccak256 } from '../crypto';
import { SLIP10Ed25519MoneroECC, SLIP10Ed25519MoneroPrivateKey, SLIP10Ed25519MoneroPublicKey } from '../eccs';
import { getBytes, bytesToString, integerToBytes, bytesToInteger, ensureTypeMatch, concatBytes, toBuffer } from '../utils';
import { MoneroDerivation } from '../derivations';
import { DerivationError, AddressError, NetworkError, PrivateKeyError, PublicKeyError, SeedError } from '../exceptions';
import { Network } from '../cryptocurrencies/cryptocurrency';
import { MoneroAddress } from '../addresses';
import { HD } from './hd';
export class MoneroHD extends HD {
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
        super({ ecc: SLIP10Ed25519MoneroECC, ...options });
        const network = ensureTypeMatch(options.network, Network, { otherTypes: ['string'] });
        const networkType = network.isValid ? network.value.NAME : options.network;
        if (!Monero.NETWORKS.isNetwork(networkType)) {
            throw new NetworkError(`Wrong Monero network`, {
                expected: Monero.NETWORKS.getNetworks(), got: options.network
            });
        }
        this.paymentID = options.paymentID;
        this.network = Monero.NETWORKS.getNetwork(networkType);
        this.derivation = new MoneroDerivation({
            minor: options.minor ?? 1,
            major: options.major ?? 0
        });
    }
    static getName() {
        return 'Monero';
    }
    fromSeed(seed) {
        try {
            this.seed = getBytes(seed instanceof Seed ? seed.getSeed() : seed);
            const spendPrivateKey = this.seed.length === SLIP10Ed25519MoneroPrivateKey.getLength()
                ? this.seed : keccak256(this.seed);
            return this.fromSpendPrivateKey(scalarReduce(spendPrivateKey));
        }
        catch {
            throw new SeedError('Invalid seed data');
        }
    }
    fromPrivateKey(privateKey) {
        try {
            this.privateKeyRaw = getBytes(privateKey);
            return this.fromSpendPrivateKey(scalarReduce(keccak256(this.privateKeyRaw)));
        }
        catch {
            throw new PrivateKeyError('Invalid private key data');
        }
    }
    fromDerivation(derivation) {
        this.derivation = ensureTypeMatch(derivation, MoneroDerivation, { errorClass: DerivationError });
        return this;
    }
    updateDerivation(derivation) {
        this.cleanDerivation();
        return this.fromDerivation(derivation);
    }
    cleanDerivation() {
        this.derivation.clean();
        return this.fromDerivation(this.derivation);
    }
    fromSpendPrivateKey(spendPrivateKey) {
        const spendKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(getBytes(spendPrivateKey));
        const viewKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(scalarReduce(keccak256(spendKey.getRaw())));
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
            viewKey = SLIP10Ed25519MoneroPrivateKey.fromBytes(getBytes(viewPrivateKey));
        }
        catch {
            throw new PrivateKeyError('Invalid view private key data');
        }
        try {
            spendKey = SLIP10Ed25519MoneroPublicKey.fromBytes(getBytes(spendPublicKey));
        }
        catch {
            throw new PublicKeyError('Invalid spend public key data');
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
            throw new DerivationError(`Invalid minor index range`, {
                expected: `0-${max}`, got: minorIndex
            });
        }
        if (majorIndex < 0 || majorIndex > max) {
            throw new DerivationError(`Invalid major index range`, {
                expected: `0-${max}`, got: majorIndex
            });
        }
        if (minorIndex === 0 && majorIndex === 0) {
            return [this.spendPublicKey, this.viewPublicKey];
        }
        const m = intDecode(scalarReduce(keccak256(concatBytes(toBuffer('SubAddr\x00', 'utf8'), this.viewPrivateKey.getRaw(), integerToBytes(majorIndex, 4, 'little'), integerToBytes(minorIndex, 4, 'little')))));
        const subAddressSpendPoint = this.spendPublicKey.getPoint().add(SLIP10Ed25519MoneroECC.GENERATOR.multiply(m));
        const subAddressViewPoint = subAddressSpendPoint.multiply(bytesToInteger(this.viewPrivateKey.getRaw(), true));
        return [
            SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressSpendPoint),
            SLIP10Ed25519MoneroPublicKey.fromPoint(subAddressViewPoint)
        ];
    }
    getSeed() {
        return this.seed ? bytesToString(this.seed) : null;
    }
    getPrivateKey() {
        return this.privateKeyRaw ? bytesToString(this.privateKeyRaw) : null;
    }
    getSpendPrivateKey() {
        return this.spendPrivateKey ? bytesToString(this.spendPrivateKey.getRaw()) : null;
    }
    getViewPrivateKey() {
        return bytesToString(this.viewPrivateKey.getRaw());
    }
    getSpendPublicKey() {
        return bytesToString(this.spendPublicKey.getRawCompressed());
    }
    getViewPublicKey() {
        return bytesToString(this.viewPublicKey.getRawCompressed());
    }
    getPrimaryAddress() {
        return MoneroAddress.encode({
            spendPublicKey: this.spendPublicKey,
            viewPublicKey: this.viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: Monero.ADDRESS_TYPES.STANDARD
        });
    }
    getIntegratedAddress(paymentID) {
        if (!paymentID && !this.paymentID)
            return null;
        return MoneroAddress.encode({
            spendPublicKey: this.spendPublicKey,
            viewPublicKey: this.viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: Monero.ADDRESS_TYPES.INTEGRATED,
            paymentID: paymentID ?? this.paymentID
        });
    }
    getSubAddress(minor = this.derivation.getMinor(), major = this.derivation.getMajor()) {
        if (minor === 0 && major === 0) {
            return this.getPrimaryAddress();
        }
        const [spendPublicKey, viewPublicKey] = this.drive(minor, major);
        return MoneroAddress.encode({
            spendPublicKey: spendPublicKey,
            viewPublicKey: viewPublicKey
        }, {
            network: this.network.NAME,
            addressType: Monero.ADDRESS_TYPES.SUB_ADDRESS
        });
    }
    getAddress(options = {
        addressType: Monero.ADDRESS_TYPES.STANDARD
    }) {
        if (options.addressType === Monero.ADDRESS_TYPES.STANDARD) {
            return this.getPrimaryAddress();
        }
        else if (options.addressType === Monero.ADDRESS_TYPES.INTEGRATED) {
            return this.getIntegratedAddress(options.paymentID);
        }
        else if (options.addressType === Monero.ADDRESS_TYPES.SUB_ADDRESS) {
            return this.getSubAddress(options.minor ?? this.derivation.getMinor(), options.major ?? this.derivation.getMajor());
        }
        throw new AddressError(`Invalid ${this.getName()} address type`, {
            expected: Monero.ADDRESS_TYPES.getAddressTypes(),
            got: options.addressType
        });
    }
}
//# sourceMappingURL=monero.js.map