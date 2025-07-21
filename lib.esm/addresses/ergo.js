// SPDX-License-Identifier: MIT
import { encode, decode } from '../libs/base58';
import { SLIP10Secp256k1PublicKey, validateAndGetPublicKey } from '../eccs';
import { Ergo } from '../cryptocurrencies';
import { blake2b256 } from '../crypto';
import { bytesToString, ensureTypeMatch, integerToBytes, getBytes, concatBytes, ensureString, equalBytes, bytesToHex } from '../utils';
import { Address } from './address';
import { AddressError, NetworkError } from '../exceptions';
import { Network } from '../cryptocurrencies/cryptocurrency';
export class ErgoAddress extends Address {
    static checksumLength = Ergo.PARAMS.CHECKSUM_LENGTH;
    static addressType = Ergo.DEFAULT_ADDRESS_TYPE;
    static addressTypes = {
        'p2pkh': Ergo.PARAMS.ADDRESS_TYPES.P2PKH,
        'p2sh': Ergo.PARAMS.ADDRESS_TYPES.P2SH
    };
    static networkType = Ergo.DEFAULT_NETWORK;
    static networkTypes = {
        'mainnet': Ergo.NETWORKS.MAINNET.TYPE,
        'testnet': Ergo.NETWORKS.TESTNET.TYPE
    };
    static getName() {
        return 'Ergo';
    }
    static computeChecksum(data) {
        return blake2b256(data).slice(0, this.checksumLength);
    }
    static encode(publicKey, options = {
        addressType: this.addressType,
        networkType: this.networkType
    }) {
        const network = options.networkType ?? this.networkType;
        const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const networkType = this.networkTypes[networkName];
        if (networkType === undefined) {
            throw new NetworkError('Invalid Ergo network type', {
                expected: Object.keys(this.networkTypes), got: network
            });
        }
        const addressType = this.addressTypes[options.addressType ?? this.addressType];
        if (addressType === undefined) {
            throw new AddressError('Invalid Ergo address type', {
                expected: Object.keys(this.addressTypes), got: options.addressType
            });
        }
        const pk = validateAndGetPublicKey(publicKey, SLIP10Secp256k1PublicKey);
        const prefix = integerToBytes(addressType + networkType);
        const addressPayload = concatBytes(prefix, pk.getRawCompressed());
        const checksum = this.computeChecksum(addressPayload);
        return ensureString(encode(concatBytes(addressPayload, checksum)));
    }
    static decode(address, options = {
        addressType: this.addressType,
        networkType: this.networkType
    }) {
        const network = options.networkType ?? this.networkType;
        const resolvedNetwork = ensureTypeMatch(network, Network, { otherTypes: ['string'] });
        const networkName = resolvedNetwork.isValid ? resolvedNetwork.value.NAME : network;
        const networkType = this.networkTypes[networkName];
        if (networkType === undefined) {
            throw new NetworkError('Invalid Ergo network type', {
                expected: Object.keys(this.networkTypes), got: options.networkType
            });
        }
        const addressType = this.addressTypes[options.addressType ?? this.addressType];
        if (addressType === undefined) {
            throw new AddressError('Invalid Ergo address type', {
                expected: Object.keys(this.addressTypes), got: options.addressType
            });
        }
        const prefix = getBytes(integerToBytes(addressType + networkType));
        const decoded = decode(address);
        const expectedLength = SLIP10Secp256k1PublicKey.getCompressedLength() + this.checksumLength + prefix.length;
        if (decoded.length !== expectedLength) {
            throw new AddressError('Invalid length', {
                expected: expectedLength, got: decoded.length
            });
        }
        const checksum = decoded.slice(-this.checksumLength);
        const payload = decoded.slice(0, -this.checksumLength);
        const checksumExpected = this.computeChecksum(payload);
        if (!equalBytes(checksum, checksumExpected)) {
            throw new AddressError('Invalid checksum', {
                expected: bytesToHex(checksumExpected), got: bytesToHex(checksum)
            });
        }
        const prefixGot = payload.slice(0, prefix.length);
        if (!equalBytes(prefix, prefixGot)) {
            throw new AddressError('Invalid prefix', {
                expected: bytesToHex(prefix), got: bytesToHex(prefixGot)
            });
        }
        const pubKey = payload.slice(prefix.length);
        if (!SLIP10Secp256k1PublicKey.isValidBytes(pubKey)) {
            throw new AddressError('Invalid public key', {
                got: bytesToHex(pubKey)
            });
        }
        return bytesToString(pubKey);
    }
}
//# sourceMappingURL=ergo.js.map