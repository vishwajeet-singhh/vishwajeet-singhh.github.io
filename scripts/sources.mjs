/**
 * Fetches problem-solving and GitHub activity. Shared by two runtimes:
 *   - scripts/fetch-stats.mjs (Node, at build time) → src/data/stats.json
 *   - worker/ (Cloudflare Worker, on visits, at most every 5 min) → the live stats API
 * so it only uses web-standard APIs (fetch, Intl, AbortSignal).
 *
 * Every source is fetched independently. If one fails (rate limit, Cloudflare
 * challenge, markup change) the previous snapshot for that source is kept, so
 * a flaky platform never blanks out a section.
 *
 * Difficulty buckets are normalised to LeetCode's Easy / Medium / Hard:
 *   - Codeforces & CodeChef: rating < 1200 → Easy, 1200–1600 → Medium, > 1600 → Hard.
 *     Problems with no official rating count as Medium.
 *   - GeeksforGeeks: School and Basic problems are excluded entirely.
 */

export const HANDLES = {
    leetcode: "recusant_byte",
    codeforces: "vishy_singh",
    codechef: "recusant_byte",
    gfg: "vishyy",
    github: "vishwajeet-singhh",
};

// Calendar days are bucketed in IST, where the submissions actually happen.
export const TIME_ZONE = "Asia/Kolkata";
// Keep roughly two years of daily activity; the UI shows the trailing 12 months.
const CALENDAR_DAYS_KEPT = 730;

const UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

// ── helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tuned per runtime by collectStats(): Node retries freely, a Worker has a
// fixed subrequest budget and can't afford to.
const settings = {retries: 2, maxRatingLookups: Infinity};

async function request(url, {json = true, retries = settings.retries, ...init} = {}) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const res = await fetch(url, {
                ...init,
                headers: {"User-Agent": UA, ...(init.headers ?? {})},
                signal: AbortSignal.timeout(30_000),
            });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return json ? await res.json() : await res.text();
        } catch (error) {
            lastError = error;
            if (attempt < retries) await sleep(1_000 * (attempt + 1));
        }
    }
    throw new Error(`${url} → ${lastError?.message ?? lastError}`);
}

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

/** Unix seconds → YYYY-MM-DD in IST. */
const istDay = (seconds) => dayFormatter.format(new Date(seconds * 1000));

/** "2026-7-8" → "2026-07-08" */
const padDay = (value) => {
    const [y, m, d] = value.split("-").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
};

/** Drops zero days and anything older than the retention window; sorts keys. */
function trimCalendar(calendar) {
    const cutoff = new Date(Date.now() - CALENDAR_DAYS_KEPT * 86_400_000).toISOString().slice(0, 10);
    return Object.fromEntries(
        Object.entries(calendar)
            .filter(([day, count]) => count > 0 && day >= cutoff)
            .sort(([a], [b]) => a.localeCompare(b)),
    );
}

const isRated = (rating) => rating != null && rating > 0;

function bucketByRating(rating) {
    if (!isRated(rating) || (rating >= 1200 && rating <= 1600)) return "medium";
    return rating < 1200 ? "easy" : "hard";
}

const emptySolved = () => ({easy: 0, medium: 0, hard: 0});

async function mapWithConcurrency(items, limit, fn) {
    const results = new Array(items.length);
    let next = 0;
    const workers = Array.from({length: Math.min(limit, items.length)}, async () => {
        while (next < items.length) {
            const index = next++;
            results[index] = await fn(items[index], index);
        }
    });
    await Promise.all(workers);
    return results;
}

// ── LeetCode ───────────────────────────────────────────────────────────────

async function leetcodeQuery(query, variables) {
    const body = await request("https://leetcode.com/graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json", Referer: "https://leetcode.com"},
        body: JSON.stringify({query, variables}),
    });
    if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join("; "));
    return body.data;
}

