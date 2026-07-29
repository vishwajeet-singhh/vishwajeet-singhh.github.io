const About = () => {
    const stats = [
        {value: "2.5+", label: "Years Exp"},
        {value: "10+", label: "Microservices"},

        {value: "60+", label: "REST APIs"},

        {value: "3", label: "Databases"},
        {value: "10+", label: "Technologies"},
        {value: "50%", label: "Faster PR Reviews"},

    ];

    return (
        <section
            id="about"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// about</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                About Me
            </h2>

            {/* Bio card */}

            <div className="dev-card" style={{padding: "28px"}}>
                <div className="space-y-5">

                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                        I gravitate towards software where correctness is axiomatic rather than aspirational. Beginning
                        as an intern, I progressed into a core engineering role within two years, designing and shipping
                        production systems largely end-to-end—identity and access management, licensing infrastructure,
                        sensitive-data intelligence, and cloud-native backend services. Building systems in isolation
                        taught me to reason beneath frameworks and abstractions, where architectural decisions become
                        operational consequences.
                    </p>

                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                        Distributed systems, security, and large-scale data processing occupy most of my attention
                        because they demand deterministic behaviour under adversarial conditions. Whether coordinating
                        Kafka workloads, recovering interrupted batch execution, or enforcing identity boundaries, I
                        prefer engineering problems where reliability is measurable and failure is unacceptable. FinTech
                        naturally appeals to me for exactly those constraints.
                    </p>

                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                        Beyond implementation, I facilitate Scrum across a multidisciplinary engineering team,
                        translating ambiguity into predictable delivery. I also build developer tooling, including
                        Helix—an open-source AI pull-request reviewer that expedites code reviews while preserving
                        reviewer attention for architectural judgement rather than mechanical defects. My long-term
                        interest lies in infrastructure whose correctness quietly underpins everything built above it.
                    </p>

                </div>
            </div>

            {/* Stats - metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 ">
                {stats.map((stat, i) => (
                    <div key={i} className="dev-card metric-card justify-items-center" style={{padding: "24px"}}>
                        <div
                            className="leading-none "
                            style={{color: "var(--dev-text)", fontSize: "30px", fontWeight: 700}}
                        >
                            {stat.value}
                        </div>
                        <div className="dev-label mt-2">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default About;
