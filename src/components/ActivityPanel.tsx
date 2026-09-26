import {useMemo, useState} from "react";
import Heatmap from "@/components/Heatmap";
import {PLATFORM_ICONS} from "@/components/icons";
import {addDays, mergeCalendars, startOfToday, windowStats} from "@/lib/calendar";
import {useStats} from "@/lib/live-stats";
import {availablePlatforms, formatNumber, PLATFORM_SHORT_NAMES, type PlatformId} from "@/lib/stats";

type Filter = "all" | PlatformId;

const WEEKS = 53;

const ActivityPanel = () => {
    const {stats: snapshot} = useStats();
    const platforms = useMemo(() => availablePlatforms(snapshot), [snapshot]);
    const [filter, setFilter] = useState<Filter>("all");
    const end = useMemo(startOfToday, []);

    const calendar = useMemo(
        () =>
            filter === "all"
                ? mergeCalendars(platforms.map((id) => snapshot.platforms[id]!.calendar))
                : snapshot.platforms[filter]!.calendar,
        [filter, platforms, snapshot],
    );

    const start = useMemo(() => addDays(end, -end.getDay() - (WEEKS - 1) * 7), [end]);
    const stats = useMemo(() => windowStats(calendar, start, end), [calendar, start, end]);

    const describeDay = (key: string) => {
        if (filter !== "all") return null;
        const rows = platforms
            .map((id) => ({id, count: snapshot.platforms[id]!.calendar[key] ?? 0}))
            .filter((row) => row.count > 0);
        return (
            <ul className="mt-2 space-y-1 border-t border-line pt-2">
                {rows.map(({id, count}) => {
                    const Icon = PLATFORM_ICONS[id];
                    return (
                        <li key={id} className="flex items-center gap-2 text-[12px] text-ink-2">
                            <Icon size={12}/>
                            <span>{PLATFORM_SHORT_NAMES[id]}</span>
                            <span className="ml-auto pl-4 font-semibold text-ink tabular">{count}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const filters: { id: Filter; label: string }[] = [
        {id: "all", label: "All"},
        ...platforms.map((id) => ({id, label: PLATFORM_SHORT_NAMES[id]})),
    ];

    const tiles = [
        {label: "Submissions", value: formatNumber(stats.total), note: "last 12 months"},
        {label: "Active days", value: formatNumber(stats.activeDays), note: "last 12 months"},
        {label: "Longest streak", value: `${stats.longestStreak}d`, note: "consecutive days"},
        {label: "Current streak", value: `${stats.currentStreak}d`, note: "as of today"},
    ];

    const scope = filter === "all" ? "all platforms" : PLATFORM_SHORT_NAMES[filter];

    return (
        <div className="card card-pad">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-[18px] font-semibold">Submission activity</h3>
                    <p className="mt-1 text-[14px] text-ink-3">Daily submissions across all four platforms.</p>
                </div>
                <div
                    role="group"
                    aria-label="Filter by platform"
                    className="scrollbar-thin -mx-1 flex overflow-x-auto px-1 sm:mx-0 sm:px-0"
                >
                    <div className="inline-flex rounded-lg border border-line bg-subtle p-0.5">
                        {filters.map((f) => {
                            const selected = filter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => setFilter(f.id)}
                                    className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] transition-colors sm:px-3 ${
                                        selected
                                            ? "bg-surface font-medium text-ink shadow-card"
                                            : "text-ink-2 hover:text-ink"
                                    }`}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <Heatmap
                    calendar={calendar}
                    end={end}
                    weeks={WEEKS}
                    unit="submission"
                    describeDay={describeDay}
                    label={`Daily submissions on ${scope}: ${stats.total} submissions across ${stats.activeDays} active days in the last 12 months.`}
                />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {tiles.map((tile) => (
                    <div key={tile.label} className="bg-surface px-4 py-3.5">
                        <dt className="text-[12.5px] text-ink-3">{tile.label}</dt>
                        <dd className="mt-1 text-[22px] font-semibold leading-tight tracking-tight">{tile.value}</dd>
                        <dd className="text-[12px] text-ink-3">{tile.note}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default ActivityPanel;