async function fetchLeetCode(handle) {
    const profile = await leetcodeQuery(
        `query($u: String!) {
            matchedUser(username: $u) {
                submitStatsGlobal { acSubmissionNum { difficulty count } }
                userCalendar { activeYears streak totalActiveDays }
                languageProblemCount { languageName problemsSolved }
                tagProblemCounts {
                    advanced { tagName problemsSolved }
                    intermediate { tagName problemsSolved }
                    fundamental { tagName problemsSolved }
                }
            }
            userContestRanking(username: $u) { rating attendedContestsCount topPercentage }
            userContestRankingHistory(username: $u) { attended rating ranking contest { title startTime } }
        }`,
        {u: handle},
    );

    const user = profile.matchedUser;
    if (!user) throw new Error(`LeetCode user ${handle} not found`);

    const ac = Object.fromEntries(user.submitStatsGlobal.acSubmissionNum.map((row) => [row.difficulty, row.count]));

    // One calendar request per active year (the API only returns a single year at a time).
    const thisYear = new Date().getFullYear();
    const years = (user.userCalendar.activeYears ?? []).filter((y) => y >= thisYear - 2);
    const calendar = {};
    for (const year of years) {
        const data = await leetcodeQuery(
            `query($u: String!, $y: Int) { matchedUser(username: $u) { userCalendar(year: $y) { submissionCalendar } } }`,
            {u: handle, y: year},
        );
        const raw = JSON.parse(data.matchedUser.userCalendar.submissionCalendar || "{}");
        for (const [ts, count] of Object.entries(raw)) {
            // Keys are UTC-midnight timestamps, so the UTC date is the calendar day.
            const day = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
            calendar[day] = (calendar[day] ?? 0) + count;
        }
    }

    const history = (profile.userContestRankingHistory ?? [])
        .filter((row) => row.attended && row.ranking > 0)
        .map((row) => ({t: row.contest.startTime, rating: Math.round(row.rating)}));

    const tags = user.tagProblemCounts;
    const topics = [...tags.fundamental, ...tags.intermediate, ...tags.advanced]
        .map((t) => ({name: t.tagName, count: t.problemsSolved}))
        .filter((t) => t.count > 0);

    const ranking = profile.userContestRanking;
    return {
        handle,
        url: `https://leetcode.com/u/${handle}/`,
        total: ac.All ?? 0,
        solved: {easy: ac.Easy ?? 0, medium: ac.Medium ?? 0, hard: ac.Hard ?? 0},
        rating: ranking
            ? {
                current: Math.round(ranking.rating),
                max: Math.max(Math.round(ranking.rating), ...history.map((h) => h.rating)),
                contests: ranking.attendedContestsCount,
                topPercent: ranking.topPercentage,
            }
            : null,
        ratingHistory: history,
        languages: user.languageProblemCount
            .map((l) => ({name: l.languageName, count: l.problemsSolved}))
            .sort((a, b) => b.count - a.count),
        topics,
        calendar: trimCalendar(calendar),
    };
}

// ── Codeforces ─────────────────────────────────────────────────────────────

async function codeforces(method, params) {
    const qs = new URLSearchParams(params).toString();
    const body = await request(`https://codeforces.com/api/${method}?${qs}`);
    if (body.status !== "OK") throw new Error(`Codeforces ${method}: ${body.comment}`);
    return body.result;
}

async function fetchCodeforces(handle) {
    const [info] = await codeforces("user.info", {handles: handle});
    const submissions = await codeforces("user.status", {handle});
    const ratingChanges = await codeforces("user.rating", {handle});

    const calendar = {};
    const solved = new Map();
    for (const sub of submissions) {
        const day = istDay(sub.creationTimeSeconds);
        calendar[day] = (calendar[day] ?? 0) + 1;

        if (sub.verdict !== "OK") continue;
        const p = sub.problem;
        const key = `${p.contestId ?? p.problemsetName}-${p.index}`;
        if (!solved.has(key)) solved.set(key, p);
    }

    const buckets = emptySolved();
    const topicCounts = {};
    for (const problem of solved.values()) {
        buckets[bucketByRating(problem.rating)]++;
        for (const tag of problem.tags ?? []) {
            if (tag.startsWith("*")) continue; // "*special" etc. are meta tags
            topicCounts[tag] = (topicCounts[tag] ?? 0) + 1;
        }
    }

    return {
        handle,
        url: `https://codeforces.com/profile/${handle}`,
        total: solved.size,
        solved: buckets,
        rating: {
            current: info.rating ?? null,
            max: info.maxRating ?? null,
            rank: info.rank ?? null,
            maxRank: info.maxRank ?? null,
            contests: ratingChanges.length,
        },
        ratingHistory: ratingChanges.map((r) => ({t: r.ratingUpdateTimeSeconds, rating: r.newRating})),
        topics: Object.entries(topicCounts)
            .map(([name, count]) => ({name, count}))
            .sort((a, b) => b.count - a.count),
        calendar: trimCalendar(calendar),
    };
}

