// Shared profile and portfolio copy. Platform numbers come from
// stats.json, which scripts/fetch-stats.mjs regenerates on every deploy.
// Copy is British English (organisation, licence, normalised).

export const PROFILE = {
    name: "Vishwajeet Pratap Singh",
    shortName: "Vishwajeet Singh",
    role: "Backend Developer",
    company: "Maya Data Privacy",
    location: "India · Remote",
    email: "vishwajeet.sage@gmail.com",
    // Single source of truth for the resume link.
    resumeUrl: "https://drive.google.com/file/d/1zdu-Cr772mH3U8AMBPDTvFojiuFG4gsj/view?usp=drive_link",
    githubUrl: "https://github.com/vishwajeet-singhh",
    linkedinUrl: "https://www.linkedin.com/in/vishwajeetsage/",
} as const;

export const ABOUT = [
    "I'm a Backend Developer with nearly three years of experience designing, building and improving backend systems. I focus on clean, efficient solutions that remain reliable and maintainable as they scale.",
    "My work spans API design, databases, data pipelines and production reliability. I've used Java with Spring Boot and Python with Flask to build these systems, choosing tools to fit the problem.",
    "I'm developing my skills in design patterns, high-level design (HLD) and low-level design (LLD). I keep learning, question assumptions and enjoy taking on challenging backend problems. I'm also keen to explore Kotlin, Go and Rust.",
] as const;

export const ENGINEERING_FOCUS = [
    {title: "API & service design", detail: "Production APIs, integrations and asynchronous processing."},
    {title: "Data & performance", detail: "Query optimisation, bulk operations and connection pools."},
    {title: "Scalability & reliability", detail: "Shared rate limits, concurrency and crash recovery."},
    {title: "Security & ownership", detail: "Licensing, access control and services in production."},
] as const;

export type Highlight = {
    value: string;
    label: string;
    detail: string;
};

export const HIGHLIGHTS: Highlight[] = [
    {value: "25+", label: "Production REST APIs", detail: "designed and delivered"},
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
        title: "Backend Developer",
        company: "Maya Data Privacy",
        period: "Jan 2024 – Present",
        location: "Remote",
        summary:
            "Build and improve backend services for data-intensive products, with ownership across API design, performance, reliability and access control.",
        groups: [
            {
                theme: "APIs & data",
                points: [
                    "Delivered **25+ production REST APIs** by building services integrated with PostgreSQL, Oracle and HANA.",
                ],
            },
            {
                theme: "Performance",
                points: [
                    "Reduced pipeline runtime by **~95%** on datasets of **100k+ tables** by applying predicate pushdown and tuning batch concurrency and per-tenant connection pools.",
                    "Improved bulk-insert performance by **~50%** and enabled crash-safe recovery by implementing a journaling pattern.",
                ],
            },
            {
                theme: "Reliability & scale",
                points: [
                    "Prevented pagination drift and duplicate processing in bulk edits and deletes by snapshotting matching rows and deduplicating composite keys.",
                    "Built configurable request and token limits across AI models by coordinating usage through Redis sliding windows and atomic Lua scripts.",
                ],
            },
            {
                theme: "Security & licensing",
                points: [
                    "Supported **500+ SaaS users and B2B tenants** by building and operating a licensing service and IAM layer, using PEM-based keys, JWT, RBAC, MFA and OAuth2.",
                ],
            },
            {
                theme: "Developer tooling",
                points: [
                    "Cut review turnaround by **~50%** by deploying Helix, my open-source AI pull-request reviewer, across the team's GitHub organisation.",
                ],
            },
        ],
    },
    {
        title: "Backend Developer Intern",
        company: "Maya Data Privacy",
        period: "Dec 2023",
        location: "Remote",
        summary:
            "Contributed to the production codebase while learning the team's Git workflow and coding conventions.",
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
    "HANA",
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

// Concrete skills from the CV, including tools demonstrated in its experience and project entries.
export const STACK: StackGroup[] = [
    {
        title: "Languages",
        items: ["Java", "Python", "SQL", "Lua"],
    },
    {
        title: "Backend & APIs",
        items: ["Spring Boot", "Spring Data JPA", "Flask", "REST APIs", "Microservices", "Webhooks"],
    },
    {
        title: "Databases & caching",
        items: ["PostgreSQL", "Oracle", "HANA", "Redis", "HikariCP"],
    },
    {
        title: "Cloud & deployment",
        items: ["Linux", "Docker", "GCP", "Nginx"],
    },
    {
        title: "Build, tools & logging",
        items: ["Git", "GitHub", "Maven", "Gradle", "Postman", "Lombok", "Log4j2"],
    },
];

export const HELIX = {
    name: "Helix",
    tagline: "Self-hosted AI pull-request reviewer",
    url: "https://github.com/vishwajeet-singhh/helix",
    description:
        "Helix reviews GitHub pull requests with a local LLM served by Ollama, so code never leaves your own infrastructure. It is published as a public Docker image: a team can pull it, run it on their own servers and connect it to their GitHub organisation.",
    usage: "Cut review turnaround by roughly 50% by deploying Helix across my team's GitHub organisation.",
    points: [
        "Keeps webhook handling responsive by returning 202 Accepted and processing reviews asynchronously.",
        "Keeps feedback focused by posting one review with a verdict and inline comments for warning- and critical-level findings.",
        "Keeps inference on your infrastructure by running a configurable model through Ollama.",
    ],
    stack: ["Java", "Spring Boot", "Maven", "Docker", "GitHub App", "Webhooks", "Ollama", "LLM", "Nginx", "GCP"],
};
