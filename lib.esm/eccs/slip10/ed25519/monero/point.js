// SPDX-License-Identifier: MIT
import { SLIP10Ed25519Point } from '../point';
/**
 * Represents a point on the SLIP10 Ed25519 Monero elliptic curve.
 * @extends SLIP10Ed25519Point
 */
export class SLIP10Ed25519MoneroPoint extends SLIP10Ed25519Point {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName() {
        return 'SLIP10-Ed25519-Monero';
    }
}
//# sourceMappingURL=point.js.map