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
    "I build APIs and backend services from scratch, integrate them with other services and databases, and maintain them after release. My work includes debugging, performance improvements and deployment.",
    "I've worked on authentication flows, database integrations, background jobs, ETL workflows and Redis-backed rate limiting. I also independently built and maintain the licensing service and its internal generation UI.",
    "I'm continuing to build my understanding of design patterns and system design. I enjoy working through practical problems, learning from feedback and finding simpler ways to write and maintain code.",
] as const;

export const ENGINEERING_FOCUS = [
    {title: "APIs & backend services", detail: "REST APIs, service integrations and product features."},
    {title: "Databases & batch processing", detail: "SQL optimisation, connection pooling and ETL workflow contributions."},
    {title: "Async & concurrent processing", detail: "Background jobs, thread pools and Redis-backed rate limiting."},
    {title: "Authentication & licensing", detail: "OAuth2 integration, OTP verification and RSA-signed licences."},
] as const;

export type Highlight = {
    value: string;
    label: string;
    detail: string;
};

export const HIGHLIGHTS: Highlight[] = [
    {value: "25+", label: "Production REST APIs", detail: "built and maintained"},
    {value: "~95%", label: "Shorter pipeline runtime", detail: "on datasets of 100k+ tables"},
    {value: "500+", label: "Users and B2B tenants", detail: "on the licensing service"},
    {value: "50%", label: "Shorter review turnaround", detail: "after rolling out Helix"},
];

export type ContributionGroup = {
    title: string;
    points: string[];
};

export type Role = {
    title: string;
    company: string;
    period: string;
    location: string;
    summary: string;
    points: string[];
    groups?: ContributionGroup[];
};

export const ROLES: Role[] = [
    {
        title: "Backend Developer",
        company: "Maya Data Privacy",
        period: "Jan 2024 – Present",
        location: "Remote",
        summary: "Backend Developer working on product features in a team of around 20 people.",
        points: [],
        groups: [
            {
                title: "Licensing service · end-to-end ownership",
                points: [
                    "Built and maintained the licensing service and internal generation UI as its **sole developer**, supporting **500+ SaaS users and B2B tenants**, with versioned APIs, domain/user configuration, duration presets, API-version selection and JSON preview/copy/download.",
                    "Implemented **RSA/SHA-256 digital signatures**, PEM key loading and public-key verification for licence authenticity and integrity, with signed JSON downloads, domain checks, UTC expiry handling, upload/startup validation, scheduled expiry checks, gateway enforcement and synchronised licence-state updates.",
                    "Connected licence installation to transactional organisation/user provisioning, existing role assignment, licensed user limits and forced initial-password reset; added digitally signed usage audit reports aggregating licensing-period metrics across backend products.",
                ],
            },
            {
                title: "APIs, databases & batch processing",
                points: [
                    "Built and operated **25+ production REST APIs** using Java and Spring Boot, integrating PostgreSQL, Oracle and HANA.",
                    "Reduced pipeline runtime by **~95%** on **100k+ table datasets** by moving filtering and sampling into SQL and tuning concurrent processing and connection pools.",
                    "Added job-scoped HikariCP connection pooling with credential-based reuse, configurable limits and cleanup after processing.",
                    "Improved bulk-insert performance by **~50%** by temporarily disabling active database triggers and keeping persistent records for restoration after processing.",
                    "Contributed transformation logic and Spring Batch flow handling to ETL workflows, including IP, URL and multilingual email processing with tests.",
                    "Added concurrent table processing and background-job handling, including completion/failure status updates and stale-job cleanup.",
                ],
            },
            {
                title: "AI services & distributed rate limiting",
                points: [
                    "Implemented Redis-backed distributed request and token limits across **3 AI providers** using sliding windows and atomic Lua scripts, with token-budget reservation, usage reconciliation and per-user fair-share checks under load.",
                    "Added validated per-model quota configuration, usage events and an internal usage API; handled provider throttling with model cooldowns, HTTP 429 responses and retry timing.",
                ],
            },
            {
                title: "Service integrations & bulk operations",
                points: [
                    "Added user- and organisation-scoped settings and default-project resolution; enhanced bulk configuration edits/deletes with stable filtered selection, composite-key deduplication, bounded requests and pagination-safe deletion.",
                    "Added asynchronous file-job completion/failure callbacks, output handoff and project-context propagation; implemented IBAN and credit-card checksum validation, improved phone-number matching and updated spaCy model loading.",
                ],
            },
            {
                title: "Authentication & user onboarding",
                points: [
                    "Integrated Microsoft OAuth2 sign-in with local account creation, existing role assignment and JWT issuance, and corrected access-token expiry after refresh.",
                    "Added registration email OTP verification with expiry, pending-state cleanup and resend cooldowns/limits; extended organisation-controlled OTP login and password-reset flows.",
                ],
            },
            {
                title: "Developer tooling & delivery",
                points: [
                    "Built and deployed Helix across my GitHub organisation, reducing PR review turnaround by **50%**, with authenticated webhooks, GitHub App authentication and review API integration.",
                    "Processed reviews asynchronously and validated inline feedback from local Ollama output against pull-request diffs; added Docker packaging and multi-architecture image build/publish workflows.",
                ],
            },
        ],
    },
    {
        title: "Backend Developer Intern",
        company: "Maya Data Privacy",
        period: "Dec 2023",
        location: "Remote",
        summary: "Worked with a live product codebase, team Git workflows and coding conventions.",
        points: [],
    },
];

export const ROLE_STACK = [
    "Java", "Python", "Spring Boot", "Spring Security", "Spring Batch", "Flask", "PostgreSQL", "Oracle", "HANA", "HikariCP", "Redis", "Lua", "Git", "GitHub", "Docker",
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
        items: ["Spring Boot", "Spring Security", "Spring Data JPA", "Spring Batch", "Flask", "REST APIs", "Microservices", "Webhooks", "OAuth2", "JWT"],
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
    {
        title: "Backend concepts",
        items: ["ETL workflows", "Batch processing", "Asynchronous jobs", "Concurrency", "SQL optimisation", "Connection pooling", "Distributed rate limiting", "Pagination & deduplication", "Digital signatures (RSA/SHA-256)", "PEM key handling"],
    },
];

export const HELIX = {
    name: "Helix",
    tagline: "Self-hosted AI pull-request reviewer",
    url: "https://github.com/vishwajeet-singhh/helix",
    description:
        "I built Helix to automate pull-request reviews on GitHub. It runs on your own infrastructure and is available as a public Docker image.",
    usage: "Reduced PR review turnaround by 50% after deploying it across my GitHub organisation.",
    points: [
        "Verifies GitHub webhook signatures, returns 202 Accepted and processes reviews asynchronously.",
        "Posts one review with a verdict and inline comments for warning and critical findings.",
        "Connects through a GitHub App and uses a configurable local model served by Ollama.",
    ],
    stack: ["Java", "Spring Boot", "Maven", "Docker", "GitHub App", "Webhooks", "Ollama", "LLM", "Nginx", "GCP"],
};
