// Everything hand-written about me lives here. Platform numbers come from
// stats.json, which scripts/fetch-stats.mjs regenerates on every deploy.
// Copy is British English (organisation, licence, normalised).

export const PROFILE = {
    name: "Vishwajeet Pratap Singh",
    shortName: "Vishwajeet Singh",
    role: "Software Engineer",
    company: "Maya Data Privacy",
    location: "India · Remote",
    email: "vishwajeet.sage@gmail.com",
    // Single source of truth for the resume link.
    resumeUrl: "https://drive.google.com/file/d/1zdu-Cr772mH3U8AMBPDTvFojiuFG4gsj/view?usp=drive_link",
    githubUrl: "https://github.com/vishwajeet-singhh",
    linkedinUrl: "https://www.linkedin.com/in/vishwajeetsage/",
} as const;

export type Highlight = {
    value: string;
    label: string;
    detail: string;
};

export const HIGHLIGHTS: Highlight[] = [
    {value: "25+", label: "Production REST APIs", detail: "Java and Spring Boot"},
    {value: "~95%", label: "Shorter pipeline runtime", detail: "on datasets of 100k+ tables"},
    {value: "500+", label: "Users and B2B tenants", detail: "on the licensing and IAM service"},
    {value: "~50%", label: "Shorter review turnaround", detail: "after rolling out Helix"},
];

export type ExperienceGroup = {
    theme: string;
    points: string[];
};

export type Role = {
    title: string;
    company: string;
    period: string;
    location: string;
    summary: string;
    groups: ExperienceGroup[];
};

export const ROLES: Role[] = [
    {
        title: "Software Engineer",
        company: "Maya Data Privacy",
        period: "Jan 2024 – Present",
        location: "Remote",
        summary:
            "Backend developer and Scrum Master on a product team of about 20 people across UI, AI, backend, product and QA.",
        groups: [
            {
                theme: "APIs & data",
                points: [
                    "Designed and built **25+** production REST APIs in Java and Spring Boot, backed by PostgreSQL, Oracle and SAP HANA.",
                ],
            },
            {
                theme: "Performance",
                points: [
                    "Reduced pipeline runtime by **~95%** on datasets of 100k+ tables through predicate pushdown, batch-concurrency tuning and per-tenant HikariCP pool sizing.",
                    "Made bulk inserts **~50%** faster with a journaling pattern for high-volume writes, without compromising data integrity.",
                ],
            },
            {
                theme: "Reliability",
                points: [
                    "Built crash-safe recovery for long-running bulk operations on PostgreSQL, Oracle and SAP HANA, using the same journaling pattern.",
                    "Built bulk edit and delete for large tables. Matching rows are snapshotted up front to prevent pagination drift, and composite-key deduplication stops rows from being processed twice.",
                ],
            },
            {
                theme: "Security & licensing",
                points: [
                    "Designed, shipped and operated the licensing service for on-prem and B2B installations as its sole engineer. Licences are generated and verified with PEM key pairs, behind a Spring Security IAM layer (JWT, RBAC, MFA, OAuth2) used by **500+** SaaS users and B2B tenants.",
                ],
            },
            {
                theme: "Developer tooling",
                points: [
                    "Rolled out Helix, my open-source AI pull-request reviewer, across the team's GitHub organisation. Review turnaround dropped by roughly half.",
                ],
            },
        ],
    },
    {
        title: "Software Engineer Intern",
        company: "Maya Data Privacy",
        period: "Dec 2023",
        location: "Remote",
        summary:
            "Worked in the production codebase from the start, learning the team's Git workflow and coding conventions.",
        groups: [],
    },
];

export const ROLE_STACK = [
    "Java",
    "Spring Boot",
    "Spring Security",
    "Spring Batch",
    "Hibernate",
    "JDBC",
    "Python",
    "Flask",
    "SQLAlchemy",
    "PostgreSQL",
    "Oracle",
    "SAP HANA",
    "Kafka",
    "Redis",
    "HikariCP",
    "JUnit",
    "Docker",
    "GitHub Actions",
    "GCP",
];

export const EDUCATION = {
    degree: "B.Tech",
    school: "Techno India University, Kolkata",
    score: "CGPA 8.64 / 10",
    year: "2023",
};

export type StackGroup = {
    title: string;
    items: string[];
};

export const STACK: StackGroup[] = [
    {title: "Languages", items: ["Java", "Python", "SQL"]},
    {
        title: "Backend",
        items: ["Spring Boot", "Spring Security", "Spring Data JPA", "Spring Batch", "Hibernate", "JDBC", "Flask", "SQLAlchemy", "Pydantic", "REST APIs", "Microservices", "Webhooks"],
    },
    {
        title: "Data",
        items: ["PostgreSQL", "Oracle", "SAP HANA", "Redis", "Kafka", "HikariCP", "Alembic"],
    },
    {
        title: "Security",
        items: ["JWT", "OAuth2", "RBAC", "MFA", "PEM key pairs"],
    },
    {
        title: "Infra & tooling",
        items: ["GCP", "Docker", "Linux", "Nginx", "GitHub Actions", "Maven", "Gradle", "Prometheus", "JUnit", "Log4j2", "Lombok", "Postman", "Git"],
    },
];

export const HELIX = {
    name: "Helix",
    tagline: "Self-hosted AI pull-request reviewer",
    url: "https://github.com/vishwajeet-singhh/helix",
    description:
        "Helix reviews GitHub pull requests with a local LLM served by Ollama, so code never leaves your own infrastructure. It is published as a public Docker image: a team can pull it, run it on their own servers and connect it to their GitHub organisation.",
    usage: "My team uses it across our GitHub organisation, where review turnaround has dropped by roughly half.",
    points: [
        "Acknowledges the webhook with 202 Accepted and reviews asynchronously, so the webhook never times out.",
        "Posts a single review: an overview, a verdict and inline comments for warning- and critical-level findings only.",
        "Works with any Ollama model. Qwen2.5-Coder 7B is the default; 14B is slower but finds more bugs.",
    ],
    stack: ["Java", "Spring Boot", "Maven", "Docker", "GitHub App", "Webhooks", "Ollama", "LLM", "Nginx", "GCP"],
};
