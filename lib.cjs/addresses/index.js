"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearAddress = exports.AptosAddress = exports.SuiAddress = exports.TezosAddress = exports.StellarAddress = exports.SolanaAddress = exports.MultiversXAddress = exports.AlgorandAddress = exports.NeoAddress = exports.NanoAddress = exports.MoneroAddress = exports.CardanoAddress = exports.InjectiveAddress = exports.ZilliqaAddress = exports.HarmonyAddress = exports.OKTChainAddress = exports.IconAddress = exports.ErgoAddress = exports.EOSAddress = exports.AvalancheAddress = exports.FilecoinAddress = exports.RippleAddress = exports.TronAddress = exports.XinFinAddress = exports.CosmosAddress = exports.EthereumAddress = exports.P2WSHInP2SHAddress = exports.P2WSHAddress = exports.P2WPKHInP2SHAddress = exports.P2WPKHAddress = exports.P2TRAddress = exports.P2SHAddress = exports.P2PKHAddress = exports.Address = exports.ADDRESSES = void 0;
const address_1 = require("./address");
Object.defineProperty(exports, "Address", { enumerable: true, get: function () { return address_1.Address; } });
const p2pkh_1 = require("./p2pkh");
Object.defineProperty(exports, "P2PKHAddress", { enumerable: true, get: function () { return p2pkh_1.P2PKHAddress; } });
const p2sh_1 = require("./p2sh");
Object.defineProperty(exports, "P2SHAddress", { enumerable: true, get: function () { return p2sh_1.P2SHAddress; } });
const p2tr_1 = require("./p2tr");
Object.defineProperty(exports, "P2TRAddress", { enumerable: true, get: function () { return p2tr_1.P2TRAddress; } });
const p2wpkh_1 = require("./p2wpkh");
Object.defineProperty(exports, "P2WPKHAddress", { enumerable: true, get: function () { return p2wpkh_1.P2WPKHAddress; } });
const p2wpkh_in_p2sh_1 = require("./p2wpkh-in-p2sh");
Object.defineProperty(exports, "P2WPKHInP2SHAddress", { enumerable: true, get: function () { return p2wpkh_in_p2sh_1.P2WPKHInP2SHAddress; } });
const p2wsh_1 = require("./p2wsh");
Object.defineProperty(exports, "P2WSHAddress", { enumerable: true, get: function () { return p2wsh_1.P2WSHAddress; } });
const p2wsh_in_p2sh_1 = require("./p2wsh-in-p2sh");
Object.defineProperty(exports, "P2WSHInP2SHAddress", { enumerable: true, get: function () { return p2wsh_in_p2sh_1.P2WSHInP2SHAddress; } });
const ethereum_1 = require("./ethereum");
Object.defineProperty(exports, "EthereumAddress", { enumerable: true, get: function () { return ethereum_1.EthereumAddress; } });
const cosmos_1 = require("./cosmos");
Object.defineProperty(exports, "CosmosAddress", { enumerable: true, get: function () { return cosmos_1.CosmosAddress; } });
const xinfin_1 = require("./xinfin");
Object.defineProperty(exports, "XinFinAddress", { enumerable: true, get: function () { return xinfin_1.XinFinAddress; } });
const tron_1 = require("./tron");
Object.defineProperty(exports, "TronAddress", { enumerable: true, get: function () { return tron_1.TronAddress; } });
const exceptions_1 = require("../exceptions");
const ripple_1 = require("./ripple");
Object.defineProperty(exports, "RippleAddress", { enumerable: true, get: function () { return ripple_1.RippleAddress; } });
const filecoin_1 = require("./filecoin");
Object.defineProperty(exports, "FilecoinAddress", { enumerable: true, get: function () { return filecoin_1.FilecoinAddress; } });
const avalanche_1 = require("./avalanche");
Object.defineProperty(exports, "AvalancheAddress", { enumerable: true, get: function () { return avalanche_1.AvalancheAddress; } });
const eos_1 = require("./eos");
Object.defineProperty(exports, "EOSAddress", { enumerable: true, get: function () { return eos_1.EOSAddress; } });
const ergo_1 = require("./ergo");
Object.defineProperty(exports, "ErgoAddress", { enumerable: true, get: function () { return ergo_1.ErgoAddress; } });
const icon_1 = require("./icon");
Object.defineProperty(exports, "IconAddress", { enumerable: true, get: function () { return icon_1.IconAddress; } });
const okt_chain_1 = require("./okt-chain");
Object.defineProperty(exports, "OKTChainAddress", { enumerable: true, get: function () { return okt_chain_1.OKTChainAddress; } });
const harmony_1 = require("./harmony");
Object.defineProperty(exports, "HarmonyAddress", { enumerable: true, get: function () { return harmony_1.HarmonyAddress; } });
const zilliqa_1 = require("./zilliqa");
Object.defineProperty(exports, "ZilliqaAddress", { enumerable: true, get: function () { return zilliqa_1.ZilliqaAddress; } });
const injective_1 = require("./injective");
Object.defineProperty(exports, "InjectiveAddress", { enumerable: true, get: function () { return injective_1.InjectiveAddress; } });
const cardano_1 = require("./cardano");
Object.defineProperty(exports, "CardanoAddress", { enumerable: true, get: function () { return cardano_1.CardanoAddress; } });
const monero_1 = require("./monero");
Object.defineProperty(exports, "MoneroAddress", { enumerable: true, get: function () { return monero_1.MoneroAddress; } });
const nano_1 = require("./nano");
Object.defineProperty(exports, "NanoAddress", { enumerable: true, get: function () { return nano_1.NanoAddress; } });
const neo_1 = require("./neo");
Object.defineProperty(exports, "NeoAddress", { enumerable: true, get: function () { return neo_1.NeoAddress; } });
const algorand_1 = require("./algorand");
Object.defineProperty(exports, "AlgorandAddress", { enumerable: true, get: function () { return algorand_1.AlgorandAddress; } });
const multiversx_1 = require("./multiversx");
Object.defineProperty(exports, "MultiversXAddress", { enumerable: true, get: function () { return multiversx_1.MultiversXAddress; } });
const solana_1 = require("./solana");
Object.defineProperty(exports, "SolanaAddress", { enumerable: true, get: function () { return solana_1.SolanaAddress; } });
const stellar_1 = require("./stellar");
Object.defineProperty(exports, "StellarAddress", { enumerable: true, get: function () { return stellar_1.StellarAddress; } });
const tezos_1 = require("./tezos");
Object.defineProperty(exports, "TezosAddress", { enumerable: true, get: function () { return tezos_1.TezosAddress; } });
const sui_1 = require("./sui");
Object.defineProperty(exports, "SuiAddress", { enumerable: true, get: function () { return sui_1.SuiAddress; } });
const aptos_1 = require("./aptos");
Object.defineProperty(exports, "AptosAddress", { enumerable: true, get: function () { return aptos_1.AptosAddress; } });
const near_1 = require("./near");
Object.defineProperty(exports, "NearAddress", { enumerable: true, get: function () { return near_1.NearAddress; } });
/**
 * Central registry of all supported blockchain address classes.
 * Provides utility methods to fetch names, classes, or check validity.
 */
