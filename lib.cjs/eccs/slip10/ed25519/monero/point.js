"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519MoneroPoint = void 0;
const point_1 = require("../point");
/**
 * Represents a point on the SLIP10 Ed25519 Monero elliptic curve.
 * @extends SLIP10Ed25519Point
 */
class SLIP10Ed25519MoneroPoint extends point_1.SLIP10Ed25519Point {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName() {
        return 'SLIP10-Ed25519-Monero';
    }
}
exports.SLIP10Ed25519MoneroPoint = SLIP10Ed25519MoneroPoint;
//# sourceMappingURL=point.js.map