// ── CodeChef ───────────────────────────────────────────────────────────────
// No public API: the profile page embeds ratings + a daily heatmap, the
// "recent activity" endpoint lists every submission, and the problem endpoint
// exposes each problem's difficulty rating.

function codechefStars(rating) {
    const floors = [1400, 1600, 1800, 2000, 2200, 2500];
    return floors.filter((floor) => rating >= floor).length + 1;
}

/**
 * `prev` is the previous CodeChef snapshot. Its `index` remembers every
 * accepted problem (and its rating) plus the newest submission already seen,
 * so later runs only read the newest submission page(s) and look up ratings
 * for problems they haven't met before.
 */
async function fetchCodeChef(handle, prev) {
    const html = await request(`https://www.codechef.com/users/${handle}`, {json: false});

    const totalMatch = html.match(/Total Problems Solved:\s*(\d+)/);
    if (!totalMatch) throw new Error("CodeChef profile markup changed (total solved not found)");
    const total = Number(totalMatch[1]);

    const parseJsonArray = (pattern) => {
        const match = html.match(pattern);
        return match ? JSON.parse(match[1]) : [];
    };
    const mainTrack = parseJsonArray(/var all_rating = (\[.*?\]);/s);
    const dsaTrack = parseJsonArray(/"dsa_monday":(\[.*?\])/s);
    const daily = parseJsonArray(/userDailySubmissionsStats = (\[.*?\]);/s);

    const calendar = {};
    for (const {date, value} of daily) calendar[padDay(date)] = Number(value);

    const seenUpTo = prev?.index?.lastSubmissionId ?? 0;
    const problems = {...(prev?.index?.problems ?? {})};
    let newestId = seenUpTo;

    // Every submission, newest first, paginated as rendered HTML rows. Stop at
    // the first page that reaches submissions indexed on an earlier run.
    for (let page = 0, maxPage = 0; page <= maxPage; page++) {
        const body = await request(
            `https://www.codechef.com/recent/user?page=${page}&user_handle=${encodeURIComponent(handle)}`,
        );
        maxPage = body.max_page ?? 0;
        let reachedIndexed = false;
        for (const row of body.content.match(/<tr >.*?<\/tr>/gs) ?? []) {
            const id = Number(row.match(/viewsolution\/(\d+)/)?.[1] ?? 0);
            if (id && id <= seenUpTo) {
                reachedIndexed = true;
                break;
            }
            newestId = Math.max(newestId, id);
            const link = row.match(/href='\/(?:([^/']+)\/)?problems\/([^']+)'/);
            const verdict = row.match(/<span title='([^']*)'/)?.[1];
            if (link && verdict === "accepted" && !problems[link[2]]) {
                problems[link[2]] = {contest: link[1] ?? "PRACTICE", rating: null, checkedAt: 0};
            }
        }
        if (reachedIndexed) break;
        if (page < maxPage) await sleep(400);
    }

    // Look up ratings we don't have yet. Unrated problems (-1) are re-checked
    // daily because CodeChef sometimes rates contest problems later.
    const DAY = 86_400_000;
    const stale = Object.entries(problems)
        .filter(([, p]) => p.rating == null || (!isRated(p.rating) && Date.now() - p.checkedAt > DAY))
        .slice(0, settings.maxRatingLookups);
    await mapWithConcurrency(stale, 3, async ([code, p]) => {
        try {
            const problem = await request(`https://www.codechef.com/api/contests/${p.contest}/problems/${code}`);
            problems[code] = {...p, rating: Number(problem.difficulty_rating), checkedAt: Date.now()};
        } catch {
            // Leave it for the next run.
        }
    });

    const buckets = emptySolved();
    for (const p of Object.values(problems)) buckets[bucketByRating(p.rating)]++;
    // The profile total also counts problems that never surface in the
    // submission feed (e.g. practice-path problems). They have no rating we can
    // see, so like other unrated problems they count as Medium.
    buckets.medium += Math.max(0, total - Object.keys(problems).length);

    const toHistory = (track) =>
        track.map((row) => ({t: Math.floor(Date.parse(`${row.end_date.replace(" ", "T")}+05:30`) / 1000), rating: Number(row.rating)}));
    const mainHistory = toHistory(mainTrack);
    const dsaHistory = toHistory(dsaTrack);
    const current = mainHistory.at(-1)?.rating ?? null;
    const highest = Number(html.match(/Highest Rating (\d+)/)?.[1] ?? 0) || null;

    return {
        handle,
        url: `https://www.codechef.com/users/${handle}`,
        total,
        solved: buckets,
        rating: current
            ? {
                current,
                max: highest ?? Math.max(...mainHistory.map((h) => h.rating)),
                stars: codechefStars(current),
                contests: mainHistory.length + dsaHistory.length,
                dsa: dsaHistory.length
                    ? {current: dsaHistory.at(-1).rating, max: Math.max(...dsaHistory.map((h) => h.rating))}
                    : null,
            }
            : null,
        ratingHistory: mainHistory,
        calendar: trimCalendar(calendar),
        index: {lastSubmissionId: newestId, problems},
    };
}

