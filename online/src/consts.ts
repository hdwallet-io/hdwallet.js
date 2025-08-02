import {
  KeyValuePairInterface, GroupBoxInterface
} from './interfaces';

export const publicKeyTypes: string[] = [
  'compressed', 'uncompressed'
];

export const wifTypes: string[] = [
  'wif', 'wif-compressed'
];

export const addressTypes: string[] = [
  'payment', 'staking'
];

export const mnemonicTypes: string[] = [
  'standard', 'segwit', 'standard-2fa', 'segwit-2fa'
];

export const clients: string[] = [
  'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero'
];

export const modes: string[] = [
  'standard', 'segwit'
];

export const cardanoTypes: string[] = [
  'byron-icarus', 'byron-ledger', 'byron-legacy', 'shelley-icarus', 'shelley-ledger'
];

export const changes: KeyValuePairInterface[] = [
  { key: 'External', value: 'external-chain' },
  { key: 'Internal', value: 'internal-chain' }
];

export const roles: KeyValuePairInterface[] = [
  { key: 'External', value: 'external-chain' },
  { key: 'Internal', value: 'internal-chain' },
  { key: 'Staking', value: 'staking-key' }
];

export const customClients: KeyValuePairInterface[] = [
  { key: 'Custom', value: null },
  { key: 'Bitcoin Core', value: "m/0'/0'" },
  { key: 'blockchain.info', value: "m/44'/0'/0'" },
  { key: 'MultiBit HD', value: "m/0'/0" },
  { key: 'Coinomi, Ledger', value: "m/44'/0'/0'" }
];

export const semantics: KeyValuePairInterface[] = [
  { key: 'P2WPKH', value: 'p2wpkh' },
  { key: 'P2WPKH-In-P2SH', value: 'p2wpkh-in-p2sh' },
  { key: 'P2WSH', value: 'p2wsh' },
  { key: 'P2WSH-In-P2SH', value: 'p2wsh-in-p2sh' }
];

export const formats: string[] = [
  'json', 'csv'
];

export const derivations: string[] = [
  'Custom', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'Electrum', 'Monero', 'HDW'
];

export function getAllowedDerivations(hd: string, from: string): string[] {
  if (['Algorand', 'BIP32', 'BIP141'].includes(hd)) {
    if (from === 'bip-xpublic-key') {
      return ['Custom'];
    } else {
      return ['Custom', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'HDW'];
    }
  } else if (hd === 'BIP44') {
    return ['BIP44'];
  } else if (hd === 'BIP49') {
    return ['BIP49'];
  } else if (hd === 'BIP84') {
    return ['BIP84'];
  } else if (hd === 'BIP86') {
    return ['BIP86'];
  } else if (hd === 'Cardano') {
    if (from === 'cardano-xpublic-key') {
      return ['Custom'];
    } else {
      return ['Custom', 'BIP44', 'CIP1852'];
    }
  } else if (['Electrum-V1', 'Electrum-V2'].includes(hd)) {
    return ['Electrum'];
  } else if (hd === 'Monero') {
    return ['Monero'];
  } else {
    return [];
  }
}

export const groupBox: GroupBoxInterface = {
  name: null,
  color: 'rgba(128, 128, 128, 0.25)',
  flag: null,
  flags: {
    warning: 'rgba(221, 125, 10, 0.50)',
    error: 'rgba(255, 0, 0, 0.50)'
  }
}
