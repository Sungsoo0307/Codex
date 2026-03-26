#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

latest_node_bin="$(ls -d "$HOME"/.nvm/versions/node/v22*/bin 2>/dev/null | sort -V | tail -n 1 || true)"
if [[ -n "$latest_node_bin" ]]; then
  export PATH="$latest_node_bin:$PATH"
fi

OUTPUT_PATH="tmp/naver-shoppinglive-seller-directory-50.csv"

echo "Starting Naver Shopping Live seller crawl..."
echo "Output: $OUTPUT_PATH"

corepack pnpm exec tsx scripts/naver-shoppinglive-seller-directory.ts \
  --target-rows-per-category 50 \
  --max-replays-per-category 80 \
  --max-scroll-passes 30 \
  --output "$OUTPUT_PATH"

echo ""
echo "Done."
echo "Opening result file..."
open "$OUTPUT_PATH"
