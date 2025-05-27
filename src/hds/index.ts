// SPDX-License-Identifier: MIT

import { HD } from './hd'
import { BaseError } from '../exceptions';
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

export class HDS {

  private static dictionary: Record<string, typeof HD> = {
    [BIP32HD.getName()]: BIP32HD,
    [BIP44HD.getName()]: BIP44HD,
    [BIP49HD.getName()]: BIP49HD,
    [BIP84HD.getName()]: BIP84HD,
    [BIP86HD.getName()]: BIP86HD,
    [BIP141HD.getName()]: BIP141HD,
    [CardanoHD.getName()]: CardanoHD,
    [ElectrumV1HD.getName()]: ElectrumV1HD,
    [ElectrumV2HD.getName()]: ElectrumV2HD,
    [MoneroHD.getName()]: MoneroHD
  }

  static getNames(): string[] {
    return Object.keys(this.dictionary);
  }

  static getClasses(): typeof HD[] {
    return Object.values(this.dictionary);
  }

  static getHDClass(name: string): typeof HD {
    if (!this.isHD(name)) {
      throw new BaseError(
        'Invalid HD name', { expected: this.getNames(), got: name }
      )
    }
    return this.dictionary[name];
  }

  static isHD(name: string): boolean {
    return this.getNames().includes(name);
  }
}

export {
  HD,
  BIP32HD,
  BIP44HD,
  BIP49HD,
  BIP84HD,
  BIP86HD,
  BIP141HD,
  CardanoHD,
  ElectrumV1HD,
  ElectrumV2HD,
  MoneroHD
}