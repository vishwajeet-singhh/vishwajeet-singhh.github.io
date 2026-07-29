import {ReactNode} from "react";

const Experience = () => {
 const fullTimeAchievements = [

    "Entrusted as a core engineer and Scrum Master within a ~20-person product organisation spanning Backend, AI, UI, QA, and Product—coordinating delivery while owning business-critical engineering initiatives barely two years into my career.",

    "Conceived, architected, and delivered the company's entire Identity & Access Management substrate as its sole engineer—JWT, RBAC, MFA, OAuth2, tenant isolation, and group-scoped authorisation—now securing 500+ SaaS users alongside on-premises B2B deployments. Also engineered the licensing platform governing every customer installation.",

    "Solely architected, implemented, and continue to steward two production microservices—a licensing platform underpinning enterprise deployments and a shared utilities service consumed across products.",

    "Delivered core capabilities across a dual-service Spring Boot architecture comprising externally facing REST APIs and an internal Kafka execution engine, introducing tenant-configurable APIs, cross-database SQL compatibility, concurrency-safe Spring Batch orchestration, and comprehensive JUnit/Testcontainers validation.",

    "Compressed a 48–60 hour production workflow into approximately 2–3 hours by introducing predicate pushdown, calibrated concurrency, and deployment-specific HikariCP tuning adaptable to each customer's database characteristics.",

    "Engineered crash-resilient recovery semantics for long-running operations spanning PostgreSQL, Oracle, and SAP HANA through journal-based execution provenance, preserving transactional integrity across mid-process failures.",

    "Halved high-volume ingestion latency by strategically suspending database triggers during bulk writes before deterministic integrity restoration.",

    "Designed bulk edit and deletion workflows resilient to mutable datasets by snapshotting candidate records, eliminating pagination drift, bounding execution windows, and reconciling duplicate composite keys before mutation.",

    "Containerised production services with Docker while modernising GitHub Actions delivery pipelines throughout the organisation's AWS-to-GCP migration, governing secrets, deployment automation, and cross-environment parity.",

    "Created and deployed Helix, an open-source AI pull-request review platform adopted across the engineering organisation, enabling deterministic pre-review analysis that removes repetitive review overhead and reduced overall review turnaround by approximately 50%."

];

const internAchievements = [

    "Developed a Python-driven sensitive-data classification engine that sampled field provenance and applied configurable detection heuristics to automate large-scale data profiling.",

    "Implemented tenant-aware group authorisation semantics that reinforced isolation guarantees and strengthened the platform's access-control model before production rollout.",

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
