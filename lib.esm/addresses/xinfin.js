// SPDX-License-Identifier: MIT
import { EthereumAddress } from './ethereum';
import { XinFin } from '../cryptocurrencies';
/**
 * Class representing a XinFin blockchain address.
 * Inherits from EthereumAddress since XinFin uses Ethereum-compatible addresses (hexadecimal with "0x" prefix).
 * Provides XinFin-specific address prefix for encoding and decoding.
 */
export class XinFinAddress extends EthereumAddress {
    static addressPrefix = XinFin.PARAMS.ADDRESS_PREFIX;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "XinFin".
     */
    static getName() {
        return 'XinFin';
    }
}
//# sourceMappingURL=xinfin.js.map