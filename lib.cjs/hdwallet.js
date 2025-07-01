"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWallet = void 0;
const entropies_1 = require("./entropies");
const mnemonics_1 = require("./mnemonics");
const seeds_1 = require("./seeds");
const hds_1 = require("./hds");
const consts_1 = require("./consts");
const cryptocurrency_1 = require("./cryptocurrencies/cryptocurrency");
const keys_1 = require("./keys");
const utils_1 = require("./utils");
const exceptions_1 = require("./exceptions");
const derivations_1 = require("./derivations");
const addresses_1 = require("./addresses");
const base58_1 = require("./libs/base58");
const cryptocurrencies_1 = require("./cryptocurrencies");
class HDWallet {
    cryptocurrency;
    network;
    address;
    hd;
    addressType;
    addressPrefix;
    entropy;
    language;
    passphrase;
    mnemonic;
    seed;
    derivation;
    semantic;
    mode;
    mnemonicType;
    publicKeyType;
    cardanoType;
    useDefaultPath = true;
    checksum = true;
    stakingPublicKey;
    paymentID;
    constructor(cryptocurrency, options = {}) {
        this.cryptocurrency = (0, utils_1.ensureTypeMatch)(cryptocurrency, cryptocurrency_1.Cryptocurrency, { errorClass: exceptions_1.CryptocurrencyError });
        const _hd = options.hd ?? this.cryptocurrency.DEFAULT_HD;
        const resolvedHD = (0, utils_1.ensureTypeMatch)(_hd, hds_1.HD, { otherTypes: ['string'] });
        const hdName = resolvedHD.isValid ? resolvedHD.value.getName() : _hd;
        if (!this.cryptocurrency.HDS.isHD(hdName)) {
            throw new exceptions_1.HDError(`${this.cryptocurrency.NAME} doesn't support HD type`, {
                expected: this.cryptocurrency.HDS.getHDS(), got: hdName
            });
        }
        const hdClass = hds_1.HDS.getHDClass(hdName);
        const _network = options.network ?? this.cryptocurrency.DEFAULT_NETWORK.NAME;
        const resolvedNetwork = (0, utils_1.ensureTypeMatch)(_network, cryptocurrency_1.Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.getName() : _network;
        if (!this.cryptocurrency.NETWORKS.isNetwork(networkName)) {
            throw new exceptions_1.NetworkError(`${this.cryptocurrency.NAME} doesn't support network type`, {
                expected: this.cryptocurrency.NETWORKS.getNetworks(), got: networkName
            });
        }
        this.network = this.cryptocurrency.NETWORKS.getNetwork(networkName);
        const _address = options.address ?? this.cryptocurrency.DEFAULT_ADDRESS;
        const resolvedAddress = (0, utils_1.ensureTypeMatch)(_address, addresses_1.Address, { otherTypes: ['string'] });
        const addressName = resolvedAddress.isValid ? resolvedAddress.value.getName() : _address;
        if (!this.cryptocurrency.ADDRESSES.isAddress(addressName)) {
            throw new exceptions_1.AddressError(`${this.cryptocurrency.NAME} doesn't support address type`, {
                expected: this.cryptocurrency.ADDRESSES.getAddresses(), got: addressName
            });
        }
        this.address = addresses_1.ADDRESSES.getAddressClass(addressName);
        this.language = options.language ?? 'english';
        this.passphrase = options.passphrase ?? null;
        this.useDefaultPath = options.useDefaultPath ?? false;
        this.stakingPublicKey = options.stakingPublicKey;
        this.paymentID = options.paymentID;
        if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Electrum-V1'].includes(hdName)) {
            this.publicKeyType = options.publicKeyType ?? (hdName === 'Electrum-V1' ? consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED : consts_1.PUBLIC_KEY_TYPES.COMPRESSED);
        }
        else if (hdName === 'Cardano') {
            this.cardanoType = options.cardanoType;
        }
        else if (hdName === 'Electrum-V2') {
            this.mode = options.mode ?? consts_1.MODES.STANDARD;
            this.mnemonicType = options.mnemonicType ?? mnemonics_1.ELECTRUM_V2_MNEMONIC_TYPES.STANDARD;
            this.publicKeyType = options.publicKeyType ?? consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED;
        }
        else if (hdName === 'Monero') {
            this.checksum = options.checksum ?? false;
        }
        this.addressType = options.addressType ?? this.cryptocurrency.DEFAULT_ADDRESS_TYPE;
        if (this.cryptocurrency.NAME === 'Tezos') {
            this.addressPrefix = options.addressPrefix ?? this.cryptocurrency.DEFAULT_ADDRESS_PREFIX;
        }
        if (['BIP32', 'BIP44', 'BIP86', 'Cardano'].includes(hdName)) {
            this.semantic = options.semantic ?? this.cryptocurrency.DEFAULT_SEMANTIC;
        }
        else if (hdName === 'BIP49') {
            this.semantic = options.semantic ?? consts_1.SEMANTICS.P2WPKH_IN_P2SH;
        }
        else if (['BIP84', 'BIP141'].includes(hdName)) {
            this.semantic = options.semantic ?? consts_1.SEMANTICS.P2WPKH;
        }
        else {
            this.semantic = undefined;
        }
        this.hd = new hdClass({
            ecc: this.cryptocurrency.ECC,
            publicKeyType: this.publicKeyType,
            semantic: this.semantic,
            coinType: this.cryptocurrency.COIN_TYPE,
            wifPrefix: this.network.WIF_PREFIX,
            cardanoType: this.cardanoType,
            mode: this.mode,
            paymentID: this.paymentID,
            network: this.network
        });
    }
    fromEntropy(entropy) {
        if (!this.cryptocurrency.ENTROPIES.isEntropy(entropy.getName())) {
            throw new exceptions_1.EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Entropy type`, {
                expected: this.cryptocurrency.ENTROPIES.getEntropies(), got: entropy.getName()
            });
        }
        this.entropy = entropy;
        let mnemonic;
        if (this.entropy.getName() === 'Electrum-V2') {
            mnemonic = mnemonics_1.ElectrumV2Mnemonic.fromEntropy(this.entropy.getEntropy(), this.language, { mnemonicType: this.mnemonicType });
        }
        else if (this.entropy.getName() === 'Monero') {
            mnemonic = mnemonics_1.MoneroMnemonic.fromEntropy(this.entropy.getEntropy(), this.language, { checksum: this.checksum });
        }
        else {
            mnemonic = mnemonics_1.MNEMONICS.getMnemonicClass(this.entropy.getName()).fromEntropy(this.entropy.getEntropy(), this.language);
        }
        const mnemonicClass = mnemonics_1.MNEMONICS.getMnemonicClass(this.entropy.getName());
        return this.fromMnemonic(this.entropy.getName() === 'Electrum-V2' ?
            new mnemonicClass(mnemonic, { mnemonicType: this.mnemonicType }) :
            new mnemonicClass(mnemonic));
    }
    fromMnemonic(mnemonic) {
        if (!this.cryptocurrency.MNEMONICS.isMnemonic(mnemonic.getName())) {
            throw new exceptions_1.EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Mnemonic type`, {
                expected: this.cryptocurrency.MNEMONICS.getMnemonics(), got: mnemonic.getName()
            });
        }
        this.mnemonic = mnemonic;
        if (this.mnemonic.getName() === 'Electrum-V2') {
            const entropyBytes = mnemonics_1.MNEMONICS.getMnemonicClass(this.mnemonic.getName()).decode(this.mnemonic.getMnemonic(), { mnemonicType: this.mnemonicType });
            const entropyClass = entropies_1.ENTROPIES.getEntropyClass(this.mnemonic.getName());
            this.entropy = new entropyClass(entropyBytes);
        }
        else {
            const entropyBytes = mnemonics_1.MNEMONICS.getMnemonicClass(this.mnemonic.getName()).decode(this.mnemonic.getMnemonic());
            const entropyClass = entropies_1.ENTROPIES.getEntropyClass(this.mnemonic.getName());
            this.entropy = new entropyClass(entropyBytes);
        }
        let seed;
        if (this.mnemonic.getName() === 'BIP39' && this.hd.getName() === 'Cardano') {
            seed = seeds_1.CardanoSeed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase,
                cardanoType: this.cardanoType
            });
        }
        else if (this.mnemonic.getName() === seeds_1.BIP39Seed.getName()) {
            seed = seeds_1.BIP39Seed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase
            });
        }
        else if (this.mnemonic.getName() === seeds_1.ElectrumV2Seed.getName()) {
            seed = seeds_1.ElectrumV2Seed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase,
                mnemonicType: this.mnemonicType
            });
        }
        else {
            seed = seeds_1.SEEDS.getSeedClass(this.mnemonic.getName()).fromMnemonic(this.mnemonic.getMnemonic());
        }
        const seedClass = seeds_1.SEEDS.getSeedClass(this.hd.getName() === 'Cardano' ? 'Cardano' : this.mnemonic.getName());
        return this.fromSeed(new seedClass(seed));
    }
    fromSeed(seed) {
        if (!this.cryptocurrency.SEEDS.isSeed(seed.getName())) {
            throw new exceptions_1.EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Seed type`, {
                expected: this.cryptocurrency.SEEDS.getSeeds(), got: seed.getName()
            });
        }
        this.seed = seed;
        if (this.hd.getName() === 'Cardano') {
            this.hd.fromSeed(seed.getSeed(), this.passphrase);
        }
        else {
            this.hd.fromSeed(seed.getSeed());
        }
        this.derivation = this.hd.getDerivation();
        return this;
    }
    fromXPrivateKey(xprivateKey, encoded = true, strict = false) {
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName())) {
            throw new exceptions_1.XPrivateKeyError(`Support for XPrivate-Key conversion is not implemented in ${this.hd.getName()} HD type`);
        }
        if (!(0, keys_1.isValidKey)(xprivateKey, encoded)) {
            throw new exceptions_1.XPrivateKeyError('Invalid XPrivate-Key data');
        }
        const [version, , , , ,] = (0, keys_1.deserialize)(xprivateKey, encoded);
        const decodedLen = encoded ? (0, base58_1.checkDecode)(xprivateKey).length : xprivateKey.length;
        if (!this.network.XPRIVATE_KEY_VERSIONS.isVersion(version) || ![78, 110].includes(decodedLen)) {
            throw new exceptions_1.XPrivateKeyError(`Invalid XPrivate-Key for ${this.cryptocurrency.NAME}`);
        }
        this.hd.fromXPrivateKey(xprivateKey, encoded, strict);
        return this;
    }
    fromXPublicKey(xpublicKey, encoded = true, strict = false) {
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName())) {
            throw new exceptions_1.XPublicKeyError(`Support for XPublic-Key conversion is not implemented in ${this.hd.getName()} HD type`);
        }
        else if (this.hd.getName() === 'Cardano' && this.cardanoType === 'byron-legacy') {
            throw new exceptions_1.XPublicKeyError(`Conversion from XPublic-Key is unavailable in ${this.cardanoType} mode for ${this.hd.getName()} HD type`);
        }
        if (!(0, keys_1.isValidKey)(xpublicKey, encoded)) {
            throw new exceptions_1.XPublicKeyError("Invalid XPublic-Key data");
        }
        const [version, , , , ,] = (0, keys_1.deserialize)(xpublicKey, encoded);
        const decodedLen = encoded ? (0, base58_1.checkDecode)(xpublicKey).length : xpublicKey.length;
        if (!this.network.XPUBLIC_KEY_VERSIONS.isVersion(version) || ![78, 110].includes(decodedLen)) {
            throw new exceptions_1.XPublicKeyError(`Invalid XPublic-Key for ${this.cryptocurrency.NAME}`);
        }
        this.hd.fromXPublicKey(xpublicKey, encoded, strict);
        return this;
    }
    fromDerivation(derivation) {
        this.hd.fromDerivation(derivation);
        this.derivation = derivation;
        return this;
    }
    updateDerivation(derivation) {
        this.hd.updateDerivation(derivation);
        this.derivation = derivation;
        return this;
    }
    cleanDerivation() {
        this.hd.cleanDerivation();
        this.derivation?.clean();
        return this;
    }
    fromPrivateKey(privateKey) {
        this.hd.fromPrivateKey(privateKey);
        return this;
    }
    fromWIF(wif) {
        if (['Cardano', 'Monero'].includes(this.hd.getName())) {
            throw new exceptions_1.WIFError(`WIF is not supported by ${this.hd.getName()} HD type`);
        }
        if (this.network.WIF_PREFIX === null || this.network.WIF_PREFIX === null) {
            throw new exceptions_1.WIFError(`WIF is not supported by ${this.cryptocurrency.NAME} cryptocurrency`);
        }
        this.hd.fromWIF(wif);
        return this;
    }
    fromPublicKey(publicKey) {
        if (this.hd.getName() === 'Monero') {
            throw new exceptions_1.PublicKeyError(`From Public-Key is not supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromPublicKey(publicKey);
        return this;
    }
    fromSpendPrivateKey(spendPrivateKey) {
        if (this.hd.getName() !== 'Monero') {
            throw new exceptions_1.PrivateKeyError(`From Spend-Private-Key is only supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromSpendPrivateKey(spendPrivateKey);
        return this;
    }
    fromWatchOnly(viewPrivateKey, spendPublicKey) {
        if (this.hd.getName() !== 'Monero') {
            throw new exceptions_1.PublicKeyError(`From Watch-Only is only supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromWatchOnly(viewPrivateKey, spendPublicKey);
        return this;
    }
    getCryptocurrency() {
        return this.cryptocurrency.NAME;
    }
    getSymbol() {
        return this.cryptocurrency.SYMBOL;
    }
    getCoinType() {
        return this.cryptocurrency.COIN_TYPE;
    }
    getNetwork() {
        return this.network.NAME;
    }
    getEntropy() {
        return this.entropy?.getEntropy() ?? null;
    }
    getStrength() {
        return this.entropy?.getStrength() ?? null;
    }
    getMnemonic() {
        return this.mnemonic?.getMnemonic() ?? null;
    }
    getMnemonicType() {
        return this.mnemonicType ?? null;
    }
    getLanguage() {
        return this.mnemonic?.getLanguage() ?? null;
    }
    getWords() {
        return this.mnemonic?.getWords() ?? null;
    }
    getPassphrase() {
        return this.passphrase;
    }
    getSeed() {
        return this.hd.getSeed();
    }
    getECC() {
        return this.cryptocurrency.ECC.NAME;
    }
    getHD() {
        return this.hd.getName();
    }
    getSemantic() {
        return this.semantic ?? null;
    }
    getCardanoType() {
        return this.hd.getName() === 'Cardano' ? (this.cardanoType ?? null) : null;
    }
    getMode() {
        if (this.hd.getName() !== 'Electrum-V2') {
            throw new Error(`Get mode is only for Electrum-V2 HD type, not ${this.hd.getName()}`);
        }
        return this.hd.getMode();
    }
    getPathKey() {
        return this.hd.getPathKey();
    }
    getRootXPrivateKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getRootXPrivateKey(this.network.XPRIVATE_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    getRootXPublicKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getRootXPublicKey(this.network.XPUBLIC_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    getMasterXPrivateKey(semantic, encoded = true) {
        return this.getRootXPrivateKey(semantic, encoded);
    }
    getMasterXPublicKey(semantic, encoded = true) {
        return this.getRootXPublicKey(semantic, encoded);
    }
    getRootPrivateKey() {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPrivateKey();
        }
        return this.hd.getRootPrivateKey();
    }
    getRootWIF(wifType) {
        if (['Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterWIF(wifType);
        }
        return this.hd.getRootWIF(wifType);
    }
    getRootChainCode() {
        return this.hd.getRootChainCode();
    }
    getRootPublicKey(publicKeyType) {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPublicKey(publicKeyType);
        }
        return this.hd.getRootPublicKey(publicKeyType);
    }
    getMasterPrivateKey() {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPrivateKey();
        }
        return this.hd.getRootPrivateKey();
    }
    getMasterWIF(wifType) {
        if (['Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterWIF(wifType);
        }
        return this.hd.getRootWIF(wifType);
    }
    getMasterChainCode() {
        return this.hd.getRootChainCode();
    }
    getMasterPublicKey(publicKeyType) {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPublicKey(publicKeyType);
        }
        return this.hd.getRootPublicKey(publicKeyType);
    }
    getXPrivateKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getXPrivateKey(this.network.XPRIVATE_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    getXPublicKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getXPublicKey(this.network.XPUBLIC_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    getPrivateKey() {
        return this.hd.getPrivateKey();
    }
    getSpendPrivateKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get Spend-Private-Key is only supported by Monero HD type');
        }
        return this.hd.getSpendPrivateKey();
    }
    getViewPrivateKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get View-Private-Key is only supported by Monero HD type');
        }
        return this.hd.getViewPrivateKey();
    }
    getWIF(wifType) {
        if (['Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        return this.hd.getWIF(wifType);
    }
    getWIFType() {
        return this.getWIF() ? this.hd.getWIFType() : null;
    }
    getChainCode() {
        return this.hd.getChainCode();
    }
    getPublicKey(publicKeyType) {
        return this.hd.getPublicKey(publicKeyType);
    }
    getPublicKeyType() {
        return this.hd.getPublicKeyType();
    }
    getUncompressed() {
        return this.hd.getUncompressed();
    }
    getCompressed() {
        return this.hd.getCompressed();
    }
    getSpendPublicKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get Spend-Public-Key is only supported by Monero HD type');
        }
        return this.hd.getSpendPublicKey();
    }
    getViewPublicKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get View-Public-Key is only supported by Monero HD type');
        }
        return this.hd.getViewPublicKey();
    }
    getHash() {
        return this.hd.getHash();
    }
    getDepth() {
        return this.hd.getDepth();
    }
    getFingerprint() {
        return this.hd.getFingerprint();
    }
    getParentFingerprint() {
        return this.hd.getParentFingerprint();
    }
    getPath() {
        return this.hd.getPath();
    }
    getIndex() {
        return this.hd.getIndex();
    }
    getIndexes() {
        return this.hd.getIndexes();
    }
    getStrict() {
        return ['Electrum-V1', 'Monero'].includes(this.hd.getName()) ? null : this.hd.getStrict();
    }
    getPrimaryAddress() {
        return this.hd.getName() === 'Monero' ? this.hd.getPrimaryAddress() : null;
    }
    getIntegratedAddress(paymentID) {
        return this.hd.getName() === 'Monero' ? this.hd.getIntegratedAddress(paymentID) : null;
    }
    getSubAddress(minor, major) {
        return this.hd.getName() === 'Monero' ? this.hd.getSubAddress(minor, major) : null;
    }
    getAddress(options = {}) {
        const _address = options.address ?? this.address;
        const resolvedAddress = (0, utils_1.ensureTypeMatch)(_address, addresses_1.Address, { otherTypes: ['string'] });
        const addressName = resolvedAddress.isValid ? resolvedAddress.value.getName() : _address;
        if (!this.cryptocurrency.ADDRESSES.isAddress(addressName)) {
            throw new exceptions_1.AddressError(`${this.cryptocurrency.NAME} doesn't support address type`, {
                expected: this.cryptocurrency.ADDRESSES.getAddresses(), got: addressName
            });
        }
        if (this.network.WITNESS_VERSIONS) {
            options.witnessVersion = this.network.WITNESS_VERSIONS.getWitnessVersion(addressName);
        }
        const hdName = this.hd.getName();
        if (hdName === 'Cardano') {
            options.network = options.network ?? this.network.NAME;
            options.addressType = options.addressType ?? this.addressType;
            options.stakingPublicKey = options.stakingPublicKey ?? this.stakingPublicKey;
            return this.hd.getAddress(options);
        }
        else if (hdName === 'Electrum-V1') {
            return this.hd.getAddress({
                publicKeyAddressPrefix: this.network.PUBLIC_KEY_ADDRESS_PREFIX
            });
        }
        else if (hdName === 'Electrum-V2') {
            return this.hd.getAddress({
                publicKeyAddressPrefix: this.network.PUBLIC_KEY_ADDRESS_PREFIX,
                hrp: this.network.HRP,
                witnessVersion: this.network.WITNESS_VERSIONS?.getWitnessVersion('P2WPKH')
            });
        }
        else if (hdName === 'Monero') {
            const versionType = options.versionType;
            if (versionType === 'standard') {
                return this.getPrimaryAddress();
            }
            else if (versionType === 'integrated') {
                return this.getIntegratedAddress(options.paymentID);
            }
            else if (versionType === 'sub-address') {
                return this.getSubAddress(options.minor, options.major);
            }
        }
        else {
            const addressClass = addresses_1.ADDRESSES.getAddressClass(addressName);
            if (['Bitcoin-Cash', 'Bitcoin-Cash-SLP', 'eCash'].includes(this.cryptocurrency.NAME)) {
                const addressType = options.addressType ?? this.addressType;
                return addressClass.encode(this.getPublicKey(), {
                    publicKeyAddressPrefix: this.network[`${addressType?.toUpperCase()}_PUBLIC_KEY_ADDRESS_PREFIX`],
                    scriptAddressPrefix: this.network[`${addressType?.toUpperCase()}_SCRIPT_ADDRESS_PREFIX`],
                    networkType: this.network.NAME,
                    publicKeyType: this.getPublicKeyType(),
                    hrp: this.network.HRP
                });
            }
            else {
                return addressClass.encode(this.getPublicKey(), {
                    publicKeyAddressPrefix: this.network.PUBLIC_KEY_ADDRESS_PREFIX,
                    scriptAddressPrefix: this.network.SCRIPT_ADDRESS_PREFIX,
                    networkType: this.network.NAME,
                    publicKeyType: this.getPublicKeyType(),
                    hrp: this.network.HRP,
                    addressType: options.addressType ?? this.addressType,
                    addressPrefix: options.addressPrefix ?? this.addressPrefix
                });
            }
        }
        throw new exceptions_1.AddressError(`Could not resolve address for ${hdName} HD type`);
    }
    getDump(exclude = []) {
        const derivationDump = {};
        const hdName = this.hd.getName();
        if (this.derivation) {
            let at = {};
            switch (this.derivation.getName()) {
                case 'BIP44':
                case 'BIP49':
                case 'BIP84':
                case 'BIP86':
                    at = {
                        'path': this.derivation.getPath(),
                        'indexes': this.derivation.getIndexes(),
                        'depth': this.getDepth(),
                        'purpose': this.derivation.getPurpose(),
                        'coin-type': this.derivation.getCoinType(),
                        'account': this.derivation.getAccount(),
                        'change': this.derivation.getChange(),
                        'address': this.derivation.getAddress()
                    };
                    break;
                case 'CIP1852':
                    at = {
                        'path': this.derivation.getPath(),
                        'indexes': this.derivation.getIndexes(),
                        'depth': this.getDepth(),
                        'purpose': this.derivation.getPurpose(),
                        'coin-type': this.derivation.getCoinType(),
                        'account': this.derivation.getAccount(),
                        'role': this.derivation.getRole(),
                        'address': this.derivation.getAddress()
                    };
                    break;
                case 'Electrum':
                    at = {
                        'change': this.derivation.getChange(),
                        'address': this.derivation.getAddress()
                    };
                    break;
                case 'Monero':
                    at = {
                        'minor': this.derivation.getMinor(),
                        'major': this.derivation.getMajor()
                    };
                    break;
                default:
                    at = {
                        'path': this.derivation.getPath(),
                        'indexes': this.derivation.getIndexes(),
                        'depth': this.getDepth(),
                        'index': this.getIndex()
                    };
            }
            derivationDump['at'] = at;
        }
        if ([
            'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Cardano'
        ].includes(hdName)) {
            Object.assign(derivationDump, {
                'xprivate-key': this.getXPrivateKey(),
                'xpublic-key': this.getXPublicKey(),
                'private-key': this.getPrivateKey(),
                'wif': this.getWIF(),
                'chain-code': this.getChainCode(),
                'public-key': this.getPublicKey(),
                'uncompressed': this.getUncompressed(),
                'compressed': this.getCompressed(),
                'fingerprint': this.getFingerprint(),
                'parent-fingerprint': this.getParentFingerprint(),
                'hash': this.getHash()
            });
            if (hdName === 'Cardano') {
                delete derivationDump.wif;
                delete derivationDump.uncompressed;
                delete derivationDump.compressed;
            }
            if (this.cryptocurrency.ADDRESSES.length() > 1 || this.cryptocurrency.NAME === 'Tezos') {
                const addresses = {};
                if (this.cryptocurrency.NAME === 'Avalanche' && this.cryptocurrency.ADDRESS_TYPES) {
                    addresses[(0, utils_1.toCamelCase)(this.cryptocurrency.ADDRESS_TYPES.C_CHAIN)] = this.getAddress({ address: 'Ethereum' });
                    addresses[(0, utils_1.toCamelCase)(this.cryptocurrency.ADDRESS_TYPES.P_CHAIN)] = this.getAddress({
                        address: 'Avalanche', addressType: this.cryptocurrency.ADDRESS_TYPES.P_CHAIN
                    });
                    addresses[(0, utils_1.toCamelCase)(this.cryptocurrency.ADDRESS_TYPES.X_CHAIN)] = this.getAddress({
                        address: 'Avalanche', addressType: this.cryptocurrency.ADDRESS_TYPES.X_CHAIN
                    });
                }
                else if (this.cryptocurrency.NAME === 'Binance' && this.cryptocurrency.ADDRESS_TYPES) {
                    addresses[(0, utils_1.toCamelCase)(this.cryptocurrency.ADDRESS_TYPES.CHAIN)] = this.getAddress({ address: 'Cosmos' });
                    addresses[(0, utils_1.toCamelCase)(this.cryptocurrency.ADDRESS_TYPES.SMART_CHAIN)] = this.getAddress({ address: 'Ethereum' });
                }
                else if ((this.cryptocurrency.NAME === 'Bitcoin-Cash' ||
                    this.cryptocurrency.NAME === 'Bitcoin-Cash-SLP' ||
                    this.cryptocurrency.NAME === 'eCash') &&
                    this.cryptocurrency.ADDRESS_TYPES) {
                    for (const addressType of this.cryptocurrency.ADDRESS_TYPES.getAddressTypes()) {
                        for (const address of this.cryptocurrency.ADDRESSES.getAddresses()) {
                            addresses[`${addressType}${address.split('-').join('')}`] = addresses_1.ADDRESSES.getAddressClass(address).encode(this.getPublicKey(), {
                                publicKeyAddressPrefix: this.network[`${addressType?.toUpperCase()}_PUBLIC_KEY_ADDRESS_PREFIX`],
                                scriptAddressPrefix: this.network[`${addressType?.toUpperCase()}_SCRIPT_ADDRESS_PREFIX`],
                                publicKeyType: this.getPublicKeyType(),
                                hrp: this.network.HRP,
                            });
                        }
                    }
                }
                else if (this.cryptocurrency.NAME === 'Tezos' && this.cryptocurrency.ADDRESS_PREFIXES) {
                    addresses[this.cryptocurrency.ADDRESS_PREFIXES.TZ1] = this.getAddress({
                        addressPrefix: this.cryptocurrency.ADDRESS_PREFIXES.TZ1
                    });
                    addresses[this.cryptocurrency.ADDRESS_PREFIXES.TZ2] = this.getAddress({
                        addressPrefix: this.cryptocurrency.ADDRESS_PREFIXES.TZ2
                    });
                    addresses[this.cryptocurrency.ADDRESS_PREFIXES.TZ3] = this.getAddress({
                        addressPrefix: this.cryptocurrency.ADDRESS_PREFIXES.TZ3
                    });
                }
                else if (this.hd.getName() === 'BIP44') {
                    derivationDump['address'] = this.getAddress({ address: 'P2PKH' });
                }
                else if (this.hd.getName() === 'BIP49') {
                    derivationDump['address'] = this.getAddress({ address: 'P2WPKH-In-P2SH' });
                }
                else if (this.hd.getName() === 'BIP84') {
                    derivationDump['address'] = this.getAddress({ address: 'P2WPKH' });
                }
                else if (this.hd.getName() === 'BIP86') {
                    derivationDump['address'] = this.getAddress({ address: 'P2TR' });
                }
                else if (this.hd.getName() === 'BIP141') {
                    if (this.semantic === consts_1.SEMANTICS.P2WPKH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WPKH' });
                    }
                    else if (this.semantic === consts_1.SEMANTICS.P2WPKH_IN_P2SH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WPKH-In-P2SH' });
                    }
                    else if (this.semantic === consts_1.SEMANTICS.P2WSH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WSH' });
                    }
                    else if (this.semantic === consts_1.SEMANTICS.P2WSH_IN_P2SH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WSH-In-P2SH' });
                    }
                }
                else {
                    for (const address of this.cryptocurrency.ADDRESSES.getAddresses()) {
                        addresses[address.toLowerCase()] = this.getAddress({ address: address });
                    }
                }
                if (Object.keys(addresses).length !== 0) {
                    derivationDump['addresses'] = addresses;
                }
            }
            else {
                if (this.cryptocurrency.NAME === 'Cardano' && [
                    cryptocurrencies_1.Cardano.TYPES.SHELLEY_ICARUS, cryptocurrencies_1.Cardano.TYPES.SHELLEY_LEDGER
                ].includes(this.cardanoType)) {
                    derivationDump['address'] = this.getAddress({
                        network: this.network.NAME,
                        addressType: this.addressType,
                        stakingPublicKey: this.stakingPublicKey
                    });
                }
                else {
                    derivationDump['address'] = this.getAddress();
                }
            }
        }
        else if (['Electrum-V1', 'Electrum-V2'].includes(hdName)) {
            Object.assign(derivationDump, {
                'private-key': this.getPrivateKey(),
                'wif': this.getWIF(),
                'public-key': this.getPublicKey(),
                'uncompressed': this.getUncompressed(),
                'compressed': this.getCompressed(),
                'address': this.getAddress()
            });
        }
        else if (hdName === 'Monero') {
            derivationDump['sub-address'] = this.getSubAddress();
        }
        if (exclude.includes('at')) {
            delete derivationDump['at'];
        }
        if (exclude.includes('root')) {
            return (0, utils_1.excludeKeys)(derivationDump, exclude);
        }
        const root = {
            'cryptocurrency': this.getCryptocurrency(),
            'symbol': this.getSymbol(),
            'network': this.getNetwork(),
            'coin-type': this.getCoinType(),
            'entropy': this.getEntropy(),
            'strength': this.getStrength(),
            'mnemonic': this.getMnemonic(),
            'passphrase': this.getPassphrase(),
            'language': this.getLanguage(),
            'seed': this.getSeed(),
            'ecc': this.getECC(),
            'hd': this.getHD()
        };
        if (['Electrum-V1', 'Electrum-V2', 'Monero'].includes(hdName)) {
            delete root['passphrase'];
        }
        if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Cardano'].includes(hdName)) {
            if (hdName === 'Cardano') {
                root['cardano-type'] = this.getCardanoType();
            }
            Object.assign(root, {
                'semantic': this.getSemantic(),
                'root-xprivate-key': this.getRootXPrivateKey(),
                'root-xpublic-key': this.getRootXPublicKey(),
                'root-private-key': this.getRootPrivateKey(),
                'root-wif': this.getRootWIF(),
                'root-chain-code': this.getRootChainCode(),
                'root-public-key': this.getRootPublicKey(),
                'path-key': this.getPathKey(),
                'strict': this.getStrict(),
                'public-key-type': this.getPublicKeyType(),
                'wif-type': this.getWIFType()
            });
            if (hdName === 'Cardano') {
                delete root['root-wif'];
                delete root['root-type'];
                if (this.cardanoType !== cryptocurrencies_1.Cardano.TYPES.BYRON_LEGACY) {
                    delete root['path-key'];
                }
            }
            else {
                delete root['path-key'];
            }
        }
        else if (hdName === 'Electrum-V1' || hdName === 'Electrum-V2') {
            if (hdName === 'Electrum-V2') {
                root['mode'] = this.getMode();
                root['mnemonic-type'] = this.getMnemonicType();
            }
            Object.assign(root, {
                'master-private-key': this.getMasterPrivateKey(),
                'master-wif': this.getMasterWIF(),
                'master-public-key': this.getMasterPublicKey(),
                'public-key-type': this.getPublicKeyType(),
                'wif-type': this.getWIFType()
            });
        }
        else if (hdName === 'Monero') {
            Object.assign(root, {
                'private-key': this.getPrivateKey(),
                'spend-private-key': this.getSpendPrivateKey(),
                'view-private-key': this.getViewPrivateKey(),
                'spend-public-key': this.getSpendPublicKey(),
                'view-public-key': this.getViewPublicKey(),
                'primary-address': this.getPrimaryAddress()
            });
            if (this.paymentID) {
                root['integrated-address'] = this.getIntegratedAddress(this.paymentID);
            }
        }
        if (!exclude.includes('derivation')) {
            root['derivation'] = derivationDump;
        }
        return (0, utils_1.excludeKeys)(root, exclude);
    }
    getDumps(exclude = []) {
        if (!this.derivation)
            return null;
        const derivationsList = [];
        const isRangeTuple = (tuple) => {
            return tuple.length === 3;
        };
        const drive = (...args) => {
            const driveHelper = (derivations, current = []) => {
                if (derivations.length === 0) {
                    const derivationName = this.derivation.getName();
                    const derivationClass = derivations_1.DERIVATIONS.getDerivationClass(derivationName);
                    let derivation;
                    if (['BIP44', 'BIP49', 'BIP84', 'BIP86'].includes(derivationName)) {
                        derivation = new derivationClass({
                            coinType: current[1][0],
                            account: current[2][0],
                            change: current[3][0],
                            address: current[4][0]
                        });
                    }
                    else if (derivationName === 'CIP1852') {
                        derivation = new derivationClass({
                            coinType: current[1][0],
                            account: current[2][0],
                            role: current[3][0],
                            address: current[4][0]
                        });
                    }
                    else if (derivationName === 'Electrum') {
                        derivation = new derivationClass({
                            change: current[0][0],
                            address: current[1][0]
                        });
                    }
                    else if (derivationName === 'Monero') {
                        derivation = new derivationClass({
                            minor: current[0][0],
                            major: current[1][0]
                        });
                    }
                    else if (derivationName === 'HDW') {
                        derivation = new derivationClass({
                            account: current[0][0],
                            ecc: current[1][0],
                            address: current[2][0]
                        });
                    }
                    else {
                        const path = 'm/' + current.map(([v, h]) => `${v}${h ? "'" : ''}`).join('/');
                        derivation = new derivationClass({ path });
                    }
                    this.updateDerivation(derivation);
                    derivationsList.push(this.getDump(['root', ...exclude]));
                    return [derivation.getPath()];
                }
                const [head, ...rest] = derivations;
                const result = [];
                if (isRangeTuple(head)) {
                    const [start, end, hardened] = head;
                    for (let i = start; i <= end; i++) {
                        result.push(...driveHelper(rest, [...current, [i, hardened]]));
                    }
                }
                else {
                    result.push(...driveHelper(rest, [...current, head]));
                }
                return result;
            };
            return driveHelper(args);
        };
        drive(...this.derivation.getDerivations());
        if (exclude.includes('root')) {
            return derivationsList;
        }
        const rootDump = this.getDump(['derivation', ...exclude]);
        if (!exclude.includes('derivations')) {
            rootDump['derivations'] = derivationsList;
        }
        return (0, utils_1.excludeKeys)(rootDump, exclude);
    }
}
exports.HDWallet = HDWallet;
//# sourceMappingURL=hdwallet.js.map