// SPDX-License-Identifier: MIT

import { CoinTypes } from '../slip44';
import { SLIP10Ed25519ECC } from '../ecc';
import {
  Info,
  Entropies,
  Mnemonics,
  Seeds,
  HDs,
  Addresses,
  Networks,
  Params,
  XPrivateKeyVersions,
  XPublicKeyVersions
} from '../const';
import { Cryptocurrency, Network } from './cryptocurrency';

export class Mainnet extends Network {

  static XPRIVATE_KEY_VERSIONS = new XPrivateKeyVersions({
    P2PKH: 0x0488ade4
  });
  static XPUBLIC_KEY_VERSIONS = new XPublicKeyVersions({
    P2PKH: 0x0488b21e
  });
}

export class Algorand extends Cryptocurrency {

  static NAME = 'Algorand';
  static SYMBOL = 'ALGO';
  static INFO = new Info({
    SOURCE_CODE: 'https://github.com/algorand/go-algorand',
    WHITEPAPER: 'https://www.algorand.com/resources/white-papers',
    WEBSITES: [
      'http://algorand.foundation',
        'https://www.algorand.com'
    ]
  });
  static ECC = SLIP10Ed25519ECC;
  static COIN_TYPE = CoinTypes.Algorand;
  static SUPPORT_BIP38 = false;
  static NETWORKS = new Networks({
    MAINNET: Mainnet
  });
  static DEFAULT_NETWORK = Algorand.NETWORKS.MAINNET;
  static ENTROPIES = new Entropies([
    { ALGORAND: 'Algorand' },
    'BIP39'
  ]);
  static MNEMONICS = new Mnemonics([
    { ALGORAND: 'Algorand' },
    'BIP39'
  ]);
  static SEEDS = new Seeds([
    { ALGORAND: 'Algorand' },
    'BIP39'
  ]);
  static HDS = new HDs([
    'BIP32',
    'BIP44'
  ]);
  static DEFAULT_HD = Algorand.HDS.BIP44;
  static DEFAULT_PATH = `m/44'/${Algorand.COIN_TYPE}'/0'/0/0`;
  static ADDRESSES = new Addresses({
    ALGORAND: 'Algorand'
  });
  static DEFAULT_ADDRESS = Algorand.ADDRESSES.ALGORAND;
  static DEFAULT_SEMANTIC = 'p2pkh';
  static PARAMS = new Params({
    CHECKSUM_LENGTH: 0x04
  });
}
