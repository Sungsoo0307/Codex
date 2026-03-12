# Isolated VPS Instance

If you want the content business agent to stay out of your existing OpenClaw agent's way, do **not**
add it as a sibling agent inside the same gateway first.

Run a **second OpenClaw instance** on the VPS:

- separate container/process
- separate state volume
- separate workspace
- separate hook transforms directory
- separate auth secrets
- separate reverse-proxy routes

This is the cleanest way to avoid session, auth, and config overlap.

## Important limit

If your existing agent still has unrestricted host exec or full host filesystem access, no config snippet
inside the same host can honestly guarantee "zero interaction". Hard isolation requires OS/container boundaries.

This template gets you the practical version of isolation:

- no shared OpenClaw state
- no shared workspace
- no shared hook transform path
- no shared gateway token or hook token
- no shared port
- no hook/cron delivery by default

## Files

- `.env.example`: secrets and public URLs for the isolated instance
- `docker-compose.isolated.yml`: second OpenClaw instance on loopback port `19889`
- `openclaw-content.json5`: content-business config for the isolated instance
- `hooks/transforms/subscribe-intake.mjs`: dedicated hook transform for this instance
- `workspace-content/`: dedicated workspace for this instance only
- `caddy-content.example`: Caddy reverse proxy for `/openclaw/` and `/api/subscribe`
- `nginx-content.example`: Nginx reverse proxy for `/openclaw/` and `/api/subscribe`

## Domain layout

The clean split is:

- `content.example.com`: public content site (for example GitHub Pages)
- `ops.example.com`: VPS reverse proxy for the isolated OpenClaw instance

If your VPS IP is `38.45.65.241`, point the DNS `A` record for `ops.example.com` to `38.45.65.241`.

Open these ports on the VPS:

- `80/tcp`
- `443/tcp`

Keep the isolated OpenClaw instance on loopback only:

- existing main instance: `127.0.0.1:18789`
- isolated content instance: `127.0.0.1:19889`

## Bring-up

1. Copy `.env.example` to `.env`.
2. Fill in the secrets and public URLs.
3. Start the isolated instance:

```bash
docker compose -f deploy/business-web/vps/docker-compose.isolated.yml up -d --build
```

4. Point the public site build to the isolated instance:

```bash
PUBLIC_OPERATOR_URL="https://ops.example.com/openclaw/" \
PUBLIC_SUBSCRIBE_API_URL="https://ops.example.com/api/subscribe" \
./deploy/business-web/publish-content.sh
```

## Reverse proxy

### Caddy

1. Replace `ops.example.com` in `caddy-content.example`.
2. Replace `REPLACE_WITH_OPENCLAW_HOOKS_TOKEN`.
3. Load that site into your Caddy config and reload Caddy.

Caddy will obtain HTTPS certificates automatically once DNS resolves to your VPS and ports `80` and `443` are reachable.

### Nginx

1. Replace `ops.example.com` in `nginx-content.example`.
2. Replace `REPLACE_WITH_OPENCLAW_HOOKS_TOKEN`.
3. Install a certificate for that hostname, for example under `/etc/letsencrypt/live/ops.example.com/`.
4. Enable the site and reload Nginx.

## OpenClaw origin config

Set the allowed Control UI origin in `openclaw-content.json5` to match the proxy hostname:

```json5
gateway: {
  controlUi: {
    allowedOrigins: ["https://ops.example.com"],
  },
}
```

If you keep a temporary direct-IP test path, add that origin separately only while testing.

## Safer than same-gateway multi-agent

Same-gateway multi-agent is useful, but it is not the right answer when you want the existing agent to have no business touching the content operator at all.

If you must share one gateway anyway, the minimum would be:

- separate `agentDir`
- separate workspace
- sandbox `mode: "all"`
- strict tool deny list
- `hooks.allowedAgentIds` restricted to the content agent

Even then, a powerful existing host-level agent is still a concern.

## Isolation notes

This isolated config also applies defense-in-depth inside the second instance:

- no messaging tools
- no session tools
- no sub-agent spawning
- hook and cron session delivery are denied
- sandbox docker network is `none`

That means the content operator can work in its own workspace and answer its own hooks/UI sessions, while automated hook/cron runs stay non-delivering by policy.

For a stronger boundary, do not configure WhatsApp, Telegram, Discord, Slack, or any other messaging credentials on this isolated instance at all.
