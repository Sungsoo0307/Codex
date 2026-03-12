# OpenClaw Content Business Stack

This bundle turns OpenClaw into a web-exposed content operator stack:

- a public-facing brand page at `/`
- the OpenClaw Control UI at `/openclaw/`
- a workspace that keeps generating article ideas, drafts, short-form derivatives, and product angles

What it does not do on its own:

- guarantee revenue
- auto-publish to third-party platforms
- spend money
- accept payments

Those parts still need your accounts and approval.

## Files

- `docker-compose.yml`: Caddy + OpenClaw deployment
- `Caddyfile`: serves the brand page and proxies OpenClaw
- `openclaw.json5`: content-operator gateway config
- `build-publication.mjs`: converts published markdown into public HTML pages
- `workspace/`: editorial system, monetization notes, and scoreboards

## Quick start

1. Copy `.env.example` to `.env`.
2. Set `OPENAI_API_KEY` and a strong `OPENCLAW_GATEWAY_PASSWORD`.
3. Replace `https://your-domain.example` in `openclaw.json5` with your real origin before public deployment.
4. Start the stack:

```bash
docker compose -f deploy/business-web/docker-compose.yml up -d --build
```

5. Open [http://localhost:8080](http://localhost:8080).
6. Log into OpenClaw at `/openclaw/` with `OPENCLAW_GATEWAY_PASSWORD`.
7. Build the public library:

```bash
./deploy/business-web/publish-content.sh
```

This build also generates:

- `site/library.json`
- `site/latest.json`
- `site/feed.xml`
- `site/sitemap.xml`
- `site/robots.txt`
- `site/.nojekyll`
- `site/site-config.json`

## Recommended next steps

1. Edit `workspace/content/strategy.md` so the niche and voice match what you want to build.
2. Review `workspace/AGENTS.md` and make sure the monetization rules fit your risk tolerance.
3. Add recurring cron jobs from the Control UI Cron panel, or use `bootstrap-content-cron.sh`.
4. Mark any article you want public with `status: published`, then rerun `publish-content.sh`.
5. Use `workspace/content/distribution.md` and `workspace/business/channel-plan.md` to turn each article into distribution assets.
6. Configure `OPENCLAW_HOOKS_TOKEN` and use the newsletter form to store subscriber intent back into the workspace.

## GitHub Pages

This stack now supports GitHub Pages deployment through GitHub Actions.

1. In the repository settings, set **Pages** to use **GitHub Actions** as the source.
2. Optionally add repository variables:
   - `OPENCLAW_PUBLIC_BASE_URL`: full Pages URL
   - `OPENCLAW_PUBLIC_CUSTOM_DOMAIN`: custom domain without protocol
   - `OPENCLAW_PUBLIC_OPERATOR_URL`: absolute URL of your OpenClaw console
   - `OPENCLAW_PUBLIC_SUBSCRIBE_API_URL`: absolute subscribe endpoint if the public site runs on GitHub Pages
3. Push to `main` or run the Pages workflow manually.

Workflow file:

- `.github/workflows/content-pages.yml`

## Production notes

- Keep the public site behind HTTPS.
- The bundled tool policy intentionally blocks browser, exec, and gateway mutation from the content operator profile.
- The current stack is best described as an autonomous draft-and-asset machine, not a fully autonomous publishing company.
