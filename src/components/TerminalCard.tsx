const TerminalCard = () => {
    const lines: { type: "cmd" | "out"; text: string }[] = [
        {type: "cmd", text: "docker compose up -d"},
        {type: "out", text: "Creating helix ... done"},
        {type: "cmd", text: "docker compose logs -f helix"},
        {type: "out", text: "Started Helix in 4.2s"},
        {type: "out", text: "Helix is running"},
    ];

    return (
        <div
            className="w-full overflow-hidden"
            style={{
                maxWidth: "320px",
                borderRadius: "6px",
                border: "1px solid var(--dev-border)",
                backgroundColor: "var(--dev-card)",
            }}
        >
            {/* Title bar */}
            <div
                className="flex items-center gap-2"
                style={{
                    padding: "9px 12px",
                    borderBottom: "1px solid var(--dev-border)",
                    backgroundColor: "var(--dev-tag-bg)",
                }}
            >
                <div className="flex items-center gap-1.5">
                    <span
                        className="rounded-full"
                        style={{width: "8px", height: "8px", backgroundColor: "var(--dev-border-strong)"}}
                    />
                    <span
                        className="rounded-full"
                        style={{width: "8px", height: "8px", backgroundColor: "var(--dev-border-strong)"}}
                    />
                    <span
                        className="rounded-full"
                        style={{width: "8px", height: "8px", backgroundColor: "var(--dev-border-strong)"}}
                    />
                </div>
                <span
                    style={{
                        color: "var(--dev-muted)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11.5px",
                        marginLeft: "4px",
                    }}
                >
                    helix
                </span>
            </div>

            {/* Body */}
            <div style={{padding: "15px 15px 17px"}}>
                {lines.map((line, i) => (
                    <div
                        key={i}
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "12px",
                            lineHeight: 1.8,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {line.type === "cmd" ? (
                            <span>
                                <span style={{color: "var(--dev-accent)"}}>$</span>{" "}
                                <span style={{color: "var(--dev-text)"}}>{line.text}</span>
                            </span>
                        ) : (
                            <span style={{color: "var(--dev-muted)"}}>{line.text}</span>
                        )}
                    </div>
                ))}
                <span
                    aria-hidden="true"
                    style={{
                        display: "inline-block",
                        width: "6px",
                        height: "12px",
                        marginTop: "4px",
                        backgroundColor: "var(--dev-accent)",
                        animation: "terminal-blink 1.1s steps(1) infinite",
                    }}
                />
            </div>

            <style>{`
                @keyframes terminal-blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default TerminalCard;
