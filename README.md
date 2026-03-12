# World Data Pages

Static GitHub Pages bundle for the animated market-flow dashboard.

## Publish

1. Create a new GitHub repository.
2. Copy the contents of this folder into that repository root.
3. Push to the `main` branch.
4. In GitHub, open `Settings -> Pages` and ensure `Build and deployment` is set to `GitHub Actions`.
5. Wait for the `Deploy Pages` workflow to finish.

The site will open at:

- `https://<your-user>.github.io/<repo-name>/`

The dashboard page is also available at:

- `https://<your-user>.github.io/<repo-name>/world-data.html`

## Notes

- This bundle already contains the built assets.
- The dashboard uses the Coinbase public WebSocket feed directly from the browser.
- The world-map lines are visualized market corridors derived from live product activity, not literal money-transfer rails.
