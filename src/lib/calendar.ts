import type {Calendar} from "@/lib/stats";

const pad = (n: number) => String(n).padStart(2, "0");

/** Local date → "YYYY-MM-DD". */
export const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "YYYY-MM-DD" → local midnight. */
export const parseDayKey = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

export const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export function mergeCalendars(calendars: Calendar[]): Calendar {
    const merged: Calendar = {};
    for (const calendar of calendars) {
        for (const [day, count] of Object.entries(calendar)) merged[day] = (merged[day] ?? 0) + count;
    }
    return merged;
}

export type HeatCell = {
    key: string;
    date: Date;
    week: number;
    weekday: number;
};

/**
 * GitHub-style grid: columns are weeks (Sunday first), the last column holds
 * `end`. Days after `end` in the final week are omitted.
 */
export function buildGrid(end: Date, weeks: number) {
    const start = addDays(end, -end.getDay() - (weeks - 1) * 7);
    const cells: HeatCell[] = [];
    for (let week = 0; week < weeks; week++) {
        for (let weekday = 0; weekday < 7; weekday++) {
            const date = addDays(start, week * 7 + weekday);
            if (date > end) break;
            cells.push({key: dayKey(date), date, week, weekday});
        }
    }

    // A month label sits over the first week that contains that month's 1st.
    const months: { week: number; label: string }[] = [];
    for (const cell of cells) {
        if (cell.date.getDate() !== 1) continue;
        months.push({week: cell.week, label: cell.date.toLocaleString("en-US", {month: "short"})});
    }
    // Leading partial month gets a label too if there's room before the next one.
    if (!months.length || months[0].week > 2) {
        months.unshift({week: 0, label: start.toLocaleString("en-US", {month: "short"})});
    }

    return {start, cells, months};
}

export type WindowStats = {
    total: number;
    activeDays: number;
    longestStreak: number;
    currentStreak: number;
};

export function windowStats(calendar: Calendar, start: Date, end: Date): WindowStats {
    let total = 0;
    let activeDays = 0;
    let longestStreak = 0;
    let run = 0;
    for (let date = new Date(start); date <= end; date = addDays(date, 1)) {
        const count = calendar[dayKey(date)] ?? 0;
        total += count;
        if (count > 0) {
            activeDays++;
            run++;
            longestStreak = Math.max(longestStreak, run);
        } else {
            run = 0;
        }
    }

    // Today without activity doesn't break a streak yet; count back from yesterday.
    let cursor = (calendar[dayKey(end)] ?? 0) > 0 ? end : addDays(end, -1);
    let currentStreak = 0;
    while ((calendar[dayKey(cursor)] ?? 0) > 0) {
        currentStreak++;
        cursor = addDays(cursor, -1);
    }

    return {total, activeDays, longestStreak, currentStreak};
}

export const HEAT_LEVELS = 5;

/**
 * Cut points for levels 1–5, taken from quantiles of the non-zero days in view
 * so sparse and busy sources both use the full ramp. Returns ascending upper
 * bounds for levels 1–4; anything above the last is level 5.
 */
export function heatThresholds(values: number[]): number[] {
    const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
    if (!sorted.length) return [1, 2, 3, 4];
    const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
    const cuts = [at(0.2), at(0.45), at(0.7), at(0.9)];
    // Keep cut points strictly increasing so every level stays reachable.
    for (let i = 1; i < cuts.length; i++) cuts[i] = Math.max(cuts[i], cuts[i - 1] + 1);
    return cuts;
}

export function heatLevel(count: number, thresholds: number[]): number {
    if (count <= 0) return 0;
    const index = thresholds.findIndex((cut) => count <= cut);
    return index === -1 ? HEAT_LEVELS : index + 1;
}

/** Human ranges for the legend, e.g. ["1–2", "3–4", "5–7", "8–12", "13+"]. */
export function heatLegend(thresholds: number[]): string[] {
    const labels: string[] = [];
    let lower = 1;
    for (const cut of thresholds) {
        labels.push(cut === lower ? `${lower}` : `${lower}–${cut}`);
        lower = cut + 1;
    }
    labels.push(`${lower}+`);
    return labels;
}
