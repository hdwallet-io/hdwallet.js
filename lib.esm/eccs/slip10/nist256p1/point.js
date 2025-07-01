// SPDX-License-Identifier: MIT
import { p256 } from '@noble/curves/p256';
import { bytesToNumberBE } from '@noble/curves/abstract/utils';
import { Point } from '../../point';
import { SLIP10_SECP256K1_CONST } from '../../../consts';
import { getBytes } from '../../../utils';
export class SLIP10Nist256p1Point extends Point {
    getName() {
        return 'SLIP10-Nist256p1';
    }
    static fromBytes(point) {
        try {
            const pt = p256.Point.fromHex(getBytes(point));
            return new SLIP10Nist256p1Point(pt);
        }
        catch {
            if (point.length === SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH * 2) {
                const x = bytesToNumberBE(point.slice(0, SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH));
                const y = bytesToNumberBE(point.slice(SLIP10_SECP256K1_CONST.POINT_COORDINATE_BYTE_LENGTH));
                return SLIP10Nist256p1Point.fromCoordinates(BigInt(x), BigInt(y));
            }
            throw new Error('Invalid point bytes');
        }
    }
    static fromCoordinates(x, y) {
        const pt = new p256.Point(BigInt(x), BigInt(y), 1n);
        return new SLIP10Nist256p1Point(pt);
    }
    getUnderlyingObject() {
        return this.point;
    }
    getX() {
        return this.point.toAffine().x;
    }
    getY() {
        return this.point.toAffine().y;
    }
    getRawEncoded() {
        return this.point.toRawBytes(true);
    }
    getRawDecoded() {
        return this.point.toRawBytes(false).slice(1); // strip leading `0x04`
    }
    add(other) {
        const p = other.getUnderlyingObject();
        return new SLIP10Nist256p1Point(this.point.add(p));
    }
    multiply(scalar) {
        return new SLIP10Nist256p1Point(this.point.multiply(scalar));
    }
}
//# sourceMappingURL=point.js.map