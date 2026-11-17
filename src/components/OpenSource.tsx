import {Fragment} from "react";
import {ArrowDown, ArrowRight, ArrowUpRight, Boxes, Cpu, GitPullRequest, MessageSquareCode} from "lucide-react";
import {GitHubIcon} from "@/components/icons";
import Section from "@/components/Section";
import {HELIX, PROFILE} from "@/data/profile";

const FLOW = [
    {icon: GitPullRequest, title: "GitHub", note: "pull_request webhook"},
    {icon: Boxes, title: "Helix", note: "Async review service"},
    {icon: Cpu, title: "Ollama", note: "Local model inference"},
    {icon: MessageSquareCode, title: "PR review", note: "Verdict + inline comments"},
];

const FlowNode = ({item}: { item: (typeof FLOW)[number] }) => {
    const Icon = item.icon;
    return (
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 xl:flex-col xl:items-start xl:gap-2">
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
    <div className="flex shrink-0 items-center justify-center gap-2 text-ink-3 xl:flex-col xl:gap-1" aria-hidden="true">
        <ArrowDown size={16} className="xl:hidden"/>
        <ArrowRight size={16} className="hidden xl:block"/>
        {label && <span className="font-mono text-[10.5px] text-ink-3">{label}</span>}
    </div>
);

/** GitHub → [ Helix → Ollama ] → review, with the self-hosted boundary drawn around the middle. */
const HelixFlow = () => (
    <figure className="rounded-xl border border-line bg-subtle/70 p-4 sm:p-5">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch">
            <FlowNode item={FLOW[0]}/>
            <Arrow label="202"/>
            <div className="relative flex flex-col gap-2 rounded-xl border border-dashed border-accent/50 bg-accent-soft/40 p-2 pt-7 xl:flex-[2.2] xl:flex-row xl:items-stretch">
                <span className="absolute left-3 top-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-strong">
                    Self-hosted
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
            Reviews run through a local Ollama model on your server.
        </figcaption>
    </figure>
);

const OpenSource = () => (
    <Section
        id="open-source"
        title="Projects & open source"
        lede="Backend projects and tools I've built."
    >
        <div className="space-y-4">
            <article className="card card-pad">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-[24px] font-semibold">{HELIX.name}</h3>
                            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-medium text-accent-strong">
                                Featured project
                            </span>
                        </div>
                        <p className="mt-1 text-[16px] text-ink-2">{HELIX.tagline}</p>
                    </div>
                    <a href={HELIX.url} target="_blank" rel="noopener noreferrer" className="btn-secondary self-start">
                        <GitHubIcon size={16}/>
                        View source
                        <ArrowUpRight size={16} aria-hidden="true"/>
                    </a>
                </header>

                <div className="mt-8">
                    <HelixFlow/>
                </div>

                <div className="mt-6 space-y-5">
                    <div>
                        <p className="text-[15px] leading-relaxed text-ink-2">{HELIX.description}</p>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{HELIX.usage}</p>
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

                <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-line pt-4" aria-label="Helix tech stack">
                    {HELIX.stack.map((tech) => (
                        <li key={tech} className="chip">
                            {tech}
                        </li>
                    ))}
                </ul>
            </article>

            <p className="px-1 text-[13px] text-ink-3">
                More projects on{" "}
                <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="link">
                    GitHub
                </a>
            </p>
        </div>
    </Section>
);

export default OpenSource;
