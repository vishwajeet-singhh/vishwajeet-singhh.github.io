import {type ReactNode, useEffect, useMemo, useState} from "react";
import {LiveStatsContext, type SourceResponse, STATS_API_URL, type StatsResponse} from "@/lib/live-stats";
import {BAKED_STATS, mergeSource, mergeStats, SOURCE_NAMES} from "@/lib/stats";

/** How often an open tab checks again. Matches the Worker's refresh window. */
const RECHECK_MS = 60_000;
// Release a stalled cycle before the next minute's check.
const SYNC_TIMEOUT_MS = 45_000;

/**
 * Keeps the numbers fresh on every visit, and while the page stays open:
 *  1. render the snapshot baked in at build time, instantly;
 *  2. fetch the Worker's latest numbers and keep whichever copy of each
 *     source is newer;
 *  3. ask the Worker to refresh any source nobody has refreshed in the last
 *     minute. The Worker lets exactly one caller per window through, so
 *     busy periods don't multiply requests to LeetCode & co.
 * Steps 2–3 repeat every minute while the tab is visible, and when an overdue
 * tab comes back into view. If the Worker is unreachable the last good numbers
 * stay on screen.
 */
const StatsProvider = ({children}: { children: ReactNode }) => {
    const [stats, setStats] = useState(BAKED_STATS);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!STATS_API_URL) return;
        let activeController: AbortController | undefined;
        let disposed = false;
        let lastSync = 0;
        let inFlight = false;

        const refreshSource = async (name: string, signal: AbortSignal) => {
            const res = await fetch(`${STATS_API_URL}/refresh/${name}`, {method: "POST", signal});
            if (!res.ok) return;
            const body = (await res.json()) as SourceResponse;
            if (!signal.aborted && !disposed) setStats((current) => mergeSource(current, body.name, body.data));
        };

        const sync = async () => {
            if (disposed || inFlight || document.hidden) return;
            inFlight = true;
            lastSync = Date.now();
            const controller = new AbortController();
            activeController = controller;
            const {signal} = controller;
            const timeout = window.setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
            try {
                const res = await fetch(`${STATS_API_URL}/stats`, {signal});
                if (!res.ok) return;
                const body = (await res.json()) as StatsResponse;
                if (signal.aborted || disposed) return;
                setStats((current) => mergeStats(current, body.stats));
                // Only sources this page knows; an older Worker may still list removed ones.
                const stale = body.stale.filter((name) => SOURCE_NAMES.includes(name));
                if (!stale.length) return;
                setUpdating(true);
                // One request per source, in parallel: each is its own small Worker run.
                await Promise.allSettled(stale.map((name) => refreshSource(name, signal)));
            } catch {
                // Offline or blocked: keep what's on screen.
            } finally {
                window.clearTimeout(timeout);
                activeController = undefined;
                inFlight = false;
                if (!disposed) setUpdating(false);
            }
        };

        const onVisible = () => {
            if (!document.hidden && Date.now() - lastSync >= RECHECK_MS) void sync();
        };

        void sync();
        const timer = window.setInterval(() => void sync(), RECHECK_MS);
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            disposed = true;
            activeController?.abort();
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    const value = useMemo(() => ({stats, updating}), [stats, updating]);
    return <LiveStatsContext.Provider value={value}>{children}</LiveStatsContext.Provider>;
};

export default StatsProvider;
