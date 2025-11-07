Constant Values
===============

.. js:autoattribute:: consts.SLIP10_ED25519_CONST

   .. list-table::
      :header-rows: 1
      :widths: 30 70

      * - Name
        - Value
      * - PRIVATE_KEY_BYTE_LENGTH
        - 32
      * - PUBLIC_KEY_PREFIX
        - ``integerToBytes(0x00)``
      * - PUBLIC_KEY_BYTE_LENGTH
        - 32

.. js:autoattribute:: consts.KHOLAW_ED25519_CONST

   .. list-table::
      :header-rows: 1
      :widths: 30 70

      * - Name
        - Value
      * - PRIVATE_KEY_BYTE_LENGTH
        - 64
      * - PUBLIC_KEY_PREFIX
        - ``integerToBytes(0x00)``
      * - PUBLIC_KEY_BYTE_LENGTH
        - 32

.. js:autoattribute:: consts.SLIP10_SECP256K1_CONST
   
   .. list-table::
      :header-rows: 1
      :widths: 35 65

      * - Name
        - Value
      * - POINT_COORDINATE_BYTE_LENGTH
        - 32
      * - PRIVATE_KEY_BYTE_LENGTH
        - 32
      * - PRIVATE_KEY_UNCOMPRESSED_PREFIX
        - ``0x00``
      * - PRIVATE_KEY_COMPRESSED_PREFIX
        - ``0x01``
      * - PUBLIC_KEY_UNCOMPRESSED_PREFIX
        - ``integerToBytes(0x04)``
      * - PUBLIC_KEY_COMPRESSED_BYTE_LENGTH
        - 33
      * - PUBLIC_KEY_UNCOMPRESSED_BYTE_LENGTH
        - 65
      * - CHECKSUM_BYTE_LENGTH
        - 4


.. js:autoclass:: consts.PUBLIC_KEY_TYPES
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 35 65

      * - Name
        - Value
      * - UNCOMPRESSED
        - uncompressed
      * - COMPRESSED
        - compressed

.. js:autoclass:: consts.WIF_TYPES
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 35 65

      * - Name
        - Value
      * - UNCOMPRESSED
        - uncompressed
      * - WIF_COMPRESSED
        - wif-compressed

.. js:autoclass:: consts.SEMANTICS
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 35 65

      * - Name
        - Value
      * - P2WPKH
        - p2wpkh
      * - P2WPKH_IN_P2SH
        - p2wpkh-in-p2sh
      * - P2WSH
        - p2wsh-in-p2sh
      * - P2WSH_IN_P2SH
        - p2wsh-in-p2sh

.. js:autoclass:: consts.MODES
   :members:

   .. list-table::
      :header-rows: 1
      :widths: 35 65

      * - Name
        - Value
      * - STANDARD
        - standard
      * - SEGWIT
        - segwit