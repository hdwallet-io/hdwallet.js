// SPDX-License-Identifier: MIT

import { ADDRESSES, CardanoAddress } from '../../src/addresses';

const rawVectors = require('../data/json/addresses.json') as {
  ['Kholaw-Ed25519']: {
    ['public-key']: string;
    addresses: {
      ['byron-icarus']: {
        encode: string;
        decode: string;
        args: { chain_code: string };
      };
      ['byron-legacy']: {
        encode: string;
        decode: string;
        args: { path: string; path_key: string; chain_code: string };
      };
      ['shelley']: {
        encode: string;
        decode: string;
        args: { staking_public_key: string; network: string };
      };
      ['shelley-staking']: {
        encode: string;
        decode: string;
        args: { network: string };
      };
    };
  };
};

describe("CardanoAddress", () => {
  const kholaw = rawVectors['Kholaw-Ed25519'];
  const pub = kholaw['public-key'];
  const byronIcarus = kholaw.addresses['byron-icarus'];
  const byronLegacy = kholaw.addresses['byron-legacy'];
  const shelley = kholaw.addresses['shelley'];
  const shelleyStaking = kholaw.addresses['shelley-staking'];

  it("has the correct name", () => {
    expect(CardanoAddress.getName()).toBe("Cardano");
  });

  it("encodes/decodes Byron (Icarus)", () => {
    // direct
    expect(
      CardanoAddress.encodeByronIcarus(pub, byronIcarus.args.chain_code)
    ).toBe(byronIcarus.encode);

    expect(
      CardanoAddress.decodeByronIcarus(byronIcarus.encode)
    ).toBe(byronIcarus.decode);

    // registry
    const RegistryClass = ADDRESSES.getAddressClass(CardanoAddress.getName());
    expect(RegistryClass).toBe(CardanoAddress);

    expect(
      (RegistryClass as any).encodeByronIcarus(pub, byronIcarus.args.chain_code)
    ).toBe(byronIcarus.encode);

    expect(
      (RegistryClass as any).decodeByronIcarus(byronIcarus.encode)
    ).toBe(byronIcarus.decode);
  });

  it("encodes/decodes Byron (Legacy)", () => {
    const pathKey = Buffer.from(byronLegacy.args.path_key, 'hex');

    expect(
      CardanoAddress.encodeByronLegacy(
        pub,
        byronLegacy.args.path,
        pathKey,
        byronLegacy.args.chain_code
      )
    ).toBe(byronLegacy.encode);

    expect(
      CardanoAddress.decodeByronLegacy(byronLegacy.encode)
    ).toBe(byronLegacy.decode);

    const RegistryClass = ADDRESSES.getAddressClass(CardanoAddress.getName());

    expect(
      (RegistryClass as any).encodeByronLegacy(
        pub,
        byronLegacy.args.path,
        pathKey,
        byronLegacy.args.chain_code
      )
    ).toBe(byronLegacy.encode);

    expect(
      (RegistryClass as any).decodeByronLegacy(byronLegacy.encode)
    ).toBe(byronLegacy.decode);
  });

  it("encodes/decodes Shelley payment", () => {
    const stakingPk = Buffer.from(shelley.args.staking_public_key, 'hex');
    const net = shelley.args.network;

    expect(
      CardanoAddress.encodeShelley(pub, stakingPk, net)
    ).toBe(shelley.encode);

    expect(
      CardanoAddress.decodeShelley(shelley.encode, net)
    ).toBe(shelley.decode);

    const RegistryClass = ADDRESSES.getAddressClass(CardanoAddress.getName());

    expect(
      (RegistryClass as any).encodeShelley(pub, stakingPk, net)
    ).toBe(shelley.encode);

    expect(
      (RegistryClass as any).decodeShelley(shelley.encode, net)
    ).toBe(shelley.decode);
  });

  it("encodes/decodes Shelley staking", () => {
    const net = shelleyStaking.args.network;

    expect(
      CardanoAddress.encodeShelleyStaking(pub, net)
    ).toBe(shelleyStaking.encode);

    expect(
      CardanoAddress.decodeShelleyStaking(shelleyStaking.encode, net)
    ).toBe(shelleyStaking.decode);

    const RegistryClass = ADDRESSES.getAddressClass(CardanoAddress.getName());

    expect(
      (RegistryClass as any).encodeShelleyStaking(pub, net)
    ).toBe(shelleyStaking.encode);

    expect(
      (RegistryClass as any).decodeShelleyStaking(shelleyStaking.encode, net)
    ).toBe(shelleyStaking.decode);
  });
});