class ADDRESSES {
    static dictionary = {
        [p2pkh_1.P2PKHAddress.getName()]: p2pkh_1.P2PKHAddress,
        [p2sh_1.P2SHAddress.getName()]: p2sh_1.P2SHAddress,
        [p2tr_1.P2TRAddress.getName()]: p2tr_1.P2TRAddress,
        [p2wpkh_1.P2WPKHAddress.getName()]: p2wpkh_1.P2WPKHAddress,
        [p2wpkh_in_p2sh_1.P2WPKHInP2SHAddress.getName()]: p2wpkh_in_p2sh_1.P2WPKHInP2SHAddress,
        [p2wsh_1.P2WSHAddress.getName()]: p2wsh_1.P2WSHAddress,
        [p2wsh_in_p2sh_1.P2WSHInP2SHAddress.getName()]: p2wsh_in_p2sh_1.P2WSHInP2SHAddress,
        [ethereum_1.EthereumAddress.getName()]: ethereum_1.EthereumAddress,
        [cosmos_1.CosmosAddress.getName()]: cosmos_1.CosmosAddress,
        [xinfin_1.XinFinAddress.getName()]: xinfin_1.XinFinAddress,
        [tron_1.TronAddress.getName()]: tron_1.TronAddress,
        [ripple_1.RippleAddress.getName()]: ripple_1.RippleAddress,
        [filecoin_1.FilecoinAddress.getName()]: filecoin_1.FilecoinAddress,
        [avalanche_1.AvalancheAddress.getName()]: avalanche_1.AvalancheAddress,
        [eos_1.EOSAddress.getName()]: eos_1.EOSAddress,
        [ergo_1.ErgoAddress.getName()]: ergo_1.ErgoAddress,
        [icon_1.IconAddress.getName()]: icon_1.IconAddress,
        [okt_chain_1.OKTChainAddress.getName()]: okt_chain_1.OKTChainAddress,
        [harmony_1.HarmonyAddress.getName()]: harmony_1.HarmonyAddress,
        [zilliqa_1.ZilliqaAddress.getName()]: zilliqa_1.ZilliqaAddress,
        [injective_1.InjectiveAddress.getName()]: injective_1.InjectiveAddress,
        [cardano_1.CardanoAddress.getName()]: cardano_1.CardanoAddress,
        [monero_1.MoneroAddress.getName()]: monero_1.MoneroAddress,
        [nano_1.NanoAddress.getName()]: nano_1.NanoAddress,
        [neo_1.NeoAddress.getName()]: neo_1.NeoAddress,
        [algorand_1.AlgorandAddress.getName()]: algorand_1.AlgorandAddress,
        [multiversx_1.MultiversXAddress.getName()]: multiversx_1.MultiversXAddress,
        [solana_1.SolanaAddress.getName()]: solana_1.SolanaAddress,
        [stellar_1.StellarAddress.getName()]: stellar_1.StellarAddress,
        [tezos_1.TezosAddress.getName()]: tezos_1.TezosAddress,
        [sui_1.SuiAddress.getName()]: sui_1.SuiAddress,
        [aptos_1.AptosAddress.getName()]: aptos_1.AptosAddress,
        [near_1.NearAddress.getName()]: near_1.NearAddress
    };
    /**
     * Returns an array of all supported address names.
     * @returns {string[]} List of address names.
     */
    static getNames() {
        return Object.keys(this.dictionary);
    }
    /**
     * Returns an array of all address classes.
     * @returns {Array<typeof Address>} List of address classes.
     */
    static getClasses() {
        return Object.values(this.dictionary);
    }
    /**
     * Fetches the address class corresponding to the given name.
     * @param {string} name - Name of the address.
     * @returns {typeof Address} The corresponding address class.
     * @throws {AddressError} If the name is not a valid address.
     */
    static getAddressClass(name) {
        if (!this.isAddress(name)) {
            throw new exceptions_1.AddressError('Invalid address name', { expected: this.getNames(), got: name });
        }
        return this.dictionary[name];
    }
    /**
     * Checks whether a given name corresponds to a supported address.
     * @param {string} name - Name to check.
     * @returns {boolean} True if the name is supported, false otherwise.
     */
    static isAddress(name) {
        return name in this.dictionary;
    }
}
exports.ADDRESSES = ADDRESSES;
//# sourceMappingURL=index.js.map