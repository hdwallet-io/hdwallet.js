import { PublicKey } from '../../../public-key';
import { SLIP10Ed25519PrivateKey } from '../../ed25519';
/**
 * Represents a private key for the SLIP10 Ed25519 Monero curve.
 * @extends SLIP10Ed25519PrivateKey
 */
export declare class SLIP10Ed25519MoneroPrivateKey extends SLIP10Ed25519PrivateKey {
    /**
     * Get the name of the curve.
     * @returns {string} Curve name
     */
    getName(): string;
    /**
     * Derive the corresponding public key from this private key.
     * @returns {PublicKey} The derived public key
     */
    getPublicKey(): PublicKey;
}
//# sourceMappingURL=private-key.d.ts.map