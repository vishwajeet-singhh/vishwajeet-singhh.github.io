import {GitBranch, Check} from "lucide-react";

const Footer = () => {
    return (
        <footer
            className="px-5 md:px-10"
            style={{
                borderTop: "1px solid var(--dev-border)",
                backgroundColor: "var(--dev-card)",
            }}
        >
            <div
                className="flex flex-col sm:flex-row items-center justify-between gap-2"
                style={{
                    padding: "10px 0",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    color: "var(--dev-muted)",
                }}
            >
                <span className="flex items-center gap-1.5">
                    <GitBranch size={12}/>
                    main
                    <Check size={12} style={{color: "var(--dev-accent)"}}/>
                    <span>·</span>
                    <span>vishwajeet.me</span>
                </span>
                <span>
                    © {new Date().getFullYear()} · Built with React + Vite
                </span>
            </div>
        </footer>
    );
};

export default Footer;
