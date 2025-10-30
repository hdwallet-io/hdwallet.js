// SPDX-License-Identifier: MIT
import { SLIP10Ed25519Point } from '../../slip10';
/**
 * @class KholawEd25519Point
 * @extends SLIP10Ed25519Point
 */
export class KholawEd25519Point extends SLIP10Ed25519Point {
    /**
     * @returns {string} The curve name identifier.
     */
    getName() {
        return 'Kholaw-Ed25519';
    }
}
//# sourceMappingURL=point.js.map