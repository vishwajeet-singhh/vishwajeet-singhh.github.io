import {type ReactNode, useState} from "react";
import {Check, Copy, FileText, Mail} from "lucide-react";
import {GitHubIcon, LinkedInIcon, PLATFORM_ICONS} from "@/components/icons";
import Section from "@/components/Section";
import {PROFILE} from "@/data/profile";
import {useNow, useStats} from "@/lib/live-stats";
import {availablePlatforms, formatUpdated, PLATFORM_NAMES} from "@/lib/stats";

const CopyEmail = () => {
    const [copied, setCopied] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(PROFILE.email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            window.location.href = `mailto:${PROFILE.email}`;
        }
    };
    return (
        <button type="button" onClick={copy} className="btn-secondary" aria-live="polite">
            {copied ? <Check size={16} aria-hidden="true"/> : <Copy size={16} aria-hidden="true"/>}
            {copied ? "Copied" : "Copy address"}
        </button>
    );
};

type ProfileLink = { href: string; label: string; icon: ReactNode };

const Contact = () => {
    const {stats} = useStats();
    const now = useNow(60_000);
    // Brand marks have very different shapes (GFG is 2:1, LinkedIn a solid square),
    // so each gets a size that gives it roughly the same visual weight.
    const OPTICAL_SIZE: Record<string, number> = {
        leetcode: 20,
        codeforces: 21,
        codechef: 21,
        gfg: 25,
    };
    const links: ProfileLink[] = [
        {href: PROFILE.githubUrl, label: "GitHub", icon: <GitHubIcon size={19}/>},
        {href: PROFILE.linkedinUrl, label: "LinkedIn", icon: <LinkedInIcon size={17}/>},
        {href: PROFILE.resumeUrl, label: "Résumé", icon: <FileText size={21} strokeWidth={1.75} aria-hidden="true"/>},
        ...availablePlatforms(stats).map((id) => {
            const Icon = PLATFORM_ICONS[id];
            return {href: stats.platforms[id]!.url, label: PLATFORM_NAMES[id], icon: <Icon size={OPTICAL_SIZE[id]}/>};
        }),
    ];

    return (
        <>
            <Section id="contact" title="Contact" lede="Email is the best way to reach me.">
                <div className="card card-pad">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="min-w-0">
                            <p className="text-[14px] text-ink-3">Email</p>
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="mt-1 block break-all text-[22px] font-semibold tracking-[-0.02em] transition-colors hover:text-accent sm:text-[28px]"
                            >
                                {PROFILE.email}
                            </a>
                            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                                Backend roles, hard systems problems or a second pair of eyes on a design: my inbox is
                                open.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-3">
                            <a href={`mailto:${PROFILE.email}`} className="btn-primary">
                                <Mail size={16} aria-hidden="true"/>
                                Send an email
                            </a>
                            <CopyEmail/>
                        </div>
                    </div>

                    <nav aria-label="Profiles" className="mt-8 border-t border-line pt-6">
                        {/* Seven equal tiles across the full card width, so the row lines up with the email
                            block above on both edges while the gaps stay small and even. */}
                        <ul className="grid grid-cols-7 gap-2 sm:gap-3">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                        title={link.label}
                                        className="grid h-10 w-full place-items-center rounded-lg border sm:h-12 sm:rounded-xl border-line bg-surface text-ink-2 transition-colors hover:border-line-strong hover:bg-subtle hover:text-ink"
                                    >
                                        {link.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </Section>

            <footer className="page-container">
                <div className="flex flex-col gap-2 border-t border-line py-8 text-[13px] text-ink-3 sm:flex-row sm:justify-between">
                    <p>© {new Date().getFullYear()} {PROFILE.name}</p>
                    <p>Coding stats updated {formatUpdated(stats.generatedAt, now)}</p>
                </div>
            </footer>
        </>
    );
};

export default Contact;
