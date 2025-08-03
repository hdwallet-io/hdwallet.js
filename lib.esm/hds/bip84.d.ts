import { BIP84Derivation } from '../derivations';
import { BIP44HD } from './bip44';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
export declare class BIP84HD extends BIP44HD {
    constructor(options?: HDOptionsInterface);
    static getName(): string;
    fromDerivation(derivation: BIP84Derivation): this;
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip84.d.ts.map