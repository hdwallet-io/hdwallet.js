"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLIP10Ed25519Blake2bPoint = void 0;
const point_1 = require("../point");
/**
 * Represents a point on the SLIP10-Ed25519-Blake2b elliptic curve.
 * @extends SLIP10Ed25519Point
 */
class SLIP10Ed25519Blake2bPoint extends point_1.SLIP10Ed25519Point {
    /**
     * Returns the name of the elliptic curve point.
     * @returns {string} The curve name.
     */
    getName() {
        return 'SLIP10-Ed25519-Blake2b';
    }
}
exports.SLIP10Ed25519Blake2bPoint = SLIP10Ed25519Blake2bPoint;
//# sourceMappingURL=point.js.map