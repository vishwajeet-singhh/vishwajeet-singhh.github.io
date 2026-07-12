const Skills = () => {


    const skillCategories = [
        {
            category: "Languages",
            note: null,
            accent: false,
            skills: [
                "Java",
                "Python",
                "SQL",
                "TypeScript",
            ],
        },
        {
            category: "Databases",
            note: null,
            accent: false,
            skills: [
                "PostgreSQL",
                "Oracle",
                "SAP HANA",
                "Redis",
            ],
        },
        {
            category: "Backend",
            note: null,
            accent: false,
            skills: [
                "Spring Boot",
                "Spring Security",
                "Spring Data JPA",
                "Hibernate",
                "Kafka",
                "JUnit",
                "Testcontainers",
                "Flyway",
            ],
        },
        {
            category: "Cloud & Tools",
            note: null,
            accent: false,
            skills: [
                "GCP",
                "Docker",
                "GitHub Actions",
                "Grafana",
                "Prometheus",
                "Git",
                "Maven",
                "Gradle",
                "Postman",
            ],
        },
    ];

    return (
        <section
            id="skills"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// skills</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                Technical Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
                {skillCategories.map((group, i) => (
                    <div key={i} className={`dev-card ${group.accent ? "md:col-span-2" : ""}`}>
                        <h3 className="dev-label mb-4" style={{fontSize: "13px"}}>
                            {group.category}
                        </h3>
                        {group.note && (
                            <p className="mb-4" style={{color: "var(--dev-muted)", fontSize: "13px"}}>
                                {group.note}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {group.skills.map((skill, j) => (
                                <span key={j} className="dev-tag">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
