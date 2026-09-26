# vishwajeet.me

Personal site of Vishwajeet Pratap Singh, a backend developer. React + Vite + Tailwind, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
npm run stats      # refresh src/data/stats.json from LeetCode, Codeforces, CodeChef, GFG and GitHub
npm run build      # type-check + production build into dist/
```

## Where things live

| Path | What |
|---|---|
| `src/data/profile.ts` | All hand-written copy: bio, experience, stack, Helix, links, résumé URL |
| `src/data/stats.json` | Stats snapshot baked into the page. Committed so builds work offline |
| `scripts/sources.mjs` | Fetches every platform. Shared by the build script and the Worker |
| `scripts/fetch-stats.mjs` | Writes the baked snapshot (runs before each deploy) |
| `worker/` | Cloudflare Worker that keeps the stats fresh on visits (at most every 5 min) |
| `src/components/` | One file per section, plus `Heatmap`, `DifficultyBar`, `PlatformCard` |
| `src/index.css` | Design tokens (colours, heatmap ramp, difficulty colours) |

## How the stats stay fresh

GitHub Pages can only serve files, and most of the platforms block requests made directly from a visitor's browser.
So visits drive the updates, through a small Cloudflare Worker (`worker/`, free plan):

1. The page renders the snapshot baked in at build time, instantly. `npm run stats` runs before every build and the
   deploy workflow rebuilds daily, so this is never more than a day old and is what remains if the Worker is down.
2. It then calls `GET /stats` on the Worker and keeps whichever copy of each source is newer.
3. For each source nobody has refreshed in the last 5 minutes, it calls `POST /refresh/:name`. The Worker makes an
   atomic claim in D1 before fetching, so only one visitor per source per 5 minutes triggers a request to LeetCode
   and the others, however many people visit. Everyone else gets the stored numbers.

Each source is refreshed in its own request, which keeps every run well inside the free plan's CPU and subrequest
limits (about 1–4 outbound requests and a few ms of CPU per source once the first run is done). If nobody visits,
nothing is fetched.

### Setting up the Worker (once)

```bash
cd worker
npm install
npx wrangler login                          # opens Cloudflare in the browser
npx wrangler d1 create portfolio-stats      # paste the printed database_id into wrangler.toml
npm run seed                                # copy src/data/stats.json into D1
npx wrangler secret put GITHUB_TOKEN        # optional: any read-only token, lifts GitHub API rate limits
npm run deploy                              # prints the Worker URL
```

Then put the URL it prints into `VITE_STATS_API_URL` in `.env` (currently
`https://vishwajeet-stats.recusant.workers.dev`) and push. Both `npm run dev` and the deploy build read it. With the
value empty the site works exactly as before, just without live updates.

To add another origin (e.g. a preview domain), edit `ALLOWED_ORIGINS` in `worker/wrangler.toml` and redeploy.

### Running both locally

`npm run dev` talks to the deployed Worker by default. To work on the Worker itself:

```bash
cd worker && npm run seed:local && npm run dev    # Worker on http://localhost:8787
VITE_STATS_API_URL=http://localhost:8787 npm run dev
```

## Difficulty rules

Difficulty is normalised to LeetCode's Easy / Medium / Hard:

- **Codeforces, CodeChef**: problem rating below 1200 is Easy, 1200–1600 is Medium, above 1600 is Hard. Problems without
  an official rating are counted as Medium.
- **GeeksforGeeks**: School and Basic problems are excluded.

Handles are set at the top of `scripts/sources.mjs`.
