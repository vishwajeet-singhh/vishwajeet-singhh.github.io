import {type ReactNode, useLayoutEffect, useMemo, useRef, useState} from "react";
import {buildGrid, heatLegend, heatLevel, heatThresholds, type HeatCell} from "@/lib/calendar";
import type {Calendar} from "@/lib/stats";

type HeatmapProps = {
    calendar: Calendar;
    end: Date;
    weeks?: number;
    /** Noun for the tooltip and summary, e.g. "submission" / "contribution". */
    unit: string;
    /** Extra tooltip lines for a day (e.g. per-platform split). */
    describeDay?: (key: string) => ReactNode;
    label: string;
};

const DAY_LABELS = [
    {weekday: 1, label: "Mon"},
    {weekday: 3, label: "Wed"},
    {weekday: 5, label: "Fri"},
];

const GUTTER_X = 30; // weekday labels
const GUTTER_Y = 20; // month labels
const MIN_PITCH = 13;
const MAX_PITCH = 22;
const GAP = 3;

const plural = (n: number, unit: string) => `${n.toLocaleString("en-US")} ${unit}${n === 1 ? "" : "s"}`;

const Heatmap = ({calendar, end, weeks = 53, unit, describeDay, label}: HeatmapProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pitch, setPitch] = useState(15);
    const [hover, setHover] = useState<{ cell: HeatCell; x: number; y: number } | null>(null);

    const {cells, months} = useMemo(() => buildGrid(end, weeks), [end, weeks]);
    const thresholds = useMemo(
        () => heatThresholds(cells.map((c) => calendar[c.key] ?? 0)),
        [cells, calendar],
    );
    const legend = useMemo(() => heatLegend(thresholds), [thresholds]);

    // Fill the card width on desktop; below the minimum cell size, scroll instead.
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const fit = () => {
            const available = el.clientWidth - GUTTER_X;
            setPitch(Math.max(MIN_PITCH, Math.min(MAX_PITCH, available / weeks)));
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(el);
        return () => observer.disconnect();
    }, [weeks]);

    // Most recent activity is on the right; start there when the grid overflows.
    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollLeft = el.scrollWidth;
    }, [pitch]);

    const size = pitch - GAP;
    const width = GUTTER_X + weeks * pitch;
    const height = GUTTER_Y + 7 * pitch;

    const showTooltip = (cell: HeatCell, target: SVGRectElement) => {
        const wrap = scrollRef.current?.parentElement;
        if (!wrap) return;
        const box = target.getBoundingClientRect();
        const origin = wrap.getBoundingClientRect();
        setHover({cell, x: box.left - origin.left + box.width / 2, y: box.top - origin.top});
    };

    const hoverCount = hover ? calendar[hover.cell.key] ?? 0 : 0;

    return (
        <div className="relative">
            <div ref={scrollRef} className="scrollbar-thin overflow-x-auto pb-1" onScroll={() => setHover(null)}>
                <svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    role="img"
                    aria-label={label}
                    className="block"
                    onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
                >
                    {months.map((m) => (
                        <text
                            key={`${m.week}-${m.label}`}
                            x={GUTTER_X + m.week * pitch}
                            y={12}
                            className="fill-ink-3 font-mono text-[11px]"
                        >
                            {m.label}
                        </text>
                    ))}
                    {DAY_LABELS.map((d) => (
                        <text
                            key={d.label}
                            x={0}
                            y={GUTTER_Y + d.weekday * pitch + size / 2}
                            dominantBaseline="central"
                            className="fill-ink-3 font-mono text-[11px]"
                        >
                            {d.label}
                        </text>
                    ))}
                    {cells.map((cell) => {
                        const count = calendar[cell.key] ?? 0;
                        const level = heatLevel(count, thresholds);
                        const isHovered = hover?.cell.key === cell.key;
                        return (
                            <rect
                                key={cell.key}
                                x={GUTTER_X + cell.week * pitch}
                                y={GUTTER_Y + cell.weekday * pitch}
                                width={size}
                                height={size}
                                rx={Math.min(4, size / 4)}
                                fill={`var(--heat-${level})`}
                                stroke={isHovered ? "rgb(var(--ink))" : "none"}
                                strokeWidth={isHovered ? 1.5 : 0}
                                onPointerEnter={(e) => showTooltip(cell, e.currentTarget)}
                            />
                        );
                    })}
                </svg>
            </div>

            {hover && (
                <div
                    role="tooltip"
                    className="pointer-events-none absolute z-20 w-max max-w-[240px] -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-surface px-3 py-2 text-left shadow-lift"
                    style={{
                        left: Math.max(90, Math.min(hover.x, (scrollRef.current?.clientWidth ?? 0) - 90)),
                        top: hover.y - 8,
                    }}
                >
                    <div className="text-[13px] font-semibold text-ink tabular">
                        {hoverCount ? plural(hoverCount, unit) : `No ${unit}s`}
                    </div>
                    <div className="font-mono text-[11px] text-ink-3">
                        {hover.cell.date.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </div>
                    {hoverCount > 0 && describeDay?.(hover.cell.key)}
                </div>
            )}

            <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-ink-3" aria-hidden="true">
                <span className="mr-1">Less</span>
                {[0, 1, 2, 3, 4, 5].map((level) => (
                    <span
                        key={level}
                        className="inline-block h-[11px] w-[11px] rounded-[3px]"
                        style={{background: `var(--heat-${level})`}}
                        title={level === 0 ? `No ${unit}s` : `${legend[level - 1]} ${unit}s`}
                    />
                ))}
                <span className="ml-1">More</span>
            </div>
        </div>
    );
};

export default Heatmap;
