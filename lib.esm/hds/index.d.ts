import { HD } from './hd';
import { AlgorandHD } from './algorand';
import { BIP32HD } from './bip32';
import { BIP44HD } from './bip44';
import { BIP49HD } from './bip49';
import { BIP84HD } from './bip84';
import { BIP141HD } from './bip141';
import { BIP86HD } from './bip86';
import { CardanoHD } from './cardano';
import { ElectrumV1HD } from './electrum/v1';
import { ElectrumV2HD } from './electrum/v2';
import { MoneroHD } from './monero';
/**
 * Manages and retrieves supported HD wallet classes for multiple blockchain protocols.
 */
export declare class HDS {
    private static dictionary;
    /**
     * Returns all registered HD wallet names.
     * @returns {string[]} An array of HD wallet names.
     */
    static getNames(): string[];
    /**
     * Returns all registered HD wallet classes.
     * @returns {typeof HD[]} An array of HD wallet class constructors.
     */
    static getClasses(): typeof HD[];
    /**
     * Retrieves a specific HD wallet class by name.
     * @param {string} name - The HD wallet name to look up.
     * @returns {typeof HD} The corresponding HD wallet class.
     * @throws {BaseError} If the provided name is not a valid HD class.
     */
    static getHDClass(name: string): typeof HD;
    /**
     * Checks whether the provided name corresponds to a valid HD wallet class.
     * @param {string} name - The HD wallet name to validate.
     * @returns {boolean} True if the name exists in the dictionary, otherwise false.
     */
    static isHD(name: string): boolean;
}
export { HD, AlgorandHD, BIP32HD, BIP44HD, BIP49HD, BIP84HD, BIP86HD, BIP141HD, CardanoHD, ElectrumV1HD, ElectrumV2HD, MoneroHD };
//# sourceMappingURL=index.d.ts.map