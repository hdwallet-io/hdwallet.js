Cryptography 
============

.. currentmodule:: hashes

Overview
--------
This module provides a comprehensive set of cryptographic hash functions,
HMACs, checksums, and encryption utilities, including SHA2, SHA3, Blake2b,
RIPEMD-160, Keccak, CRC checksums, PBKDF2-HMAC, and ChaCha20-Poly1305.

Functions
---------

.. js:autofunction:: hmacSha256
.. js:autofunction:: hmacSha512
.. js:autofunction:: blake2b
.. js:autofunction:: blake2b32
.. js:autofunction:: blake2b40
.. js:autofunction:: blake2b160
.. js:autofunction:: blake2b224
.. js:autofunction:: blake2b256
.. js:autofunction:: blake2b512
.. js:autofunction:: chacha20Poly1305Encrypt
.. js:autofunction:: chacha20Poly1305Decrypt
.. js:autofunction:: sha256
.. js:autofunction:: doubleSha256
.. js:autofunction:: sha512
.. js:autofunction:: sha512_256
.. js:autofunction:: keccak256
.. js:autofunction:: sha3_256
.. js:autofunction:: ripemd160
.. js:autofunction:: hash160
.. js:autofunction:: crc32
.. js:autofunction:: xmodemCrc
.. js:autofunction:: pbkdf2HmacSha512
.. js:autofunction:: getChecksum

Constants / Aliases
-------------------

Blake2b variants with fixed digest lengths (all are functions):

.. js:autofunction:: blake2b32
.. js:autofunction:: blake2b40
.. js:autofunction:: blake2b160
.. js:autofunction:: blake2b224
.. js:autofunction:: blake2b256
.. js:autofunction:: blake2b512
