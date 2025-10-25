SEEDS
=====

.. js:autoclass:: seed.Seed
   :members:

.. js:autoclass:: index.SEEDS
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 20 80

      * - Name
        - Class
      * - Algorand
        - :js:class:`algorand.AlgorandSeed`
      * - BIP39
        - :js:class:`bip39.BIP39Seed`
      * - Cardano
        - :js:class:`cardano.CardanoSeed`
      * - Electrum-V1
        - :js:class:`electrum.v1.ElectrumV1Seed`
      * - Electrum-V2
        - :js:class:`electrum.v2.ElectrumV2Seed`
      * - Monero
        - :js:class:`monero.MoneroSeed`

.. js:autoclass:: algorand.AlgorandSeed
   :members:

   const { SEEDS, AlgorandSeed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("Algorand")
   console.log(SEEDS.getSeedClass("Algorand"));
   // Output: [class AlgorandSeed]
   SEEDS.getSeedClass("Algorand") === AlgorandSeed
   console.log(SEEDS.getSeedClass("Algorand") === AlgorandSeed);
   // Output: true
   SEEDS.isSeed("Algorand")
   console.log(SEEDS.isSeed("Algorand"));
   // Output: true
   AlgorandSeed.getName()
   console.log(AlgorandSeed.getName());
   // Output: 'Algorand'

.. js:autoclass:: bip39.BIP39Seed
   :members:

   const { SEEDS, BIP39Seed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("BIP39")
   console.log(SEEDS.getSeedClass("BIP39"));
   // Output: [class BIP39Seed]
   SEEDS.getSeedClass("BIP39") === BIP39Seed
   console.log(SEEDS.getSeedClass("BIP39") === BIP39Seed);
   // Output: true
   SEEDS.isSeed("BIP39")
   console.log(SEEDS.isSeed("BIP39"));
   // Output: true
   BIP39Seed.getName()
   console.log(BIP39Seed.getName());
   // Output: 'BIP39'
   const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
   const seed = BIP39Seed.fromMnemonic(mnemonic, { passphrase: 'optional-passphrase' });
   console.log('BIP39Seed.fromMnemonic(...)');
   console.log(seed);
   // Output: '5eb00bbddcf069084889a8ab9155568165f5c1e76e3b1d7d0...'


.. js:autoclass:: cardano.CardanoSeed
   :members:

   const { SEEDS, CardanoSeed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("Cardano")
   console.log(SEEDS.getSeedClass("Cardano"));
   // Output: [class CardanoSeed]
   SEEDS.getSeedClass("Cardano") === CardanoSeed
   console.log(SEEDS.getSeedClass("Cardano") === CardanoSeed);
   // Output: true
   SEEDS.isSeed("Cardano")
   console.log(SEEDS.isSeed("Cardano"));
   // Output: true
   CardanoSeed.getName()
   console.log(CardanoSeed.getName());
   // Output: 'Cardano'
   const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
   const seedByronIcarus = CardanoSeed.fromMnemonic(mnemonic, { cardanoType: 'Byron-Icarus' });
   console.log('CardanoSeed.fromMnemonic(..., { cardanoType: "Byron-Icarus" })');
   console.log(seedByronIcarus);
   // Output: 'b19d5f1e4d5e24e3d7a09c3b5fbe1b4f7e...'
   const seedShelleyLedger = CardanoSeed.fromMnemonic(mnemonic, { cardanoType: 'Shelley-Ledger', passphrase: 'my-passphrase' });
   console.log('CardanoSeed.fromMnemonic(..., { cardanoType: "Shelley-Ledger", passphrase: "my-passphrase" })');
   console.log(seedShelleyLedger);
   // Output: '6ab00cfde91e56b4889a8ab9155568165f...'


.. js:autoclass:: monero.MoneroSeed
   :members:

   const { SEEDS, MoneroSeed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("Monero")
   console.log(SEEDS.getSeedClass("Monero"));
   // Output: [class MoneroSeed]
   SEEDS.getSeedClass("Monero") === MoneroSeed
   console.log(SEEDS.getSeedClass("Monero") === MoneroSeed);
   // Output: true
   SEEDS.isSeed("Monero")
   console.log(SEEDS.isSeed("Monero"));
   // Output: true
   MoneroSeed.getName()
   console.log(MoneroSeed.getName());
   // Output: 'Monero'
   const mnemonic = 'abbey academic acid acrobat ...'; // 25-word Monero mnemonic
   const seed = MoneroSeed.fromMnemonic(mnemonic);
   console.log('MoneroSeed.fromMnemonic(...)');
   console.log(seed);
   // Output: '4f8c9a1b9a2e6d3b4c5e2d1f0a9b8c7d6e5f4c3b2a1d0e9f8c7b6a5d4e3f2a1b'

.. js:autoclass:: electrum/v1.ElectrumV1Seed
   :members:

   const { SEEDS, ElectrumV1Seed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("Electrum-V1")
   console.log(SEEDS.getSeedClass("Electrum-V1"));
   // Output: [class ElectrumV1Seed]
   SEEDS.getSeedClass("Electrum-V1") === ElectrumV1Seed
   console.log(SEEDS.getSeedClass("Electrum-V1") === ElectrumV1Seed);
   // Output: true
   SEEDS.isSeed("Electrum-V1")
   console.log(SEEDS.isSeed("Electrum-V1"));
   // Output: true
   ElectrumV1Seed.getName()
   console.log(ElectrumV1Seed.getName());
   // Output: 'Electrum-V1'
   const mnemonic = 'all all all all all all all all all all all all';
   const seed = ElectrumV1Seed.fromMnemonic(mnemonic);
   console.log(seed);
   // Output: 'c7d5f32a1b4f6e8d9a0b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f50617'


.. js:autoclass:: electrum/v2.ElectrumV2Seed
   :members:

   const { SEEDS, ElectrumV2Seed } = await import('./src/seeds/index.js');
   SEEDS.getNames()
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   SEEDS.getClasses()
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   SEEDS.getSeedClass("Electrum-V2")
   console.log(SEEDS.getSeedClass("Electrum-V2"));
   // Output: [class ElectrumV2Seed]
   SEEDS.getSeedClass("Electrum-V2") === ElectrumV2Seed
   console.log(SEEDS.getSeedClass("Electrum-V2") === ElectrumV2Seed);
   // Output: true
   SEEDS.isSeed("Electrum-V2")
   console.log(SEEDS.isSeed("Electrum-V2"));
   // Output: true
   ElectrumV2Seed.getName()
   console.log(ElectrumV2Seed.getName());
   // Output: 'Electrum-V2'
   const mnemonic = 'like breeze vast morning vapor sense task desert vivid token frost jungle';
   const seed = ElectrumV2Seed.fromMnemonic(mnemonic, { mnemonicType: 'standard' });
   console.log('ElectrumV2Seed.fromMnemonic(...)');
   console.log(seed);
   // Output: 'd3c5a47b1c3e9f2d8a5c6e7f9b0a1d3e4f5061728394a5b6c7d8e9f0a1b2c3d4'
   const instance = new ElectrumV2Seed(mnemonic, { mnemonicType: 'segwit' });
   console.log('instance.getMnemonicType()');
   console.log(instance.getMnemonicType());
   // Output: 'segwit'
