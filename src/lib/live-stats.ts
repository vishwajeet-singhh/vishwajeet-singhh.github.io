import {createContext, useContext, useEffect, useState} from "react";
import type {SourceName, Stats} from "@/lib/stats";

/**
 * Base URL of the stats Worker (worker/), set at build time. When it's empty
 * the site simply shows the snapshot baked in at build time.
 */
export const STATS_API_URL = (import.meta.env.VITE_STATS_API_URL ?? "").replace(/\/+$/, "");

/** GET /stats */
export type StatsResponse = {
    stats: Stats;
    /** Sources nobody has refreshed in the last few minutes. */
    stale: SourceName[];
};

/** POST /refresh/:name */
export type SourceResponse = {
    name: SourceName;
    data: unknown;
    refreshed: boolean;
};

export type LiveStats = {
    stats: Stats;
    /** A visit-triggered refresh is in flight. */
    updating: boolean;
};

export const LiveStatsContext = createContext<LiveStats | null>(null);

export function useStats(): LiveStats {
    const value = useContext(LiveStatsContext);
    if (!value) throw new Error("useStats must be used inside <StatsProvider>");
    return value;
}

/** Current time, re-read every `intervalMs`, for "updated 5 min ago" labels. */
export function useNow(intervalMs = 30_000) {
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), intervalMs);
        return () => window.clearInterval(id);
    }, [intervalMs]);
    return now;
}
