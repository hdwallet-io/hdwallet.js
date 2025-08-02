export interface DictionaryInterface {
  [key: string]: any;
}

export interface KeyValuePairInterface {
  key: string;
  value: any;
}

export interface GroupBoxInterface {
  name: string | null;
  color: string;
  flags: {
    warning: string;
    error: string;
  }
  flag: string | null;
}

export interface ComboboxInterface {
  name: string;
  value: any;
}

export interface DonationAddressInterface {
  cryptocurrency: string;
  symbol: string;
  address: string;
  defaultAddress: string;
  addressType?: string;
}

export interface DonationInterface {
  publicKeys: Array<DictionaryInterface>;
  addresses: Array<DonationAddressInterface>;
}

export interface EntropyInterface {
  client: string;
  strength: number;
}

export interface MnemonicInterface {
  client: string;
  language: string;
  from: 'words' | 'entropy';
  words?: number;
  entropy?: string;
  mnemonicType?: string;
}

export interface SeedInterface {
  client: string;
  cardanoType?: string;
  mnemonicType?: string;
  mnemonic: string;
  passphrase?: string;
}

export interface PassphraseInterface {
  length: number;
  numbers: boolean;
  upperCase: boolean;
  lowerCase: boolean;
  characters: boolean;
}

export interface DumpsInterface {
  ecc: string;
  symbol: string;
  network: string;
  hd: string;
  from: string;
  client: string;
  entropy: string;
  mnemonic: string;
  mnemonicType: string;
  language?: string;
  seed: string;
  xprivateKey: string;
  xpublicKey: string;
  strict: boolean;
  privateKey: string;
  wif: string;
  publicKey: string;
  spendPrivateKey: string;
  viewPrivateKey: string;
  spendPublicKey: string;
  derivation: string;
  account: string;
  change: string;
  role: string;
  address: string;
  minor: string;
  major: string;
  path: string;
  publicKeyType: string;
  passphrase: string;
  paymentID: string;
  cardanoType: string;
  addressType: string;
  stakingPublicKey: string;
  mode: string;
  exclude: string;
  include: string;
  bip38: boolean;
  customClient: string;
  semantic: string;
  format: 'json' | 'csv';
  checksum?: boolean;
}
