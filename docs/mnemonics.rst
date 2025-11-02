MNEMONICS
==========

.. js:autoclass:: index.MNEMONICS
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 20 80

      * - Name
        - Class
      * - Algorand
        - :js:class:`algorand.mnemonic.AlgorandMnemonic`
      * - BIP39
        - :js:class:`bip39.mnemonic.BIP39Mnemonic`
      * - Electrum-V1
        - :js:class:`electrum.v1.mnemonic.ElectrumV1Mnemonic`
      * - Electrum-V2
        - :js:class:`electrum.v2.mnemonic.ElectrumV2Mnemonic`
      * - Monero
        - :js:class:`monero.mnemonic.MoneroMnemonic`

.. js:autoclass:: mnemonic.Mnemonic
   :members:

.. js:autoclass:: algorand/mnemonic.AlgorandMnemonic
   :members:

.. code-block:: javascript

   const { MNEMONICS, AlgorandMnemonic, ALGORAND_MNEMONIC_STRENGTHS } = await import('./src/mnemonics/index.js');
   MNEMONICS.names()
   console.log(MNEMONICS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   MNEMONICS.classes()
   console.log(MNEMONICS.getClasses());
   // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], ... ]
   MNEMONICS.getMnemonicClass("Algorand")
   console.log(MNEMONICS.getMnemonicClass("Algorand"));
   // Output: [class AlgorandMnemonic]
   MNEMONICS.getMnemonicClass("Algorand") === AlgorandMnemonic
   console.log(MNEMONICS.getMnemonicClass("Algorand") === AlgorandMnemonic);
   // Output: true
   MNEMONICS.isMnemonic("Algorand")
   console.log(MNEMONICS.isMnemonic("Algorand"));
   // Output: true
   ALGORAND_MNEMONIC_STRENGTHS.TWENTY_FIVE
   console.log(ALGORAND_MNEMONIC_STRENGTHS.TWENTY_FIVE);
   // Output: 25

.. js:autoclass:: bip39/mnemonic.BIP39Mnemonic
   :members:

.. code-block:: javascript

    const { MNEMONICS, BIP39Mnemonic, BIP39_MNEMONIC_STRENGTHS } = await import('./src/mnemonics/index.js');
    MNEMONICS.names()
    console.log(MNEMONICS.getNames());
    // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
    MNEMONICS.classes()
    console.log(MNEMONICS.getClasses());
    // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], ... ]
    MNEMONICS.getMnemonicClass("BIP39")
    console.log(MNEMONICS.getMnemonicClass("BIP39"));
    // Output: [class BIP39Mnemonic]
    MNEMONICS.getMnemonicClass("BIP39") === BIP39Mnemonic
    console.log(MNEMONICS.getMnemonicClass("BIP39") === BIP39Mnemonic);
    // Output: true
    MNEMONICS.isMnemonic("BIP39")
    console.log(MNEMONICS.isMnemonic("BIP39"));
    // Output: true
    BIP39_MNEMONIC_STRENGTHS.TWELVE
    console.log(BIP39_MNEMONIC_STRENGTHS.TWELVE);
    // Output: 12
    BIP39_MNEMONIC_STRENGTHS.TWENTY_FOUR
    console.log(BIP39_MNEMONIC_STRENGTHS.TWENTY_FOUR);
    // Output: 24

.. js:autoclass:: electrum/v1/mnemonic.ElectrumV1Mnemonic
   :members:

.. code-block:: javascript

   const { MNEMONICS, ElectrumV1Mnemonic, ELECTRUM_V1_MNEMONIC_WORDS, ELECTRUM_V1_MNEMONIC_LANGUAGES } = await import('./src/mnemonics/index.js');
   MNEMONICS.names()
   console.log(MNEMONICS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   MNEMONICS.classes()
   console.log(MNEMONICS.getClasses());
   // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], [class ElectrumV1Mnemonic], ... ]
   MNEMONICS.getMnemonicClass("Electrum-V1")
   console.log(MNEMONICS.getMnemonicClass("Electrum-V1"));
   // Output: [class ElectrumV1Mnemonic]
   MNEMONICS.getMnemonicClass("Electrum-V1") === ElectrumV1Mnemonic
   console.log(MNEMONICS.getMnemonicClass("Electrum-V1") === ElectrumV1Mnemonic);
   // Output: true
   MNEMONICS.isMnemonic("Electrum-V1")
   console.log(MNEMONICS.isMnemonic("Electrum-V1"));
   // Output: true
   ELECTRUM_V1_MNEMONIC_WORDS.TWELVE
   console.log(ELECTRUM_V1_MNEMONIC_WORDS.TWELVE);
   // Output: 12
   ELECTRUM_V1_MNEMONIC_LANGUAGES.ENGLISH
   console.log(ELECTRUM_V1_MNEMONIC_LANGUAGES.ENGLISH);
   // Output: 'english'


.. js:autoclass:: electrum/v2/mnemonic.ElectrumV2Mnemonic
   :members:

.. code-block:: javascript

    const { MNEMONICS, ElectrumV2Mnemonic, ELECTRUM_V2_MNEMONIC_WORDS, ELECTRUM_V2_MNEMONIC_LANGUAGES, ELECTRUM_V2_MNEMONIC_TYPES } = await import('./src/mnemonics/index.js');
    MNEMONICS.names()
    console.log(MNEMONICS.getNames());
    // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
    MNEMONICS.classes()
    console.log(MNEMONICS.getClasses());
    // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], [class ElectrumV1Mnemonic], [class ElectrumV2Mnemonic], [class MoneroMnemonic] ]
    MNEMONICS.getMnemonicClass("Electrum-V2")
    console.log(MNEMONICS.getMnemonicClass("Electrum-V2"));
    // Output: [class ElectrumV2Mnemonic]
    MNEMONICS.getMnemonicClass("Electrum-V2") === ElectrumV2Mnemonic
    console.log(MNEMONICS.getMnemonicClass("Electrum-V2") === ElectrumV2Mnemonic);
    // Output: true
    MNEMONICS.isMnemonic("Electrum-V2")
    console.log(MNEMONICS.isMnemonic("Electrum-V2"));
    // Output: true
    ELECTRUM_V2_MNEMONIC_WORDS.TWELVE
    console.log(ELECTRUM_V2_MNEMONIC_WORDS.TWELVE);
    // Output: 12
    ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR
    console.log(ELECTRUM_V2_MNEMONIC_WORDS.TWENTY_FOUR);
    // Output: 24
    ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH
    console.log(ELECTRUM_V2_MNEMONIC_LANGUAGES.ENGLISH);
    // Output: 'english'
    ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT
    console.log(ELECTRUM_V2_MNEMONIC_TYPES.SEGWIT);
    // Output: 'segwit'

.. js:autoclass:: monero/mnemonic.MoneroMnemonic
   :members:

.. code-block:: javascript

    const { MNEMONICS, MoneroMnemonic, MONERO_MNEMONIC_STRENGTHS } = await import('./src/mnemonics/index.js');
    MNEMONICS.names()
    console.log(MNEMONICS.getNames());
    // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
    MNEMONICS.classes()
    console.log(MNEMONICS.getClasses());
    // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], ... ]
    MNEMONICS.getMnemonicClass("Monero")
    console.log(MNEMONICS.getMnemonicClass("Monero"));
    // Output: [class MoneroMnemonic]
    MNEMONICS.getMnemonicClass("Monero") === MoneroMnemonic
    console.log(MNEMONICS.getMnemonicClass("Monero") === MoneroMnemonic);
    // Output: true
    MNEMONICS.isMnemonic("Monero")
    console.log(MNEMONICS.isMnemonic("Monero"));
    // Output: true
    MONERO_MNEMONIC_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT
    console.log(MONERO_MNEMONIC_STRENGTHS.ONE_HUNDRED_TWENTY_EIGHT);
    // Output: 128
    MONERO_MNEMONIC_STRENGTHS.TWO_HUNDRED_FIFTY_SIX
    console.log(MONERO_MNEMONIC_STRENGTHS.TWO_HUNDRED_FIFTY_SIX);
    // Output: 256


