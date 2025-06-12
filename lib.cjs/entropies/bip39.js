"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIP39Entropy = exports.BIP39_ENTROPY_STRENGTHS = void 0;
const entropy_1 = require("./entropy");
exports.BIP39_ENTROPY_STRENGTHS = {
    ONE_HUNDRED_TWENTY_EIGHT: 128,
    ONE_HUNDRED_SIXTY: 160,
    ONE_HUNDRED_NINETY_TWO: 192,
    TWO_HUNDRED_TWENTY_FOUR: 224,
    TWO_HUNDRED_FIFTY_SIX: 256
};
class BIP39Entropy extends entropy_1.Entropy {
    static strengths = [
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT,
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_SIXTY,
        exports.BIP39_ENTROPY_STRENGTHS.ONE_HUNDRED_NINETY_TWO,
        exports.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_TWENTY_FOUR,
        exports.BIP39_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    ];
    static getName() {
        return 'BIP39';
    }
}
exports.BIP39Entropy = BIP39Entropy;
//# sourceMappingURL=bip39.js.map