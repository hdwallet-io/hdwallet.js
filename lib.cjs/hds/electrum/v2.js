"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectrumV2HD = void 0;
const hd_1 = require("../hd");
const derivations_1 = require("../../derivations");
const consts_1 = require("../../consts");
const addresses_1 = require("../../addresses");
const wif_1 = require("../../wif");
const cryptocurrencies_1 = require("../../cryptocurrencies");
const bip32_1 = require("../bip32");
const utils_1 = require("../../utils");
const exceptions_1 = require("../../exceptions");
const eccs_1 = require("../../eccs");
class ElectrumV2HD extends hd_1.HD {
    mode;
    wifType;
    publicKeyType;
    wifPrefix;
    bip32HD;
    constructor(options = {
        publicKeyType: consts_1.PUBLIC_KEY_TYPES.UNCOMPRESSED,
        mode: consts_1.MODES.STANDARD
    }) {
        super({ ecc: eccs_1.SLIP10Secp256k1ECC, ...options });
        this.mode = options.mode ?? consts_1.MODES.STANDARD;
        if (!consts_1.MODES.getTypes().includes(this.mode)) {
            throw new exceptions_1.BaseError(`Invalid ${this.getName()} mode`, {
                expected: consts_1.MODES.getTypes(),
                got: this.mode
            });
        }
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
        this.bip32HD = new bip32_1.BIP32HD({
            ecc: cryptocurrencies_1.Bitcoin.ECC, publicKeyType: this.publicKeyType
        });
    }
    static getName() {
        return 'Electrum-V2';
    }
    fromSeed(seed) {
        this.bip32HD.fromSeed(seed);
        this.fromDerivation(this.derivation);
        return this;
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
        const custom = new derivations_1.CustomDerivation();
        if (this.mode === consts_1.MODES.SEGWIT) {
            custom.fromIndex(0, true); // Hardened
        }
        custom.fromIndex(changeIndex);
        custom.fromIndex(addressIndex);
        this.bip32HD.updateDerivation(custom);
        return this;
    }
    getMode() {
        return this.mode;
    }
    getSeed() {
        return this.bip32HD.getSeed();
    }
    getMasterPrivateKey() {
        return this.bip32HD.getRootPrivateKey();
    }
    getMasterWIF(wifType) {
        if (this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getMasterPrivateKey(), type, this.wifPrefix);
    }
    getMasterPublicKey(publicKeyType) {
        return this.bip32HD.getRootPublicKey(publicKeyType ?? this.publicKeyType);
    }
    getPrivateKey() {
        return this.bip32HD.getPrivateKey();
    }
    getWIF(wifType) {
        if (this.wifPrefix == null)
            return null;
        const type = wifType ?? this.wifType;
        return (0, wif_1.privateKeyToWIF)(this.getPrivateKey(), type, this.wifPrefix);
    }
    getWIFType() {
        return this.wifType;
    }
    getPublicKey(publicKeyType) {
        return this.bip32HD.getPublicKey(publicKeyType ?? this.publicKeyType);
    }
    getPublicKeyType() {
        return this.publicKeyType;
    }
    getUncompressed() {
        return this.bip32HD.getUncompressed();
    }
    getCompressed() {
        return this.bip32HD.getCompressed();
    }
    getAddress(options = {
        publicKeyAddressPrefix: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
        hrp: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        if (this.mode === consts_1.MODES.STANDARD) {
            return addresses_1.P2PKHAddress.encode(this.getPublicKey(), {
                publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
                publicKeyType: this.publicKeyType
            });
        }
        else if (this.mode === consts_1.MODES.SEGWIT) {
            return addresses_1.P2WPKHAddress.encode(this.getPublicKey(), {
                hrp: options.hrp ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.HRP,
                witnessVersion: options.witnessVersion ?? cryptocurrencies_1.Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
                publicKeyType: this.publicKeyType
            });
        }
        throw new exceptions_1.AddressError(`Invalid ${this.getName()} mode`, {
            expected: consts_1.MODES.getTypes(), got: this.mode
        });
    }
}
exports.ElectrumV2HD = ElectrumV2HD;
//# sourceMappingURL=v2.js.map