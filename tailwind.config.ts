import type {Config} from "tailwindcss";

// Colours live as CSS custom properties in src/index.css; Tailwind only maps names to them.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
            },
            colors: {
                page: token("page"),
                surface: token("surface"),
                subtle: token("subtle"),
                line: token("line"),
                "line-strong": token("line-strong"),
                ink: token("ink"),
                "ink-2": token("ink-2"),
                "ink-3": token("ink-3"),
                accent: token("accent"),
                "accent-strong": token("accent-strong"),
                "accent-soft": token("accent-soft"),
                easy: token("easy"),
                medium: token("medium"),
                hard: token("hard"),
                positive: token("positive"),
            },
            maxWidth: {
                page: "1160px",
            },
            boxShadow: {
                card: "0 1px 2px rgb(15 17 21 / 0.04), 0 1px 1px rgb(15 17 21 / 0.02)",
                lift: "0 1px 2px rgb(15 17 21 / 0.04), 0 8px 24px -8px rgb(15 17 21 / 0.10)",
            },
        },
    },
    plugins: [],
} satisfies Config;
