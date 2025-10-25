Derivations
===========

.. js:autoclass:: derivation.Derivation
   :members:

.. js:autoclass:: index.DERIVATIONS
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 20 80

      * - Name
        - Class
      * - Custom
        - :js:class:`custom.CustomDerivation`
      * - BIP44
        - :js:class:`bip44.BIP44Derivation`
      * - BIP49
        - :js:class:`bip49.BIP49Derivation`
      * - BIP84
        - :js:class:`bip84.BIP84Derivation`
      * - BIP86
        - :js:class:`bip86.BIP86Derivation`
      * - CIP1852
        - :js:class:`cip1852.CIP1852Derivation`
      * - Electrum
        - :js:class:`electrum.ElectrumDerivation`
      * - Monero
        - :js:class:`monero.MoneroDerivation`
      * - HDW
        - :js:class:`hdw.HDWDerivation`

.. js:autoclass:: bip44.BIP44Derivation
   :members:

   const { DERIVATIONS, BIP44Derivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', ... ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], [class BIP49Derivation], [class BIP84Derivation], ... ]
   DERIVATIONS.getDerivationClass("BIP44")
   console.log(DERIVATIONS.getDerivationClass("BIP44"));
   // Output: [class BIP44Derivation]
   DERIVATIONS.getDerivationClass("BIP44") === BIP44Derivation
   console.log(DERIVATIONS.getDerivationClass("BIP44") === BIP44Derivation);
   // Output: true
   DERIVATIONS.isDerivation("BIP44")
   console.log(DERIVATIONS.isDerivation("BIP44"));
   // Output: true
   BIP44Derivation.getName()
   console.log(BIP44Derivation.getName());
   // Output: 'BIP44'
   const derivation = new BIP44Derivation({
   ...   coinType: 0,  // Bitcoin
   ...   account: 0,
   ...   change: 'external-chain',
   ...   address: 0
   ... });
   console.log('\n>>> new BIP44Derivation(...)');
   console.log(derivation);
   // Output: BIP44 derivation path: m/44'/0'/0'/0/0
   derivation.fromAccount(1).fromChange('internal-chain').fromAddress(5);
   console.log('derivation.fromAccount(1).fromChange("internal-chain").fromAddress(5)');
   console.log(derivation);
   // Output: m/44'/0'/1'/1/5
   derivation.clean();
   console.log('derivation.clean()');
   console.log(derivation);
   // Output: m/44'/0'/0'/0/0
   console.log(derivation.getPurpose());
   // Output: 44
   console.log(derivation.getCoinType());
   // Output: 0
   console.log(derivation.getChange());
   // Output: 'external-chain'


.. js:autoclass:: bip49.BIP49Derivation
   :members:

   const { DERIVATIONS, BIP49Derivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log('DERIVATIONS.getNames()');
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', ... ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], [class BIP49Derivation], [class BIP84Derivation], ... ]
   DERIVATIONS.getDerivationClass("BIP49")
   console.log(DERIVATIONS.getDerivationClass("BIP49"));
   // Output: [class BIP49Derivation]
   DERIVATIONS.getDerivationClass("BIP49") === BIP49Derivation
   console.log(DERIVATIONS.getDerivationClass("BIP49") === BIP49Derivation);
   // Output: true
   DERIVATIONS.isDerivation("BIP49")
   console.log(DERIVATIONS.isDerivation("BIP49"));
   // Output: true
   BIP49Derivation.getName()
   console.log(BIP49Derivation.getName());
   // Output: 'BIP49'
   const derivation = new BIP49Derivation({
   ...   coinType: 0,  // Bitcoin
   ...   account: 0,
   ...   change: 'external-chain',
   ...   address: 0
   ... });
   console.log(derivation);
   // Output: BIP49 derivation path: m/49'/0'/0'/0/0
   derivation.fromAccount(1).fromChange('internal-chain').fromAddress(5);
   console.log(derivation);
   // Output: m/49'/0'/1'/1/5
   derivation.clean();
   console.log('\n>>> derivation.clean()');
   console.log(derivation);
   // Output: m/49'/0'/0'/0/0
   console.log(derivation.getPurpose());
   // Output: 49
   console.log(derivation.getCoinType());
   // Output: 0
   console.log(derivation.getChange());
   // Output: 'external-chain'


.. js:autoclass:: bip84.BIP84Derivation
   :members:

   const { DERIVATIONS, BIP84Derivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', ... ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], [class BIP49Derivation], [class BIP84Derivation], ... ]
   DERIVATIONS.getDerivationClass("BIP84")
   console.log(DERIVATIONS.getDerivationClass("BIP84"));
   // Output: [class BIP84Derivation]
   DERIVATIONS.getDerivationClass("BIP84") === BIP84Derivation
   console.log(DERIVATIONS.getDerivationClass("BIP84") === BIP84Derivation);
   // Output: true
   DERIVATIONS.isDerivation("BIP84")
   console.log(DERIVATIONS.isDerivation("BIP84"));
   // Output: true
   BIP84Derivation.getName()
   console.log(BIP84Derivation.getName());
   // Output: 'BIP84'
   const derivation = new BIP84Derivation({
   ...   coinType: 0,  // Bitcoin
   ...   account: 0,
   ...   change: 'external-chain',
   ...   address: 0
   ... });
   console.log('\n>>> new BIP84Derivation(...)');
   console.log(derivation);
   // Output: BIP84 derivation path: m/84'/0'/0'/0/0
   derivation.fromAccount(2).fromChange('internal-chain').fromAddress(7);
   console.log(derivation);
   // Output: m/84'/0'/2'/1/7
   derivation.clean();
   console.log(derivation);
   // Output: m/84'/0'/0'/0/0
   console.log(derivation.getPurpose());
   // Output: 84
   console.log(derivation.getCoinType());
   // Output: 0
   console.log(derivation.getChange());
   // Output: 'external-chain'



.. js:autoclass:: bip86.BIP86Derivation
   :members:

   const { DERIVATIONS, BIP86Derivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', ... ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], [class BIP49Derivation], [class BIP84Derivation], [class BIP86Derivation], ... ]
   DERIVATIONS.getDerivationClass("BIP86")
   console.log(DERIVATIONS.getDerivationClass("BIP86"));
   // Output: [class BIP86Derivation]
   DERIVATIONS.getDerivationClass("BIP86") === BIP86Derivation
   console.log(DERIVATIONS.getDerivationClass("BIP86") === BIP86Derivation);
   // Output: true
   DERIVATIONS.isDerivation("BIP86")
   console.log(DERIVATIONS.isDerivation("BIP86"));
   // Output: true
   BIP86Derivation.getName()
   console.log(BIP86Derivation.getName());
   // Output: 'BIP86'
   const derivation = new BIP86Derivation({
   ...   coinType: 0,  // Bitcoin
   ...   account: 0,
   ...   change: 'external-chain',
   ...   address: 0
   ... });
   console.log(derivation);
   // Output: BIP86 derivation path: m/86'/0'/0'/0/0
   derivation.fromAccount(1).fromChange('internal-chain').fromAddress(5);
   console.log('derivation.fromAccount(1).fromChange("internal-chain").fromAddress(5)');
   console.log(derivation);
   // Output: m/86'/0'/1'/1/5
   derivation.clean();
   console.log(derivation);
   // Output: m/86'/0'/0'/0/0
   console.log(derivation.getPurpose());
   // Output: 86
   console.log(derivation.getCoinType());
   // Output: 0
   console.log(derivation.getChange());
   // Output: 'external-chain'



.. js:autoclass:: cip1852.CIP1852Derivation
   :members:

   const { DERIVATIONS, CIP1852Derivation, ROLES } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', ... ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], ..., [class CIP1852Derivation], ... ]
   DERIVATIONS.getDerivationClass("CIP1852")
   console.log(DERIVATIONS.getDerivationClass("CIP1852"));
   // Output: [class CIP1852Derivation]
   DERIVATIONS.getDerivationClass("CIP1852") === CIP1852Derivation
   console.log(DERIVATIONS.getDerivationClass("CIP1852") === CIP1852Derivation);
   // Output: true
   DERIVATIONS.isDerivation("CIP1852")
   console.log(DERIVATIONS.isDerivation("CIP1852"));
   // Output: true
   CIP1852Derivation.getName()
   console.log(CIP1852Derivation.getName());
   // Output: 'CIP1852'
   const derivation = new CIP1852Derivation({
   ...   coinType: 0,  // Cardano
   ...   account: 0,
   ...   role: ROLES.EXTERNAL_CHAIN,
   ...   address: 0
   ... });
   console.log(derivation);
   // Output: CIP1852 derivation path: m/1852'/0'/0'/0/0
   derivation.fromAccount(1).fromRole(ROLES.STAKING_KEY).fromAddress(5);
   console.log(derivation);
   // Output: m/1852'/0'/1'/2/5
   derivation.clean();
   console.log(derivation);
   // Output: m/1852'/0'/0'/0/0
   console.log(derivation.getPurpose());
   // Output: 1852
   console.log(derivation.getCoinType());
   // Output: 0
   console.log(derivation.getRole());
   // Output: 'external-chain'


.. js:autoclass:: custom.CustomDerivation
   :members:

   const { DERIVATIONS, CustomDerivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'Custom', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'Electrum', 'Monero', 'HDW' ]
   DERIVATIONS.getDerivationClass("Custom")
   console.log(DERIVATIONS.getDerivationClass("Custom"));
   // Output: [class CustomDerivation]
   DERIVATIONS.getDerivationClass("Custom") === CustomDerivation
   console.log(DERIVATIONS.getDerivationClass("Custom") === CustomDerivation);
   // Output: true
   CustomDerivation.getName()
   console.log(CustomDerivation.getName());
   // Output: 'Custom'
   const derivation = new CustomDerivation();
   console.log(derivation);
   // Output: Custom derivation with default empty path: m/
   derivation.fromPath("m/44'/0'/0'/0/0");
   console.log(derivation);
   // Output: Custom derivation path: m/44'/0'/0'/0/0
   derivation.fromIndexes([44, 0, 0, 0, 1]);
   console.log(derivation);
   // Output: Custom derivation path: m/44/0/0/0/1
   derivation.fromIndex(5, true);
   console.log(derivation);
   // Output: Custom derivation path: m/44/0/0/0/1/5'
   derivation.clean();
   console.log(derivation);
   // Output: Custom derivation path: m/


.. js:autoclass:: electrum.ElectrumDerivation
   :members:

   const { DERIVATIONS, ElectrumDerivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'Electrum', 'Monero', 'HDW' ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], [class BIP49Derivation], ... [class ElectrumDerivation], ... ]
   DERIVATIONS.getDerivationClass("Electrum")
   console.log(DERIVATIONS.getDerivationClass("Electrum"));
   // Output: [class ElectrumDerivation]
   DERIVATIONS.getDerivationClass("Electrum") === ElectrumDerivation
   console.log(DERIVATIONS.getDerivationClass("Electrum") === ElectrumDerivation);
   // Output: true
   DERIVATIONS.isDerivation("Electrum")
   console.log(DERIVATIONS.isDerivation("Electrum"));
   // Output: true
   ElectrumDerivation.getName()
   console.log(ElectrumDerivation.getName());
   // Output: 'Electrum'
   const derivation = new ElectrumDerivation({ change: 0, address: 0 });
   console.log(derivation);
   // Output: Electrum derivation path: m/0/0
   derivation.fromChange(1).fromAddress(5);
   console.log(derivation);
   // Output: m/1/5
   derivation.clean();
   console.log(derivation);
   // Output: m/0/0
   console.log(derivation.getChange());
   // Output: 0
   console.log(derivation.getAddress());
   // Output: 0


.. js:autoclass:: hdw.HDWDerivation
   :members:

   const { DERIVATIONS, HDWDerivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'Electrum', 'Monero', 'HDW' ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], ... , [class HDWDerivation] ]
   DERIVATIONS.getDerivationClass("HDW")
   console.log(DERIVATIONS.getDerivationClass("HDW"));
   // Output: [class HDWDerivation]
   DERIVATIONS.getDerivationClass("HDW") === HDWDerivation
   console.log(DERIVATIONS.getDerivationClass("HDW") === HDWDerivation);
   // Output: true
   DERIVATIONS.isDerivation("HDW")
   console.log(DERIVATIONS.isDerivation("HDW"));
   // Output: true
   HDWDerivation.getName()
   console.log(HDWDerivation.getName());
   // Output: 'HDW'
   const derivation = new HDWDerivation({ account: 0, ecc: 'SLIP10Secp256k1ECC', address: 0 });
   console.log(derivation);
   // Output: HDW derivation path: m/0/0/0
   derivation.fromAccount(1).fromECC('SLIP10Ed25519ECC').fromAddress(5);
   console.log(derivation);
   // Output: m/1/1/5
   derivation.clean();
   console.log(derivation);
   // Output: m/0/0/0
   console.log(derivation.getAccount());
   // Output: 0
   console.log(derivation.getECC());
   // Output: 'SLIP10Secp256k1ECC'
   console.log(derivation.getAddress());
   // Output: 0


.. js:autoclass:: monero.MoneroDerivation
   :members:

   const { DERIVATIONS, MoneroDerivation } = await import('./src/derivations/index.js');
   DERIVATIONS.getNames()
   console.log(DERIVATIONS.getNames());
   // Output: [ 'BIP32', 'BIP44', 'BIP49', 'BIP84', 'BIP86', 'CIP1852', 'Electrum', 'Monero', 'HDW' ]
   DERIVATIONS.getClasses()
   console.log(DERIVATIONS.getClasses());
   // Output: [ [class BIP32Derivation], [class BIP44Derivation], ..., [class MoneroDerivation], [class HDWDerivation] ]
   DERIVATIONS.getDerivationClass("Monero")
   console.log(DERIVATIONS.getDerivationClass("Monero"));
   // Output: [class MoneroDerivation]
   DERIVATIONS.getDerivationClass("Monero") === MoneroDerivation
   console.log(DERIVATIONS.getDerivationClass("Monero") === MoneroDerivation);
   // Output: true
   DERIVATIONS.isDerivation("Monero")
   console.log(DERIVATIONS.isDerivation("Monero"));
   // Output: true
   MoneroDerivation.getName()
   console.log(MoneroDerivation.getName());
   // Output: 'Monero'
   const derivation = new MoneroDerivation({ minor: 1, major: 0 });
   console.log(derivation);
   // Output: Monero derivation path: m/1/0
   derivation.fromMinor(2).fromMajor(1);
   console.log(derivation);
   // Output: m/2/1
   derivation.clean();
   console.log(derivation);
   // Output: m/1/0
   console.log(derivation.getMinor());
   // Output: 1
   console.log(derivation.getMajor());
   // Output: 0

