import {Github, Globe, Linkedin, Mail} from "lucide-react";

const Contact = () => {
    const contactLinks = [
        {
            icon: Globe,
            label: "Website",
            value: "vishwajeet.me",
            href: "https://vishwajeet.me",
        },
        {
            icon: Mail,
            label: "Email",
            value: "vishwajeet.sage@gmail.com",
            href: "mailto:vishwajeet.sage@gmail.com",
        },
        {
            icon: Github,
            label: "GitHub",
            value: "github.com/vishy-singh",
            href: "https://github.com/vishy-singh",
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            value: "linkedin.com/in/vishyysingh",
            href: "https://www.linkedin.com/in/vishyysingh/",
        },
    ];

    return (
        <section
            id="contact"
            className="px-5 md:px-10 py-12 md:py-16"
            style={{scrollMarginTop: "80px"}}
        >
            <div className="flex flex-col items-center text-center mx-auto" style={{maxWidth: "720px"}}>
                {/* Eyebrow */}
                <p className="dev-label mb-4">// contact</p>

                {/* Heading */}
                <h2
                    className="mb-4"
                    style={{color: "var(--dev-text)", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700}}
                >
                    Let's Build Something.
                </h2>


                    <p
                        lang="en"
                        className="mb-6"
                        style={{
                            color: "var(--dev-muted)",
                            fontSize: "16px",
                            lineHeight: 1.50,
                            textAlign: "center",
                            maxWidth: "480px",
                        }}
                    >

                    I'm available for backend projects, freelance work, and full-time roles.
                    Especially interested in fintech and distributed systems.
                </p>

                {/* Availability badge */}
                <div className="flex items-center gap-2.5 mb-12">
                    <span className="relative flex h-2.5 w-2.5">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                            style={{backgroundColor: "var(--dev-accent)"}}
                        />
                        <span
                            className="relative inline-flex h-2.5 w-2.5 rounded-full"
                            style={{backgroundColor: "var(--dev-accent)"}}
                        />
                    </span>
                    <span
                        style={{
                            color: "var(--dev-accent)",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "13.5px",
                            fontWeight: 600,
                        }}
                    >
                        Available for Projects
                    </span>
                </div>

                {/* Contact link cards — 2×2 grid, centered as a group */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                    style={{maxWidth: "720px", margin: "0 auto"}}
                >
                    {contactLinks.map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="dev-card flex items-center gap-3"
                            style={{textDecoration: "none", padding: "18px 20px", minWidth: 0}}
                        >
                            <span
                                className="flex items-center justify-center flex-shrink-0"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--dev-border)",
                                    backgroundColor: "var(--dev-tag-bg)",
                                }}
                            >
                                <item.icon size={18} style={{color: "var(--dev-accent)"}}/>
                            </span>
                            <span className="flex flex-col" style={{minWidth: 0, textAlign: "left"}}>
                                <span className="dev-label" style={{fontSize: "12px"}}>
                                    {item.label}
                                </span>
                                <span
                                    style={{
                                        color: "var(--dev-text)",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {item.value}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;
