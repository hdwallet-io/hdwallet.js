// SPDX-License-Identifier: MIT

import {
  ADDRESSES,
  P2PKHAddress,
  P2SHAddress,
  P2WPKHAddress,
  P2WPKHInP2SHAddress,
  P2TRAddress,
  EthereumAddress,
  XinFinAddress,
  TronAddress,
  RippleAddress,
  FilecoinAddress,
  CosmosAddress,
  AvalancheAddress,
  EOSAddress,
  ErgoAddress,
  OKTChainAddress,
  HarmonyAddress,
  ZilliqaAddress,
  InjectiveAddress,
  IconAddress
} from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['SLIP10-Secp256k1']: {
    ['uncompressed-public-key']: string;
    ['compressed-public-key']: string;
    addresses: {
      P2PKH: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { 
            public_key_address_prefix: string; 
            public_key_type: 'compressed' | 'uncompressed' 
          };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      P2SH: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { script_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { script_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      ['P2WPKH']: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { hrp: string; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { hrp: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      ['P2WPKH-In-P2SH']: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { script_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { script_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      P2TR: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Ethereum: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      XinFin: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Tron: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { skip_checksum_encode: boolean; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Ripple: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_address_prefix: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Filecoin: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { address_type: 'secp256k1'; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { address_type: 'secp256k1'; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Cosmos: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { hrp: string; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { hrp: string; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Avalanche: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { address_type: 'p-chain'; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { address_type: 'p-chain'; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      EOS: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Ergo: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { address_type: 'p2pkh'; network_type: 'testnet' | 'mainnet'; public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { address_type: 'p2pkh'; network_type: 'testnet' | 'mainnet'; public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      ['OKT-Chain']: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Harmony: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Zilliqa: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Injective: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
      Icon: {
        name: string;
        compressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
        uncompressed: {
          encode: string;
          decode: string;
          args: { public_key_type: 'compressed' | 'uncompressed' };
        };
      };
    };
  };
};

const hexToInt = (hex: string) => parseInt(hex, 16);

describe("SLIP10-Secp256k1 based address encoders", () => {
  const group = rawVectors['SLIP10-Secp256k1'];
  const pubC = group['compressed-public-key'];
  const pubU = group['uncompressed-public-key'];
  const A = group.addresses;

  // ---------- P2PKH ----------
  describe("P2PKHAddress", () => {
    it("has the correct name", () => {
      expect(P2PKHAddress.getName()).toBe(A.P2PKH.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (P2PKHAddress as any).encode(pubC, {
          publicKeyAddressPrefix: hexToInt(A.P2PKH.compressed.args.public_key_address_prefix),
          publicKeyType: A.P2PKH.compressed.args.public_key_type
        })
      ).toBe(A.P2PKH.compressed.encode);

      expect(
        (P2PKHAddress as any).decode(A.P2PKH.compressed.encode, {
          publicKeyAddressPrefix: hexToInt(A.P2PKH.compressed.args.public_key_address_prefix),
          publicKeyType: A.P2PKH.compressed.args.public_key_type
        })
      ).toBe(A.P2PKH.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (P2PKHAddress as any).encode(pubU, {
          publicKeyAddressPrefix: hexToInt(A.P2PKH.uncompressed.args.public_key_address_prefix),
          publicKeyType: A.P2PKH.uncompressed.args.public_key_type
        })
      ).toBe(A.P2PKH.uncompressed.encode);

      expect(
        (P2PKHAddress as any).decode(A.P2PKH.uncompressed.encode, {
          publicKeyAddressPrefix: hexToInt(A.P2PKH.uncompressed.args.public_key_address_prefix),
          publicKeyType: A.P2PKH.uncompressed.args.public_key_type
        })
      ).toBe(A.P2PKH.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.P2PKH.name);
      expect(RegistryClass).toBe(P2PKHAddress);
    });
  });

  // ---------- P2SH ----------
  describe("P2SHAddress", () => {
    it("has the correct name", () => {
      expect(P2SHAddress.getName()).toBe(A.P2SH.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (P2SHAddress as any).encode(pubC, {
          scriptAddressPrefix: hexToInt(A.P2SH.compressed.args.script_address_prefix),
          publicKeyType: A.P2SH.compressed.args.public_key_type
        })
      ).toBe(A.P2SH.compressed.encode);

      expect(
        (P2SHAddress as any).decode(A.P2SH.compressed.encode, {
          scriptAddressPrefix: hexToInt(A.P2SH.compressed.args.script_address_prefix),
          publicKeyType: A.P2SH.compressed.args.public_key_type
        })
      ).toBe(A.P2SH.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (P2SHAddress as any).encode(pubU, {
          scriptAddressPrefix: hexToInt(A.P2SH.uncompressed.args.script_address_prefix),
          publicKeyType: A.P2SH.uncompressed.args.public_key_type
        })
      ).toBe(A.P2SH.uncompressed.encode);

      expect(
        (P2SHAddress as any).decode(A.P2SH.uncompressed.encode, {
          scriptAddressPrefix: hexToInt(A.P2SH.uncompressed.args.script_address_prefix),
          publicKeyType: A.P2SH.uncompressed.args.public_key_type
        })
      ).toBe(A.P2SH.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.P2SH.name);
      expect(RegistryClass).toBe(P2SHAddress);
    });
  });

  // ---------- P2WPKH & P2WPKH-In-P2SH (use bracketed access for both) ----------
  describe("P2WPKHAddress", () => {
    it("has the correct name", () => {
      expect(P2WPKHAddress.getName()).toBe(A['P2WPKH'].name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (P2WPKHAddress as any).encode(pubC, {
          hrp: A['P2WPKH'].compressed.args.hrp,
          publicKeyType: A['P2WPKH'].compressed.args.public_key_type
        })
      ).toBe(A['P2WPKH'].compressed.encode);

      expect(
        (P2WPKHAddress as any).decode(A['P2WPKH'].compressed.encode, {
          hrp: A['P2WPKH'].compressed.args.hrp,
          publicKeyType: A['P2WPKH'].compressed.args.public_key_type
        })
      ).toBe(A['P2WPKH'].compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (P2WPKHAddress as any).encode(pubU, {
          hrp: A['P2WPKH'].uncompressed.args.hrp,
          publicKeyType: A['P2WPKH'].uncompressed.args.public_key_type
        })
      ).toBe(A['P2WPKH'].uncompressed.encode);

      expect(
        (P2WPKHAddress as any).decode(A['P2WPKH'].uncompressed.encode, {
          hrp: A['P2WPKH'].uncompressed.args.hrp,
          publicKeyType: A['P2WPKH'].uncompressed.args.public_key_type
        })
      ).toBe(A['P2WPKH'].uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A['P2WPKH'].name);
      expect(RegistryClass).toBe(P2WPKHAddress);
    });
  });

  describe("P2WPKHInP2SHAddress", () => {
    it("has the correct name", () => {
      expect(P2WPKHInP2SHAddress.getName()).toBe(A['P2WPKH-In-P2SH'].name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (P2WPKHInP2SHAddress as any).encode(pubC, {
          scriptAddressPrefix: hexToInt(A['P2WPKH-In-P2SH'].compressed.args.script_address_prefix),
          publicKeyType: A['P2WPKH-In-P2SH'].compressed.args.public_key_type
        })
      ).toBe(A['P2WPKH-In-P2SH'].compressed.encode);

      expect(
        (P2WPKHInP2SHAddress as any).decode(A['P2WPKH-In-P2SH'].compressed.encode, {
          scriptAddressPrefix: hexToInt(A['P2WPKH-In-P2SH'].compressed.args.script_address_prefix),
          publicKeyType: A['P2WPKH-In-P2SH'].compressed.args.public_key_type
        })
      ).toBe(A['P2WPKH-In-P2SH'].compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (P2WPKHInP2SHAddress as any).encode(pubU, {
          scriptAddressPrefix: hexToInt(A['P2WPKH-In-P2SH'].uncompressed.args.script_address_prefix),
          publicKeyType: A['P2WPKH-In-P2SH'].uncompressed.args.public_key_type
        })
      ).toBe(A['P2WPKH-In-P2SH'].uncompressed.encode);

      expect(
        (P2WPKHInP2SHAddress as any).decode(A['P2WPKH-In-P2SH'].uncompressed.encode, {
          scriptAddressPrefix: hexToInt(A['P2WPKH-In-P2SH'].uncompressed.args.script_address_prefix),
          publicKeyType: A['P2WPKH-In-P2SH'].uncompressed.args.public_key_type
        })
      ).toBe(A['P2WPKH-In-P2SH'].uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A['P2WPKH-In-P2SH'].name);
      expect(RegistryClass).toBe(P2WPKHInP2SHAddress);
    });
  });

  // ---------- P2TR ----------
  describe("P2TRAddress", () => {
    it("has the correct name", () => {
      expect(P2TRAddress.getName()).toBe(A.P2TR.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((P2TRAddress as any).encode(pubC, { publicKeyType: A.P2TR.compressed.args.public_key_type }))
        .toBe(A.P2TR.compressed.encode);
      expect((P2TRAddress as any).decode(A.P2TR.compressed.encode, { publicKeyType: A.P2TR.compressed.args.public_key_type }))
        .toBe(A.P2TR.compressed.decode);

      expect((P2TRAddress as any).encode(pubU, { publicKeyType: A.P2TR.uncompressed.args.public_key_type }))
        .toBe(A.P2TR.uncompressed.encode);
      expect((P2TRAddress as any).decode(A.P2TR.uncompressed.encode, { publicKeyType: A.P2TR.uncompressed.args.public_key_type }))
        .toBe(A.P2TR.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.P2TR.name);
      expect(RegistryClass).toBe(P2TRAddress);
    });
  });

  // ---------- Ethereum / XinFin / Tron ----------
  describe("Ethereum-like (EVM) addresses", () => {
    it("EthereumAddress", () => {
      expect(EthereumAddress.getName()).toBe(A.Ethereum.name);

      expect(
        (EthereumAddress as any).encode(pubC, {
          skipChecksumEncode: A.Ethereum.compressed.args.skip_checksum_encode,
          publicKeyType: A.Ethereum.compressed.args.public_key_type
        })
      ).toBe(A.Ethereum.compressed.encode);

      expect(
        (EthereumAddress as any).decode(A.Ethereum.compressed.encode, {
          skipChecksumEncode: A.Ethereum.compressed.args.skip_checksum_encode,
          publicKeyType: A.Ethereum.compressed.args.public_key_type
        })
      ).toBe(A.Ethereum.compressed.decode);

      expect(
        (EthereumAddress as any).encode(pubU, {
          skipChecksumEncode: A.Ethereum.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.Ethereum.uncompressed.args.public_key_type
        })
      ).toBe(A.Ethereum.uncompressed.encode);

      expect(
        (EthereumAddress as any).decode(A.Ethereum.uncompressed.encode, {
          skipChecksumEncode: A.Ethereum.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.Ethereum.uncompressed.args.public_key_type
        })
      ).toBe(A.Ethereum.uncompressed.decode);

      expect(ADDRESSES.getAddressClass(A.Ethereum.name)).toBe(EthereumAddress);
    });

    it("XinFinAddress", () => {
      expect(XinFinAddress.getName()).toBe(A.XinFin.name);

      expect(
        (XinFinAddress as any).encode(pubC, {
          skipChecksumEncode: A.XinFin.compressed.args.skip_checksum_encode,
          publicKeyType: A.XinFin.compressed.args.public_key_type
        })
      ).toBe(A.XinFin.compressed.encode);

      expect(
        (XinFinAddress as any).decode(A.XinFin.compressed.encode, {
          skipChecksumEncode: A.XinFin.compressed.args.skip_checksum_encode,
          publicKeyType: A.XinFin.compressed.args.public_key_type
        })
      ).toBe(A.XinFin.compressed.decode);

      expect(
        (XinFinAddress as any).encode(pubU, {
          skipChecksumEncode: A.XinFin.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.XinFin.uncompressed.args.public_key_type
        })
      ).toBe(A.XinFin.uncompressed.encode);

      expect(
        (XinFinAddress as any).decode(A.XinFin.uncompressed.encode, {
          skipChecksumEncode: A.XinFin.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.XinFin.uncompressed.args.public_key_type
        })
      ).toBe(A.XinFin.uncompressed.decode);

      expect(ADDRESSES.getAddressClass(A.XinFin.name)).toBe(XinFinAddress);
    });

    it("TronAddress", () => {
      expect(TronAddress.getName()).toBe(A.Tron.name);

      expect(
        (TronAddress as any).encode(pubC, {
          skipChecksumEncode: A.Tron.compressed.args.skip_checksum_encode,
          publicKeyType: A.Tron.compressed.args.public_key_type
        })
      ).toBe(A.Tron.compressed.encode);

      expect(
        (TronAddress as any).decode(A.Tron.compressed.encode, {
          skipChecksumEncode: A.Tron.compressed.args.skip_checksum_encode,
          publicKeyType: A.Tron.compressed.args.public_key_type
        })
      ).toBe(A.Tron.compressed.decode);

      expect(
        (TronAddress as any).encode(pubU, {
          skipChecksumEncode: A.Tron.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.Tron.uncompressed.args.public_key_type
        })
      ).toBe(A.Tron.uncompressed.encode);

      expect(
        (TronAddress as any).decode(A.Tron.uncompressed.encode, {
          skipChecksumEncode: A.Tron.uncompressed.args.skip_checksum_encode,
          publicKeyType: A.Tron.uncompressed.args.public_key_type
        })
      ).toBe(A.Tron.uncompressed.decode);

      expect(ADDRESSES.getAddressClass(A.Tron.name)).toBe(TronAddress);
    });
  });

  // ---------- Ripple ----------
  describe("RippleAddress", () => {
    it("has the correct name", () => {
      expect(RippleAddress.getName()).toBe(A.Ripple.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (RippleAddress as any).encode(pubC, {
          publicKeyAddressPrefix: hexToInt(A.Ripple.compressed.args.public_key_address_prefix),
          publicKeyType: A.Ripple.compressed.args.public_key_type
        })
      ).toBe(A.Ripple.compressed.encode);

      expect(
        (RippleAddress as any).decode(A.Ripple.compressed.encode, {
          publicKeyAddressPrefix: hexToInt(A.Ripple.compressed.args.public_key_address_prefix),
          publicKeyType: A.Ripple.compressed.args.public_key_type
        })
      ).toBe(A.Ripple.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (RippleAddress as any).encode(pubU, {
          publicKeyAddressPrefix: hexToInt(A.Ripple.uncompressed.args.public_key_address_prefix),
          publicKeyType: A.Ripple.uncompressed.args.public_key_type
        })
      ).toBe(A.Ripple.uncompressed.encode);

      expect(
        (RippleAddress as any).decode(A.Ripple.uncompressed.encode, {
          publicKeyAddressPrefix: hexToInt(A.Ripple.uncompressed.args.public_key_address_prefix),
          publicKeyType: A.Ripple.uncompressed.args.public_key_type
        })
      ).toBe(A.Ripple.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Ripple.name);
      expect(RegistryClass).toBe(RippleAddress);
    });
  });

  // ---------- Filecoin ----------
  describe("FilecoinAddress", () => {
    it("has the correct name", () => {
      expect(FilecoinAddress.getName()).toBe(A.Filecoin.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (FilecoinAddress as any).encode(pubC, {
          addressType: A.Filecoin.compressed.args.address_type,
          publicKeyType: A.Filecoin.compressed.args.public_key_type
        })
      ).toBe(A.Filecoin.compressed.encode);

      expect(
        (FilecoinAddress as any).decode(A.Filecoin.compressed.encode, {
          addressType: A.Filecoin.compressed.args.address_type,
          publicKeyType: A.Filecoin.compressed.args.public_key_type
        })
      ).toBe(A.Filecoin.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (FilecoinAddress as any).encode(pubU, {
          addressType: A.Filecoin.uncompressed.args.address_type,
          publicKeyType: A.Filecoin.uncompressed.args.public_key_type
        })
      ).toBe(A.Filecoin.uncompressed.encode);

      expect(
        (FilecoinAddress as any).decode(A.Filecoin.uncompressed.encode, {
          addressType: A.Filecoin.uncompressed.args.address_type,
          publicKeyType: A.Filecoin.uncompressed.args.public_key_type
        })
      ).toBe(A.Filecoin.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Filecoin.name);
      expect(RegistryClass).toBe(FilecoinAddress);
    });
  });

  // ---------- Cosmos ----------
  describe("CosmosAddress", () => {
    it("has the correct name", () => {
      expect(CosmosAddress.getName()).toBe(A.Cosmos.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (CosmosAddress as any).encode(pubC, {
          hrp: A.Cosmos.compressed.args.hrp,
          publicKeyType: A.Cosmos.compressed.args.public_key_type
        })
      ).toBe(A.Cosmos.compressed.encode);

      expect(
        (CosmosAddress as any).decode(A.Cosmos.compressed.encode, {
          hrp: A.Cosmos.compressed.args.hrp,
          publicKeyType: A.Cosmos.compressed.args.public_key_type
        })
      ).toBe(A.Cosmos.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (CosmosAddress as any).encode(pubU, {
          hrp: A.Cosmos.uncompressed.args.hrp,
          publicKeyType: A.Cosmos.uncompressed.args.public_key_type
        })
      ).toBe(A.Cosmos.uncompressed.encode);

      expect(
        (CosmosAddress as any).decode(A.Cosmos.uncompressed.encode, {
          hrp: A.Cosmos.uncompressed.args.hrp,
          publicKeyType: A.Cosmos.uncompressed.args.public_key_type
        })
      ).toBe(A.Cosmos.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Cosmos.name);
      expect(RegistryClass).toBe(CosmosAddress);
    });
  });

  // ---------- Avalanche ----------
  describe("AvalancheAddress", () => {
    it("has the correct name", () => {
      expect(AvalancheAddress.getName()).toBe(A.Avalanche.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (AvalancheAddress as any).encode(pubC, {
          addressType: A.Avalanche.compressed.args.address_type,
          publicKeyType: A.Avalanche.compressed.args.public_key_type
        })
      ).toBe(A.Avalanche.compressed.encode);

      expect(
        (AvalancheAddress as any).decode(A.Avalanche.compressed.encode, {
          addressType: A.Avalanche.compressed.args.address_type,
          publicKeyType: A.Avalanche.compressed.args.public_key_type
        })
      ).toBe(A.Avalanche.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (AvalancheAddress as any).encode(pubU, {
          addressType: A.Avalanche.uncompressed.args.address_type,
          publicKeyType: A.Avalanche.uncompressed.args.public_key_type
        })
      ).toBe(A.Avalanche.uncompressed.encode);

      expect(
        (AvalancheAddress as any).decode(A.Avalanche.uncompressed.encode, {
          addressType: A.Avalanche.uncompressed.args.address_type,
          publicKeyType: A.Avalanche.uncompressed.args.public_key_type
        })
      ).toBe(A.Avalanche.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Avalanche.name);
      expect(RegistryClass).toBe(AvalancheAddress);
    });
  });

  // ---------- EOS ----------
  describe("EOSAddress", () => {
    it("has the correct name", () => {
      expect(EOSAddress.getName()).toBe(A.EOS.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((EOSAddress as any).encode(pubC, { publicKeyType: A.EOS.compressed.args.public_key_type }))
        .toBe(A.EOS.compressed.encode);
      expect((EOSAddress as any).decode(A.EOS.compressed.encode, { publicKeyType: A.EOS.compressed.args.public_key_type }))
        .toBe(A.EOS.compressed.decode);

      expect((EOSAddress as any).encode(pubU, { publicKeyType: A.EOS.uncompressed.args.public_key_type }))
        .toBe(A.EOS.uncompressed.encode);
      expect((EOSAddress as any).decode(A.EOS.uncompressed.encode, { publicKeyType: A.EOS.uncompressed.args.public_key_type }))
        .toBe(A.EOS.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.EOS.name);
      expect(RegistryClass).toBe(EOSAddress);
    });
  });

  // ---------- Ergo ----------
  describe("ErgoAddress", () => {
    it("has the correct name", () => {
      expect(ErgoAddress.getName()).toBe(A.Ergo.name);
    });

    it("encodes/decodes (compressed)", () => {
      expect(
        (ErgoAddress as any).encode(pubC, {
          addressType: A.Ergo.compressed.args.address_type,
          networkType: A.Ergo.compressed.args.network_type,
          publicKeyType: A.Ergo.compressed.args.public_key_type
        })
      ).toBe(A.Ergo.compressed.encode);

      expect(
        (ErgoAddress as any).decode(A.Ergo.compressed.encode, {
          addressType: A.Ergo.compressed.args.address_type,
          networkType: A.Ergo.compressed.args.network_type,
          publicKeyType: A.Ergo.compressed.args.public_key_type
        })
      ).toBe(A.Ergo.compressed.decode);
    });

    it("encodes/decodes (uncompressed)", () => {
      expect(
        (ErgoAddress as any).encode(pubU, {
          addressType: A.Ergo.uncompressed.args.address_type,
          networkType: A.Ergo.uncompressed.args.network_type,
          publicKeyType: A.Ergo.uncompressed.args.public_key_type
        })
      ).toBe(A.Ergo.uncompressed.encode);

      expect(
        (ErgoAddress as any).decode(A.Ergo.uncompressed.encode, {
          addressType: A.Ergo.uncompressed.args.address_type,
          networkType: A.Ergo.uncompressed.args.network_type,
          publicKeyType: A.Ergo.uncompressed.args.public_key_type
        })
      ).toBe(A.Ergo.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Ergo.name);
      expect(RegistryClass).toBe(ErgoAddress);
    });
  });

  // ---------- OKT-Chain ----------
  describe("OKTChainAddress", () => {
    it("has the correct name", () => {
      expect(OKTChainAddress.getName()).toBe(A['OKT-Chain'].name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((OKTChainAddress as any).encode(pubC, { publicKeyType: A['OKT-Chain'].compressed.args.public_key_type }))
        .toBe(A['OKT-Chain'].compressed.encode);
      expect((OKTChainAddress as any).decode(A['OKT-Chain'].compressed.encode, { publicKeyType: A['OKT-Chain'].compressed.args.public_key_type }))
        .toBe(A['OKT-Chain'].compressed.decode);

      expect((OKTChainAddress as any).encode(pubU, { publicKeyType: A['OKT-Chain'].uncompressed.args.public_key_type }))
        .toBe(A['OKT-Chain'].uncompressed.encode);
      expect((OKTChainAddress as any).decode(A['OKT-Chain'].uncompressed.encode, { publicKeyType: A['OKT-Chain'].uncompressed.args.public_key_type }))
        .toBe(A['OKT-Chain'].uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A['OKT-Chain'].name);
      expect(RegistryClass).toBe(OKTChainAddress);
    });
  });

  // ---------- Harmony ----------
  describe("HarmonyAddress", () => {
    it("has the correct name", () => {
      expect(HarmonyAddress.getName()).toBe(A.Harmony.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((HarmonyAddress as any).encode(pubC, { publicKeyType: A.Harmony.compressed.args.public_key_type }))
        .toBe(A.Harmony.compressed.encode);
      expect((HarmonyAddress as any).decode(A.Harmony.compressed.encode, { publicKeyType: A.Harmony.compressed.args.public_key_type }))
        .toBe(A.Harmony.compressed.decode);

      expect((HarmonyAddress as any).encode(pubU, { publicKeyType: A.Harmony.uncompressed.args.public_key_type }))
        .toBe(A.Harmony.uncompressed.encode);
      expect((HarmonyAddress as any).decode(A.Harmony.uncompressed.encode, { publicKeyType: A.Harmony.uncompressed.args.public_key_type }))
        .toBe(A.Harmony.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Harmony.name);
      expect(RegistryClass).toBe(HarmonyAddress);
    });
  });

  // ---------- Zilliqa ----------
  describe("ZilliqaAddress", () => {
    it("has the correct name", () => {
      expect(ZilliqaAddress.getName()).toBe(A.Zilliqa.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((ZilliqaAddress as any).encode(pubC, { publicKeyType: A.Zilliqa.compressed.args.public_key_type }))
        .toBe(A.Zilliqa.compressed.encode);
      expect((ZilliqaAddress as any).decode(A.Zilliqa.compressed.encode, { publicKeyType: A.Zilliqa.compressed.args.public_key_type }))
        .toBe(A.Zilliqa.compressed.decode);

      expect((ZilliqaAddress as any).encode(pubU, { publicKeyType: A.Zilliqa.uncompressed.args.public_key_type }))
        .toBe(A.Zilliqa.uncompressed.encode);
      expect((ZilliqaAddress as any).decode(A.Zilliqa.uncompressed.encode, { publicKeyType: A.Zilliqa.uncompressed.args.public_key_type }))
        .toBe(A.Zilliqa.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Zilliqa.name);
      expect(RegistryClass).toBe(ZilliqaAddress);
    });
  });

  // ---------- Injective ----------
  describe("InjectiveAddress", () => {
    it("has the correct name", () => {
      expect(InjectiveAddress.getName()).toBe(A.Injective.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((InjectiveAddress as any).encode(pubC, { publicKeyType: A.Injective.compressed.args.public_key_type }))
        .toBe(A.Injective.compressed.encode);
      expect((InjectiveAddress as any).decode(A.Injective.compressed.encode, { publicKeyType: A.Injective.compressed.args.public_key_type }))
        .toBe(A.Injective.compressed.decode);

      expect((InjectiveAddress as any).encode(pubU, { publicKeyType: A.Injective.uncompressed.args.public_key_type }))
        .toBe(A.Injective.uncompressed.encode);
      expect((InjectiveAddress as any).decode(A.Injective.uncompressed.encode, { publicKeyType: A.Injective.uncompressed.args.public_key_type }))
        .toBe(A.Injective.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Injective.name);
      expect(RegistryClass).toBe(InjectiveAddress);
    });
  });

  // ---------- Icon (extra coverage) ----------
  describe("IconAddress", () => {
    it("has the correct name", () => {
      expect(IconAddress.getName()).toBe(A.Icon.name);
    });

    it("encodes/decodes (compressed & uncompressed)", () => {
      expect((IconAddress as any).encode(pubC, { publicKeyType: A.Icon.compressed.args.public_key_type }))
        .toBe(A.Icon.compressed.encode);
      expect((IconAddress as any).decode(A.Icon.compressed.encode, { publicKeyType: A.Icon.compressed.args.public_key_type }))
        .toBe(A.Icon.compressed.decode);

      expect((IconAddress as any).encode(pubU, { publicKeyType: A.Icon.uncompressed.args.public_key_type }))
        .toBe(A.Icon.uncompressed.encode);
      expect((IconAddress as any).decode(A.Icon.uncompressed.encode, { publicKeyType: A.Icon.uncompressed.args.public_key_type }))
        .toBe(A.Icon.uncompressed.decode);
    });

    it("registry matches class", () => {
      const RegistryClass = ADDRESSES.getAddressClass(A.Icon.name);
      expect(RegistryClass).toBe(IconAddress);
    });
  });
});
