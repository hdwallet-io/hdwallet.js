// SPDX-License-Identifier: MIT
import { P2PKHAddress } from './p2pkh';
import { Ripple } from '../cryptocurrencies';
/**
 * Class representing a Ripple (XRP) address.
 * Extends P2PKHAddress since Ripple addresses are derived from a public key hash
 * and use the Base58Check encoding with a specific alphabet.
 */
export class RippleAddress extends P2PKHAddress {
    static alphabet = Ripple.PARAMS.ALPHABET;
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("Ripple").
     */
    static getName() {
        return 'Ripple';
    }
}
//# sourceMappingURL=ripple.js.map