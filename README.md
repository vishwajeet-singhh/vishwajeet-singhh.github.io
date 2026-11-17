# vishwajeet.me

Personal site of Vishwajeet Pratap Singh, a Backend Developer focused on APIs, data, performance and reliable systems. React + Vite + Tailwind, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
npm run stats      # refresh src/data/stats.json from LeetCode, Codeforces, CodeChef and GitHub
npm run build      # type-check + production build into dist/
```

## Where things live

| Path | What |
|---|---|
| `src/data/profile.ts` | Shared profile, About, engineering focus, achievements, experience, stack, Helix and links |
| `src/data/platform-visibility.ts` | Show or hide individual coding profiles; missing entries stay visible |
| `src/data/stats.json` | Stats snapshot baked into the page. Committed so builds work offline |
| `scripts/sources.mjs` | Fetches every platform. Shared by the build script and the Worker |
| `scripts/fetch-stats.mjs` | Writes the baked snapshot (runs before each deploy) |
| `worker/` | Cloudflare Worker that keeps the stats fresh on visits (at most once per minute) |
| `src/components/` | One file per section, plus `Heatmap`, `DifficultyBar`, `PlatformCard` |
| `src/index.css` | Design tokens (colours, heatmap ramp, difficulty colours) |

## Coding-profile visibility

Edit `src/data/platform-visibility.ts`, then rebuild/redeploy. For example, to show only LeetCode:

```ts
export const PLATFORM_VISIBILITY: Partial<Record<PlatformId, boolean>> = {
    leetcode: true,
    codeforces: false,
    codechef: false,
};
```

Only `false` hides a profile. `true`, an omitted value, or a missing entry keeps it visible.
The setting applies to profile cards, Contact links, activity filters, totals, charts and platform names in the copy.
The existing layout fills the available space with the remaining cards. If all profiles are hidden, the Problem
solving section, its navigation link and its footer update note are hidden too. Profile data and stats fetching
are preserved, so enabling a profile brings it back. `src/data/features.ts` still controls the entire section.

## How the stats stay fresh

GitHub Pages can only serve files, and most of the platforms block requests made directly from a visitor's browser.
So visits drive the updates, through a small Cloudflare Worker (`worker/`, free plan):

1. The page renders the snapshot baked in at build time, instantly. `npm run stats` runs before every build and the
   deploy workflow rebuilds daily, so this is never more than a day old and is what remains if the Worker is down.
2. It then calls `GET /stats` on the Worker and keeps whichever copy of each source is newer.
3. For each source nobody has attempted to refresh in the last minute, it calls `POST /refresh/:name`. The Worker makes an
   atomic claim in D1 before fetching, so only one visitor per source per minute triggers a request to LeetCode
   and the others, however many people visit. Everyone else gets the stored numbers.
4. An open, visible tab checks again every 60 seconds. Hidden tabs pause checks and refresh when overdue on return.
   A 45-second timeout prevents a stalled request from blocking later checks. Failed sources keep their last good
   snapshot and can be retried in the next refresh window. Codeforces API calls are spaced over two seconds apart.

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

When changing the sync interval, deploy both the site and the Worker: the browser's polling interval and the
Worker's refresh window must match. Platform-side caching can delay when newly solved problems appear upstream.

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

Handles are set at the top of `scripts/sources.mjs`.

## Portfolio presentation

The site uses a light-only professional profile layout: blue actions, warm neutral background, white cards and a desktop engineering-focus sidebar. On smaller screens, the main content becomes a single column; engineering focus remains visible in About. Navigation, platform filters, heatmaps, live stats and visitor logging are retained.

Public positioning is Backend Developer. Technologies are presented as tools used; all portfolio role labels use Backend Developer, including Backend Developer Intern. Keep career metrics grounded in verified experience and keep descriptive copy in `src/data/profile.ts` where practical.

The hero profile panel reads the current Codeforces rank and LeetCode contest rating from the shared stats provider. The About problem count uses those same platforms. Values render from the saved snapshot first, then update through the existing live-stats service; there are no fixed rank/rating values in the headline. The hero side panel contains live Codeforces and LeetCode profiles, stacked on desktop and arranged in two columns below the profile on mobile.

The desktop content container is capped at 1320px to use more of the screen while retaining side padding. Experience groups roles under one company with a compact timeline; accomplishment themes remain above the bullets. Additional role tools expand through a native details control.
