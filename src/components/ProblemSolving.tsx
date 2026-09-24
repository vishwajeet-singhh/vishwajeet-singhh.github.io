import {useMemo} from "react";
import ActivityPanel from "@/components/ActivityPanel";
import {DifficultyBar, DifficultyLegend} from "@/components/DifficultyBar";
import {PLATFORM_ICONS} from "@/components/icons";
import PlatformCard from "@/components/PlatformCard";
import Section from "@/components/Section";
import StatsFreshness from "@/components/StatsFreshness";
import {useStats} from "@/lib/live-stats";
import {
    availablePlatforms,
    formatNumber,
    PLATFORM_NAMES,
    type PlatformId,
    type Stats,
    topTopics,
    totalSolved,
} from "@/lib/stats";

function deriveView(stats: Stats) {
    const platforms = availablePlatforms(stats);
    const contests = [
        {id: "leetcode" as const, count: stats.platforms.leetcode?.rating?.contests ?? 0},
        {id: "codeforces" as const, count: stats.platforms.codeforces?.rating.contests ?? 0},
        {id: "codechef" as const, count: stats.platforms.codechef?.rating?.contests ?? 0},
    ].filter((row) => row.count > 0);
    return {
        platforms,
        ...totalSolved(stats),
        topics: topTopics(stats, 10),
        // LeetCode reports "Python3"; the version suffix is noise here.
        languages: (stats.platforms.leetcode?.languages ?? []).map((l) => ({
            ...l,
            name: l.name.replace(/^Python3$/, "Python"),
        })),
        contests,
        totalContests: contests.reduce((sum, row) => sum + row.count, 0),
        byPlatform: platforms
            .map((id) => ({name: PLATFORM_NAMES[id], count: stats.platforms[id]!.total, icon: id}))
            .sort((x, y) => y.count - x.count),
    };
}

/** Horizontal bars: one hue, value at the tip, sorted descending. */
const BarList = ({rows, label}: { rows: { name: string; count: number; icon?: PlatformId }[]; label: string }) => {
    const max = Math.max(...rows.map((r) => r.count), 1);
    return (
        <ul className="space-y-3" aria-label={label}>
            {rows.map((row) => {
                const Icon = row.icon ? PLATFORM_ICONS[row.icon] : null;
                return (
                    <li key={row.name} className="grid grid-cols-[minmax(0,140px)_1fr] items-center gap-3 sm:grid-cols-[170px_1fr]">
                        <span className="flex min-w-0 items-center gap-2 text-[14px] text-ink-2">
                            {Icon && <Icon size={15}/>}
                            <span className="truncate">{row.name}</span>
                        </span>
                        <span className="flex items-center gap-2.5">
                            <span
                                className="h-2.5 rounded-r-[4px] bg-accent"
                                style={{width: `max(4px, calc((100% - 44px) * ${row.count / max}))`}}
                                aria-hidden="true"
                            />
                            <span className="text-[13px] font-semibold text-ink tabular">{row.count}</span>
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

const ProblemSolving = () => {
    const {stats} = useStats();
    const {platforms, total, solved, topics, languages, contests, totalContests, byPlatform} = useMemo(
        () => deriveView(stats),
        [stats],
    );

    return (
        <Section
            id="problem-solving"
            title="Problem solving"
            lede="Problems I have solved on LeetCode, Codeforces, CodeChef and GeeksforGeeks. The figures come straight from each platform and stay up to date on their own. Difficulty is grouped into LeetCode's Easy, Medium and Hard levels."
            aside={<StatsFreshness/>}
        >
            <div className="space-y-6">
                {/* Overview */}
                <div className="card grid lg:grid-cols-[1.15fr_1fr]">
                    <div className="card-pad">
                        <p className="text-[14px] font-medium text-ink-2">Problems solved</p>
                        <p className="mt-2 text-[64px] font-semibold leading-none tracking-[-0.025em] sm:text-[80px]">
                            {formatNumber(total)}
                        </p>
                        <div className="mt-8">
                            <DifficultyBar solved={solved} height={14}/>
                            <DifficultyLegend
                                solved={solved}
                                showPercent
                                inline
                                className="mt-5 flex flex-wrap gap-x-8 gap-y-2.5"
                            />
                        </div>
                    </div>
                    <div className="card-pad border-t border-line lg:border-l lg:border-t-0">
                        <p className="text-[14px] font-medium text-ink-2">By platform</p>
                        <div className="mt-6">
                            <BarList rows={byPlatform} label="Problems solved per platform"/>
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <ActivityPanel/>

                {/* Per platform */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {platforms.map((id) => (
                        <PlatformCard key={id} id={id}/>
                    ))}
                </div>

                {/* Topics + languages */}
                <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <div className="card card-pad">
                        <h3 className="text-[18px] font-semibold">Topics</h3>
                        <p className="mt-1 text-[14px] text-ink-3">
                            Problem tags from LeetCode and Codeforces. A problem can have more than one tag.
                        </p>
                        <div className="mt-6">
                            <BarList rows={topics} label="Problems solved per topic"/>
                        </div>
                    </div>

                    <div className="card card-pad flex flex-col">
                        <h3 className="text-[18px] font-semibold">Languages</h3>
                        <p className="mt-1 text-[14px] text-ink-3">Accepted LeetCode solutions by language.</p>
                        <ul className="mt-6 space-y-4">
                            {languages.map((lang) => {
                                const share = lang.count / Math.max(1, languages.reduce((s, l) => s + l.count, 0));
                                return (
                                    <li key={lang.name}>
                                        <div className="flex items-baseline justify-between text-[14px]">
                                            <span className="text-ink-2">{lang.name}</span>
                                            <span className="font-semibold text-ink tabular">
                                                {lang.count}
                                                <span className="ml-1.5 font-normal text-ink-3">{Math.round(share * 100)}%</span>
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 rounded-full bg-subtle" aria-hidden="true">
                                            <div className="h-full rounded-full bg-accent" style={{width: `${Math.max(2, share * 100)}%`}}/>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {totalContests > 0 && (
                            <div className="mt-8 border-t border-line pt-6">
                                <p className="flex items-baseline justify-between">
                                    <span className="text-[14px] font-medium text-ink-2">Rated contests</span>
                                    <span className="text-[22px] font-semibold leading-none tracking-tight">{totalContests}</span>
                                </p>
                                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                                    {contests.map(({id, count}) => {
                                        const Icon = PLATFORM_ICONS[id];
                                        return (
                                            <li key={id} className="flex items-center gap-1.5 text-[13px] text-ink-2">
                                                <Icon size={13}/>
                                                {PLATFORM_NAMES[id]}
                                                <span className="font-semibold text-ink tabular">{count}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ProblemSolving;
