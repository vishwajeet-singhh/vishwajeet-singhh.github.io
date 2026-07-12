import {ArrowRight, Download, Github, Globe, Linkedin, Mail} from "lucide-react";
import TerminalCard from "@/components/TerminalCard";
import profileImage from "@/assets/profile-dev.png";
import {RESUME_URL} from "@/lib/resume";

const Hero = () => {
    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior: "smooth"});
    };

    return (
        <section
            id="home"
            className="px-5 md:px-10 pt-12 pb-16 md:pt-16 md:pb-20"
            style={{scrollMarginTop: "80px"}}
        >
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">

                {/* Left: Text */}
                <div className="space-y-6" style={{containerType: "inline-size"}}>

                    {/* Availability badge */}
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5">
                            <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                                style={{backgroundColor: "var(--dev-accent)"}}
                            />
                            <span
                                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                                style={{backgroundColor: "var(--dev-accent)"}}
                            />
                        </span>
                        <span
                            style={{
                                color: "var(--dev-accent)",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "13.5px",
                                fontWeight: 600,
                            }}
                        >
                           Building&nbsp;&nbsp;Zorqen
                        </span>
                    </div>

                    {/* Eyebrow label */}
                    <p className="dev-label">
                        // software engineer · backend
                    </p>

                    {/* Headline */}
                    <h1
                        style={{
                            color: "var(--dev-text)",
                            fontSize: "clamp(20px, 5cqi, 40px)",
                            fontWeight: 700,
                            lineHeight: 1.4,
                            letterSpacing: "-0.02em",
                            textAlign: "left",
                        }}
                    >
                        <span style={{whiteSpace: "nowrap"}}>I build backend systems</span>
                        <br/>
                        <span style={{whiteSpace: "nowrap"}}>that can't afford to break.</span>
                    </h1>

                    {/* Subtext */}
                    <p
                        lang="en"
                        style={{
                            color: "var(--dev-body)",
                            fontSize: "15px",
                            lineHeight: 1.7,
                            textAlign: "justify",
                            maxWidth: "600px",
                        }}
                    >
                        Software Engineer with 2.5+ years building fault-tolerant distributed
                        systems, identity and security infrastructure, and microservices
                        at scale (Java, Spring Boot, Kafka, PostgreSQL, Oracle). Built and open-sourced an
                        AI-powered PR-review tool that cut review time in half, and pairs hands-on engineering
                        with Scrum Master leadership across cross-functional teams.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        <button onClick={() => scrollToSection("experience")} className="dev-btn-primary">
                            See My Work
                            <ArrowRight size={17}/>
                        </button>

                        <a
                            href={RESUME_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dev-btn-secondary"
                        >
                            <Download size={17}/>
                            Download Resume
                        </a>
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-5 pt-2">
                        {[
                            {href: "https://github.com/vishy-singh", icon: Github, label: "GitHub"},
                            {href: "https://www.linkedin.com/in/vishyysingh/", icon: Linkedin, label: "LinkedIn"},
                            {href: "mailto:vishy.devv@gmail.com", icon: Mail, label: "Email"},
                            {href: "https://vishwajeet.me", icon: Globe, label: "Website"},
                        ].map(({href, icon: Icon, label}) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="transition-colors duration-150"
                                style={{color: "var(--dev-muted)"}}
                                title={label}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--dev-accent)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--dev-muted)";
                                }}
                            >
                                <Icon size={20}/>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Photo + Terminal */}
                <div className="flex flex-col items-center gap-4 w-full mx-auto" style={{maxWidth: "320px"}}>
                    <div
                        className="flex flex-col items-center w-full"
                        style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid var(--dev-border)",
                            backgroundColor: "var(--dev-card)",
                        }}
                    >
                        <div className="w-full aspect-square overflow-hidden rounded">
                            <img
                                src={profileImage}
                                alt="Vishwajeet Pratap Singh"
                                className="w-full h-full object-cover object-[50%_38%]"
                                style={{transform: "scale(1.06)"}}
                            />
                        </div>
                        <span
                            className="dev-label"
                            style={{fontSize: "11px", marginTop: "6px"}}
                        >
                            profile.jpg
                        </span>
                    </div>
                    <TerminalCard/>
                </div>

            </div>
        </section>
    );
};

export default Hero;
