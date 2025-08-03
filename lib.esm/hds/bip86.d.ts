import { BIP86Derivation } from '../derivations';
import { BIP44HD } from './bip44';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
export declare class BIP86HD extends BIP44HD {
    constructor(options?: HDOptionsInterface);
    static getName(): string;
    fromDerivation(derivation: BIP86Derivation): this;
    getRootXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getRootXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getXPrivateKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getXPublicKey(version?: Uint8Array | number, encoded?: boolean): string | null;
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip86.d.ts.map