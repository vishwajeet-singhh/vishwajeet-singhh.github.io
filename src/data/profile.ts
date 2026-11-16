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
    {value: "500+", label: "Users and B2B tenants", detail: "on the licensing service"},
    {value: "50%", label: "Shorter review turnaround", detail: "after rolling out Helix"},
];

export type Role = {
    title: string;
    company: string;
    period: string;
    location: string;
    summary: string;
    points: string[];
};

export const ROLES: Role[] = [
    {
        title: "Backend Developer",
        company: "Maya Data Privacy",
        period: "Jan 2024 – Present",
        location: "Remote",
        summary: "Core Backend Developer in a product team of around 20 people.",
        points: [
            "Designed, built and operated **25+ production REST APIs** using Java and Spring Boot, integrating PostgreSQL, Oracle and HANA to support core product workflows.",
            "Slashed pipeline runtime by **~95%** on **100k+ table datasets** using predicate pushdown, batch concurrency tuning and per-tenant HikariCP pool sizing.",
            "Accelerated bulk-insert performance by **~50%** using a journaling pattern for high-volume writes, while preserving data integrity.",
            "Engineered configurable sliding-window **RPM/TPM rate limiting across 3 AI providers** using Redis and atomic Lua scripts to curb API abuse and enforce fair usage.",
            "Secured **500+ SaaS users and B2B tenants** by designing and operating a licensing service for on-prem/B2B installs with PEM-based key pairs.",
            "Shipped bulk edit/delete for large tables, snapshotting matched rows upfront to prevent pagination drift and using composite-key deduplication to eliminate double-processing.",
            "Cut PR review turnaround by **50%** by deploying Helix across my GitHub organisation.",
        ],
    },
    {
        title: "Backend Developer Intern",
        company: "Maya Data Privacy",
        period: "Dec 2023",
        location: "Remote",
        summary: "Gained hands-on experience navigating a live production codebase, working within a team Git workflow and applying professional coding conventions.",
        points: [],
    },
];

export const ROLE_STACK = [
    "Java", "Spring Boot", "PostgreSQL", "Oracle", "HANA", "HikariCP", "Redis", "Lua", "Git", "GitHub", "Docker",
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
    usage: "Cut PR review turnaround by 50% by deploying Helix across my GitHub organisation.",
    points: [
        "Keeps webhook handling responsive by returning 202 Accepted and processing reviews asynchronously.",
        "Keeps feedback focused by posting one review with a verdict and inline comments for warning- and critical-level findings.",
        "Keeps inference on your infrastructure by running a configurable model through Ollama.",
    ],
    stack: ["Java", "Spring Boot", "Maven", "Docker", "GitHub App", "Webhooks", "Ollama", "LLM", "Nginx", "GCP"],
};
