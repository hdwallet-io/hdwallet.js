import { Point } from '../../point';
export declare class SLIP10Ed25519Point extends Point {
    getName(): string;
    static fromBytes(point: Uint8Array): Point;
    static fromCoordinates(x: bigint, y: bigint): Point;
    getUnderlyingObject(): any;
    getX(): bigint;
    getY(): bigint;
    getRawEncoded(): Uint8Array;
    getRawDecoded(): Uint8Array;
    add(point: Point): Point;
    multiply(scalar: bigint): Point;
}
//# sourceMappingURL=point.d.ts.map