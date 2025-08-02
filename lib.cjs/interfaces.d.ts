import { IndexType } from './types';
export interface ErrorOptionsInterface {
    expected?: any;
    got?: any;
    detail?: string;
}
export interface OptionsPrivateKey {
    extendedKey?: Uint8Array;
}
export interface MnemonicOptionsInterface {
    checksum?: boolean;
    mnemonicType?: string;
    maxAttempts?: bigint;
    wordLists?: Record<string, string[]>;
    wordsList?: string[];
    wordsListWithIndex?: Record<string, number>;
    bip39List?: string[];
    bip39Index?: Record<string, number>;
    ev1List?: string[];
    ev1Index?: Record<string, number>;
}
export interface AlgorandMnemonicWordsInterface {
    TWENTY_FIVE: number;
}
export interface AlgorandMnemonicLanguagesInterface {
    ENGLISH: string;
}
export interface BIP39MnemonicWordsInterface {
    TWELVE: number;
    FIFTEEN: number;
    EIGHTEEN: number;
    TWENTY_ONE: number;
    TWENTY_FOUR: number;
}
export interface BIP39MnemonicLanguagesInterface {
    CHINESE_SIMPLIFIED: string;
    CHINESE_TRADITIONAL: string;
    CZECH: string;
    ENGLISH: string;
    FRENCH: string;
    ITALIAN: string;
    JAPANESE: string;
    KOREAN: string;
    PORTUGUESE: string;
    RUSSIAN: string;
    SPANISH: string;
    TURKISH: string;
}
export interface ElectrumV1MnemonicWordsInterface {
    TWELVE: number;
}
export interface ElectrumV1MnemonicLanguagesInterface {
    ENGLISH: string;
}
export interface ElectrumV2MnemonicWordsInterface {
    TWELVE: number;
    TWENTY_FOUR: number;
}
export interface ElectrumV2MnemonicLanguagesInterface {
    CHINESE_SIMPLIFIED: string;
    ENGLISH: string;
    PORTUGUESE: string;
    SPANISH: string;
}
export interface ElectrumV2MnemonicTypesInterface {
    STANDARD: string;
    SEGWIT: string;
    STANDARD_2FA: string;
    SEGWIT_2FA: string;
}
export interface MoneroMnemonicWordsInterface {
    TWELVE: number;
    THIRTEEN: number;
    TWENTY_FOUR: number;
    TWENTY_FIVE: number;
}
export interface MoneroMnemonicLanguagesInterface {
    CHINESE_SIMPLIFIED: string;
    DUTCH: string;
    ENGLISH: string;
    FRENCH: string;
    GERMAN: string;
    ITALIAN: string;
    JAPANESE: string;
    PORTUGUESE: string;
    RUSSIAN: string;
    SPANISH: string;
}
export interface SeedOptionsInterface {
    passphrase?: string | null;
    cardanoType?: string;
    mnemonicType?: string;
}
export interface DerivationOptionsInterface {
    path?: string;
    indexes?: number[];
    coinType?: IndexType;
    account?: IndexType;
    change?: IndexType;
    address?: IndexType;
    role?: IndexType;
    minor?: IndexType;
    major?: IndexType;
    ecc?: any;
}
export interface HDOptionsInterface {
    ecc?: any;
    network?: any;
    publicKeyType?: string;
    wifPrefix?: number;
    coinType?: number;
    account?: number;
    change?: string;
    address?: number;
    path?: string;
    indexes?: number[];
    semantic?: string;
    cardanoType?: string;
    p2wpkhXPrivateKeyVersion?: number;
    p2wpkhXPublicKeyVersion?: number;
    p2wpkhInP2SHXPrivateKeyVersion?: number;
    p2wpkhInP2SHXPublicKeyVersion?: number;
    p2wshXPrivateKeyVersion?: number;
    p2wshXPublicKeyVersion?: number;
    p2wshInP2SHXPrivateKeyVersion?: number;
    p2wshInP2SHXPublicKeyVersion?: number;
    paymentID?: string;
    mode?: string;
    minor?: number;
    major?: number;
}
export interface HDAddressOptionsInterface {
    address?: string;
    publicKeyAddressPrefix?: number;
    scriptAddressPrefix?: number;
    hrp?: string;
    witnessVersion?: number;
    addressType?: string;
    stakingPublicKey?: any;
    network?: string;
    minor?: number;
    major?: number;
    paymentID?: string;
}
export interface HDWalletAddressOptionsInterface extends HDAddressOptionsInterface {
    versionType?: string;
    addressPrefix?: string;
}
export interface BIP141HDSemanticOptionsInterface {
    p2wpkhXPrivateKeyVersion?: number;
    p2wpkhXPublicKeyVersion?: number;
    p2wpkhInP2SHXPrivateKeyVersion?: number;
    p2wpkhInP2SHXPublicKeyVersion?: number;
    p2wshXPrivateKeyVersion?: number;
    p2wshXPublicKeyVersion?: number;
    p2wshInP2SHXPrivateKeyVersion?: number;
    p2wshInP2SHXPublicKeyVersion?: number;
}
export interface AddressOptionsInterface {
    hrp?: string;
    addressPrefix?: string;
    addressType?: string;
    networkType?: string;
    publicKeyAddressPrefix?: number;
    scriptAddressPrefix?: number;
    publicKeyType?: string;
    witnessVersion?: number;
    skipChecksumEncode?: boolean;
    alphabet?: string;
    encodeType?: string;
    decodeType?: string;
    path?: string;
    pathKey?: string | Uint8Array;
    chainCode?: string | Uint8Array;
    stakingPublicKey?: any;
    network?: string;
    paymentID?: string;
    addressVersion?: string | Uint8Array;
}
export interface EnsureTypeMatchOptionsInterface {
    strict?: boolean;
    errorClass?: any;
    otherTypes?: any[];
}
export interface HDWalletOptionsInterface {
    ecc?: any;
    hd?: any;
    network?: any;
    address?: any;
    publicKeyType?: string;
    cardanoType?: string;
    mode?: string;
    mnemonicType?: string;
    checksum?: boolean;
    addressType?: string;
    addressPrefix?: string;
    language?: string;
    passphrase?: string | null;
    useDefaultPath?: boolean;
    stakingPublicKey?: string;
    paymentID?: string;
    semantic?: string;
}
//# sourceMappingURL=interfaces.d.ts.map