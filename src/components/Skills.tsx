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
            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--pp-text)", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 800}}
            >
                Technical Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
                {skillCategories.map((group, i) => (
                    <div key={i} className={`pp-card ${group.accent ? "md:col-span-2" : ""}`}>
                        <h3
                            className="mb-4"
                            style={{color: "var(--pp-text)", fontSize: "18px", fontWeight: 700}}
                        >
                            {group.category}
                        </h3>
                        {group.note && (
                            <p className="mb-4" style={{color: "var(--pp-muted)", fontSize: "13px"}}>
                                {group.note}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-2.5">
                            {group.skills.map((skill, j) => (
                                <span key={j} className={group.accent ? "pp-chip pp-chip-blue" : "pp-chip"}>
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
