#!/usr/bin/env bash
set -euo pipefail

OPENCLAW_BIN="${OPENCLAW_BIN:-openclaw}"
TIMEZONE="${TIMEZONE:-Asia/Seoul}"

"${OPENCLAW_BIN}" cron add \
  --name "Daily flagship draft" \
  --cron "0 9 * * *" \
  --tz "${TIMEZONE}" \
  --session isolated \
  --message "Read content/strategy.md, content/idea-backlog.md, and content/publishing-queue.md. Draft one strong long-form asset in content/articles/. Update the queue after drafting." \
  --light-context \
  --no-deliver

"${OPENCLAW_BIN}" cron add \
  --name "Daily derivative pack" \
  --cron "0 13 * * *" \
  --tz "${TIMEZONE}" \
  --session isolated \
  --message "Read the newest long-form draft and extract short-form derivatives into content/shorts.md. Add 5-10 usable hooks, posts, or captions." \
  --light-context \
  --no-deliver

"${OPENCLAW_BIN}" cron add \
  --name "Daily monetization pass" \
  --cron "0 18 * * *" \
  --tz "${TIMEZONE}" \
  --session isolated \
  --message "Review recent content and update business/monetization.md plus business/scoreboard.md with monetization angles, product ideas, and funnel notes." \
  --light-context \
  --no-deliver
