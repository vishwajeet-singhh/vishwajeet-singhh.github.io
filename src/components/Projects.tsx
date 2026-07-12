import {useEffect, useState} from "react";
import {ArrowUpRight, GitFork, GitPullRequest, Github, Star} from "lucide-react";

const HELIX_URL = "https://github.com/vishy-singh/helix";

const Projects = () => {
    const stack = [
        "Java",
        "Spring Boot",
        "Docker",
        "REST API",
        "Webhooks",
        "Ollama",
        "LLM",
        "GCP",
        "Nginx",
        "Maven",
    ];

    const [repoStats, setRepoStats] = useState<{ stars: number; forks: number } | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch("https://api.github.com/repos/vishy-singh/helix")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data) {
                    setRepoStats({stars: data.stargazers_count, forks: data.forks_count});
                }
            })
            .catch(() => {
                /* rate-limited or offline — silently omit stats */
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section
            id="projects"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// open source</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                Featured Project
            </h2>

            {/* Featured card */}
            <div className="dev-card" style={{padding: "28px"}}>
                {/* Title row */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "6px",
                                border: "1px solid var(--dev-border)",
                                backgroundColor: "var(--dev-tag-bg)",
                            }}
                        >
                            <GitPullRequest size={22} style={{color: "var(--dev-accent)"}}/>
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h3 style={{color: "var(--dev-text)", fontSize: "22px", fontWeight: 700}}>
                                    Helix
                                </h3>
                                <span className="dev-tag dev-tag-accent">
                                    Open Source
                                </span>
                                {repoStats && (
                                    <span
                                        className="flex items-center gap-3"
                                        style={{
                                            color: "var(--dev-muted)",
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: "12.5px",
                                        }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <Star size={12}/>
                                            {repoStats.stars}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork size={12}/>
                                            {repoStats.forks}
                                        </span>
                                    </span>
                                )}
                            </div>
                            <p style={{
                                color: "var(--dev-muted)",
                                fontSize: "14px",
                                fontWeight: 600,
                                marginTop: "2px"
                            }}>
                                Self-hosted AI PR-review tool
                            </p>
                        </div>
                    </div>

                    <a
                        href={HELIX_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dev-btn-primary"
                        style={{padding: "10px 20px", fontSize: "14px"}}
                    >
                        <Github size={16}/>
                        View on GitHub
                        <ArrowUpRight size={15}/>
                    </a>
                </div>

                {/* Description */}
                <p
                    className="mb-6"
                    style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}
                >
                    Built and open-sourced a self-hosted AI pull-request review tool, shipped as a
                    public Docker image so any team can pull, deploy on their own infra, and connect
                    their GitHub org with zero vendor lock-in or per-seat licensing. It automates
                    GitHub PR reviews - cutting review time by 50% while catching issues that are
                    difficult or impossible for a human reviewer to consistently spot.
                </p>

                {/* Stack chips */}
                <div className="flex flex-wrap gap-2">
                    {stack.map((tech) => (
                        <span key={tech} className="dev-tag">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
