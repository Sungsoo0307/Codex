#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

latest_node_bin="$(ls -d "$HOME"/.nvm/versions/node/v22*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
if [[ -n "$latest_node_bin" ]]; then
  export PATH="$latest_node_bin:$PATH"
fi

OUTPUT_BASE="tmp/naver-shoppinglive-seller-directory-50"
PORT="4181"
SERVER_LOG="tmp/naver-shoppinglive-directory-web-server.log"
SERVER_PID="tmp/naver-shoppinglive-directory-web-server.pid"

echo "Refreshing crawl data..."
corepack pnpm exec tsx scripts/naver-shoppinglive-seller-directory.ts \
  --target-rows-per-category 50 \
  --max-replays-per-category 80 \
  --max-scroll-passes 30 \
  --output "${OUTPUT_BASE}.csv"

echo "Syncing web snapshot..."
corepack pnpm exec tsx scripts/sync-naver-shoppinglive-directory-web-data.ts \
  --source-base "$OUTPUT_BASE"

echo "Building web page..."
corepack pnpm --dir ui build

echo "Syncing public Pages bundle..."
corepack pnpm exec tsx scripts/sync-naver-shoppinglive-pages-bundle.ts

mkdir -p tmp
if [[ -f "$SERVER_PID" ]]; then
  old_pid="$(cat "$SERVER_PID" 2>/dev/null || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    kill "$old_pid" 2>/dev/null || true
  fi
fi

echo "Starting local server on http://127.0.0.1:${PORT}/"
(
  corepack pnpm exec tsx scripts/naver-shoppinglive-directory-web-server.ts \
    --port "$PORT" \
    --public-dir deploy/naver-shoppinglive-pages \
    --output-base "$OUTPUT_BASE" >"$SCRIPT_DIR/$SERVER_LOG" 2>&1
) &
echo $! >"$SERVER_PID"

sleep 1
open "http://127.0.0.1:${PORT}/"
