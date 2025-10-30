# Changelog

## [1.0.0-beta.11](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.11) (2025-10-30)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.10...1.0.0-beta.11)

**New Additions:**

- Add: unit-tests and documentations

**Enhancements:**

- Modify: `getDump` passphrase for Electrum v1/v2 & Monero HDs
- Update: all blake2b implementation doc strings
- Drop: `make.bat` & `Makefile` docs builder commands
- Drop: `sphinx-click` extension from docs

**Fix Bugs:**

- Fix: typo error of wif-type in HDWallet class
- Fix: ArrayBufferLike issue of BIP32HD & AlgorandHD

## [1.0.0-beta.10](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.10) (2025-08-03)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.9...1.0.0-beta.10)

**New Additions:**

- Add: cryptocurrency symbol values

**Fix Bugs:**

- Fix: SLIP-0044 import issue

## [1.0.0-beta.9](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.9) (2025-08-03)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.8...1.0.0-beta.9)

**Enhancements:**

- Remove: Coin-Type handling in `BIP44Derivation` cleanup

**Fix Bugs:**

- Fix: `fromDerivation`, `updateDerivation` & `cleanDerivation` funcs of HD implementation

## [1.0.0-beta.8](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.8) (2025-08-02)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.7...1.0.0-beta.8)

**New Cryptocurrencies:**

| Name                     | Symbol | Coin Type | Networks  |
|:-------------------------|:------:|:---------:|:---------:|
| [Base](https://base.org) |  BASE  |    60     | `mainnet` |

**New Additions:**

- Add: Algorand foundation xHD (AlgorandHD) implementation

**Enhancements:**

- Modify: BIP32 HD to accept custom ECC on HDWallet class
- Change: default Algorand cryptocurrency ECC to `Kholaw-Ed25519`
- Update: retrieve ECC name from HD class in HDWallet

**Fix Bugs:**

- Fix: Wallet Import Format (WIF) default value in `BIP32HD`

## [1.0.0-beta.7](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.7) (2025-07-21)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.6...1.0.0-beta.7)

**Improvements:**

- Drop: `checksome` param in MoneroMnemonic `fromWords` func

**Fix Bugs:**

- Fix: serialize issue for Cardano extended private-key
- Fix: `Ergo` & `Monero` address network name
- Fix: CardanoHD `from_seed` bytes & `parentFingerprint` issue

## [1.0.0-beta.6](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.6) (2025-07-18)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.5...1.0.0-beta.6)

**Enhancements:**

- Add: default address setup based on HDs in hdwallet.ts
- Update: Solana default derivation path to `m/44'/${Solana.COIN_TYPE}'/0'/0'`
- Modify: return type of `getDumps` to `any` in hdwallet.ts

## [1.0.0-beta.5](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.5) (2025-07-09)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.4...1.0.0-beta.5)

**Enhancements:**

- Update: separate import to reduce bundle size of @taichunmin/crc package by [@taichunmin](https://github.com/taichunmin)

**Fix Bugs:**

- Fix: Monero HD get network name issue

**Closed Pull-requests:**

- [[#2](https://github.com/hdwallet-io/hdwallet.js/pull/2)] Update @taichunmin/crc

## [1.0.0-beta.4](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.4) (2025-07-06)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.3...1.0.0-beta.4)

**Improvements:**

- Drop: `Buffer.from` & use `toBuffer` function.

**Fix Bugs:**

- Fix: HDWallet derivation to public type.

## [1.0.0-beta.3](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.3) (2025-07-02)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.2...1.0.0-beta.3)

**Fix Bugs:**

- Fix: network name issue in constructor HDWallet class.

## [1.0.0-beta.2](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.2) (2025-07-02)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.1...1.0.0-beta.2)

**New Additions:**

- Add: `SEMANTICS` for extended keys in all cryptocurrencies.

**Improvements:**

- Modify: drop `getName()` function & changed to `NAME` variable for all networks.
- Add: `chars` param for `generatePassphrase()` function in utils.

## [1.0.0-beta.1](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.1) (2025-06-15)

[Full Changelog](https://github.com/hdwallet-io/hdwallet.js/compare/1.0.0-beta.0...1.0.0-beta.1)

**New Additions:**

- Add: `dist` on files / package.json

## [1.0.0-beta.0](https://github.com/hdwallet-io/hdwallet.js/tree/1.0.0-beta.0) (2025-06-12)

**hdwallet.js 1.0.0-beta.0** is the project’s first public beta release. This milestone marks the initial feature-complete implementation and opens the library to broader testing and feedback.
