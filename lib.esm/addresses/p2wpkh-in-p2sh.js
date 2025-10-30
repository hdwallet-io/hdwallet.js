// SPDX-License-Identifier: MIT
import { checkEncode } from '../libs/base58';
import { PUBLIC_KEY_TYPES } from '../consts';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { hash160 } from '../crypto';
import { getBytes, integerToBytes, bytesToString, concatBytes, ensureString } from '../utils';
import { P2SHAddress } from './p2sh';
/**
 * Class representing a P2WPKH-in-P2SH (Pay-to-Witness-Public-Key-Hash nested in P2SH) Bitcoin address.
 * Inherits from P2SHAddress and overrides the encoding method to implement P2WPKH redemption.
 */
export class P2WPKHInP2SHAddress extends P2SHAddress {
    /**
     * Returns the display name of this address type.
     * @returns {string} Name of the address type ("P2WPKH-In-P2SH").
     */
    static getName() {
        return 'P2WPKH-In-P2SH';
    }
    /**
     * Encodes a public key into a P2WPKH-in-P2SH address.
     * This involves hashing the public key (RIPEMD160(SHA256(pubKey))),
     * building the redeem script for P2WPKH, and then hashing it to get the P2SH address.
     *
     * @param {Uint8Array | string | PublicKey} publicKey - Public key to encode.
     * @param {AddressOptionsInterface} options - Optional parameters including script prefix, public key type, and alphabet.
     * @returns {string} Base58 encoded P2WPKH-in-P2SH address.
     */
    static encode(publicKey, options = {
        scriptAddressPrefix: this.scriptAddressPrefix,
        publicKeyType: PUBLIC_KEY_TYPES.COMPRESSED,
        alphabet: this.alphabet
    }) {
        const prefixValue = options.scriptAddressPrefix ?? this.scriptAddressPrefix;
        const prefixBytes = integerToBytes(prefixValue);
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const rawPubBytes = options.publicKeyType === PUBLIC_KEY_TYPES.UNCOMPRESSED
            ? pk.getRawUncompressed() : pk.getRawCompressed();
        const pubKeyHash = hash160(rawPubBytes);
        const redeemScript = getBytes('0014' + bytesToString(pubKeyHash));
        const scriptHash = hash160(redeemScript);
        const alphabet = options.alphabet ?? this.alphabet;
        return ensureString(checkEncode(concatBytes(prefixBytes, scriptHash), alphabet));
    }
}
//# sourceMappingURL=p2wpkh-in-p2sh.js.map