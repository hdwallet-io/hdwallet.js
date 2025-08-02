// SPDX-License-Identifier: MIT
import { ECCError } from '../exceptions';
export class HD {
    ecc;
    derivation;
    constructor(options = {}) {
        if (!options.ecc) {
            throw new ECCError('Elliptic Curve Cryptography (ECC) is required');
        }
        this.ecc = options.ecc;
    }
    static getName() {
        throw new Error('Must override getName()');
    }
    getName() {
        return this.constructor.getName();
    }
    fromSeed(...args) {
        throw new Error('Not implemented');
    }
    fromXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    fromXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    fromWIF(wif) {
        throw new Error('Not implemented');
    }
    fromPrivateKey(privateKey) {
        throw new Error('Not implemented');
    }
    fromSpendPrivateKey(spendPrivateKey) {
        throw new Error('Not implemented');
    }
    fromPublicKey(publicKey) {
        throw new Error('Not implemented');
    }
    fromWatchOnly(viewPrivateKey, spendPublicKey) {
        throw new Error('Not implemented');
    }
    fromDerivation(derivation) {
        throw new Error('Not implemented');
    }
    updateDerivation(derivation) {
        throw new Error('Not implemented');
    }
    cleanDerivation() {
        throw new Error('Not implemented');
    }
    getDerivation() {
        return this.derivation;
    }
    getSeed() {
        throw new Error('Not implemented');
    }
    getSemantic() {
        return null;
    }
    getRootXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    getRootXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    getMasterXPrivateKey(...args) {
        return this.getRootXPrivateKey(...args);
    }
    getMasterXPublicKey(...args) {
        return this.getRootXPublicKey(...args);
    }
    getRootPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    getRootWIF(...args) {
        throw new Error('Not implemented');
    }
    getRootChainCode() {
        throw new Error('Not implemented');
    }
    getRootPublicKey(...args) {
        throw new Error('Not implemented');
    }
    getMasterPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    getMasterWIF(...args) {
        throw new Error('Not implemented');
    }
    getMasterChainCode(...args) {
        return this.getRootChainCode();
    }
    getMasterPublicKey(...args) {
        throw new Error('Not implemented');
    }
    getXPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    getXPublicKey(...args) {
        throw new Error('Not implemented');
    }
    getPrivateKey(...args) {
        throw new Error('Not implemented');
    }
    getStrict() {
        throw new Error('Not implemented');
    }
    getSpendPrivateKey() {
        throw new Error('Not implemented');
    }
    getViewPrivateKey() {
        throw new Error('Not implemented');
    }
    getWIF(..._args) {
        throw new Error('Not implemented');
    }
    getWIFType() {
        throw new Error('Not implemented');
    }
    getChainCode() {
        throw new Error('Not implemented');
    }
    getPublicKey(...args) {
        throw new Error('Not implemented');
    }
    getCompressed() {
        throw new Error('Not implemented');
    }
    getUncompressed() {
        throw new Error('Not implemented');
    }
    getSpendPublicKey() {
        throw new Error('Not implemented');
    }
    getViewPublicKey() {
        throw new Error('Not implemented');
    }
    getPublicKeyType() {
        throw new Error('Not implemented');
    }
    getMode() {
        throw new Error('Not implemented');
    }
    getHash() {
        throw new Error('Not implemented');
    }
    getFingerprint() {
        throw new Error('Not implemented');
    }
    getParentFingerprint() {
        throw new Error('Not implemented');
    }
    getDepth() {
        throw new Error('Not implemented');
    }
    getPath() {
        throw new Error('Not implemented');
    }
    getPathKey() {
        return null;
    }
    getIndex() {
        throw new Error('Not implemented');
    }
    getIndexes() {
        throw new Error('Not implemented');
    }
    getIntegratedAddress(...args) {
        throw new Error('Not implemented');
    }
    getPrimaryAddress(...args) {
        throw new Error('Not implemented');
    }
    getSubAddress(...args) {
        throw new Error('Not implemented');
    }
    getAddress(...args) {
        throw new Error('Not implemented');
    }
}
//# sourceMappingURL=hd.js.map