MNEMONICS
==========

.. js:autoclass:: mnemonic.Mnemonic
   :members:

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

.. js:autoclass:: algorand/mnemonic.AlgorandMnemonic
   :members:

   >>> const { MNEMONICS, AlgorandMnemonic, ALGORAND_MNEMONIC_STRENGTHS } = await import('./src/mnemonics/index.js');
   >>> MNEMONICS.names()
   console.log('>>> MNEMONICS.names()');
   console.log(MNEMONICS.getNames());
   // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
   >>> MNEMONICS.classes()
   console.log('\n>>> MNEMONICS.classes()');
   console.log(MNEMONICS.getClasses());
   // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], ... ]
   >>> MNEMONICS.getMnemonicClass("Algorand")
   console.log('\n>>> MNEMONICS.getMnemonicClass("Algorand")');
   console.log(MNEMONICS.getMnemonicClass("Algorand"));
   // Output: [class AlgorandMnemonic]
   >>> MNEMONICS.getMnemonicClass("Algorand") === AlgorandMnemonic
   console.log('\n>>> MNEMONICS.getMnemonicClass("Algorand") === AlgorandMnemonic');
   console.log(MNEMONICS.getMnemonicClass("Algorand") === AlgorandMnemonic);
   // Output: true
   >>> MNEMONICS.isMnemonic("Algorand")
   console.log('\n>>> MNEMONICS.isMnemonic("Algorand")');
   console.log(MNEMONICS.isMnemonic("Algorand"));
   // Output: true
   >>> ALGORAND_MNEMONIC_STRENGTHS.TWENTY_FIVE
   console.log('\n>>> ALGORAND_MNEMONIC_STRENGTHS.TWENTY_FIVE');
   console.log(ALGORAND_MNEMONIC_STRENGTHS.TWENTY_FIVE);
   // Output: 25

.. js:autoclass:: bip39/mnemonic.BIP39Mnemonic
   :members:

    >>> const { MNEMONICS, BIP39Mnemonic, BIP39_MNEMONIC_STRENGTHS } = await import('./src/mnemonics/index.js');
    >>> MNEMONICS.names()
    console.log('>>> MNEMONICS.names()');
    console.log(MNEMONICS.getNames());
    // Output: [ 'Algorand', 'BIP39', 'Electrum-V1', 'Electrum-V2', 'Monero' ]
    >>> MNEMONICS.classes()
    console.log('\n>>> MNEMONICS.classes()');
    console.log(MNEMONICS.getClasses());
    // Output: [ [class AlgorandMnemonic], [class BIP39Mnemonic], ... ]
    >>> MNEMONICS.getMnemonicClass("BIP39")
    console.log('\n>>> MNEMONICS.getMnemonicClass("BIP39")');
    console.log(MNEMONICS.getMnemonicClass("BIP39"));
    // Output: [class BIP39Mnemonic]
    >>> MNEMONICS.getMnemonicClass("BIP39") === BIP39Mnemonic
    console.log('\n>>> MNEMONICS.getMnemonicClass("BIP39") === BIP39Mnemonic');
    console.log(MNEMONICS.getMnemonicClass("BIP39") === BIP39Mnemonic);
    // Output: true
    >>> MNEMONICS.isMnemonic("BIP39")
    console.log('\n>>> MNEMONICS.isMnemonic("BIP39")');
    console.log(MNEMONICS.isMnemonic("BIP39"));
    // Output: true
    >>> BIP39_MNEMONIC_STRENGTHS.TWELVE
    console.log('\n>>> BIP39_MNEMONIC_STRENGTHS.TWELVE');
    console.log(BIP39_MNEMONIC_STRENGTHS.TWELVE);
    // Output: 12
    >>> BIP39_MNEMONIC_STRENGTHS.TWENTY_FOUR
    console.log('\n>>> BIP39_MNEMONIC_STRENGTHS.TWENTY_FOUR');
    console.log(BIP39_MNEMONIC_STRENGTHS.TWENTY_FOUR);
    // Output: 24
