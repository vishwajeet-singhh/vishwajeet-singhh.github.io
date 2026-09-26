import {Fragment, useMemo} from "react";
import {ArrowDown, ArrowRight, ArrowUpRight, Boxes, Cpu, GitPullRequest, MessageSquareCode} from "lucide-react";
import Heatmap from "@/components/Heatmap";
import {GitHubIcon} from "@/components/icons";
import Section from "@/components/Section";
import {HELIX, PROFILE} from "@/data/profile";
import {addDays, startOfToday, windowStats} from "@/lib/calendar";
import {useStats} from "@/lib/live-stats";
import {formatNumber} from "@/lib/stats";

const FLOW = [
    {icon: GitPullRequest, title: "GitHub", note: "pull_request webhook"},
    {icon: Boxes, title: "Helix", note: "Spring Boot, async worker"},
    {icon: Cpu, title: "Ollama", note: "Qwen2.5-Coder, local"},
    {icon: MessageSquareCode, title: "PR review", note: "verdict + inline comments"},
];

const FlowNode = ({item}: { item: (typeof FLOW)[number] }) => {
    const Icon = item.icon;
    return (
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 shadow-card lg:flex-col lg:items-start lg:gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
                <Icon size={16} aria-hidden="true"/>
            </span>
            <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">{item.title}</p>
                <p className="font-mono text-[11.5px] leading-snug text-ink-3">{item.note}</p>
            </div>
        </div>
    );
};

const Arrow = ({label}: { label?: string }) => (
    <div className="flex shrink-0 items-center justify-center gap-2 text-ink-3 lg:flex-col lg:gap-1" aria-hidden="true">
        <ArrowDown size={16} className="lg:hidden"/>
        <ArrowRight size={16} className="hidden lg:block"/>
        {label && <span className="font-mono text-[10.5px] text-ink-3">{label}</span>}
    </div>
);

/** GitHub → [ Helix → Ollama ] → review, with the self-hosted boundary drawn around the middle. */
const HelixFlow = () => (
    <figure className="rounded-2xl border border-line bg-subtle/70 p-4 sm:p-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
            <FlowNode item={FLOW[0]}/>
            <Arrow label="202"/>
            <div className="relative flex flex-col gap-2 rounded-xl border border-dashed border-accent/50 bg-accent-soft/40 p-2 pt-7 lg:flex-[2.2] lg:flex-row lg:items-stretch">
                <span className="absolute left-3 top-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-strong">
                    your infrastructure
                </span>
                {FLOW.slice(1, 3).map((item, i) => (
                    <Fragment key={item.title}>
                        {i > 0 && <Arrow/>}
                        <FlowNode item={item}/>
                    </Fragment>
                ))}
            </div>
            <Arrow/>
            <FlowNode item={FLOW[3]}/>
        </div>
        <figcaption className="mt-3 text-[12.5px] text-ink-3">
            The diff is sent only to your own Ollama instance, never to a third-party API.
        </figcaption>
    </figure>
);

const GitHubActivity = () => {
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
        <div className="card card-pad">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-[18px] font-semibold">GitHub contributions</h3>
                    <p className="mt-1 text-[14px] text-ink-3">
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
                        <dd className="text-[56px] font-semibold leading-none tracking-[-0.025em] sm:text-[72px]">
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
    );
};

const OpenSource = () => (
    <Section
        id="open-source"
        title="Open source"
        lede="Projects I build and maintain outside work."
    >
        <div className="space-y-6">
            <article className="card card-pad">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-[26px] font-semibold">{HELIX.name}</h3>
                            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent-strong">
                                Open source
                            </span>
                            <span className="chip">Docker image</span>
                        </div>
                        <p className="mt-1 text-[16px] text-ink-2">{HELIX.tagline}</p>
                    </div>
                    <a href={HELIX.url} target="_blank" rel="noopener noreferrer" className="btn-primary self-start">
                        <GitHubIcon size={16}/>
                        View source
                        <ArrowUpRight size={16} aria-hidden="true"/>
                    </a>
                </header>

                <div className="mt-8">
                    <HelixFlow/>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
                    <div>
                        <p className="text-[15.5px] leading-relaxed text-ink-2">{HELIX.description}</p>
                        <p className="mt-4 text-[15.5px] leading-relaxed text-ink-2">{HELIX.usage}</p>
                    </div>
                    <ul className="space-y-3">
                        {HELIX.points.map((point) => (
                            <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"/>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <ul className="mt-8 flex flex-wrap gap-1.5 border-t border-line pt-6" aria-label="Helix tech stack">
                    {HELIX.stack.map((tech) => (
                        <li key={tech} className="chip">
                            {tech}
                        </li>
                    ))}
                </ul>
            </article>

            <GitHubActivity/>

            <p className="text-center text-[14px] text-ink-3">
                More on{" "}
                <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="link">
                    github.com/vishwajeet-singhh
                </a>
            </p>
        </div>
    </Section>
);

export default OpenSource;
