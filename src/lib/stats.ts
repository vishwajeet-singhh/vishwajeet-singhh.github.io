import raw from "@/data/stats.json";

export type Difficulty = "easy" | "medium" | "hard";
export type SolvedBreakdown = Record<Difficulty, number>;
export type Calendar = Record<string, number>;
export type RatingPoint = { t: number; rating: number };

type PlatformBase = {
    handle: string;
    url: string;
    total: number;
    solved: SolvedBreakdown;
    calendar: Calendar;
    fetchedAt?: string;
};

export type LeetCodeStats = PlatformBase & {
    rating: { current: number; max: number; contests: number; topPercent: number } | null;
    ratingHistory: RatingPoint[];
    languages: { name: string; count: number }[];
    topics: { name: string; count: number }[];
};

export type CodeforcesStats = PlatformBase & {
    rating: { current: number | null; max: number | null; rank: string | null; maxRank: string | null; contests: number };
    ratingHistory: RatingPoint[];
    topics: { name: string; count: number }[];
};

export type CodeChefStats = PlatformBase & {
    rating: {
        current: number;
        max: number;
        stars: number;
        contests: number;
        dsa: { current: number; max: number } | null;
    } | null;
    ratingHistory: RatingPoint[];
};

export type GfgStats = PlatformBase & {
    score: number | null;
    instituteRank: number | null;
};

export type GitHubStats = {
    handle: string;
    url: string;
    fetchedAt?: string;
    total: number;
    from: string;
    to: string;
    /** Every calendar year since the account was created. */
    allTime?: { total: number; activeDays: number; since: number };
    calendar: Calendar;
};

export type Stats = {
    generatedAt: string;
    timeZone: string;
    platforms: {
        leetcode: LeetCodeStats | null;
        codeforces: CodeforcesStats | null;
        codechef: CodeChefStats | null;
        gfg: GfgStats | null;
    };
    github: GitHubStats | null;
};

/** The snapshot baked in at build time: what renders first, and the fallback if the live API is down. */
export const BAKED_STATS = raw as unknown as Stats;

export type PlatformId = keyof Stats["platforms"];

export const PLATFORM_ORDER: PlatformId[] = ["leetcode", "codeforces", "codechef", "gfg"];

export const PLATFORM_NAMES: Record<PlatformId, string> = {
    leetcode: "LeetCode",
    codeforces: "Codeforces",
    codechef: "CodeChef",
    gfg: "GeeksforGeeks",
};

export const PLATFORM_SHORT_NAMES: Record<PlatformId, string> = {
    leetcode: "LeetCode",
    codeforces: "Codeforces",
    codechef: "CodeChef",
    gfg: "GFG",
};

export const DIFFICULTIES: { id: Difficulty; label: string }[] = [
    {id: "easy", label: "Easy"},
    {id: "medium", label: "Medium"},
    {id: "hard", label: "Hard"},
];

export const availablePlatforms = (stats: Stats) =>
    PLATFORM_ORDER.filter((id) => stats.platforms[id] != null);

export function totalSolved(stats: Stats): { total: number; solved: SolvedBreakdown } {
    const solved: SolvedBreakdown = {easy: 0, medium: 0, hard: 0};
    let total = 0;
    for (const id of availablePlatforms(stats)) {
        const p = stats.platforms[id]!;
        total += p.total;
        for (const d of DIFFICULTIES) solved[d.id] += p.solved[d.id];
    }
    return {total, solved};
}

