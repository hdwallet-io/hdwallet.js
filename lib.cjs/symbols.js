"use strict";
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.CRP = exports.CPU = exports.ATOM = exports.CMP = exports.CLUB = exports.CLAM = exports.HUA = exports.CELO = exports.ADA = exports.CCN = exports.CDN = exports.BRIT = exports.BOLI = exports.BST = exports.BND = exports.BLK = exports.BSD = exports.BTX = exports.BTCZ = exports.BSV = exports.BTCP = exports.XBC = exports.BITG = exports.BTG = exports.SLP = exports.BCH = exports.BCA = exports.BTC = exports.BTDX = exports.BNB = exports.BELA = exports.BEET = exports.BTA = exports.BASE = exports.BAND = exports.AXL = exports.AXE = exports.AVN = exports.AVAX = exports.AUR = exports.AC = exports.AYA = exports.XAX = exports.AGM = exports.ARB = exports.APT = exports.ANON = exports.ALGO = exports.AKT = exports.ACC = void 0;
exports.INSN = exports.INJ = exports.ICX = exports.HUSH = exports.HT = exports.ZEN = exports.THC = exports.HNC = exports.ONE = exports.NLG = exports.GRS = exports.GRC = exports.GBX = exports.GCR = exports.GAME = exports.FJC = exports.FOXD = exports.FLUX = exports.FLASH = exports.FIX = exports.FRST = exports.FIRO = exports.FIL = exports.FET = exports.FTC = exports.FTM = exports.EXCL = exports.EVR = exports.ERC = exports.ETH = exports.ERG = exports.EOS = exports.NRG = exports.ELA = exports.EMC2 = exports.EFL = exports.EDRC = exports.ECN = exports.XEC = exports.DYDX = exports.DOGE = exports.DIVI = exports.DGC = exports.DGB = exports.DMD = exports.DNR = exports.DFC = exports.ONION = exports.DASH = exports.CRAVE = void 0;
exports.PHR = exports.PSB = exports.PPC = exports.PART = exports.OSMO = exports.OP = exports.ONT = exports.ONX = exports.OMNI = exports.OKT = exports.OK = exports.NSR = exports.NBT = exports.NVC = exports.NIX = exports.NCG = exports.NYC = exports.NTRN = exports.NRO = exports.NEOS = exports.NEO = exports.NEBL = exports.NEAR = exports.NAV = exports.XNO = exports.NMC = exports.XMY = exports.EGLD = exports.MONK = exports.XMR = exports.MONA = exports.MNX = exports.METIS = exports.MEC = exports.MZC = exports.LYNX = exports.LKR = exports.LTZ = exports.LCC = exports.LTC = exports.LINX = exports.LBC = exports.LDCN = exports.KMD = exports.KOBO = exports.KAVA = exports.JBS = exports.IXC = exports.IRIS = exports.IOP = void 0;
exports.VASH = exports.VOX = exports.VIVO = exports.VIA = exports.VTC = exports.XVG = exports.VET = exports.VC = exports.UNO = exports.USC = exports.TWINS = exports.TRX = exports.TOA = exports.THT = exports.THETA = exports.XTZ = exports.LUNA = exports.SYS = exports.SUI = exports.SUGAR = exports.STRAT = exports.XLM = exports.STASH = exports.FIS = exports.SLR = exports.SOL = exports.SMLY = exports.SLM = exports.CTK = exports.SDC = exports.SCRT = exports.SCRIBE = exports.SLS = exports.SAFE = exports.RBY = exports.RBTC = exports.RITO = exports.XRP = exports.RDD = exports.RVN = exports.RPD = exports.QTUM = exports.PUT = exports.PRJ = exports.POT = exports.POSW = exports.MATIC = exports.PIVX = exports.PINK = exports.PI = void 0;
exports.ZBC = exports.ZIL = exports.ZET = exports.ZCL = exports.ZEC = exports.YEC = exports.XUEZ = exports.XDC = exports.WC = exports.XWC = exports.WGR = void 0;
// Adcoin
exports.ACC = 'ACC';
// Akash-Network
exports.AKT = 'AKT';
// Algorand
exports.ALGO = 'ALGO';
// Anon
exports.ANON = 'ANON';
// Aptos
exports.APT = 'APT';
// Arbitrum
exports.ARB = 'ARB';
// Argoneum
exports.AGM = 'AGM';
// Artax
exports.XAX = 'XAX';
// Aryacoin
exports.AYA = 'AYA';
// Asiacoin
exports.AC = 'AC';
// Auroracoin
exports.AUR = 'AUR';
// Avalanche
exports.AVAX = 'AVAX';
// Avian
exports.AVN = 'AVN';
// Axe
exports.AXE = 'AXE';
// Axelar
exports.AXL = 'AXL';
// Band-Protocol
exports.BAND = 'BAND';
// Base
exports.BASE = 'BASE';
// Bata
exports.BTA = 'BTA';
// Beetle Coin
exports.BEET = 'BEET';
// Bela Coin
exports.BELA = 'BELA';
// Binance
exports.BNB = 'BNB';
// Bit Cloud
exports.BTDX = 'BTDX';
// Bitcoin
exports.BTC = 'BTC';
// Bitcoin Atom
exports.BCA = 'BCA';
// Bitcoin-Cash
exports.BCH = 'BCH';
// Bitcoin-Cash-SLP
exports.SLP = 'SLP';
// Bitcoin Gold
exports.BTG = 'BTG';
// Bitcoin-Green
exports.BITG = 'BITG';
// Bitcoin Plus
exports.XBC = 'XBC';
// Bitcoin-Private
exports.BTCP = 'BTCP';
// Bitcoin SV
exports.BSV = 'BSV';
// BitcoinZ
exports.BTCZ = 'BTCZ';
// Bitcore
exports.BTX = 'BTX';
// Bit Send
exports.BSD = 'BSD';
// Blackcoin
exports.BLK = 'BLK';
// Blocknode
exports.BND = 'BND';
// Block Stamp
exports.BST = 'BST';
// Bolivarcoin
exports.BOLI = 'BOLI';
// Brit Coin
exports.BRIT = 'BRIT';
// Canada eCoin
exports.CDN = 'CDN';
// Cannacoin
exports.CCN = 'CCN';
// Cardano
exports.ADA = 'ADA';
// Celo
exports.CELO = 'CELO';
// Chihuahua
exports.HUA = 'HUA';
// Clams
exports.CLAM = 'CLAM';
// Club Coin
exports.CLUB = 'CLUB';
// Compcoin
exports.CMP = 'CMP';
// Cosmos
exports.ATOM = 'ATOM';
// CPU Chain
exports.CPU = 'CPU';
// Crane Pay
exports.CRP = 'CRP';
// Crave
exports.CRAVE = 'CRAVE';
// Dash
exports.DASH = 'DASH';
// DeepOnion
exports.ONION = 'ONION';
// Defcoin
exports.DFC = 'DFC';
// Denarius
exports.DNR = 'DNR';
// Diamond
exports.DMD = 'DMD';
// Digi Byte
exports.DGB = 'DGB';
// Digitalcoin
exports.DGC = 'DGC';
// Divi
exports.DIVI = 'DIVI';
// Dogecoin
exports.DOGE = 'DOGE';
// dYdX
exports.DYDX = 'DYDX';
// eCash
exports.XEC = 'XEC';
// E-coin
exports.ECN = 'ECN';
// EDR Coin
exports.EDRC = 'EDRC';
// e-Gulden
exports.EFL = 'EFL';
// Einsteinium
exports.EMC2 = 'EMC2';
// Elastos
exports.ELA = 'ELA';
// Energi
exports.NRG = 'NRG';
// EOS
exports.EOS = 'EOS';
// Ergo
exports.ERG = 'ERG';
// Ethereum
exports.ETH = 'ETH';
// Europe Coin
exports.ERC = 'ERC';
// Evrmore
exports.EVR = 'EVR';
// Exclusive Coin
exports.EXCL = 'EXCL';
// Fantom
exports.FTM = 'FTM';
// Feathercoin
exports.FTC = 'FTC';
// Fetch.ai
exports.FET = 'FET';
// Filecoin
exports.FIL = 'FIL';
// Firo
exports.FIRO = 'FIRO';
// Firstcoin
exports.FRST = 'FRST';
// FIX
exports.FIX = 'FIX';
// Flashcoin
exports.FLASH = 'FLASH';
// Flux
exports.FLUX = 'FLUX';
// Foxdcoin
exports.FOXD = 'FOXD';
// Fuji Coin
exports.FJC = 'FJC';
// Game Credits
exports.GAME = 'GAME';
// GCR Coin
exports.GCR = 'GCR';
// Go Byte
exports.GBX = 'GBX';
// Gridcoin
exports.GRC = 'GRC';
// Groestl Coin
exports.GRS = 'GRS';
// Gulden
exports.NLG = 'NLG';
// Harmony
exports.ONE = 'ONE';
// Helleniccoin
exports.HNC = 'HNC';
// Hempcoin
exports.THC = 'THC';
// Horizen
exports.ZEN = 'ZEN';
// Huobi Token
exports.HT = 'HT';
// Hush
exports.HUSH = 'HUSH';
// ICON
exports.ICX = 'ICX';
// Injective
exports.INJ = 'INJ';
// InsaneCoin
exports.INSN = 'INSN';
// Internet Of People
exports.IOP = 'IOP';
// IRISnet
exports.IRIS = 'IRIS';
// IX Coin
exports.IXC = 'IXC';
// Jumbucks
exports.JBS = 'JBS';
// Kava
exports.KAVA = 'KAVA';
// Kobocoin
exports.KOBO = 'KOBO';
// Komodo
exports.KMD = 'KMD';
// Landcoin
exports.LDCN = 'LDCN';
// LBRY Credits
exports.LBC = 'LBC';
// Linx
exports.LINX = 'LINX';
// Litecoin
exports.LTC = 'LTC';
// Litecoin Cash
exports.LCC = 'LCC';
// LitecoinZ
exports.LTZ = 'LTZ';
// Lkrcoin
exports.LKR = 'LKR';
// Lynx
exports.LYNX = 'LYNX';
// Mazacoin
exports.MZC = 'MZC';
// Megacoin
exports.MEC = 'MEC';
// Metis
exports.METIS = 'METIS';
// Minexcoin
exports.MNX = 'MNX';
// Monacoin
exports.MONA = 'MONA';
// Monero
exports.XMR = 'XMR';
// Monk
exports.MONK = 'MONK';
// MultiversX
exports.EGLD = 'EGLD';
// Myriadcoin
exports.XMY = 'XMY';
// Namecoin
exports.NMC = 'NMC';
// Nano
exports.XNO = 'XNO';
// Navcoin
exports.NAV = 'NAV';
// Near
exports.NEAR = 'NEAR';
// Neblio
exports.NEBL = 'NEBL';
// Neo
exports.NEO = 'NEO';
// Neoscoin
exports.NEOS = 'NEOS';
// Neurocoin
exports.NRO = 'NRO';
// Neutron
exports.NTRN = 'NTRN';
// New York Coin
exports.NYC = 'NYC';
// Nine-Chronicles
exports.NCG = 'NCG';
// NIX
exports.NIX = 'NIX';
// Novacoin
exports.NVC = 'NVC';
// NuBits
exports.NBT = 'NBT';
// NuShares
exports.NSR = 'NSR';
// OK Cash
exports.OK = 'OK';
// OKT-Chain
exports.OKT = 'OKT';
// Omni
exports.OMNI = 'OMNI';
// Onix
exports.ONX = 'ONX';
// Ontology
exports.ONT = 'ONT';
// Optimism
exports.OP = 'OP';
// Osmosis
exports.OSMO = 'OSMO';
// Particl
exports.PART = 'PART';
// Peercoin
exports.PPC = 'PPC';
// Pesobit
exports.PSB = 'PSB';
// Phore
exports.PHR = 'PHR';
// Pi-Network
exports.PI = 'PI';
// Pinkcoin
exports.PINK = 'PINK';
// Pivx
exports.PIVX = 'PIVX';
// Polygon
exports.MATIC = 'MATIC';
// PoSW Coin
exports.POSW = 'POSW';
// Potcoin
exports.POT = 'POT';
// Project Coin
exports.PRJ = 'PRJ';
// Putincoin
exports.PUT = 'PUT';
// Qtum
exports.QTUM = 'QTUM';
// Rapids
exports.RPD = 'RPD';
// Ravencoin
exports.RVN = 'RVN';
// Reddcoin
exports.RDD = 'RDD';
// Ripple
exports.XRP = 'XRP';
// Ritocoin
exports.RITO = 'RITO';
// RSK
exports.RBTC = 'RBTC';
// Rubycoin
exports.RBY = 'RBY';
// Safecoin
exports.SAFE = 'SAFE';
// Saluscoin
exports.SLS = 'SLS';
// Scribe
exports.SCRIBE = 'SCRIBE';
// Secret
exports.SCRT = 'SCRT';
// Shadow Cash
exports.SDC = 'SDC';
// Shentu
exports.CTK = 'CTK';
// Slimcoin
exports.SLM = 'SLM';
// Smileycoin
exports.SMLY = 'SMLY';
// Solana
exports.SOL = 'SOL';
// Solarcoin
exports.SLR = 'SLR';
// Stafi
exports.FIS = 'FIS';
// Stash
exports.STASH = 'STASH';
// Stellar
exports.XLM = 'XLM';
// Stratis
exports.STRAT = 'STRAT';
// Sugarchain
exports.SUGAR = 'SUGAR';
// Sui
exports.SUI = 'SUI';
// Syscoin
exports.SYS = 'SYS';
// Terra
exports.LUNA = 'LUNA';
// Tezos
exports.XTZ = 'XTZ';
// Theta
exports.THETA = 'THETA';
// Thought AI
exports.THT = 'THT';
// TOA Coin
exports.TOA = 'TOA';
// Tron
exports.TRX = 'TRX';
// TWINS
exports.TWINS = 'TWINS';
// Ultimate Secure Cash
exports.USC = 'USC';
// Unobtanium
exports.UNO = 'UNO';
// Vcash
exports.VC = 'VC';
// VeChain
exports.VET = 'VET';
// Verge
exports.XVG = 'XVG';
// Vertcoin
exports.VTC = 'VTC';
// Viacoin
exports.VIA = 'VIA';
// Vivo
exports.VIVO = 'VIVO';
// Voxels
exports.VOX = 'VOX';
// Virtual Cash
exports.VASH = 'VASH';
// Wagerr
exports.WGR = 'WGR';
// Whitecoin
exports.XWC = 'XWC';
// Wincoin
exports.WC = 'WC';
// XinFin
exports.XDC = 'XDC';
// XUEZ
exports.XUEZ = 'XUEZ';
// Ycash
exports.YEC = 'YEC';
// Zcash
exports.ZEC = 'ZEC';
// ZClassic
exports.ZCL = 'ZCL';
// Zetacoin
exports.ZET = 'ZET';
// Zilliqa
exports.ZIL = 'ZIL';
// ZooBC
exports.ZBC = 'ZBC';
//# sourceMappingURL=symbols.js.map