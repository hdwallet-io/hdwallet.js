import { Entropy } from './entropies';
import { Mnemonic } from './mnemonics';
import { Seed } from './seeds';
import { Cryptocurrency } from './cryptocurrencies/cryptocurrency';
import { HDWalletAddressOptionsInterface, HDWalletOptionsInterface } from './interfaces';
import { Derivation } from './derivations';
/**
 * HDWallet class for managing hierarchical deterministic wallets.
 */
export declare class HDWallet {
    private ecc;
    private cryptocurrency;
    private network;
    private address;
    private hd;
    private addressType?;
    private addressPrefix?;
    private entropy?;
    private language;
    private passphrase;
    private mnemonic?;
    private seed?;
    derivation?: Derivation;
    private semantic?;
    private mode?;
    private mnemonicType?;
    private publicKeyType?;
    private cardanoType?;
    private useDefaultPath;
    private checksum;
    private stakingPublicKey?;
    private paymentID?;
    /**
     * Creates an HDWallet instance.
     * @param cryptocurrency - The cryptocurrency class to use.
     * @param options - Optional wallet settings.
     */
    constructor(cryptocurrency: typeof Cryptocurrency, options?: HDWalletOptionsInterface);
    /**
     * Initialize wallet from entropy.
     * @param entropy - The entropy instance.
     * @returns The current HDWallet instance.
     */
    fromEntropy(entropy: Entropy): HDWallet;
    /**
     * Initialize wallet from a mnemonic.
     * @param mnemonic - The mnemonic instance.
     * @returns The current HDWallet instance.
     */
    fromMnemonic(mnemonic: Mnemonic): HDWallet;
    /**
     * Initialize wallet from a seed.
     * @param seed - The seed instance.
     * @returns The current HDWallet instance.
     */
    fromSeed(seed: Seed): HDWallet;
    /**
     * Initialize wallet from an extended private key.
     * @param xprivateKey - The extended private key string.
     * @param encoded - Whether the key is encoded (default: true).
     * @param strict - Whether to use strict mode (default: false).
     * @returns The current HDWallet instance.
     */
    fromXPrivateKey(xprivateKey: string, encoded?: boolean, strict?: boolean): HDWallet;
    /**
     * Initialize wallet from an extended public key.
     * @param xpublicKey - The extended public key string.
     * @param encoded - Whether the key is encoded (default: true).
     * @param strict - Whether to use strict mode (default: false).
     * @returns The current HDWallet instance.
     */
    fromXPublicKey(xpublicKey: string, encoded?: boolean, strict?: boolean): HDWallet;
    /**
     * Initialize wallet from a derivation.
     * @param derivation - The derivation instance.
     * @returns The current HDWallet instance.
     */
    fromDerivation(derivation: Derivation): HDWallet;
    /**
     * Update the wallet's derivation.
     * @param derivation - The derivation instance.
     * @returns The current HDWallet instance.
     */
    updateDerivation(derivation: Derivation): HDWallet;
    /**
     * Clears the derivation.
     * @returns The current HDWallet instance.
     */
    cleanDerivation(): HDWallet;
    /**
     * Initialize wallet from a private key.
     * @param privateKey - The private key string.
     * @returns The current HDWallet instance.
     */
    fromPrivateKey(privateKey: string): HDWallet;
    /**
     * Initialize wallet from a WIF key.
     * @param wif - The WIF string.
     * @returns The current HDWallet instance.
     */
    fromWIF(wif: string): HDWallet;
    /**
     * Initialize wallet from a public key.
     * @param publicKey - The public key string.
     * @returns The current HDWallet instance.
     */
    fromPublicKey(publicKey: string): HDWallet;
    /**
     * Initialize wallet from Monero spend private key.
     * @param spendPrivateKey - The spend private key string.
     * @returns The current HDWallet instance.
     */
    fromSpendPrivateKey(spendPrivateKey: string): HDWallet;
    /**
     * Initialize wallet from Monero watch-only keys.
     * @param viewPrivateKey - The view private key string.
     * @param spendPublicKey - The spend public key string.
     * @returns The current HDWallet instance.
     */
    fromWatchOnly(viewPrivateKey: string, spendPublicKey: string): HDWallet;
    /**
     * Get the cryptocurrency name.
     * @returns Cryptocurrency name string.
     */
    getCryptocurrency(): string;
    /**
     * Get the cryptocurrency symbol.
     * @returns Cryptocurrency symbol string.
     */
    getSymbol(): string;
    /**
     * Get the coin type.
     * @returns Coin type number.
     */
    getCoinType(): number;
    /**
     * Get network name.
     * @returns Network name string.
     */
    getNetwork(): string;
    /**
     * Get entropy value.
     * @returns Entropy as a string or null.
     */
    getEntropy(): string | null;
    /**
     * Get entropy strength.
     * @returns Entropy strength in bits or null.
     */
    getStrength(): number | null;
    /**
     * Get the mnemonic string.
     * @returns Mnemonic string or null.
     */
    getMnemonic(): string | null;
    /**
     * Get mnemonic type.
     * @returns Mnemonic type string or null.
     */
    getMnemonicType(): string | null;
    /**
     * Get language of mnemonic.
     * @returns Language string or null.
     */
    getLanguage(): string | null;
    /**
     * Get number of words in mnemonic.
     * @returns Word count or null.
     */
    getWords(): number | null;
    /**
     * Get wallet passphrase.
     * @returns Passphrase string or null.
     */
    getPassphrase(): string | null;
    /**
     * Get wallet seed.
     * @returns Seed string or null.
     */
    getSeed(): string | null;
    /**
     * Get the ECC algorithm name.
     * @returns ECC algorithm string.
     */
    getECC(): string;
    /**
     * Get HD type name.
     * @returns HD type string.
     */
    getHD(): string;
    /**
     * Get semantic type.
     * @returns Semantic string or null.
     */
    getSemantic(): string | null;
    /**
     * Get Cardano type.
     * @returns Cardano type string or null.
     */
    getCardanoType(): string | null;
    /**
     * Get mode (Electrum-V2 only).
     * @returns Mode string.
     */
    getMode(): string;
    /**
     * Get path key.
     * @returns Path key string or null.
     */
    getPathKey(): string | null;
    /**
     * Get the root extended private key (xprv) for the wallet.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Root xprv string or null if unsupported.
     */
    getRootXPrivateKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Get the root extended public key (xpub) for the wallet.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Root xpub string or null if unsupported.
     */
    getRootXPublicKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Alias for getRootXPrivateKey.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Master xprv string or null.
     */
    getMasterXPrivateKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Alias for getRootXPublicKey.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return the encoded key (default: true).
     * @returns Master xpub string or null.
     */
    getMasterXPublicKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Get the root private key.
     * @returns Root private key string or null.
     */
    getRootPrivateKey(): string | null;
    /**
     * Get the root WIF (Wallet Import Format) key.
     * @param wifType - Optional WIF type.
     * @returns WIF string or null if unsupported.
     */
    getRootWIF(wifType?: string): string | null;
    /**
     * Get the root chain code.
     * @returns Root chain code string.
     */
    getRootChainCode(): string | null;
    /**
     * Get the root public key.
     * @param publicKeyType - Optional public key type.
     * @returns Root public key string.
     */
    getRootPublicKey(publicKeyType?: string): string | null;
    /**
     * Get the master private key.
     * @returns Master private key string or null.
     */
    getMasterPrivateKey(): string | null;
    /**
     * Get the master WIF key.
     * @param wifType - Optional WIF type.
     * @returns Master WIF string or null.
     */
    getMasterWIF(wifType?: string): string | null;
    /**
     * Get the master chain code.
     * @returns Master chain code string.
     */
    getMasterChainCode(): string | null;
    /**
     * Get the master public key.
     * @param publicKeyType - Optional public key type.
     * @returns Master public key string.
     */
    getMasterPublicKey(publicKeyType?: string): string | null;
    /**
     * Get coin-specific extended private key.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return encoded key (default: true).
     * @returns Extended private key string or null.
     */
    getXPrivateKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Get coin-specific extended public key.
     * @param semantic - Optional semantic version.
     * @param encoded - Whether to return encoded key (default: true).
     * @returns Extended public key string or null.
     */
    getXPublicKey(semantic?: string, encoded?: boolean): string | null;
    /**
     * Get the standard private key.
     * @returns Private key string or null.
     */
    getPrivateKey(): string | null;
    /**
     * Get the Monero spend private key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero spend private key string.
     */
    getSpendPrivateKey(): string | null;
    /**
     * Get the Monero view private key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero view private key string.
     */
    getViewPrivateKey(): string;
    /**
     * Get the standard WIF key.
     * @param wifType - Optional WIF type.
     * @returns WIF string or null.
     */
    getWIF(wifType?: string): string | null;
    /**
     * Get the WIF type.
     * @returns WIF type string or null.
     */
    getWIFType(): string | null;
    /**
     * Get the chain code.
     * @returns Chain code string.
     */
    getChainCode(): string | null;
    /**
     * Get the standard public key.
     * @param publicKeyType - Optional public key type.
     * @returns Public key string.
     */
    getPublicKey(publicKeyType?: string): string;
    /**
     * Get the public key type.
     * @returns Public key type string.
     */
    getPublicKeyType(): string;
    /**
     * Get the uncompressed public key.
     * @returns Uncompressed public key string.
     */
    getUncompressed(): string;
    /**
     * Get the compressed public key.
     * @returns Compressed public key string.
     */
    getCompressed(): string;
    /**
     * Get the Monero spend public key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero spend public key string.
     */
    getSpendPublicKey(): string;
    /**
     * Get the Monero view public key.
     * @throws Error if called for non-Monero HD type.
     * @returns Monero view public key string.
     */
    getViewPublicKey(): string;
    /**
     * Get key hash.
     * @returns Key hash string.
     */
    getHash(): string;
    /**
     * Get key depth.
     * @returns Depth number.
     */
    getDepth(): number;
    /**
     * Get key fingerprint.
     * @returns Fingerprint string.
     */
    getFingerprint(): string;
    /**
     * Get parent fingerprint.
     * @returns Parent fingerprint string.
     */
    getParentFingerprint(): string;
    /**
     * Get derivation path.
     * @returns Path string.
     */
    getPath(): string;
    /**
     * Get last index in derivation path.
     * @returns Index number.
     */
    getIndex(): number;
    /**
     * Get all indexes in derivation path.
     * @returns Array of index numbers.
     */
    getIndexes(): number[];
    /**
     * Get strict derivation setting.
     * @returns Boolean or null if unsupported.
     */
    getStrict(): boolean | null;
    /**
     * Get the Monero primary address.
     * @returns Address string or null.
     */
    getPrimaryAddress(): string | null;
    /**
     * Get Monero integrated address.
     * @param paymentID - Optional payment ID.
     * @returns Integrated address string or null.
     */
    getIntegratedAddress(paymentID?: string): string | null;
    /**
     * Get Monero subaddress.
     * @param minor - Optional minor index.
     * @param major - Optional major index.
     * @returns Subaddress string or null.
     */
    getSubAddress(minor?: number, major?: number): string | null;
    /**
     * Get wallet address.
     * @param options - Optional address settings.
     * @returns Address string or null.
     */
    getAddress(options?: HDWalletAddressOptionsInterface): string | null;
    /**
     * Get full dump of wallet data.
     * @param exclude - List of keys to exclude.
     * @returns Object containing wallet data.
     */
    getDump(exclude?: string[]): Record<string, any>;
    /**
     * Get dumps for derivation ranges.
     * @param exclude - List of keys to exclude.
     * @returns Array of wallet data objects or null.
     */
    getDumps(exclude?: string[]): any;
}
//# sourceMappingURL=hdwallet.d.ts.map