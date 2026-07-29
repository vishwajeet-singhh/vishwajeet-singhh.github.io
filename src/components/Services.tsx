import {Server, Lock, Shield, Database} from "lucide-react";

const Services = () => {
    const services = [
        {
            icon: Server,
            title: "Backend & Distributed Systems",
            description:
                "Engineer production-grade backend systems in Java and Spring Boot with clear service decomposition, durable API contracts, and well-defined bounded contexts. Experienced shipping Kafka-backed microservices designed for operational simplicity rather than architectural ornamentation.",
        },
        {
            icon: Lock,
            title: "Identity & Access Management",
            description:
                "Design complete identity substrates from first principles—JWT authentication, RBAC, MFA, OAuth2, gateway enforcement, and tenant-aware authorisation. Currently own the production identity layer securing hundreds of SaaS and on-premises users.",
        },
        {
            icon: Shield,
            title: "Reliability Engineering",
            description:
                "Build systems that degrade gracefully instead of catastrophically. Implement crash recovery, journaling, failure reconciliation, root-cause analysis, and operational safeguards that preserve consistency through unexpected process termination.",
        },
        {
            icon: Database,
            title: "Data Processing Systems",
            description:
                "Develop high-throughput data pipelines capable of processing heterogeneous schemas across multiple database engines. Optimise execution through concurrency tuning, predicate pushdown, and workload orchestration—reducing production runtimes from days to hours.",
        },
    ];

    return (
        <section
            id="services"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// focus areas</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                Focus Areas
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 ">
                {services.map((service, index) => (
                    <div key={index} className="dev-card focus-card flex flex-col ">
                        <div
                            className="flex items-center justify-center mb-4 mx-auto"
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "6px",
                                border: "1px solid var(--dev-border)",
                                backgroundColor: "var(--dev-tag-bg)",
                            }}
                        >
                            <service.icon size={20} style={{color: "var(--dev-accent)"}}/>
                        </div>
                        <h3 className="mb-2"
                            style={{color: "var(--dev-text)", fontSize: "18px", fontWeight: 700, textAlign: "center"}}>
                            {service.title}
                        </h3>
                        <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Services;
