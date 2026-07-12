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
                        I build the backend systems that can't afford to break. I started as an intern and, within
                        two years, grew into the lead engineer role - designing and shipping entire systems on my
                        own: identity and access management, billing and licensing engines, sensitive-data
                        classification, and cloud infrastructure. Owning systems end-to-end, alone, is what taught me
                        how they actually work underneath the abstractions.
                    </p>
                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                        I'm drawn to backend problems where correctness isn't negotiable - distributed architectures
                        where a single failure cascades, identity layers where a bug is a breach, and data pipelines
                        that have to stay consistent under load. That's why fintech is where I want to take this work
                        next: it demands exactly the things I care about most - reliability, security, and
                        financial-grade
                        correctness where "mostly right" simply isn't good enough.
                    </p>
                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7, textAlign: "justify"}}>
                        Alongside writing code, I run Scrum for my team - sprint ceremonies, unblocking people,
                        keeping delivery on track - which reinforced that great engineering is as much about clear
                        communication as raw technical skill. Outside of work, I build and open-source tools,
                        including Helix, an AI-powered PR reviewer that cut our review time in half. I'm always
                        looking for harder systems problems to take on - ideally ones where money's on the line.
                    </p>
                </div>
            </div>

            {/* Stats - metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 ">
                {stats.map((stat, i) => (
                    <div key={i} className="dev-card justify-items-center" style={{padding: "24px"}}>
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
