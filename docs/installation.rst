============
Installation
============

The easiest way to install **hdwallet.js** is via **npm**:

.. code-block:: bash

    npm install @hdwallet/core

Or with **yarn**:

.. code-block:: bash

    yarn add @hdwallet/core

-----------------------
Browser (no build step)
-----------------------

The bundled library is available in the ``./dist/`` folder in this repository.

**ESM**

Modern module build, import directly in the browser or any ESM-aware bundler:

.. code-block:: html

    <script type="module">
      import { hdwallet } from './dist/hdwallet.min.js';
    </script>

**UMD**

Standalone browser build, load via ``<script>`` and access as ``window.hdwallet``:

.. code-block:: html

    <script src="./dist/hdwallet.udm.min.js" type="text/javascript"></script>

--------------
Development
--------------

We welcome pull requests. To get started, just fork this `github repository <https://github.com/hdwallet-io/hdwallet.js>`_, clone it locally, and run:

.. code-block:: bash

    npm install

