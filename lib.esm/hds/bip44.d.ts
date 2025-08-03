import { BIP44Derivation } from '../derivations';
import { BIP32HD } from './bip32';
import { HDAddressOptionsInterface, HDOptionsInterface } from '../interfaces';
export declare class BIP44HD extends BIP32HD {
    protected coinType: number;
    constructor(options?: HDOptionsInterface);
    static getName(): string;
    fromCoinType(coinType: number): this;
    fromAccount(account: number | [number, number]): this;
    fromChange(change: string | number): this;
    fromAddress(address: number | [number, number]): this;
    fromDerivation(derivation: BIP44Derivation): this;
    getAddress(options?: HDAddressOptionsInterface): string;
}
//# sourceMappingURL=bip44.d.ts.map