// SPDX-License-Identifier: MIT
import { ENTROPIES } from './entropies';
import { ElectrumV2Mnemonic, MoneroMnemonic, ELECTRUM_V2_MNEMONIC_TYPES, MNEMONICS } from './mnemonics';
import { BIP39Seed, CardanoSeed, ElectrumV2Seed, SEEDS } from './seeds';
import { HD, HDS } from './hds';
import { PUBLIC_KEY_TYPES, SEMANTICS, MODES } from './consts';
import { Cryptocurrency, Network } from './cryptocurrencies/cryptocurrency';
import { deserialize, isValidKey } from './keys';
import { excludeKeys, ensureTypeMatch, toCamelCase } from './utils';
import { NetworkError, AddressError, CryptocurrencyError, HDError, XPrivateKeyError, XPublicKeyError, PrivateKeyError, PublicKeyError, EntropyError, WIFError } from './exceptions';
import { DERIVATIONS } from './derivations';
import { Address, ADDRESSES } from './addresses';
import { checkDecode } from './libs/base58';
import { Cardano } from './cryptocurrencies';
/**
 * HDWallet class for managing hierarchical deterministic wallets.
 */
export class HDWallet {
    ecc;
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
    /**
     * Creates an HDWallet instance.
     * @param cryptocurrency - The cryptocurrency class to use.
     * @param options - Optional wallet settings.
     */
    constructor(cryptocurrency, options = {}) {
        this.cryptocurrency = ensureTypeMatch(cryptocurrency, Cryptocurrency, { errorClass: CryptocurrencyError });
        this.ecc = options.ecc ?? this.cryptocurrency.ECC;
        const _hd = options.hd ?? this.cryptocurrency.DEFAULT_HD;
        const resolvedHD = ensureTypeMatch(_hd, HD, { otherTypes: ['string'] });
        const hdName = resolvedHD.isValid ? resolvedHD.value.getName() : _hd;
        if (!this.cryptocurrency.HDS.isHD(hdName)) {
            throw new HDError(`${this.cryptocurrency.NAME} doesn't support HD type`, {
                expected: this.cryptocurrency.HDS.getHDS(), got: hdName
            });
        }
        const hdClass = HDS.getHDClass(hdName);
        const _network = options.network ?? this.cryptocurrency.DEFAULT_NETWORK.NAME;
        const resolvedNetwork = ensureTypeMatch(_network, Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : _network;
        if (!this.cryptocurrency.NETWORKS.isNetwork(networkName)) {
            throw new NetworkError(`${this.cryptocurrency.NAME} doesn't support network type`, {
                expected: this.cryptocurrency.NETWORKS.getNetworks(), got: networkName
            });
        }
        this.network = this.cryptocurrency.NETWORKS.getNetwork(networkName);
        if (['Algorand', 'BIP32', 'BIP44', 'BIP86', 'Cardano'].includes(hdName)) {
            this.semantic = options.semantic ?? this.cryptocurrency.DEFAULT_SEMANTIC;
        }
        else if (hdName === 'BIP49') {
            this.semantic = options.semantic ?? SEMANTICS.P2WPKH_IN_P2SH;
        }
        else if (['BIP84', 'BIP141'].includes(hdName)) {
            this.semantic = options.semantic ?? SEMANTICS.P2WPKH;
        }
        else {
            this.semantic = undefined;
        }
        let _address = options.address;
        if (!options.address) { // Use default address
            _address = this.cryptocurrency.DEFAULT_ADDRESS;
            if (hdName === 'BIP49') {
                _address = 'P2WPKH-In-P2SH';
            }
            else if (hdName === 'BIP84') {
                _address = 'P2WPKH';
            }
            else if (hdName === 'BIP86') {
                _address = 'P2TR';
            }
            else if (hdName === 'BIP141') {
                if (this.semantic === SEMANTICS.P2WPKH) {
                    _address = 'P2WPKH';
                }
                else if (this.semantic === SEMANTICS.P2WPKH_IN_P2SH) {
                    _address = 'P2WPKH-In-P2SH';
                }
                else if (this.semantic === SEMANTICS.P2WSH) {
                    _address = 'P2WSH';
                }
                else if (this.semantic === SEMANTICS.P2WSH_IN_P2SH) {
                    _address = 'P2WSH-In-P2SH';
                }
            }
        }
        const resolvedAddress = ensureTypeMatch(_address, Address, { otherTypes: ['string'] });
        const addressName = resolvedAddress.isValid ? resolvedAddress.value.getName() : _address;
        if (!this.cryptocurrency.ADDRESSES.isAddress(addressName)) {
            throw new AddressError(`${this.cryptocurrency.NAME} doesn't support address type`, {
                expected: this.cryptocurrency.ADDRESSES.getAddresses(), got: addressName
            });
        }
        this.address = ADDRESSES.getAddressClass(addressName);
        this.language = options.language ?? 'english';
        this.passphrase = options.passphrase ?? null;
        this.useDefaultPath = options.useDefaultPath ?? false;
        this.stakingPublicKey = options.stakingPublicKey;
        this.paymentID = options.paymentID;
        if (['BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Electrum-V1'].includes(hdName)) {
            this.publicKeyType = options.publicKeyType ?? (hdName === 'Electrum-V1' ? PUBLIC_KEY_TYPES.UNCOMPRESSED : PUBLIC_KEY_TYPES.COMPRESSED);
        }
        else if (hdName === 'Cardano') {
            this.cardanoType = options.cardanoType;
        }
        else if (hdName === 'Electrum-V2') {
            this.mode = options.mode ?? MODES.STANDARD;
            this.mnemonicType = options.mnemonicType ?? ELECTRUM_V2_MNEMONIC_TYPES.STANDARD;
            this.publicKeyType = options.publicKeyType ?? PUBLIC_KEY_TYPES.UNCOMPRESSED;
        }
        else if (hdName === 'Monero') {
            this.checksum = options.checksum ?? false;
        }
        this.addressType = options.addressType ?? this.cryptocurrency.DEFAULT_ADDRESS_TYPE;
        if (this.cryptocurrency.NAME === 'Tezos') {
            this.addressPrefix = options.addressPrefix ?? this.cryptocurrency.DEFAULT_ADDRESS_PREFIX;
        }
        this.hd = new hdClass({
            ecc: this.ecc,
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
    /**
     * Initialize wallet from entropy.
     * @param entropy - The entropy instance.
     * @returns The current HDWallet instance.
     */
    fromEntropy(entropy) {
        if (!this.cryptocurrency.ENTROPIES.isEntropy(entropy.getName())) {
            throw new EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Entropy type`, {
                expected: this.cryptocurrency.ENTROPIES.getEntropies(), got: entropy.getName()
            });
        }
        this.entropy = entropy;
        let mnemonic;
        if (this.entropy.getName() === 'Electrum-V2') {
            mnemonic = ElectrumV2Mnemonic.fromEntropy(this.entropy.getEntropy(), this.language, { mnemonicType: this.mnemonicType });
        }
        else if (this.entropy.getName() === 'Monero') {
            mnemonic = MoneroMnemonic.fromEntropy(this.entropy.getEntropy(), this.language, { checksum: this.checksum });
        }
        else {
            mnemonic = MNEMONICS.getMnemonicClass(this.entropy.getName()).fromEntropy(this.entropy.getEntropy(), this.language);
        }
        const mnemonicClass = MNEMONICS.getMnemonicClass(this.entropy.getName());
        return this.fromMnemonic(this.entropy.getName() === 'Electrum-V2' ?
            new mnemonicClass(mnemonic, { mnemonicType: this.mnemonicType }) :
            new mnemonicClass(mnemonic));
    }
    /**
     * Initialize wallet from a mnemonic.
     * @param mnemonic - The mnemonic instance.
     * @returns The current HDWallet instance.
     */
    fromMnemonic(mnemonic) {
        if (!this.cryptocurrency.MNEMONICS.isMnemonic(mnemonic.getName())) {
            throw new EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Mnemonic type`, {
                expected: this.cryptocurrency.MNEMONICS.getMnemonics(), got: mnemonic.getName()
            });
        }
        this.mnemonic = mnemonic;
        if (this.mnemonic.getName() === 'Electrum-V2') {
            const entropyBytes = MNEMONICS.getMnemonicClass(this.mnemonic.getName()).decode(this.mnemonic.getMnemonic(), { mnemonicType: this.mnemonicType });
            const entropyClass = ENTROPIES.getEntropyClass(this.mnemonic.getName());
            this.entropy = new entropyClass(entropyBytes);
        }
        else {
            const entropyBytes = MNEMONICS.getMnemonicClass(this.mnemonic.getName()).decode(this.mnemonic.getMnemonic());
            const entropyClass = ENTROPIES.getEntropyClass(this.mnemonic.getName());
            this.entropy = new entropyClass(entropyBytes);
        }
        let seed;
        if (this.mnemonic.getName() === 'BIP39' && this.hd.getName() === 'Cardano') {
            seed = CardanoSeed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase,
                cardanoType: this.cardanoType
            });
        }
        else if (this.mnemonic.getName() === BIP39Seed.getName()) {
            seed = BIP39Seed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase
            });
        }
        else if (this.mnemonic.getName() === ElectrumV2Seed.getName()) {
            seed = ElectrumV2Seed.fromMnemonic(this.mnemonic.getMnemonic(), {
                passphrase: this.passphrase,
                mnemonicType: this.mnemonicType
            });
        }
        else {
            seed = SEEDS.getSeedClass(this.mnemonic.getName()).fromMnemonic(this.mnemonic.getMnemonic());
        }
        const seedClass = SEEDS.getSeedClass(this.hd.getName() === 'Cardano' ? 'Cardano' : this.mnemonic.getName());
        return this.fromSeed(new seedClass(seed));
    }
    /**
     * Initialize wallet from a seed.
     * @param seed - The seed instance.
     * @returns The current HDWallet instance.
     */
    fromSeed(seed) {
        if (!this.cryptocurrency.SEEDS.isSeed(seed.getName())) {
            throw new EntropyError(`${this.cryptocurrency.NAME} cryptocurrency doesn't support Seed type`, {
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
    /**
     * Initialize wallet from an extended private key.
     * @param xprivateKey - The extended private key string.
     * @param encoded - Whether the key is encoded (default: true).
     * @param strict - Whether to use strict mode (default: false).
     * @returns The current HDWallet instance.
     */
    fromXPrivateKey(xprivateKey, encoded = true, strict = false) {
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName())) {
            throw new XPrivateKeyError(`Support for XPrivate-Key conversion is not implemented in ${this.hd.getName()} HD type`);
        }
        if (!isValidKey(xprivateKey, encoded)) {
            throw new XPrivateKeyError('Invalid XPrivate-Key data');
        }
        const [version, , , , ,] = deserialize(xprivateKey, encoded);
        const decodedLen = encoded ? checkDecode(xprivateKey).length : xprivateKey.length;
        if (!this.network.XPRIVATE_KEY_VERSIONS.isVersion(version) || ![78, 110].includes(decodedLen)) {
            throw new XPrivateKeyError(`Invalid XPrivate-Key for ${this.cryptocurrency.NAME}`);
        }
        this.hd.fromXPrivateKey(xprivateKey, encoded, strict);
        return this;
    }
    /**
     * Initialize wallet from an extended public key.
     * @param xpublicKey - The extended public key string.
     * @param encoded - Whether the key is encoded (default: true).
     * @param strict - Whether to use strict mode (default: false).
     * @returns The current HDWallet instance.
     */
    fromXPublicKey(xpublicKey, encoded = true, strict = false) {
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName())) {
            throw new XPublicKeyError(`Support for XPublic-Key conversion is not implemented in ${this.hd.getName()} HD type`);
        }
        else if (this.hd.getName() === 'Cardano' && this.cardanoType === 'byron-legacy') {
            throw new XPublicKeyError(`Conversion from XPublic-Key is unavailable in ${this.cardanoType} mode for ${this.hd.getName()} HD type`);
        }
        if (!isValidKey(xpublicKey, encoded)) {
            throw new XPublicKeyError("Invalid XPublic-Key data");
        }
        const [version, , , , ,] = deserialize(xpublicKey, encoded);
        const decodedLen = encoded ? checkDecode(xpublicKey).length : xpublicKey.length;
        if (!this.network.XPUBLIC_KEY_VERSIONS.isVersion(version) || ![78, 110].includes(decodedLen)) {
            throw new XPublicKeyError(`Invalid XPublic-Key for ${this.cryptocurrency.NAME}`);
        }
        this.hd.fromXPublicKey(xpublicKey, encoded, strict);
        return this;
    }
    /**
     * Initialize wallet from a derivation.
     * @param derivation - The derivation instance.
     * @returns The current HDWallet instance.
     */
    fromDerivation(derivation) {
        this.hd.fromDerivation(derivation);
        this.derivation = derivation;
        return this;
    }
    /**
     * Update the wallet's derivation.
     * @param derivation - The derivation instance.
     * @returns The current HDWallet instance.
     */
    updateDerivation(derivation) {
        this.hd.updateDerivation(derivation);
        this.derivation = derivation;
        return this;
    }
    /**
     * Clears the derivation.
     * @returns The current HDWallet instance.
     */
    cleanDerivation() {
        this.hd.cleanDerivation();
        this.derivation?.clean();
        return this;
    }
    /**
     * Initialize wallet from a private key.
     * @param privateKey - The private key string.
     * @returns The current HDWallet instance.
     */
    fromPrivateKey(privateKey) {
        this.hd.fromPrivateKey(privateKey);
        return this;
    }
    /**
     * Initialize wallet from a WIF key.
     * @param wif - The WIF string.
     * @returns The current HDWallet instance.
     */
    fromWIF(wif) {
        if (['Algorand', 'Cardano', 'Monero'].includes(this.hd.getName())) {
            throw new WIFError(`WIF is not supported by ${this.hd.getName()} HD type`);
        }
        if (this.network.WIF_PREFIX === null) {
            throw new WIFError(`WIF is not supported by ${this.cryptocurrency.NAME} cryptocurrency`);
        }
        this.hd.fromWIF(wif);
        return this;
    }
    /**
     * Initialize wallet from a public key.
     * @param publicKey - The public key string.
     * @returns The current HDWallet instance.
     */
    fromPublicKey(publicKey) {
        if (this.hd.getName() === 'Monero') {
            throw new PublicKeyError(`From Public-Key is not supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromPublicKey(publicKey);
        return this;
    }
    /**
     * Initialize wallet from Monero spend private key.
     * @param spendPrivateKey - The spend private key string.
     * @returns The current HDWallet instance.
     */
    fromSpendPrivateKey(spendPrivateKey) {
        if (this.hd.getName() !== 'Monero') {
            throw new PrivateKeyError(`From Spend-Private-Key is only supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromSpendPrivateKey(spendPrivateKey);
        return this;
    }
    /**
     * Initialize wallet from Monero watch-only keys.
     * @param viewPrivateKey - The view private key string.
     * @param spendPublicKey - The spend public key string.
     * @returns The current HDWallet instance.
     */
    fromWatchOnly(viewPrivateKey, spendPublicKey) {
        if (this.hd.getName() !== 'Monero') {
            throw new PublicKeyError(`From Watch-Only is only supported by ${this.hd.getName()} HD type`);
        }
        this.hd.fromWatchOnly(viewPrivateKey, spendPublicKey);
        return this;
    }
    /**
     * Get the cryptocurrency name.
     * @returns Cryptocurrency name string.
     */
    getCryptocurrency() {
        return this.cryptocurrency.NAME;
    }
    /**
     * Get the cryptocurrency symbol.
     * @returns Cryptocurrency symbol string.
     */
    getSymbol() {
        return this.cryptocurrency.SYMBOL;
    }
    /**
     * Get the coin type.
     * @returns Coin type number.
     */
    getCoinType() {
        return this.cryptocurrency.COIN_TYPE;
    }
    /**
     * Get network name.
     * @returns Network name string.
     */
    getNetwork() {
        return this.network.NAME;
    }
    /**
     * Get entropy value.
     * @returns Entropy as a string or null.
     */
    getEntropy() {
        return this.entropy?.getEntropy() ?? null;
    }
    /**
     * Get entropy strength.
     * @returns Entropy strength in bits or null.
     */
    getStrength() {
        return this.entropy?.getStrength() ?? null;
    }
    /**
     * Get the mnemonic string.
     * @returns Mnemonic string or null.
     */
    getMnemonic() {
        return this.mnemonic?.getMnemonic() ?? null;
    }
    /**
     * Get mnemonic type.
     * @returns Mnemonic type string or null.
     */
    getMnemonicType() {
        return this.mnemonicType ?? null;
    }
    /**
     * Get language of mnemonic.
     * @returns Language string or null.
     */
    getLanguage() {
        return this.mnemonic?.getLanguage() ?? null;
    }
    /**
     * Get number of words in mnemonic.
     * @returns Word count or null.
     */
    getWords() {
        return this.mnemonic?.getWords() ?? null;
    }
    /**
     * Get wallet passphrase.
     * @returns Passphrase string or null.
     */
    getPassphrase() {
        return this.passphrase;
    }
    /**
     * Get wallet seed.
     * @returns Seed string or null.
     */
    getSeed() {
        return this.hd.getSeed();
    }
    /**
     * Get the ECC algorithm name.
     * @returns ECC algorithm string.
     */
    getECC() {
        return this.hd.ecc.NAME;
    }
    /**
     * Get HD type name.
     * @returns HD type string.
     */
    getHD() {
        return this.hd.getName();
    }
    /**
     * Get semantic type.
     * @returns Semantic string or null.
     */
    getSemantic() {
        return this.semantic ?? null;
    }
    /**
     * Get Cardano type.
     * @returns Cardano type string or null.
     */
    getCardanoType() {
        return this.hd.getName() === 'Cardano' ? (this.cardanoType ?? null) : null;
    }
    /**
     * Get mode (Electrum-V2 only).
     * @returns Mode string.
     */
    getMode() {
        if (this.hd.getName() !== 'Electrum-V2') {
            throw new Error(`Get mode is only for Electrum-V2 HD type, not ${this.hd.getName()}`);
        }
        return this.hd.getMode();
    }
    /**
     * Get path key.
     * @returns Path key string or null.
     */
    getPathKey() {
        return this.hd.getPathKey();
    }
    /**
     * Get the root extended private key (xprv) for the wallet.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Root xprv string or null if unsupported.
     */
    getRootXPrivateKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getRootXPrivateKey(this.network.XPRIVATE_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    /**
     * Get the root extended public key (xpub) for the wallet.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Root xpub string or null if unsupported.
     */
    getRootXPublicKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getRootXPublicKey(this.network.XPUBLIC_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    /**
     * Alias for getRootXPrivateKey.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Master xprv string or null.
     */
    getMasterXPrivateKey(semantic, encoded = true) {
        return this.getRootXPrivateKey(semantic, encoded);
    }
    /**
     * Alias for getRootXPublicKey.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Master xpub string or null.
     */
    getMasterXPublicKey(semantic, encoded = true) {
        return this.getRootXPublicKey(semantic, encoded);
    }
    /**
     * Get the root private key.
     * @returns Root private key string or null.
     */
    getRootPrivateKey() {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPrivateKey();
        }
        return this.hd.getRootPrivateKey();
    }
    /**
     * Get the root WIF (Wallet Import Format) key.
     * @param wifType - Optional WIF type.
     * @returns WIF string or null if unsupported.
     */
    getRootWIF(wifType) {
        if (['Algorand', 'Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterWIF(wifType);
        }
        return this.hd.getRootWIF(wifType);
    }
    /**
     * Get the root chain code.
     * @returns Root chain code string.
     */
    getRootChainCode() {
        return this.hd.getRootChainCode();
    }
    /**
     * Get the root public key.
     * @param publicKeyType - Optional public key type.
     * @returns Root public key string.
     */
    getRootPublicKey(publicKeyType) {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPublicKey(publicKeyType);
        }
        return this.hd.getRootPublicKey(publicKeyType);
    }
    /**
     * Get the master private key.
     * @returns Master private key string or null.
     */
    getMasterPrivateKey() {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPrivateKey();
        }
        return this.hd.getRootPrivateKey();
    }
    /**
     * Get the master WIF key.
     * @param wifType - Optional WIF type.
     * @returns Master WIF string or null.
     */
    getMasterWIF(wifType) {
        if (['Algorand', 'Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterWIF(wifType);
        }
        return this.hd.getRootWIF(wifType);
    }
    /**
     * Get the master chain code.
     * @returns Master chain code string.
     */
    getMasterChainCode() {
        return this.hd.getRootChainCode();
    }
    /**
     * Get the master public key.
     * @param publicKeyType - Optional public key type.
     * @returns Master public key string.
     */
    getMasterPublicKey(publicKeyType) {
        if (['Electrum-V1', 'Electrum-V2'].includes(this.hd.getName())) {
            return this.hd.getMasterPublicKey(publicKeyType);
        }
        return this.hd.getRootPublicKey(publicKeyType);
    }
    /**
     * Get coin-specific extended private key.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return encoded key (default: true).
     * @returns Extended private key string or null.
     */
    getXPrivateKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getXPrivateKey(this.network.XPRIVATE_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    /**
     * Get coin-specific extended public key.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return encoded key (default: true).
     * @returns Extended public key string or null.
     */
    getXPublicKey(semantic, encoded = true) {
        const currentSemantic = semantic ?? this.semantic;
        if (['Electrum-V1', 'Monero'].includes(this.hd.getName()) || !currentSemantic) {
            return null;
        }
        return this.hd.getXPublicKey(this.network.XPUBLIC_KEY_VERSIONS.getVersion(currentSemantic), encoded);
    }
    /**
     * Get the standard private key.
     * @returns Private key string or null.
     */
    getPrivateKey() {
        return this.hd.getPrivateKey();
    }
    /**
     * Get the Monero spend private key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero spend private key string.
     */
    getSpendPrivateKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get Spend-Private-Key is only supported by Monero HD type');
        }
        return this.hd.getSpendPrivateKey();
    }
    /**
     * Get the Monero view private key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero view private key string.
     */
    getViewPrivateKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get View-Private-Key is only supported by Monero HD type');
        }
        return this.hd.getViewPrivateKey();
    }
    /**
     * Get the standard WIF key.
     * @param wifType - Optional WIF type.
     * @returns WIF string or null.
     */
    getWIF(wifType) {
        if (['Algorand', 'Cardano', 'Monero'].includes(this.hd.getName())) {
            return null;
        }
        return this.hd.getWIF(wifType);
    }
    /**
     * Get the WIF type.
     * @returns WIF type string or null.
     */
    getWIFType() {
        return this.getWIF() ? this.hd.getWIFType() : null;
    }
    /**
     * Get the chain code.
     * @returns Chain code string.
     */
    getChainCode() {
        return this.hd.getChainCode();
    }
    /**
     * Get the standard public key.
     * @param publicKeyType - Optional public key type.
     * @returns Public key string.
     */
    getPublicKey(publicKeyType) {
        return this.hd.getPublicKey(publicKeyType);
    }
    /**
     * Get the public key type.
     * @returns Public key type string.
     */
    getPublicKeyType() {
        return this.hd.getPublicKeyType();
    }
    /**
     * Get the uncompressed public key.
     * @returns Uncompressed public key string.
     */
    getUncompressed() {
        return this.hd.getUncompressed();
    }
    /**
     * Get the compressed public key.
     * @returns Compressed public key string.
     */
    getCompressed() {
        return this.hd.getCompressed();
    }
    /**
     * Get the Monero spend public key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero spend public key string.
     */
    getSpendPublicKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get Spend-Public-Key is only supported by Monero HD type');
        }
        return this.hd.getSpendPublicKey();
    }
    /**
     * Get the Monero view public key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero view public key string.
     */
    getViewPublicKey() {
        if (this.hd.getName() !== 'Monero') {
            throw new Error('Get View-Public-Key is only supported by Monero HD type');
        }
        return this.hd.getViewPublicKey();
    }
    /**
     * Get key hash.
     * @returns Key hash string.
     */
    getHash() {
        return this.hd.getHash();
    }
    /**
     * Get key depth.
     * @returns Depth number.
     */
    getDepth() {
        return this.hd.getDepth();
    }
    /**
     * Get key fingerprint.
     * @returns Fingerprint string.
     */
    getFingerprint() {
        return this.hd.getFingerprint();
    }
    /**
     * Get parent fingerprint.
     * @returns Parent fingerprint string.
     */
    getParentFingerprint() {
        return this.hd.getParentFingerprint();
    }
    /**
     * Get derivation path.
     * @returns Path string.
     */
    getPath() {
        return this.hd.getPath();
    }
    /**
     * Get last index in derivation path.
     * @returns Index number.
     */
    getIndex() {
        return this.hd.getIndex();
    }
    /**
     * Get all indexes in derivation path.
     * @returns Array of index numbers.
     */
    getIndexes() {
        return this.hd.getIndexes();
    }
    /**
     * Get strict derivation setting.
     * @returns Boolean or null if unsupported.
     */
    getStrict() {
        return ['Electrum-V1', 'Monero'].includes(this.hd.getName()) ? null : this.hd.getStrict();
    }
    /**
     * Get the Monero primary address.
     * @returns Address string or null.
     */
    getPrimaryAddress() {
        return this.hd.getName() === 'Monero' ? this.hd.getPrimaryAddress() : null;
    }
    /**
     * Get Monero integrated address.
     * @param paymentID - Optional payment ID.
     * @returns Integrated address string or null.
     */
    getIntegratedAddress(paymentID) {
        return this.hd.getName() === 'Monero' ? this.hd.getIntegratedAddress(paymentID) : null;
    }
    /**
     * Get Monero subaddress.
     * @param minor - Optional minor index.
     * @param major - Optional major index.
     * @returns Subaddress string or null.
     */
    getSubAddress(minor, major) {
        return this.hd.getName() === 'Monero' ? this.hd.getSubAddress(minor, major) : null;
    }
    /**
     * Get wallet address.
     * @param options - Optional address settings.
     * @returns Address string or null.
     */
    getAddress(options = {}) {
        const _address = options.address ?? this.address;
        const resolvedAddress = ensureTypeMatch(_address, Address, { otherTypes: ['string'] });
        const addressName = resolvedAddress.isValid ? resolvedAddress.value.getName() : _address;
        if (!this.cryptocurrency.ADDRESSES.isAddress(addressName)) {
            throw new AddressError(`${this.cryptocurrency.NAME} doesn't support address type`, {
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
            const addressClass = ADDRESSES.getAddressClass(addressName);
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
        throw new AddressError(`Could not resolve address for ${hdName} HD type`);
    }
    /**
     * Get full dump of wallet data.
     * @param exclude - List of keys to exclude.
     * @returns Object containing wallet data.
     */
    getDump(exclude = []) {
        const derivationDump = {};
        const hdName = this.hd.getName();
        if (this.derivation) {
            let at;
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
            'Algorand', 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Cardano'
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
            if (['Algorand', 'Cardano'].includes(hdName)) {
                delete derivationDump.wif;
                delete derivationDump.uncompressed;
                delete derivationDump.compressed;
            }
            if (this.cryptocurrency.ADDRESSES.length() > 1 || this.cryptocurrency.NAME === 'Tezos') {
                const addresses = {};
                if (this.cryptocurrency.NAME === 'Avalanche' && this.cryptocurrency.ADDRESS_TYPES) {
                    addresses[toCamelCase(this.cryptocurrency.ADDRESS_TYPES.C_CHAIN)] = this.getAddress({ address: 'Ethereum' });
                    addresses[toCamelCase(this.cryptocurrency.ADDRESS_TYPES.P_CHAIN)] = this.getAddress({
                        address: 'Avalanche', addressType: this.cryptocurrency.ADDRESS_TYPES.P_CHAIN
                    });
                    addresses[toCamelCase(this.cryptocurrency.ADDRESS_TYPES.X_CHAIN)] = this.getAddress({
                        address: 'Avalanche', addressType: this.cryptocurrency.ADDRESS_TYPES.X_CHAIN
                    });
                }
                else if (this.cryptocurrency.NAME === 'Binance' && this.cryptocurrency.ADDRESS_TYPES) {
                    addresses[toCamelCase(this.cryptocurrency.ADDRESS_TYPES.CHAIN)] = this.getAddress({ address: 'Cosmos' });
                    addresses[toCamelCase(this.cryptocurrency.ADDRESS_TYPES.SMART_CHAIN)] = this.getAddress({ address: 'Ethereum' });
                }
                else if ((this.cryptocurrency.NAME === 'Bitcoin-Cash' ||
                    this.cryptocurrency.NAME === 'Bitcoin-Cash-SLP' ||
                    this.cryptocurrency.NAME === 'eCash') &&
                    this.cryptocurrency.ADDRESS_TYPES) {
                    for (const addressType of this.cryptocurrency.ADDRESS_TYPES.getAddressTypes()) {
                        for (const address of this.cryptocurrency.ADDRESSES.getAddresses()) {
                            addresses[`${addressType}${address.split('-').join('')}`] = ADDRESSES.getAddressClass(address).encode(this.getPublicKey(), {
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
                    if (this.semantic === SEMANTICS.P2WPKH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WPKH' });
                    }
                    else if (this.semantic === SEMANTICS.P2WPKH_IN_P2SH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WPKH-In-P2SH' });
                    }
                    else if (this.semantic === SEMANTICS.P2WSH) {
                        derivationDump['address'] = this.getAddress({ address: 'P2WSH' });
                    }
                    else if (this.semantic === SEMANTICS.P2WSH_IN_P2SH) {
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
                    Cardano.TYPES.SHELLEY_ICARUS, Cardano.TYPES.SHELLEY_LEDGER
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
            return excludeKeys(derivationDump, exclude);
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
        // if (['Electrum-V1', 'Electrum-V2', 'Monero'].includes(hdName)) {
        //   delete root['passphrase'];
        // }
        if ([
            'Algorand', 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'BIP141', 'Cardano'
        ].includes(hdName)) {
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
            if (['Algorand', 'Cardano'].includes(hdName)) {
                delete root['root-wif'];
                delete root['public-key-type'];
                delete root['wif-type'];
                if (this.cardanoType !== Cardano.TYPES.BYRON_LEGACY) {
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
        return excludeKeys(root, exclude);
    }
    /**
     * Get dumps for derivation ranges.
     * @param exclude - List of keys to exclude.
     * @returns Array of wallet data objects or null.
     */
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
                    const derivationClass = DERIVATIONS.getDerivationClass(derivationName);
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
        return excludeKeys(rootDump, exclude);
    }
}
//# sourceMappingURL=hdwallet.js.map