import {useEffect, useState} from "react";
import {ArrowUpRight, Menu, X} from "lucide-react";
import {GitHubIcon, LinkedInIcon} from "@/components/icons";
import {FEATURES} from "@/data/features";
import {PROFILE} from "@/data/profile";

const NAV_ITEMS = [
    {id: "experience", label: "Experience"},
    // Shown only when the section is (see src/data/features.ts).
    ...(FEATURES.problemSolving ? [{id: "problem-solving", label: "Problem solving"}] : []),
    {id: "open-source", label: "Open source"},
    {id: "skills", label: "Skills"},
    {id: "contact", label: "Contact"},
];

/** The last section whose top has scrolled past the middle of the viewport. */
const useActiveSection = (ids: string[]) => {
    const [active, setActive] = useState<string | null>(null);
    useEffect(() => {
        // Scroll events already fire at most once per frame; five rect reads are cheap.
        const update = () => {
            const doc = document.documentElement;
            if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
                setActive(ids[ids.length - 1]);
                return;
            }
            const middle = window.innerHeight / 2;
            let current: string | null = null;
            for (const id of ids) {
                const top = document.getElementById(id)?.getBoundingClientRect().top;
                if (top !== undefined && top <= middle) current = id;
            }
            setActive(current);
        };
        update();
        window.addEventListener("scroll", update, {passive: true});
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [ids]);
    return active;
};

const ids = NAV_ITEMS.map((item) => item.id);

const SiteHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const active = useActiveSection(ids);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <header
            className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
                scrolled || open ? "border-line bg-page/85 backdrop-blur-md" : "border-transparent bg-page"
            }`}
        >
            <div className="page-container flex h-[var(--header-h)] items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
                <a href="#top" className="flex items-center gap-3 justify-self-start" aria-label={`${PROFILE.name}, back to top`}>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-[13px] font-semibold tracking-[0.02em] text-white">
                        VS
                    </span>
                    <span className="leading-tight">
                        <span className="block text-[15px] font-semibold tracking-[-0.01em] text-ink">{PROFILE.shortName}</span>
                        <span className="hidden text-[12.5px] text-ink-3 sm:block">Backend Developer</span>
                    </span>
                </a>

                <nav aria-label="Primary" className="hidden lg:block">
                    <ul className="flex items-center gap-0.5 rounded-full border border-line bg-surface/80 p-1 shadow-card">
                        {NAV_ITEMS.map((item) => {
                            const isActive = active === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        aria-current={isActive ? "true" : undefined}
                                        className={`flex h-8 items-center rounded-full px-3.5 text-[14px] font-medium transition-colors ${
                                            isActive ? "bg-subtle text-ink" : "text-ink-2 hover:text-ink"
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="flex items-center gap-1.5 justify-self-end">
                    <a
                        href={PROFILE.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden h-9 w-9 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-subtle hover:text-ink sm:grid"
                        aria-label="GitHub"
                    >
                        <GitHubIcon size={18}/>
                    </a>
                    <a
                        href={PROFILE.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden h-9 w-9 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-subtle hover:text-ink sm:grid"
                        aria-label="LinkedIn"
                    >
                        <LinkedInIcon size={17}/>
                    </a>
                    <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary ml-1.5 h-9 px-3.5">
                        Résumé
                        <ArrowUpRight size={15} aria-hidden="true"/>
                    </a>
                    <button
                        type="button"
                        className="btn-icon ml-1.5 h-9 w-9 lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X size={18}/> : <Menu size={18}/>}
                    </button>
                </div>
            </div>

            {open && (
                <nav id="mobile-nav" aria-label="Primary" className="border-t border-line lg:hidden">
                    <ul className="page-container py-2">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.id} className="border-b border-line">
                                <a
                                    href={`#${item.id}`}
                                    onClick={() => setOpen(false)}
                                    aria-current={active === item.id ? "true" : undefined}
                                    className={`flex h-12 items-center text-[16px] font-medium ${
                                        active === item.id ? "text-ink" : "text-ink-2"
                                    }`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        <li className="flex gap-6 pb-2 pt-4 sm:hidden">
                            <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] text-ink-2">
                                <GitHubIcon size={17}/>GitHub
                            </a>
                            <a href={PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] text-ink-2">
                                <LinkedInIcon size={16}/>LinkedIn
                            </a>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default SiteHeader;
