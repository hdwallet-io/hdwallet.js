// SPDX-License-Identifier: MIT
import { HD } from '../hd';
import { ElectrumDerivation, CustomDerivation } from '../../derivations';
import { PUBLIC_KEY_TYPES, MODES, WIF_TYPES } from '../../consts';
import { P2PKHAddress, P2WPKHAddress } from '../../addresses';
import { privateKeyToWIF } from '../../wif';
import { Bitcoin } from '../../cryptocurrencies';
import { BIP32HD } from '../bip32';
import { ensureTypeMatch } from '../../utils';
import { BaseError, AddressError, DerivationError } from '../../exceptions';
import { SLIP10Secp256k1ECC } from '../../eccs';
export class ElectrumV2HD extends HD {
    mode;
    wifType;
    publicKeyType;
    wifPrefix;
    bip32HD;
    constructor(options = {
        publicKeyType: PUBLIC_KEY_TYPES.UNCOMPRESSED,
        mode: MODES.STANDARD
    }) {
        super({ ecc: SLIP10Secp256k1ECC, ...options });
        this.mode = options.mode ?? MODES.STANDARD;
        if (!MODES.getTypes().includes(this.mode)) {
            throw new BaseError(`Invalid ${this.getName()} mode`, {
                expected: MODES.getTypes(),
                got: this.mode
            });
        }
        this.publicKeyType = options.publicKeyType ?? PUBLIC_KEY_TYPES.UNCOMPRESSED;
        if (this.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED) {
            this.wifType = WIF_TYPES.WIF;
        }
        else if (this.publicKeyType === PUBLIC_KEY_TYPES.COMPRESSED) {
            this.wifType = WIF_TYPES.WIF_COMPRESSED;
        }
        else {
            throw new BaseError('Invalid public key type', {
                expected: PUBLIC_KEY_TYPES.getTypes(), got: this.publicKeyType
            });
        }
        this.wifPrefix = options.wifPrefix ?? Bitcoin.NETWORKS.MAINNET.WIF_PREFIX;
        this.derivation = new ElectrumDerivation({
            change: options.change, address: options.address
        });
        this.bip32HD = new BIP32HD({
            ecc: Bitcoin.ECC, publicKeyType: this.publicKeyType
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
        this.derivation = ensureTypeMatch(derivation, ElectrumDerivation, { errorClass: DerivationError });
        this.drive(derivation.getChange(), derivation.getAddress());
        return this;
    }
    updateDerivation(derivation) {
        this.cleanDerivation();
        return this.fromDerivation(derivation);
    }
    cleanDerivation() {
        this.derivation.clean();
        this.fromDerivation(this.derivation);
        return this;
    }
    drive(changeIndex, addressIndex) {
        const custom = new CustomDerivation();
        if (this.mode === MODES.SEGWIT) {
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
        return privateKeyToWIF(this.getMasterPrivateKey(), type, this.wifPrefix);
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
        return privateKeyToWIF(this.getPrivateKey(), type, this.wifPrefix);
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
        publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
        hrp: Bitcoin.NETWORKS.MAINNET.HRP,
        witnessVersion: Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH
    }) {
        if (this.mode === MODES.STANDARD) {
            return P2PKHAddress.encode(this.getPublicKey(), {
                publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
                publicKeyType: this.publicKeyType
            });
        }
        else if (this.mode === MODES.SEGWIT) {
            return P2WPKHAddress.encode(this.getPublicKey(), {
                hrp: options.hrp ?? Bitcoin.NETWORKS.MAINNET.HRP,
                witnessVersion: options.witnessVersion ?? Bitcoin.NETWORKS.MAINNET.WITNESS_VERSIONS.P2WPKH,
                publicKeyType: this.publicKeyType
            });
        }
        throw new AddressError(`Invalid ${this.getName()} mode`, {
            expected: MODES.getTypes(), got: this.mode
        });
    }
}
//# sourceMappingURL=v2.js.map