import { Derivation } from './derivation';
import { DerivationOptionsInterface } from '../interfaces';
import { IndexType } from '../types';
/**
 * Implements Electrum-style derivation for hierarchical deterministic wallets.
 *
 * Electrum derivation paths are simplified as:
 * `m / change / address_index`
 */
export declare class ElectrumDerivation extends Derivation {
    private change;
    private address;
    /**
     * Creates a new Electrum derivation path.
     *
     * @param {DerivationOptionsInterface} [options] - Configuration options.
     * @param {number} [options.change=0] - Change index.
     * @param {number} [options.address=0] - Address index.
     */
    constructor(options?: DerivationOptionsInterface);
    /**
     * Returns the derivation standard name.
     * @returns {string} `'Electrum'`
     */
    static getName(): string;
    private updateDerivation;
    /**
     * Updates the change index and regenerates the derivation path.
     * @param {IndexType} change - Change index.
     * @returns {this} Current instance for chaining.
     */
    fromChange(change: IndexType): this;
    /**
     * Updates the address index and regenerates the derivation path.
     * @param {IndexType} address - Address index.
     * @returns {this} Current instance for chaining.
     */
    fromAddress(address: IndexType): this;
    /**
     * Resets the derivation to change 0 and address 0.
     * @returns {this} Current instance for chaining.
     */
    clean(): this;
    /**
     * Gets the current change index.
     * @returns {number} Change index.
     */
    getChange(): number;
    /**
     * Gets the current address index.
     * @returns {number} Address index.
     */
    getAddress(): number;
}
//# sourceMappingURL=electrum.d.ts.map