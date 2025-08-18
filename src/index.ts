// SPDX-License-Identifier: MIT

import * as info from './info'

import * as consts from './consts';
import * as crypto from './crypto';
import * as utils from './utils';

import * as cryptocurrencies from './cryptocurrencies';
import * as symbols from './symbols';

import * as entropies from './entropies';
import * as mnemonics from './mnemonics';
import * as seeds from './seeds';

import * as eccs from './eccs';
import * as derivations from './derivations';
import * as hds from './hds';
import * as addresses from './addresses';

import { HDWallet } from './hdwallet';

const hdwallet = {
  info,
  consts,
  crypto,
  utils,
  cryptocurrencies,
  symbols,
  entropies,
  mnemonics,
  seeds,
  eccs,
  derivations,
  hds,
  addresses,
  HDWallet
};

export {
  hdwallet,
  info,
  consts,
  crypto,
  utils,
  cryptocurrencies,
  symbols,
  entropies,
  mnemonics,
  seeds,
  eccs,
  derivations,
  hds,
  addresses,
  HDWallet
};
