import {useMemo} from "react";
import {ArrowUpRight} from "lucide-react";
import Heatmap from "@/components/Heatmap";
import {GitHubIcon} from "@/components/icons";
import Section from "@/components/Section";
import {addDays, startOfToday, windowStats} from "@/lib/calendar";
import {useStats} from "@/lib/live-stats";
import {formatNumber} from "@/lib/stats";

const GitHubContributions = () => {
    const {stats: snapshot} = useStats();
    const github = snapshot.github;
    const end = useMemo(startOfToday, []);
    const stats = useMemo(
        () => (github ? windowStats(github.calendar, addDays(end, -end.getDay() - 52 * 7), end) : null),
        [github, end],
    );
    if (!github || !stats) return null;

    // Headline is all-time; the heatmap and the small line are the last 12 months.
    const allTime = github.allTime ?? {total: stats.total, activeDays: stats.activeDays, since: null};
    const figures = [
        {value: formatNumber(allTime.total), label: "total contributions"},
        {value: formatNumber(allTime.activeDays), label: "total active days"},
    ];

    return (
        <Section id="github-contributions" title="GitHub contributions">
            <div className="card card-pad">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-[14px] text-ink-3">
                            {allTime.since ? `All time, since ${allTime.since}` : "Last 12 months"}
                        </p>
                    </div>
                    <a href={github.url} target="_blank" rel="noopener noreferrer" className="btn-secondary h-9 self-start">
                        <GitHubIcon size={15}/>@{github.handle}
                        <ArrowUpRight size={15} aria-hidden="true"/>
                    </a>
                </div>

                <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-5">
                    {figures.map((f) => (
                        <div key={f.label} className="flex flex-col-reverse">
                            <dt className="mt-2 text-[14px] text-ink-3">{f.label}</dt>
                            <dd className="text-[36px] font-semibold leading-none tracking-[-0.025em] sm:text-[44px]">
                                {f.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {github.allTime && (
                    <p className="mt-6 border-t border-line pt-4 text-[14px] text-ink-3">
                        Last 12 months:{" "}
                        <span className="whitespace-nowrap">
                            <span className="font-semibold text-ink">{formatNumber(stats.total)}</span> contributions
                        </span>
                        <span className="mx-2 text-line-strong">·</span>
                        <span className="whitespace-nowrap">
                            <span className="font-semibold text-ink">{formatNumber(stats.activeDays)}</span> active days
                        </span>
                    </p>
                )}

                <div className="mt-6">
                    <Heatmap
                        calendar={github.calendar}
                        end={end}
                        unit="contribution"
                        label={`GitHub contributions: ${stats.total} in the last 12 months.`}
                    />
                </div>
            </div>
        </Section>
    );
};

export default GitHubContributions;
