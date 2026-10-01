#!/usr/bin/env bash
# 重新打包 Vue dist 并同步到 Flutter assets
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run build
rm -rf flutter_app/assets/www
mkdir -p flutter_app/assets/www
cp -R dist/. flutter_app/assets/www/
echo "synced dist -> flutter_app/assets/www"
