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
        - :js:class:`electrum/v1.ElectrumV1Seed`
      * - Electrum-V2
        - :js:class:`electrum/v2.ElectrumV2Seed`
      * - Monero
        - :js:class:`monero.MoneroSeed`

.. js:autoclass:: algorand.AlgorandSeed
   :members:

   >>> const { SEEDS, AlgorandSeed } = await import('./src/seeds/index.js');
   >>> SEEDS.getNames()
   console.log('>>> SEEDS.getNames()');
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   >>> SEEDS.getClasses()
   console.log('\n>>> SEEDS.getClasses()');
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   >>> SEEDS.getSeedClass("Algorand")
   console.log('\n>>> SEEDS.getSeedClass("Algorand")');
   console.log(SEEDS.getSeedClass("Algorand"));
   // Output: [class AlgorandSeed]
   >>> SEEDS.getSeedClass("Algorand") === AlgorandSeed
   console.log('\n>>> SEEDS.getSeedClass("Algorand") === AlgorandSeed');
   console.log(SEEDS.getSeedClass("Algorand") === AlgorandSeed);
   // Output: true
   >>> SEEDS.isSeed("Algorand")
   console.log('\n>>> SEEDS.isSeed("Algorand")');
   console.log(SEEDS.isSeed("Algorand"));
   // Output: true
   >>> AlgorandSeed.getName()
   console.log('\n>>> AlgorandSeed.getName()');
   console.log(AlgorandSeed.getName());
   // Output: 'Algorand'

.. js:autoclass:: bip39.BIP39Seed
   :members:

   >>> const { SEEDS, BIP39Seed } = await import('./src/seeds/index.js');
   >>> SEEDS.getNames()
   console.log('>>> SEEDS.getNames()');
   console.log(SEEDS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Cardano', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   >>> SEEDS.getClasses()
   console.log('\n>>> SEEDS.getClasses()');
   console.log(SEEDS.getClasses());
   // Output: [ [class AlgorandSeed], [class BIP39Seed], [class CardanoSeed], [class ElectrumV1Seed], [class ElectrumV2Seed], [class MoneroSeed] ]
   >>> SEEDS.getSeedClass("BIP39")
   console.log('\n>>> SEEDS.getSeedClass("BIP39")');
   console.log(SEEDS.getSeedClass("BIP39"));
   // Output: [class BIP39Seed]
   >>> SEEDS.getSeedClass("BIP39") === BIP39Seed
   console.log('\n>>> SEEDS.getSeedClass("BIP39") === BIP39Seed');
   console.log(SEEDS.getSeedClass("BIP39") === BIP39Seed);
   // Output: true
   >>> SEEDS.isSeed("BIP39")
   console.log('\n>>> SEEDS.isSeed("BIP39")');
   console.log(SEEDS.isSeed("BIP39"));
   // Output: true
   >>> BIP39Seed.getName()
   console.log('\n>>> BIP39Seed.getName()');
   console.log(BIP39Seed.getName());
   // Output: 'BIP39'
   >>> const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
   >>> const seed = BIP39Seed.fromMnemonic(mnemonic, { passphrase: 'optional-passphrase' });
   console.log('\n>>> BIP39Seed.fromMnemonic(...)');
   console.log(seed);
   // Output: '5eb00bbddcf069084889a8ab9155568165f5c1e76e3b1d7d0...'
