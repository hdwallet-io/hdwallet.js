ENTROPIES
==========

.. js:autoclass:: entropy.Entropy
   :members:

.. js:autoclass:: index.ENTROPIES
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 20 80

      * - Name
        - Class
      * - Algorand
        - :js:class:`algorand.AlgorandEntropy`
      * - BIP39
        - :js:class:`bip39.BIP39Entropy`
      * - Electrum-V1
        - :js:class:`electrum.v1.ElectrumV1Entropy`
      * - Electrum-V2
        - :js:class:`electrum.v2.ElectrumV2Entropy`
      * - Monero
        - :js:class:`monero.MoneroEntropy`



.. js:autoclass:: algorand.AlgorandEntropy
   :members:

   >>> const { ENTROPIES, AlgorandEntropy, ALGORAND_ENTROPY_STRENGTHS } = await import('./src/entropies/index.js');
   >>> ENTROPIES.names()
   console.log('>>> ENTROPIES.names()');
   console.log(ENTROPIES.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   >>> ENTROPIES.classes()
   console.log('\n>>> ENTROPIES.classes()');
   console.log(ENTROPIES.getClasses());
   // Output: [ [class AlgorandEntropy], [class BIP39Entropy], ... ]
   >>> ENTROPIES.getEntropyClass("Algorand")
   console.log('\n>>> ENTROPIES.getEntropyClass("Algorand")');
   console.log(ENTROPIES.getEntropyClass("Algorand"));
   // Output: [class AlgorandEntropy]
   >>> ENTROPIES.getEntropyClass("Algorand") === AlgorandEntropy
   console.log('\n>>> ENTROPIES.getEntropyClass("Algorand") === AlgorandEntropy');
   console.log(ENTROPIES.getEntropyClass("Algorand") === AlgorandEntropy);
   // Output: true
   >>> ENTROPIES.isEntropy("Algorand")
   console.log('\n>>> ENTROPIES.isEntropy("Algorand")');
   console.log(ENTROPIES.isEntropy("Algorand"));
   // Output: true
   >>> ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
   console.log('\n>>> ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX');
   console.log(ALGORAND_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX);
   // Output: 256



.. js:autoclass:: bip39.BIP39Entropy
   :members:

   >>> const { ENTROPIES, BIP39Entropy } = await import('./src/entropies/index.js');
   >>> ENTROPIES.names()
   console.log('>>> ENTROPIES.names()');
   console.log(ENTROPIES.getNames());
   Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   >>> ENTROPIES.classes()
   console.log('\n>>> ENTROPIES.classes()');
   console.log(ENTROPIES.getClasses());
   // Output: [ [class AlgorandEntropy], [class BIP39Entropy], ... ]
   >>> ENTROPIES.getEntropyClass("BIP39")
   console.log('\n>>> ENTROPIES.getEntropyClass("BIP39")');
   console.log(ENTROPIES.getEntropyClass("BIP39"));
   Output: [class BIP39Entropy]
   >>> ENTROPIES.getEntropyClass("BIP39") === BIP39Entropy
   console.log('\n>>> ENTROPIES.getEntropyClass("BIP39") === BIP39Entropy');
   console.log(ENTROPIES.getEntropyClass("BIP39") === BIP39Entropy);
   Output: true
   >>> ENTROPIES.isEntropy("Electrum-V2")
   console.log('\n>>> ENTROPIES.isEntropy("Electrum-V2")');
   console.log(ENTROPIES.isEntropy("Electrum-V2"));
   Output: true


.. js:autoclass:: monero.MoneroEntropy
   :members:


   >>> const { ENTROPIES, MoneroEntropy, MONERO_ENTROPY_STRENGTHS } = await import('./src/entropies/index.js');

   >>> ENTROPIES.names()
   console.log(ENTROPIES.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' 
   >>> ENTROPIES.classes()
   console.log(ENTROPIES.getClasses());
   // Output: [ [class AlgorandEntropy], [class BIP39Entropy], ..., [class MoneroEntropy] ]
   >>> ENTROPIES.getEntropyClass("Monero")
   console.log(ENTROPIES.getEntropyClass("Monero"));
   // Output: [class MoneroEntropy]
   >>> ENTROPIES.getEntropyClass("Monero") === MoneroEntropy
   console.log(ENTROPIES.getEntropyClass("Monero") === MoneroEntropy);
   // Output: true
   >>> ENTROPIES.isEntropy("Monero")
   console.log(ENTROPIES.isEntropy("Monero"));
   // Output: true
   >>> MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
   console.log(MONERO_ENTROPY_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT);
   // Output: 128
   >>> MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
   console.log(MONERO_ENTROPY_STRENGTHS.TWO_HUNDRED_FIFTY_SIX);
   // Output: 256
   >>> MoneroEntropy.strengths
   console.log(MoneroEntropy.strengths);
   // Output: [128, 256]
   >>> MoneroEntropy.getName()
   console.log(MoneroEntropy.getName());
   // Output: 'Monero'


