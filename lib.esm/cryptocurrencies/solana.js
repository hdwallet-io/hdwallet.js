// SPDX-License-Identifier: MIT
import { CoinTypes } from '../slip44';
import { SLIP10Ed25519ECC } from '../eccs';
import { Info, Entropies, Mnemonics, Seeds, HDs, Addresses, Networks, Params, XPrivateKeyVersions, XPublicKeyVersions } from '../consts';
import { Cryptocurrency, Network } from './cryptocurrency';
export class Mainnet extends Network {
    static NAME = 'mainnet';
    static XPRIVATE_KEY_VERSIONS = new XPrivateKeyVersions({
        P2PKH: 0x0488ade4
    });
    static XPUBLIC_KEY_VERSIONS = new XPublicKeyVersions({
        P2PKH: 0x0488b21e
    });
}
export class Solana extends Cryptocurrency {
    static NAME = 'Solana';
    static SYMBOL = 'SOL';
    static INFO = new Info({
        SOURCE_CODE: 'https://github.com/solana-labs/solana',
        WHITEPAPER: 'https://solana.com/solana-whitepaper.pdf',
        WEBSITES: [
            'https://solana.com'
        ]
    });
    static ECC = SLIP10Ed25519ECC;
    static COIN_TYPE = CoinTypes.Solana;
    static SUPPORT_BIP38 = false;
    static NETWORKS = new Networks({
        MAINNET: Mainnet
    });
    static DEFAULT_NETWORK = Solana.NETWORKS.MAINNET;
    static ENTROPIES = new Entropies([
        'BIP39'
    ]);
    static MNEMONICS = new Mnemonics([
        'BIP39'
    ]);
    static SEEDS = new Seeds([
        'BIP39'
    ]);
    static HDS = new HDs([
        'BIP32',
        'BIP44'
    ]);
    static DEFAULT_HD = Solana.HDS.BIP44;
    static DEFAULT_PATH = `m/44'/${Solana.COIN_TYPE}'/0'/0'`;
    static ADDRESSES = new Addresses({
        SOLANA: 'Solana'
    });
    static DEFAULT_ADDRESS = Solana.ADDRESSES.SOLANA;
    static SEMANTICS = ['p2pkh'];
    static DEFAULT_SEMANTIC = 'p2pkh';
    static PARAMS = new Params({
        ALPHABET: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    });
}
//# sourceMappingURL=solana.js.map