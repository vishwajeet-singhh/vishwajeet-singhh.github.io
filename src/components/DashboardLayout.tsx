import {ReactNode, useEffect, useState} from "react";
import {
    Briefcase,
    Code2,
    GitPullRequest,
    GraduationCap,
    Home,
    Layers,
    Mail,
    Menu,
    User,
    Wrench,
    X,
} from "lucide-react";
import {RESUME_URL} from "@/lib/resume";

const GITHUB_URL = "https://github.com/vishy-singh";

const navItems = [
    {id: "home", label: "Home", icon: Home},
    {id: "projects", label: "Projects", icon: GitPullRequest},
    {id: "about", label: "About", icon: User},
    {id: "skills", label: "Skills", icon: Layers},
    {id: "experience", label: "Experience", icon: Briefcase},
    {id: "services", label: "Focus Areas", icon: Wrench},
    {id: "education", label: "Education", icon: GraduationCap},
    {id: "contact", label: "Contact", icon: Mail},
];

const Avatar = ({size = 40}: { size?: number }) => (
    <div
        className="profile-avatar flex items-center justify-center rounded-full flex-shrink-0"
        style={{
            width: size,
            height: size,
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: size * 0.36,
            letterSpacing: "0.02em",
        }}
    >
        VS
    </div>
);

const DashboardLayout = ({children}: { children: ReactNode }) => {
    const [activeSection, setActiveSection] = useState("home");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Scroll-spy: highlight the section currently in view.
    useEffect(() => {
        const sections = navItems
            .map((item) => document.getElementById(item.id))
            .filter((el): el is HTMLElement => Boolean(el));

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1]}
        );

        sections.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return;

        const root = document.documentElement;
        let frame: number | null = null;
        let x = -200;
        let y = -200;

        const updateGlowPosition = () => {
            root.style.setProperty("--cursor-x", `${x}px`);
            root.style.setProperty("--cursor-y", `${y}px`);
            root.style.setProperty("--cursor-glow-opacity", "1");
            frame = null;
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") return;
            x = event.clientX;
            y = event.clientY;
            if (frame === null) frame = window.requestAnimationFrame(updateGlowPosition);
        };

        const hideGlow = () => root.style.setProperty("--cursor-glow-opacity", "0");

        window.addEventListener("pointermove", handlePointerMove, {passive: true});
        window.addEventListener("blur", hideGlow);

        return () => {
            if (frame !== null) window.cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("blur", hideGlow);
            root.style.removeProperty("--cursor-x");
            root.style.removeProperty("--cursor-y");
            root.style.removeProperty("--cursor-glow-opacity");
        };
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({behavior: "smooth"});
            setActiveSection(id);
            setIsDrawerOpen(false);
        }
    };

    const activeLabel =
        navItems.find((item) => item.id === activeSection)?.label ?? "Home";

    const NavList = () => (
        <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`portfolio-nav-link flex items-center gap-3 w-full text-left transition-colors duration-150 ${isActive ? "is-active" : ""}`}
                        style={{
                            padding: "9px 14px 9px 12px",
                            borderRadius: "4px",
                            backgroundColor: isActive ? "var(--dev-tag-bg)" : "transparent",
                            color: isActive ? "var(--dev-text)" : "var(--dev-muted)",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: isActive ? 600 : 500,
                            fontSize: "13.5px",
                            border: "none",
                            borderLeft: isActive ? "2px solid var(--dev-accent)" : "2px solid transparent",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive)
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                    "var(--dev-tag-bg)";
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive)
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                                    "transparent";
                        }}
                    >
                        <Icon size={16}/>
                        {item.label}
                    </button>
                );
            })}
        </nav>
    );

    const SidebarInner = () => (
        <>
            {/* Identity block */}
            <div className="flex flex-col items-start gap-3 px-2">
                <Avatar size={56}/>
                <div>
                    <div
                        style={{
                            color: "var(--dev-text)",
                            fontWeight: 700,
                            fontSize: "17px",
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                        }}
                    >
                        Vishwajeet Pratap Singh
                    </div>
                    <div
                        style={{
                            color: "var(--dev-muted)",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 500,
                            fontSize: "12.5px",
                            marginTop: "3px",
                        }}
                    >
                        Software Engineer · Backend
                    </div>
                </div>
            </div>

            {/* Resume CTA */}
            <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="dev-btn-primary"
                style={{justifyContent: "center", width: "100%", marginTop: "20px"}}
            >
                Resume
            </a>

            {/* Nav */}
            <div style={{marginTop: "24px"}}>
                <NavList/>
            </div>
        </>
    );

    return (
        <div className="portfolio-shell">
            <div className="cursor-glow" aria-hidden="true"/>
            {/* ── Desktop sidebar ─────────────────────────────── */}
            <aside
                className="portfolio-sidebar hidden lg:flex flex-col fixed top-0 left-0 bottom-0 z-40"
                style={{
                    width: "292px",
                    padding: "24px 16px",
                    overflowY: "auto",
                }}
            >
                <SidebarInner/>
            </aside>

            {/* ── Mobile drawer ───────────────────────────────── */}
            {isDrawerOpen && (
                <div className="lg:hidden">
                    <div
                        className="portfolio-drawer-overlay fixed inset-0 z-40"
                        style={{backgroundColor: "rgba(10,10,10,0.4)"}}
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    <aside
                        className="portfolio-mobile-drawer fixed top-0 left-0 bottom-0 z-50 flex flex-col"
                        style={{
                            width: "260px",
                            padding: "24px 16px",
                            overflowY: "auto",
                        }}
                    >
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="self-end p-1 mb-2"
                            style={{color: "var(--dev-muted)", border: "none", background: "none", cursor: "pointer"}}
                            aria-label="Close menu"
                        >
                            <X size={22}/>
                        </button>
                        <SidebarInner/>
                    </aside>
                </div>
            )}

            {/* ── Main column ─────────────────────────────────── */}
            <div className="portfolio-content lg:ml-[292px]">
                {/* Top bar */}
                <header
                    className="portfolio-topbar sticky top-0 z-30 flex items-center justify-between"
                    style={{
                        height: "72px",
                        padding: "0 20px",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-1"
                            style={{color: "var(--dev-text)", border: "none", background: "none", cursor: "pointer"}}
                            onClick={() => setIsDrawerOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22}/>
                        </button>
                        <span
                            className="hidden lg:inline"
                            style={{color: "var(--dev-text)", fontWeight: 700, fontSize: "16px"}}
                        >
                            {activeLabel}
                        </span>
                        <span
                            className="lg:hidden"
                            style={{color: "var(--dev-text)", fontWeight: 700, fontSize: "15px"}}
                        >
                            Vishwajeet Pratap Singh
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            style={{color: "var(--dev-muted)"}}
                            className="transition-colors duration-150 hover:text-[var(--dev-accent)]"
                        >
                            <Code2 size={20}/>
                        </a>
                        <Avatar size={32}/>
                    </div>
                </header>

                {/* Content */}
                <main
                    className="portfolio-main mx-auto"
                    style={{maxWidth: "1060px", width: "100%"}}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;


//claude --resume a2918e8d-87d6-4fad-86d5-3ee0c7eeb31b
