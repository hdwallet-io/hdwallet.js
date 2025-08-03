// SPDX-License-Identifier: MIT
import { BIP44Derivation, CHANGES } from '../derivations';
import { Bitcoin } from '../cryptocurrencies';
import { P2PKHAddress } from '../addresses';
import { BIP32HD } from './bip32';
import { PUBLIC_KEY_TYPES } from '../consts';
import { ensureTypeMatch } from '../utils';
import { DerivationError } from '../exceptions';
export class BIP44HD extends BIP32HD {
    coinType;
    constructor(options = {
        publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED
    }) {
        super(options);
        this.coinType = options.coinType ?? Bitcoin.COIN_TYPE;
        this.derivation = new BIP44Derivation({
            coinType: this.coinType,
            account: options.account ?? 0,
            change: options.change ?? CHANGES.EXTERNAL_CHAIN,
            address: options.address ?? 0
        });
    }
    static getName() {
        return 'BIP44';
    }
    fromCoinType(coinType) {
        this.cleanDerivation();
        this.derivation.fromCoinType(coinType);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromAccount(account) {
        this.cleanDerivation();
        this.derivation.fromAccount(account);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromChange(change) {
        this.cleanDerivation();
        this.derivation.fromChange(change);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromAddress(address) {
        this.cleanDerivation();
        this.derivation.fromAddress(address);
        this.fromDerivation(this.derivation);
        return this;
    }
    fromDerivation(derivation) {
        this.cleanDerivation();
        this.derivation = ensureTypeMatch(derivation, BIP44Derivation, { errorClass: DerivationError });
        for (const index of this.derivation.getIndexes()) {
            this.drive(index);
        }
        return this;
    }
    getAddress(options = {
        publicKeyAddressPrefix: Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX
    }) {
        return P2PKHAddress.encode(this.publicKey, {
            publicKeyAddressPrefix: options.publicKeyAddressPrefix ?? Bitcoin.NETWORKS.MAINNET.PUBLIC_KEY_ADDRESS_PREFIX,
            publicKeyType: this.publicKeyType
        });
    }
}
//# sourceMappingURL=bip44.js.map