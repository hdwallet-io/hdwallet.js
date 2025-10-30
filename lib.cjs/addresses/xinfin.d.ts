import { EthereumAddress } from './ethereum';
import { Address } from './address';
/**
 * Class representing a XinFin blockchain address.
 * Inherits from EthereumAddress since XinFin uses Ethereum-compatible addresses (hexadecimal with "0x" prefix).
 * Provides XinFin-specific address prefix for encoding and decoding.
 */
export declare class XinFinAddress extends EthereumAddress implements Address {
    static addressPrefix: string;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "XinFin".
     */
    static getName(): string;
}
//# sourceMappingURL=xinfin.d.ts.map