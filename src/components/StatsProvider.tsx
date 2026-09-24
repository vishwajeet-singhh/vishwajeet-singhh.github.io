import {type ReactNode, useEffect, useMemo, useState} from "react";
import {LiveStatsContext, type SourceResponse, STATS_API_URL, type StatsResponse} from "@/lib/live-stats";
import {BAKED_STATS, mergeSource, mergeStats} from "@/lib/stats";

/** How often an open tab checks again. Matches the Worker's refresh window. */
const RECHECK_MS = 5 * 60_000;

/**
 * Keeps the numbers fresh on every visit, and while the page stays open:
 *  1. render the snapshot baked in at build time, instantly;
 *  2. fetch the Worker's latest numbers and keep whichever copy of each
 *     source is newer;
 *  3. ask the Worker to refresh any source nobody has refreshed in the last
 *     five minutes. The Worker lets exactly one caller per window through, so
 *     busy periods don't multiply requests to LeetCode & co.
 * Steps 2–3 repeat every five minutes while the tab is visible, and right away
 * when the tab comes back into view. If the Worker is unreachable nothing
 * changes on screen.
 */
const StatsProvider = ({children}: { children: ReactNode }) => {
    const [stats, setStats] = useState(BAKED_STATS);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!STATS_API_URL) return;
        const controller = new AbortController();
        const {signal} = controller;
        let lastSync = 0;
        let inFlight = false;

        const refreshSource = async (name: string) => {
            const res = await fetch(`${STATS_API_URL}/refresh/${name}`, {method: "POST", signal});
            if (!res.ok) return;
            const body = (await res.json()) as SourceResponse;
            setStats((current) => mergeSource(current, body.name, body.data));
        };

        const sync = async () => {
            if (inFlight || document.hidden) return;
            inFlight = true;
            lastSync = Date.now();
            try {
                const res = await fetch(`${STATS_API_URL}/stats`, {signal});
                if (!res.ok) return;
                const body = (await res.json()) as StatsResponse;
                setStats((current) => mergeStats(current, body.stats));
                if (!body.stale.length) return;
                setUpdating(true);
                // One request per source, in parallel: each is its own small Worker run.
                await Promise.allSettled(body.stale.map(refreshSource));
            } catch {
                // Offline or blocked: keep what's on screen.
            } finally {
                inFlight = false;
                if (!signal.aborted) setUpdating(false);
            }
        };

        const onVisible = () => {
            if (!document.hidden && Date.now() - lastSync >= RECHECK_MS) void sync();
        };

        void sync();
        const timer = window.setInterval(() => void sync(), RECHECK_MS);
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            controller.abort();
            window.clearInterval(timer);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    const value = useMemo(() => ({stats, updating}), [stats, updating]);
    return <LiveStatsContext.Provider value={value}>{children}</LiveStatsContext.Provider>;
};

export default StatsProvider;
