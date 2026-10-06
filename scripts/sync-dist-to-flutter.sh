#!/usr/bin/env bash
# 重新打包 Vue dist 并同步到 Flutter lib/h5（见 FLUTTER_INTEGRATION.md）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run build
rm -rf flutter_app/lib/h5
mkdir -p flutter_app/lib/h5
cp -R dist/. flutter_app/lib/h5/
# 保证 version.json 在包内
if [[ ! -f flutter_app/lib/h5/version.json ]]; then
  cp -f public/version.json flutter_app/lib/h5/version.json
fi
cp -f "${ROOT}/FLUTTER_INTEGRATION.md" flutter_app/lib/h5/FLUTTER_INTEGRATION.md 2>/dev/null || true
# 清理旧路径
rm -rf flutter_app/assets/www
echo "synced dist -> flutter_app/lib/h5"
