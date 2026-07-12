import {Server, Lock, Shield, Database} from "lucide-react";

const Services = () => {
    const services = [
        {
            icon: Server,
            title: "Backend & Distributed Systems",
            description:
                "Architect clean, maintainable services in Java and Spring Boot - defining service boundaries, data models, and API contracts that hold up under real production load. I've built entire systems from scratch across a Kafka-based microservices architecture.",
        },
        {
            icon: Lock,
            title: "Identity & Access Management",
            description:
                "Design and ship complete IAM systems from scratch - JWT auth, RBAC, MFA, OAuth2, and gateway-level validation. I own the entire identity layer at my company, now securing 500+ users across on-premises B2B deployments.",
        },
        {
            icon: Shield,
            title: "Fault Tolerance & Reliability",
            description:
                "Build systems that survive failure instead of just avoiding it - crash-safe journaling for automatic mid-process recovery, plus incident response, RCA, and recovery automation. Comfortable owning reliability where downtime has real business consequences.",
        },
        {
            icon: Database,
            title: "Large-Scale Data Processing",
            description:
                "Build configurable pipelines for batch and concurrent data operations, with pluggable rule engines and support for diverse client schemas. Diagnose and fix bottlenecks at scale - cut one production workflow from 48 hours to under 3 hours.",
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
                    <div key={index} className="dev-card flex flex-col ">
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
