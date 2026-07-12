import {ReactNode} from "react";

const Experience = () => {
    const fullTimeAchievements = [
        "Work as core developer and Scrum Master on a ~20-person product team spanning UI, AI, Backend, Product, and Testing - owning feature delivery as the team's core developer just two years into my career.",
        "Designed and shipped a production Identity and Access Management (IAM) system from scratch as the sole engineer on it - auth flows, JWT, RBAC, MFA, OAuth2, and group-based access control - now securing 500+ SaaS users, with the same build running on-premises for B2B tenants. Also built the licensing system for those on-prem installs.",
        "Built and own two backend microservices as sole engineer - a licensing service powering on-prem/B2B installs and a shared utilities service - designing, shipping, and operating them end to end.",
        "Shipped core features into a two-service Spring Boot backend (Kafka, Redis) running the data-processing pipeline - a client-facing REST API service and an internal Kafka-consumer execution engine - with tenant-configurable APIs, cross-database SQL handling, and concurrency-safe Spring Batch processing, covered by JUnit and Testcontainers tests.",
        "Cut a 48–60 hr workflow pipeline to ~2–3 hr on 100k-table datasets via database-layer predicate pushdown, tuned batch concurrency, and HikariCP pool sizing exposed as per-deployment config so each tenant tunes to its own database limits.",
        "Added crash-safe recovery to long-running bulk operations across PostgreSQL, Oracle, and SAP HANA using a journaling pattern, keeping data consistent through mid-run failures.",
        "Cut bulk-insert time ~50% by disabling database triggers during high-volume writes, then restoring integrity after load.",
        "Shipped bulk edit/delete for large data tables - snapshotting matched rows up front so edits can't shift pagination mid-run, with capped batch loops and composite-key dedup to stop rows being skipped or processed twice.",
        "Containerised services with Docker and reworked GitHub Actions CI/CD pipelines during the company's AWS-to-GCP migration, managing secrets and connectivity across environments.",
        "Rolled out Helix, my open-source AI code-review tool, across the team's GitHub org - it auto-catches style and correctness issues at PR open so developers self-correct before human review and seniors focus only on logic and flow, cutting review turnaround roughly in half.",
    ];

    const internAchievements = [
        "Built a Python-based data classification utility that samples field values and applies configurable detection logic to identify sensitive data types at scale, powering automated data profiling.",
        "Implemented group-based access control logic to enforce data consistency boundaries across multi-tenant workflows, hardening the authorisation model ahead of production rollout.",
    ];

    const Bullet = ({children}: { children: ReactNode }) => (
        <li className="flex gap-3 items-start">
            <span
                className="flex-shrink-0 mt-[9px] w-1.5 h-1.5"
                style={{backgroundColor: "var(--dev-accent)"}}
            />
            <span style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                {children}
            </span>
        </li>
    );

    return (
        <section
            id="experience"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// experience</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                Professional Experience
            </h2>

            <div className="space-y-5">

                {/* Full-time entry */}
                <div className="dev-card" style={{padding: "28px"}}>
                    {/* Role + company */}
                    <div className="flex flex-wrap items-baseline gap-x-3 mb-1">
                        <h3 style={{color: "var(--dev-text)", fontSize: "20px", fontWeight: 700}}>
                            Software Engineer
                        </h3>
                        <span style={{color: "var(--dev-accent)", fontSize: "16px", fontWeight: 600}}>
                            Maya Data Privacy
                        </span>
                    </div>

                    {/* Clarification line */}
                    <p className="italic mb-3" style={{color: "var(--dev-muted)", fontSize: "14px"}}>
                        Three roles at once · Developer · Scrum Master · Tester
                    </p>

                    <p className="dev-label mb-4">
                        Jan 2024 – Present
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {["Software Engineer", "Scrum Master", "Tester"].map(badge => (
                            <span key={badge} className="dev-tag dev-tag-accent">
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Achievements */}
                    <ul className="space-y-3.5">
                        {fullTimeAchievements.map((item, i) => (
                            <Bullet key={i}>{item}</Bullet>
                        ))}
                    </ul>
                </div>

                {/* Intern entry */}
                <div className="dev-card" style={{padding: "28px"}}>
                    <div className="flex flex-wrap items-baseline gap-x-3 mb-1">
                        <h3 style={{color: "var(--dev-text)", fontSize: "20px", fontWeight: 700}}>
                            Software Engineer Intern
                        </h3>
                        <span style={{color: "var(--dev-accent)", fontSize: "15px", fontWeight: 600}}>
                            Maya Data Privacy
                        </span>
                    </div>

                    <p className="italic mb-3" style={{color: "var(--dev-muted)", fontSize: "14px"}}>
                        Converted to full-time
                    </p>

                    <p className="dev-label mb-5">
                        Dec 2023
                    </p>

                    <ul className="space-y-3.5">
                        {internAchievements.map((item, i) => (
                            <Bullet key={i}>{item}</Bullet>
                        ))}
                    </ul>
                </div>

            </div>
        </section>
    );
};

export default Experience;
