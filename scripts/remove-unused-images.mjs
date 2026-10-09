#!/usr/bin/env node
// Keep the old entry point, but replace the stale deletion list with a fresh audit.
// Dry-run by default. --apply creates a backup and removes confirmed candidates.
import './audit-images.mjs'