// ── GeeksforGeeks ──────────────────────────────────────────────────────────

async function gfgSubmissions(handle, requestType = "", year = "") {
    const body = await request("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({handle, requestType, year, month: ""}),
    });
    if (body.status !== "success") throw new Error(`GFG submissions: ${body.message}`);
    return body.result;
}

async function fetchGfg(handle) {
    const byDifficulty = await gfgSubmissions(handle);
    const count = (level) => Object.keys(byDifficulty[level] ?? {}).length;
    // School and Basic are intentionally left out.
    const solved = {easy: count("Easy"), medium: count("Medium"), hard: count("Hard")};

    let profile = null;
    try {
        const body = await request(
            `https://authapi.geeksforgeeks.org/api-get/user-profile-info/?handle=${encodeURIComponent(handle)}`,
        );
        profile = body.data ?? null;
    } catch {
        // Score is a nice-to-have; the solved counts above are what matter.
    }

    const calendar = {};
    const thisYear = new Date().getFullYear();
    for (const year of [thisYear - 1, thisYear]) {
        const days = await gfgSubmissions(handle, "getYearwiseUserSubmissions", String(year));
        for (const [day, value] of Object.entries(days ?? {})) calendar[day] = Number(value);
    }

    return {
        handle,
        url: `https://www.geeksforgeeks.org/profile/${handle}`,
        total: solved.easy + solved.medium + solved.hard,
        solved,
        score: profile?.score ?? null,
        instituteRank: profile?.institute_rank ?? null,
        calendar: trimCalendar(calendar),
    };
}

// ── GitHub ─────────────────────────────────────────────────────────────────
// The public contributions fragment needs no token and matches the graph on
// the profile page (public contributions, plus private ones if the profile
// shows them). Without a range it covers the trailing year; with from/to it
// covers one calendar year, which is how the all-time totals are built.

async function fetchContributionCalendar(handle, range = "") {
    const html = await request(`https://github.com/users/${handle}/contributions${range}`, {json: false});

    const dates = new Map();
    for (const [, cell] of html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
        const id = cell.match(/\bid="([^"]+)"/)?.[1];
        const date = cell.match(/\bdata-date="([^"]+)"/)?.[1];
        if (id && date) dates.set(id, date);
    }
    if (!dates.size) throw new Error("GitHub contributions markup changed (no cells found)");

    const calendar = {};
    for (const [, forId, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
        const date = dates.get(forId);
        const match = text.match(/^([\d,]+) contribution/);
        if (date) calendar[date] = match ? Number(match[1].replace(/,/g, "")) : 0;
    }
    return calendar;
}

const sumDays = (calendar) => ({
    total: Object.values(calendar).reduce((sum, n) => sum + n, 0),
    activeDays: Object.values(calendar).filter((n) => n > 0).length,
});

async function githubJoinYear(handle, token) {
    // The token is optional; it only lifts the shared-IP API rate limit.
    const user = await request(`https://api.github.com/users/${handle}`, {
        headers: token ? {Authorization: `Bearer ${token}`} : {},
    });
    return new Date(user.created_at).getUTCFullYear();
}

