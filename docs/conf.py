# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

import os
import re
import datetime
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parent.parent
_TS_INFO = _REPO_ROOT / "src" / "info.ts"

def _parse_ts_exports(ts_path: Path) -> dict:
    if not ts_path.exists():
        return {}
    txt = ts_path.read_text(encoding="utf-8")
    # strip full-line // comments (good enough for your file style)
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
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = []

templates_path = ['_templates']
exclude_patterns = []



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_static_path = ['_static', '_static/css', '_static/svg']
