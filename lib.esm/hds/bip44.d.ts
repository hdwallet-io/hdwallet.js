import { BIP44Derivation } from '../derivations';
import { BIP32HD } from './bip32';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
/**
 * Implements the BIP44 hierarchical deterministic (HD) wallet standard.
 * Extends BIP32HD to provide multi-account, multi-coin, and change/address-level derivations.
 * Provides methods to derive keys and generate P2PKH addresses according to BIP44.
 *
 */
export declare class BIP44HD extends BIP32HD {
    protected coinType: number;
    /**
     * Create a new BIP44HD instance with optional configuration.
     * @param options Configuration options for HD wallet
     * @param options.publicKeyType Type of public key (compressed/uncompressed)
     * @param options.coinType Coin type index (default: Bitcoin.COIN_TYPE)
     * @param options.account Account index (default: 0)
     * @param options.change Change chain (0: external, 1: internal, default: external)
     * @param options.address Address index (default: 0)
     */
    constructor(options?: HDOptionsInterface);
    /**
     * Returns the name of this HD implementation.
     * @returns {string} 'BIP44'
     */
    static getName(): string;
    /**
     * Set derivation to a specific coin type.
     * @param coinType Coin type index
     * @returns {this} Current BIP44HD instance
     */
    fromCoinType(coinType: number): this;
    /**
     * Set derivation to a specific account or account range.
     * @param account Single account index or a tuple [start, end]
     * @returns {this} Current BIP44HD instance
     */
    fromAccount(account: number | [number, number]): this;
    /**
     * Set derivation to a specific change chain.
     * @param change Change index or string (0: external, 1: internal)
     * @returns {this} Current BIP44HD instance
     */
    fromChange(change: string | number): this;
    /**
     * Set derivation to a specific address index or range.
     * @param address Single address index or a tuple [start, end]
     * @returns {this} Current BIP44HD instance
     */
    fromAddress(address: number | [number, number]): this;
    /**
     * Apply a full BIP44 derivation path to the HD instance.
     * @param derivation BIP44Derivation instance
     * @returns {this} Current BIP44HD instance
     * @throws {DerivationError} If the derivation type is invalid
     */
    fromDerivation(derivation: BIP44Derivation): this;
    /**
     * Generate a P2PKH cryptocurrency address from the current public key.
     * @param options Address generation options
     * @param options.publicKeyAddressPrefix Prefix for the public key address (default: Bitcoin mainnet)
     * @returns {string} Encoded P2PKH address
     */
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip44.d.ts.map