# Configuration file for the Sphinx documentation builder.
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import sys
import os
import re
import datetime
from pathlib import Path
import shutil

# -- Project information -----------------------------------------------------

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

_REPO_ROOT = Path(__file__).resolve().parent.parent
_TS_INFO = _REPO_ROOT / "src" / "info.ts"

def _parse_ts_exports(ts_path: Path) -> dict:
    if not ts_path.exists():
        return {}
    txt = ts_path.read_text(encoding="utf-8")
    txt = "\n".join(("" if re.match(r"^\s*//", ln) else ln) for ln in txt.splitlines())
    pat = re.compile(r"export\s+const\s+(__\w+__)\s*:\s*[^=]+=\s*(.+?);")
    out = {}
    def _resolve(s: str) -> str:
        return re.sub(r"\$\{(__\w+__)\}", lambda m: str(out.get(m.group(1), "")), s)
    for m in pat.finditer(txt):
        key, raw = m.group(1), m.group(2).strip()
        if raw.startswith("`") and raw.endswith("`"):
            out[key] = _resolve(raw[1:-1]); continue
        if raw[:1] in ("'", '"') and raw.endswith(raw[:1]):
            out[key] = raw[1:-1]; continue
        if raw.startswith("[") and raw.endswith("]"):
            out[key] = [s.group(2) for s in re.finditer(r"(['\"])(.*?)\1", raw)]; continue
        out[key] = raw
    return out

_ts = _parse_ts_exports(_TS_INFO)

project = "HDWallet"
author = _ts.get("__author__")
release = _ts.get("__version__")
copyright = f"2020-{datetime.datetime.now().year}, {author}"

master_doc = "toctree"

# -- General configuration ---------------------------------------------------

extensions = [
    "sphinx_js",
    "sphinx.ext.autodoc",
    "sphinx_ext",
]

templates_path = ['_templates']
exclude_patterns = []

# -- JS/TS source settings for sphinx-js -----------------------------------

# Path to JS/TS files relative to docs/conf.py
js_source_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))

# Enable recursion into subfolders
jsdoc_config_path = "typedoc.json"  # Make sure this exists

js_language = 'typescript'



# Explicitly set Node executable on Windows
js_node_executable = r"C:\path\from\where\node.exe" 

# Ensure npm global bin is in PATH for jsdoc
npm_global_bin = os.path.expandvars(r"%APPDATA%\npm")
os.environ["PATH"] += os.pathsep + npm_global_bin

# -- Options for HTML output -------------------------------------------------

html_theme = 'furo'
html_logo = "_static/svg/hdwallet-logo.svg"
html_title = _ts.get("__version__")
html_static_path = ['_static', '_static/css', '_static/svg']

autodoc_member_order = "bysource"

# Sphinx docs setup
def setup(sphinx):
    sphinx.add_css_file("css/hdwallet.css")
