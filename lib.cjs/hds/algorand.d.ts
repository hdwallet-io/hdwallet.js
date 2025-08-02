import { Seed } from '../seeds';
import { BIP32HD } from './bip32';
export declare class AlgorandHD extends BIP32HD {
    constructor();
    static getName(): string;
    fromSeed(seed: string | Uint8Array | Seed): this;
    drive(index: number): this;
    getRootXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    getXPrivateKey(version?: number | Uint8Array, encoded?: boolean): string | null;
    getAddress(): string;
}
//# sourceMappingURL=algorand.d.ts.map