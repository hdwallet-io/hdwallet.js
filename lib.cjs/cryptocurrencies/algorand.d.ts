import { KholawEd25519ECC } from '../eccs';
import { Info, Entropies, Mnemonics, Seeds, HDs, Addresses, Networks, Params, XPrivateKeyVersions, XPublicKeyVersions } from '../consts';
import { Cryptocurrency, Network } from './cryptocurrency';
export declare class Mainnet extends Network {
    static NAME: string;
    static XPRIVATE_KEY_VERSIONS: XPrivateKeyVersions;
    static XPUBLIC_KEY_VERSIONS: XPublicKeyVersions;
}
export declare class Algorand extends Cryptocurrency {
    static NAME: string;
    static SYMBOL: string;
    static INFO: Info;
    static ECC: typeof KholawEd25519ECC;
    static COIN_TYPE: number;
    static SUPPORT_BIP38: boolean;
    static NETWORKS: Networks;
    static DEFAULT_NETWORK: any;
    static ENTROPIES: Entropies;
    static MNEMONICS: Mnemonics;
    static SEEDS: Seeds;
    static HDS: HDs;
    static DEFAULT_HD: any;
    static DEFAULT_PATH: string;
    static ADDRESSES: Addresses;
    static DEFAULT_ADDRESS: any;
    static SEMANTICS: string[];
    static DEFAULT_SEMANTIC: string;
    static PARAMS: Params;
}
//# sourceMappingURL=algorand.d.ts.map