import { Point } from '../../point';
export declare class SLIP10Nist256p1Point extends Point {
    getName(): string;
    static fromBytes(point: Uint8Array): Point;
    static fromCoordinates(x: bigint, y: bigint): Point;
    getUnderlyingObject(): any;
    getX(): bigint;
    getY(): bigint;
    getRawEncoded(): Uint8Array;
    getRawDecoded(): Uint8Array;
    add(other: Point): SLIP10Nist256p1Point;
    multiply(scalar: bigint): SLIP10Nist256p1Point;
}
//# sourceMappingURL=point.d.ts.map