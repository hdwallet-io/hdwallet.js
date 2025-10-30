import { Derivation } from './derivation';
import { EllipticCurveCryptography } from '../eccs';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType } from '../types';
/**
 * HDWDerivation implements a generic hierarchical deterministic wallet derivation
 * supporting multiple elliptic curves.
 *
 **/
export declare class HDWDerivation extends Derivation {
    private account;
    private ecc;
    private address;
    /**
     * Constructor to initialize the HDW derivation.
     * @param options - Options including account, ECC type, and address.
     */
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the name of this derivation class.
     * @returns {string} - 'HDW'
     */
    static getName(): string;
    /**
     * Converts an ECC input to a valid internal representation.
     * @param ecc - ECC name, index, or EllipticCurveCryptography instance.
     * @param nameOnly - If true, returns the ECC name instead of numeric index.
     * @returns {number|string} - Numeric index or ECC name.
     * @throws {DerivationError} If the ECC type is invalid.
     */
    protected getECCValue(ecc: IndexType | EllipticCurveCryptography, nameOnly?: boolean): any;
    private updateDerivation;
    /**
     * Set a new account index.
     * @param account - The new account index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromAccount(account: IndexType): this;
    /**
     * Set a new ECC type.
     * @param ecc - ECC name, index, or EllipticCurveCryptography instance.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromECC(ecc: string | number | EllipticCurveCryptography): this;
    /**
     * Set a new address index.
     * @param address - The new address index.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    fromAddress(address: IndexType): this;
    /**
     * Reset the derivation to default values.
     * @returns {this} - Returns the derivation instance for chaining.
     */
    clean(): this;
    /**
     * Get the account index.
     * @returns {number} - The account index.
     */
    getAccount(): number;
    /**
     * Get the ECC type used.
     * @param nameOnly - If true, returns the ECC name; otherwise returns numeric index.
     * @returns {string|number} - ECC name or numeric index.
     */
    getECC(nameOnly?: boolean): string;
    /**
     * Get the address index.
     * @returns {number} - The address index.
     */
    getAddress(): number;
}
//# sourceMappingURL=hdw.d.ts.map