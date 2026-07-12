import {GraduationCap} from "lucide-react";

const Education = () => {
    const entries = [
        {
            degree: "B.Tech",
            institute: "Techno India University, Kolkata",
            meta: "2023  ·  CGPA 8.64 / 10",
            note: "",
        },
        {
            degree: "Java Full Stack Development",
            institute: "Q-Spider, Kolkata",
            meta: "Dec 2023",
            note: null,
        },
    ];

    return (
        <section
            id="education"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            {/* Eyebrow */}
            <p className="dev-label mb-3">// education</p>

            {/* Heading */}
            <h2
                className="mb-8"
                style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
            >
                Education
            </h2>

            <div className="dev-card" style={{padding: "28px"}}>
                <div className="space-y-8">
                    {entries.map((entry, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div
                                className="flex-shrink-0 flex items-center justify-center"
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--dev-border)",
                                    backgroundColor: "var(--dev-tag-bg)",
                                }}
                            >
                                <GraduationCap size={20} style={{color: "var(--dev-accent)"}}/>
                            </div>
                            <div>
                                <h3
                                    className="mb-0.5"
                                    style={{color: "var(--dev-text)", fontSize: "18px", fontWeight: 700}}
                                >
                                    {entry.degree}
                                </h3>
                                <p style={{color: "var(--dev-accent)", fontSize: "15px", fontWeight: 600}}>
                                    {entry.institute}
                                </p>
                                <p className="dev-label mt-1 mb-2">
                                    {entry.meta}
                                </p>
                                {entry.note && (
                                    <p style={{color: "var(--dev-body)", fontSize: "15px", lineHeight: 1.7}}>
                                        {entry.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;
