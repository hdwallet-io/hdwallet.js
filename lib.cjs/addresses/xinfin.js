"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.XinFinAddress = void 0;
const ethereum_1 = require("./ethereum");
const cryptocurrencies_1 = require("../cryptocurrencies");
/**
 * Class representing a XinFin blockchain address.
 * Inherits from EthereumAddress since XinFin uses Ethereum-compatible addresses (hexadecimal with "0x" prefix).
 * Provides XinFin-specific address prefix for encoding and decoding.
 */
class XinFinAddress extends ethereum_1.EthereumAddress {
    static addressPrefix = cryptocurrencies_1.XinFin.PARAMS.ADDRESS_PREFIX;
    /**
     * Returns the display name of this address type.
     * @returns {string} The string "XinFin".
     */
    static getName() {
        return 'XinFin';
    }
}
exports.XinFinAddress = XinFinAddress;
//# sourceMappingURL=xinfin.js.map