/** `prev` is the previous GitHub snapshot; finished years never change, so they're reused. */
async function fetchGitHub(handle, prev, {token} = {}) {
    const calendar = await fetchContributionCalendar(handle);
    const dates = Object.keys(calendar).sort();

    const thisYear = new Date().getFullYear();
    let joinYear = prev?.joinYear ?? null;
    if (!joinYear) {
        try {
            joinYear = await githubJoinYear(handle, token);
        } catch {
            // Fall back to scanning back until two empty years in a row.
        }
    }

    // All-time = every calendar year since the account was created.
    const years = {};
    let total = 0;
    let activeDays = 0;
    let since = thisYear;
    // The trailing-year calendar always reaches back past 1 January, so the
    // current year comes from it for free; finished years are reused.
    const thisYearSoFar = Object.fromEntries(Object.entries(calendar).filter(([day]) => day.startsWith(`${thisYear}-`)));
    for (let year = thisYear, emptyRun = 0; joinYear ? year >= joinYear : emptyRun < 2; year--) {
        const cached = year < thisYear ? prev?.years?.[year] : sumDays(thisYearSoFar);
        const sums = cached ?? sumDays(await fetchContributionCalendar(handle, `?from=${year}-01-01&to=${year}-12-31`));
        if (year < thisYear) years[year] = sums;
        total += sums.total;
        activeDays += sums.activeDays;
        if (sums.total > 0) since = year;
        emptyRun = sums.total > 0 ? 0 : emptyRun + 1;
        if (year <= 2008) break; // GitHub's launch year
    }

    return {
        handle,
        url: `https://github.com/${handle}`,
        total: sumDays(calendar).total,
        from: dates[0],
        to: dates.at(-1),
        allTime: {total, activeDays, since},
        calendar: trimCalendar(calendar),
        joinYear,
        years,
    };
}

// ── collect ────────────────────────────────────────────────────────────────

/**
 * Fetches every source and returns a full stats snapshot.
 *
 * @param previous  the last snapshot; used for incremental work and as the
 *                  fallback for any source that fails this time
 * @param options   retries / maxRatingLookups tune the request budget,
 *                  githubToken is optional, log receives one line per source
 */
export const SOURCE_NAMES = ["leetcode", "codeforces", "codechef", "gfg", "github"];

const previousSource = (previous, name) =>
    (name === "github" ? previous?.github : previous?.platforms?.[name]) ?? null;

/**
 * Fetches one source and stamps it with fetchedAt. Throws on failure; callers
 * decide what to fall back to.
 */
export async function collectSource(name, previous = {}, {retries = 2, maxRatingLookups = Infinity, githubToken} = {}) {
    settings.retries = retries;
    settings.maxRatingLookups = maxRatingLookups;
    const prev = previousSource(previous, name);
    const loaders = {
        leetcode: () => fetchLeetCode(HANDLES.leetcode),
        codeforces: () => fetchCodeforces(HANDLES.codeforces),
        codechef: () => fetchCodeChef(HANDLES.codechef, prev),
        gfg: () => fetchGfg(HANDLES.gfg),
        github: () => fetchGitHub(HANDLES.github, prev, {token: githubToken}),
    };
    if (!loaders[name]) throw new Error(`Unknown source "${name}"`);
    return {...(await loaders[name]()), fetchedAt: new Date().toISOString()};
}

/**
 * Assembles a snapshot from per-source results, keeping the previous copy of
 * any source that failed.
 *
 * @param results  {name: data | Error}
 */
export function assembleStats(previous = {}, results, log = () => {}) {
    const out = {};
    for (const name of SOURCE_NAMES) {
        const result = results[name];
        if (result && !(result instanceof Error)) {
            out[name] = result;
            continue;
        }
        const fallback = previousSource(previous, name);
        log(`✗ ${name.padEnd(10)} ${result?.message ?? "no result"}${fallback ? " (keeping previous snapshot)" : ""}`);
        out[name] = fallback;
    }
    const {github, ...platforms} = out;
    return {generatedAt: new Date().toISOString(), timeZone: TIME_ZONE, platforms, github};
}

/**
 * Fetches every source in parallel and returns a full snapshot.
 *
 * @param previous  the last snapshot; used for incremental work and as the
 *                  fallback for any source that fails this time
 * @param options   retries / maxRatingLookups tune the request budget,
 *                  githubToken is optional, log receives one line per source
 */
export async function collectStats(previous = {}, {log = () => {}, ...options} = {}) {
    const entries = await Promise.all(
        SOURCE_NAMES.map(async (name) => {
            const started = Date.now();
            try {
                const data = await collectSource(name, previous, options);
                log(`✓ ${name.padEnd(10)} ${String(Date.now() - started).padStart(5)}ms`);
                return [name, data];
            } catch (error) {
                return [name, error instanceof Error ? error : new Error(String(error))];
            }
        }),
    );
    return assembleStats(previous, Object.fromEntries(entries), log);
}
