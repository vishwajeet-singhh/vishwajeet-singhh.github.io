import {ArrowUpRight, Code2, Database, FileText, ShieldCheck, Workflow} from "lucide-react";
import {GitHubIcon, LinkedInIcon} from "@/components/icons";
import {ENGINEERING_FOCUS, PROFILE} from "@/data/profile";

const FOCUS_ICONS = [Code2, Database, Workflow, ShieldCheck];

const ProfileSidebar = () => (
    <aside aria-label="Professional profile" className="hidden min-w-0 space-y-4 lg:sticky lg:top-[88px] lg:block lg:self-start">
        <section className="card p-5" aria-labelledby="focus-title">
            <h2 id="focus-title" className="text-[16px] font-semibold">Backend work</h2>
            <ul className="mt-5 space-y-5">
                {ENGINEERING_FOCUS.map((focus, i) => {
                    const Icon = FOCUS_ICONS[i];
                    return <li className="flex gap-3" key={focus.title}>
                        <Icon size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true"/>
                        <div><h3 className="text-[13px] font-semibold leading-snug">{focus.title}</h3>
                            <p className="mt-1 text-[12px] leading-relaxed text-ink-3">{focus.detail}</p></div>
                    </li>;
                })}
            </ul>
        </section>
        <nav className="card overflow-hidden" aria-labelledby="elsewhere-title">
            <h2 id="elsewhere-title" className="px-5 pb-3 pt-5 text-[16px] font-semibold">Find me elsewhere</h2>
            {[
                {label: "LinkedIn", note: "Professional profile", href: PROFILE.linkedinUrl, Icon: LinkedInIcon},
                {label: "GitHub", note: "Projects & source code", href: PROFILE.githubUrl, Icon: GitHubIcon},
                {label: "Résumé", note: "Experience at a glance", href: PROFILE.resumeUrl, Icon: FileText},
            ].map(({label, note, href, Icon}) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 border-t border-line px-5 py-3.5 transition-colors hover:bg-subtle">
                    <Icon size={18} className="shrink-0 text-ink-2" aria-hidden="true"/>
                    <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold text-ink">{label}</span>
                        <span className="block text-[11px] text-ink-3">{note}</span></span>
                    <ArrowUpRight size={15} className="text-ink-3" aria-hidden="true"/>
                </a>
            ))}
        </nav>
    </aside>
);

export default ProfileSidebar;
