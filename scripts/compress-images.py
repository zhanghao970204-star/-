#!/usr/bin/env python3
"""Compatibility entry point. Dry-run by default; --apply enables lossless PNG optimization."""
import runpy
from pathlib import Path

runpy.run_path(str(Path(__file__).with_name('compress-images-lossless.py')), run_name='__main__')
