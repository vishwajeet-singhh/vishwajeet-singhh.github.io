import {ArrowUpRight} from "lucide-react";
import {DifficultyBar, DifficultyLegend} from "@/components/DifficultyBar";
import {PLATFORM_ICONS} from "@/components/icons";
import Sparkline from "@/components/Sparkline";
import {useStats} from "@/lib/live-stats";
import {formatNumber, PLATFORM_NAMES, type PlatformId, type RatingPoint, type Stats} from "@/lib/stats";

// Official rank colours, used only on the small rank dot.
const CODEFORCES_RANK_COLORS: Record<string, string> = {
    newbie: "#808080",
    pupil: "#008000",
    specialist: "#03a89e",
    expert: "#0000ff",
    "candidate master": "#aa00aa",
    master: "#ff8c00",
    "international master": "#ff8c00",
    grandmaster: "#ff0000",
    "international grandmaster": "#ff0000",
    "legendary grandmaster": "#ff0000",
};

const CODECHEF_STAR_COLORS = ["#666666", "#1e7d22", "#3366cc", "#684273", "#ffbf00", "#ff7f00", "#d0011b"];

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

type RatingBlock = {
    label: string;
    value: string;
    badge?: { text: string; color: string };
    notes: string[];
    history?: RatingPoint[];
};

function ratingFor(id: PlatformId, stats: Stats): RatingBlock | null {
    const {leetcode, codeforces, codechef, gfg} = stats.platforms;
    switch (id) {
        case "leetcode":
            if (!leetcode?.rating) return null;
            return {
                label: "Contest rating",
                value: formatNumber(leetcode.rating.current),
                notes: [
                    `Top ${leetcode.rating.topPercent.toFixed(1)}%`,
                    `${leetcode.rating.contests} rated contest${leetcode.rating.contests === 1 ? "" : "s"}`,
                ],
                history: leetcode.ratingHistory,
            };
        case "codeforces": {
            const r = codeforces?.rating;
            if (!r?.current) return null;
            return {
                label: "Rating",
                value: formatNumber(r.current),
                badge: r.rank ? {text: titleCase(r.rank), color: CODEFORCES_RANK_COLORS[r.rank] ?? "#808080"} : undefined,
                notes: [`Max ${formatNumber(r.max ?? r.current)}`, `${r.contests} contests`],
                history: codeforces?.ratingHistory,
            };
        }
        case "codechef": {
            const r = codechef?.rating;
            if (!r) return null;
            return {
                label: "Rating",
                value: formatNumber(r.current),
                badge: {text: `${r.stars}★`, color: CODECHEF_STAR_COLORS[r.stars - 1] ?? "#666666"},
                notes: [
                    r.dsa ? `DSA rating ${formatNumber(r.dsa.current)}` : `Max ${formatNumber(r.max)}`,
                    `${r.contests} contests`,
                ],
                history: codechef?.ratingHistory,
            };
        }
        case "gfg":
            if (!gfg?.score) return null;
            return {
                label: "Coding score",
                value: formatNumber(gfg.score),
                notes: gfg.instituteRank ? [`Institute rank #${gfg.instituteRank}`] : [],
            };
    }
}

const PlatformCard = ({id}: { id: PlatformId }) => {
    const {stats} = useStats();
    const platform = stats.platforms[id];
    if (!platform) return null;
    const Icon = PLATFORM_ICONS[id];
    const rating = ratingFor(id, stats);

    return (
        <article className="card card-pad flex flex-col">
            <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface">
                    <Icon size={22}/>
                </span>
                <div className="min-w-0">
                    <h3 className="text-[16px] font-semibold">
                        <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1 hover:text-accent"
                        >
                            {PLATFORM_NAMES[id]}
                            <ArrowUpRight
                                size={14}
                                className="text-ink-3 transition-colors group-hover:text-accent"
                                aria-hidden="true"
                            />
                        </a>
                    </h3>
                    <p className="truncate font-mono text-[12px] text-ink-3">@{platform.handle}</p>
                </div>
            </header>

            <p className="mt-6 flex items-baseline gap-2">
                <span className="text-[40px] font-semibold leading-none tracking-[-0.02em]">{formatNumber(platform.total)}</span>
                <span className="text-[14px] text-ink-3">solved</span>
            </p>

            <div className="mt-4">
                <DifficultyBar solved={platform.solved} height={8}/>
                <DifficultyLegend solved={platform.solved} className="mt-3 space-y-1.5"/>
            </div>

            {rating && (
                <div className="pt-6">
                    <div className="border-t border-line pt-4">
                        <div className="flex h-6 items-center justify-between gap-3">
                            <p className="text-[13px] text-ink-3">{rating.label}</p>
                            {rating.badge && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[12px] font-medium text-ink-2">
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{background: rating.badge.color}}
                                        aria-hidden="true"
                                    />
                                    {rating.badge.text}
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-[22px] font-semibold leading-tight tracking-[-0.02em]">{rating.value}</p>
                        {rating.history && rating.history.length > 1 && (
                            <div className="mt-3">
                                <Sparkline
                                    points={rating.history}
                                    height={36}
                                    label={`${PLATFORM_NAMES[id]} rating over ${rating.history.length} contests`}
                                />
                            </div>
                        )}
                        {rating.notes.length > 0 && (
                            <p className="mt-2 text-[13px] text-ink-3">{rating.notes.join(" · ")}</p>
                        )}
                    </div>
                </div>
            )}
        </article>
    );
};

export default PlatformCard;
