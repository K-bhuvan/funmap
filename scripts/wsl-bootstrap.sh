#!/usr/bin/env bash
# Reinstall frontend + backend deps on the CURRENT OS (use from WSL only).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "funmap WSL bootstrap — repo: $ROOT"
echo "Node: $(node -v 2>/dev/null || echo 'node not found') — npm: $(npm -v 2>/dev/null || echo 'npm not found')"
echo ""

for pkg in frontend backend; do
  if [[ ! -f "$pkg/package.json" ]]; then
    echo "Skip: no $pkg/package.json"
    continue
  fi
  echo "==> Cleaning and installing: $pkg"
  rm -rf "$pkg/node_modules"
  (cd "$pkg" && npm install)
  echo ""
done

echo "Done."
echo "Run backend:  cd $ROOT/backend && npm run dev"
echo "Run frontend: cd $ROOT/frontend && npm run dev"
