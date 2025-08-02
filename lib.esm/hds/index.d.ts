import { HD } from './hd';
import { AlgorandHD } from './algorand';
import { BIP32HD } from './bip32';
import { BIP44HD } from './bip44';
import { BIP49HD } from './bip49';
import { BIP84HD } from './bip84';
import { BIP141HD } from './bip141';
import { BIP86HD } from './bip86';
import { CardanoHD } from './cardano';
import { ElectrumV1HD } from './electrum/v1';
import { ElectrumV2HD } from './electrum/v2';
import { MoneroHD } from './monero';
export declare class HDS {
    private static dictionary;
    static getNames(): string[];
    static getClasses(): typeof HD[];
    static getHDClass(name: string): typeof HD;
    static isHD(name: string): boolean;
}
export { HD, AlgorandHD, BIP32HD, BIP44HD, BIP49HD, BIP84HD, BIP86HD, BIP141HD, CardanoHD, ElectrumV1HD, ElectrumV2HD, MoneroHD };
//# sourceMappingURL=index.d.ts.map