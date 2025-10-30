"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.RippleAddress = void 0;
const p2pkh_1 = require("./p2pkh");
const cryptocurrencies_1 = require("../cryptocurrencies");
/**
 * Class representing a Ripple (XRP) address.
 * Extends P2PKHAddress since Ripple addresses are derived from a public key hash
 * and use the Base58Check encoding with a specific alphabet.
 */
class RippleAddress extends p2pkh_1.P2PKHAddress {
    static alphabet = cryptocurrencies_1.Ripple.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Ripple").
     */
    static getName() {
        return 'Ripple';
    }
}
exports.RippleAddress = RippleAddress;
//# sourceMappingURL=ripple.js.map