"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWDerivation = void 0;
const derivation_1 = require("./derivation");
const utils_1 = require("../utils");
const eccs_1 = require("../eccs");
const exceptions_1 = require("../exceptions");
/**
 * HDWDerivation implements a generic hierarchical deterministic wallet derivation
 * supporting multiple elliptic curves.
 *
 **/
class HDWDerivation extends derivation_1.Derivation {
    account;
    ecc;
    address;
    /**
     * Constructor to initialize the HDW derivation.
     * @param options - Options including account, ECC type, and address.
     */
    constructor(options = {
        account: 0, ecc: eccs_1.SLIP10Secp256k1ECC, address: 0
    }) {
        super(options);
        this.account = (0, utils_1.normalizeIndex)(options.account ?? 0, true);
        this.ecc = (0, utils_1.normalizeIndex)(this.getECCValue(options.ecc ?? eccs_1.SLIP10Secp256k1ECC), false);
        this.address = (0, utils_1.normalizeIndex)(options.address ?? 0, false);
        this.updateDerivation();
    }
    /**
     * Returns the name of this derivation class.
     * @returns {string} - 'HDW'
     */
    static getName() {
        return 'HDW';
    }
    /**
     * Converts an ECC input to a valid internal representation.
     * @param ecc - ECC name, index, or EllipticCurveCryptography instance.
     * @param nameOnly - If true, returns the ECC name instead of numeric index.
     * @returns {number|string} - Numeric index or ECC name.
     * @throws {DerivationError} If the ECC type is invalid.
     */
    getECCValue(ecc, nameOnly = false) {
        const { value, isValid } = (0, utils_1.ensureTypeMatch)(ecc, eccs_1.EllipticCurveCryptography, { otherTypes: ['string', 'number'] });
        const curve = isValid ? value.NAME : ecc;
        const slip10Secp256k1 = [eccs_1.SLIP10Secp256k1ECC.NAME, 0, '0'];
        const slip10Ed25519 = [eccs_1.SLIP10Ed25519ECC.NAME, 1, '1'];
        const slip10Nist256p1 = [eccs_1.SLIP10Nist256p1ECC.NAME, 2, '2'];
        const kholawEd25519 = [eccs_1.KholawEd25519ECC.NAME, 3, '3'];
        const slip10Ed25519Blake2b = [eccs_1.SLIP10Ed25519Blake2bECC.NAME, 4, '4'];
        const slip10Ed25519Monero = [eccs_1.SLIP10Ed25519MoneroECC.NAME, 5, '5'];
        const exceptedECC = [
            ...slip10Secp256k1, ...slip10Ed25519, ...slip10Nist256p1,
            ...kholawEd25519, ...slip10Ed25519Blake2b, ...slip10Ed25519Monero
        ];
        if (!exceptedECC.includes(curve)) {
            throw new exceptions_1.DerivationError(`Bad ${this.getName()} ECC index`, {
                expected: exceptedECC, got: curve
            });
        }
        if (slip10Secp256k1.includes(curve))
            return nameOnly ? eccs_1.SLIP10Secp256k1ECC.NAME : 0;
        if (slip10Ed25519.includes(curve))
            return nameOnly ? eccs_1.SLIP10Ed25519ECC.NAME : 1;
        if (slip10Nist256p1.includes(curve))
            return nameOnly ? eccs_1.SLIP10Nist256p1ECC.NAME : 2;
        if (kholawEd25519.includes(curve))
            return nameOnly ? eccs_1.KholawEd25519ECC.NAME : 3;
        if (slip10Ed25519Blake2b.includes(curve))
            return nameOnly ? eccs_1.SLIP10Ed25519Blake2bECC.NAME : 4;
        if (slip10Ed25519Monero.includes(curve))
            return nameOnly ? eccs_1.SLIP10Ed25519MoneroECC.NAME : 5;
    }
    updateDerivation() {
        const [path, indexes, derivations] = (0, utils_1.normalizeDerivation)(`m/${(0, utils_1.indexTupleToString)(this.account)}/` +
            `${(0, utils_1.indexTupleToString)(this.ecc)}/` +
            `${(0, utils_1.indexTupleToString)(this.address)}`);
        this.derivations = derivations;
        this.indexes = indexes;
        this.path = path;
    }
    /**
     * Set a new account index.
     * @param account - The new account index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromAccount(account) {
        this.account = (0, utils_1.normalizeIndex)(account, true);
        this.updateDerivation();
        return this;
    }
    /**
     * Set a new ECC type.
     * @param ecc - ECC name, index, or EllipticCurveCryptography instance.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromECC(ecc) {
        this.ecc = (0, utils_1.normalizeIndex)(this.getECCValue(ecc), false);
        this.updateDerivation();
        return this;
    }
    /**
     * Set a new address index.
     * @param address - The new address index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromAddress(address) {
        this.address = (0, utils_1.normalizeIndex)(address, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Reset the derivation to default values.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    clean() {
        this.account = (0, utils_1.normalizeIndex)(0, true);
        this.ecc = (0, utils_1.normalizeIndex)(this.getECCValue(eccs_1.SLIP10Secp256k1ECC), false);
        this.address = (0, utils_1.normalizeIndex)(0, false);
        this.updateDerivation();
        return this;
    }
    /**
     * Get the account index.
     * @returns {number} - The account index.
     */
    getAccount() {
        return this.account.length === 3 ? this.account[1] : this.account[0];
    }
    /**
     * Get the ECC type used.
     * @param nameOnly - If true, returns the ECC name; otherwise returns numeric index.
     * @returns {string|number} - ECC name or numeric index.
     */
    getECC(nameOnly = true) {
        return this.getECCValue(this.ecc[0], nameOnly);
    }
    /**
     * Get the address index.
     * @returns {number} - The address index.
     */
    getAddress() {
        return this.address.length === 3 ? this.address[1] : this.address[0];
    }
}
exports.HDWDerivation = HDWDerivation;
//# sourceMappingURL=hdw.js.map