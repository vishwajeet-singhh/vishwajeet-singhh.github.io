/**
 * Live stats API for the portfolio. Refreshes are driven by visits:
 *
 *   GET  /stats          latest numbers for every source, plus which sources
 *                        are older than the refresh window
 *   POST /refresh/:name  refetch one source, but only if nobody else has in
 *                        the last REFRESH_WINDOW; otherwise return what's stored
 *
 * The page calls GET /stats on load, then POST /refresh/:name for each stale
 * source. The "has anyone refreshed this recently?" check is an atomic claim
 * in D1, so ten visitors inside five minutes still cause one fetch per source.
 * Memory inside the Worker can't do this: Cloudflare runs many separate
 * copies of it around the world, each with its own memory.
 *
 * Each source is refreshed in its own request, which keeps every run well
 * inside the free plan's per-request CPU and subrequest limits.
 */
import {collectSource, SOURCE_NAMES, TIME_ZONE} from "../../scripts/sources.mjs";

const REFRESH_WINDOW_MS = 5 * 60_000;
// A cold CodeChef run can need many rating lookups; cap them per run and let
// later runs finish the rest. Warm runs need 1–4 requests per source.
const COLLECT_OPTIONS = {retries: 1, maxRatingLookups: 20};

const SCHEMA = `CREATE TABLE IF NOT EXISTS sources (
    name       TEXT PRIMARY KEY,
    data       TEXT,
    fetched_at INTEGER NOT NULL DEFAULT 0,
    checked_at INTEGER NOT NULL DEFAULT 0
)`;

export default {
    async fetch(request, env, ctx) {
        const cors = corsHeaders(request, env);
        const {pathname} = new URL(request.url);

        if (request.method === "OPTIONS") return new Response(null, {status: 204, headers: cors});

        try {
            if (pathname === "/stats" && request.method === "GET") {
                const rows = await readAll(env);
                const now = Date.now();
                const stale = SOURCE_NAMES.filter((name) => (rows[name]?.checked_at ?? 0) <= now - REFRESH_WINDOW_MS);
                return json({stats: toSnapshot(rows), stale}, 200, {...cors, "Cache-Control": "no-store"});
            }

            const refreshMatch = pathname.match(/^\/refresh\/([a-z]+)$/);
            if (refreshMatch && request.method === "POST") {
                const name = refreshMatch[1];
                if (!SOURCE_NAMES.includes(name)) return json({error: `Unknown source "${name}"`}, 404, cors);

                if (!(await claim(env, name))) {
                    // Someone refreshed (or is refreshing) this source within the window.
                    const row = (await readAll(env))[name];
                    return json({name, data: publicSource(parse(row)), refreshed: false}, 200, cors);
                }
                // waitUntil lets the refresh finish even if the visitor closes the tab.
                const work = refreshSource(env, name);
                ctx.waitUntil(work.catch(() => {}));
                const data = await work;
                return json({name, data: publicSource(data), refreshed: true}, 200, cors);
            }
        } catch (error) {
            console.log(`✗ ${pathname}: ${error.message}`);
            return json({error: "Upstream or storage error"}, 502, cors);
        }

        return json({error: "Not found"}, 404, cors);
    },
};

/**
 * Atomically claims the right to refresh `name`: succeeds only if nobody has
 * claimed it within the window. Returns true for exactly one caller per window.
 */
async function claim(env, name) {
    const now = Date.now();
    const row = await query(env, (db) =>
        db
            .prepare(
                `INSERT INTO sources (name, checked_at) VALUES (?1, ?2)
                 ON CONFLICT(name) DO UPDATE SET checked_at = excluded.checked_at
                 WHERE sources.checked_at <= ?3
                 RETURNING name`,
            )
            .bind(name, now, now - REFRESH_WINDOW_MS)
            .first(),
    );
    return Boolean(row);
}

async function refreshSource(env, name) {
    const previous = parse((await readAll(env))[name]);
    const snapshot = name === "github" ? {github: previous} : {platforms: {[name]: previous}};
    const data = await collectSource(name, snapshot, {...COLLECT_OPTIONS, githubToken: env.GITHUB_TOKEN});
    await query(env, (db) =>
        db
            .prepare("UPDATE sources SET data = ?2, fetched_at = ?3 WHERE name = ?1")
            .bind(name, JSON.stringify(data), Date.parse(data.fetchedAt))
            .run(),
    );
    console.log(`✓ ${name}`);
    return data;
}

async function readAll(env) {
    const {results} = await query(env, (db) => db.prepare("SELECT name, data, fetched_at, checked_at FROM sources").all());
    return Object.fromEntries(results.map((row) => [row.name, row]));
}

/** Runs a D1 query, creating the table on first use. */
async function query(env, run) {
    try {
        return await run(env.DB);
    } catch (error) {
        if (!/no such table/i.test(error.message)) throw error;
        await env.DB.exec(SCHEMA.replace(/\s+/g, " "));
        return run(env.DB);
    }
}

const parse = (row) => (row?.data ? JSON.parse(row.data) : null);

function toSnapshot(rows) {
    const sources = Object.fromEntries(SOURCE_NAMES.map((name) => [name, publicSource(parse(rows[name]))]));
    const newest = Math.max(0, ...SOURCE_NAMES.map((name) => rows[name]?.fetched_at ?? 0));
    const {github, ...platforms} = sources;
    return {generatedAt: new Date(newest).toISOString(), timeZone: TIME_ZONE, platforms, github};
}

const BOOKKEEPING = ["index", "joinYear", "years"];

/** Drops incremental bookkeeping that the site doesn't need. */
const publicSource = (data) =>
    data ? Object.fromEntries(Object.entries(data).filter(([key]) => !BOOKKEEPING.includes(key))) : null;

function corsHeaders(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean);
    if (!origin || !allowed.includes(origin)) return {Vary: "Origin"};
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
    };
}

const json = (body, status, headers) =>
    new Response(JSON.stringify(body), {status, headers: {"Content-Type": "application/json", ...headers}});