// Topic names differ per judge; fold them into one vocabulary. Within one
// platform overlapping tags collapse with max() (a Tree problem is usually
// also a Binary Tree problem), and platforms are then summed.
const TOPIC_ALIASES: Record<string, string> = {
    // LeetCode
    "Array": "Arrays",
    "String": "Strings",
    "Hash Table": "Hashing",
    "Math": "Math",
    "Dynamic Programming": "Dynamic Programming",
    "Sorting": "Sorting",
    "Greedy": "Greedy",
    "Two Pointers": "Two Pointers",
    "Binary Search": "Binary Search",
    "Sliding Window": "Sliding Window",
    "Stack": "Stacks & Queues",
    "Queue": "Stacks & Queues",
    "Monotonic Stack": "Stacks & Queues",
    "Monotonic Queue": "Stacks & Queues",
    "Simulation": "Implementation",
    "Enumeration": "Brute Force",
    "Bit Manipulation": "Bit Manipulation",
    "Tree": "Trees",
    "Binary Tree": "Trees",
    "Binary Search Tree": "Trees",
    "Depth-First Search": "Graphs & Search",
    "Breadth-First Search": "Graphs & Search",
    "Graph": "Graphs & Search",
    "Union-Find": "Graphs & Search",
    "Shortest Path": "Graphs & Search",
    "Linked List": "Linked Lists",
    "Matrix": "Matrix",
    "Prefix Sum": "Prefix Sum",
    "Game Theory": "Game Theory",
    "Number Theory": "Number Theory",
    "Recursion": "Recursion",
    "Backtracking": "Backtracking",
    "Heap (Priority Queue)": "Heaps",
    // Codeforces
    "math": "Math",
    "implementation": "Implementation",
    "greedy": "Greedy",
    "brute force": "Brute Force",
    "constructive algorithms": "Constructive",
    "sortings": "Sorting",
    "strings": "Strings",
    "number theory": "Number Theory",
    "games": "Game Theory",
    "two pointers": "Two Pointers",
    "data structures": "Data Structures",
    "bitmasks": "Bit Manipulation",
    "binary search": "Binary Search",
    "dp": "Dynamic Programming",
    "dfs and similar": "Graphs & Search",
    "graphs": "Graphs & Search",
    "trees": "Trees",
    "hashing": "Hashing",
    "combinatorics": "Combinatorics",
    "geometry": "Geometry",
};

export function topTopics(stats: Stats, limit = 12): { name: string; count: number }[] {
    const combined = new Map<string, number>();
    const sources = [stats.platforms.leetcode?.topics, stats.platforms.codeforces?.topics];
    for (const topics of sources) {
        if (!topics) continue;
        const perPlatform = new Map<string, number>();
        for (const {name, count} of topics) {
            const canonical = TOPIC_ALIASES[name];
            if (!canonical) continue;
            perPlatform.set(canonical, Math.max(perPlatform.get(canonical) ?? 0, count));
        }
        for (const [name, count] of perPlatform) combined.set(name, (combined.get(name) ?? 0) + count);
    }
    return [...combined]
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, limit);
}

export const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

export const formatSyncDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.getDate()} ${date.toLocaleString("en-US", {month: "short"})} ${date.getFullYear()}`;
};

/** "just now", "12 min ago", "3 h ago", then a plain date. */
export function formatUpdated(iso: string, now = Date.now()) {
    const minutes = Math.floor((now - Date.parse(iso)) / 60_000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (minutes < 24 * 60) return `${Math.floor(minutes / 60)} h ago`;
    return `on ${formatSyncDate(iso)}`;
}

type Timestamped = { fetchedAt?: string } | null;

const newer = <T extends Timestamped>(a: T, b: T): T => {
    if (!a) return b;
    if (!b) return a;
    return (b.fetchedAt ?? "") > (a.fetchedAt ?? "") ? b : a;
};

/**
 * Combines two snapshots source by source, keeping whichever copy of each
 * platform was fetched more recently. A platform that failed in one place
 * (e.g. blocked from the Worker) never makes the other copy look older.
 */
export type SourceName = PlatformId | "github";

export const SOURCE_NAMES: SourceName[] = [...PLATFORM_ORDER, "github"];

/** Replaces one source if the incoming copy is newer. */
export function mergeSource(stats: Stats, name: SourceName, data: unknown): Stats {
    if (!data) return stats;
    if (name === "github") return {...stats, github: newer(stats.github, data as GitHubStats)};
    const platforms = {...stats.platforms, [name]: newer(stats.platforms[name] as Timestamped, data as Timestamped)};
    const fetched = (data as { fetchedAt?: string }).fetchedAt ?? "";
    return {
        ...stats,
        generatedAt: fetched > stats.generatedAt ? fetched : stats.generatedAt,
        platforms: platforms as Stats["platforms"],
    };
}

export function mergeStats(a: Stats, b: Stats): Stats {
    return {
        generatedAt: a.generatedAt > b.generatedAt ? a.generatedAt : b.generatedAt,
        timeZone: a.timeZone,
        platforms: {
            leetcode: newer(a.platforms.leetcode, b.platforms.leetcode),
            codeforces: newer(a.platforms.codeforces, b.platforms.codeforces),
            codechef: newer(a.platforms.codechef, b.platforms.codechef),
            gfg: newer(a.platforms.gfg, b.platforms.gfg),
        },
        github: newer(a.github, b.github),
    };
}
