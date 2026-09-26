import {DIFFICULTIES, type SolvedBreakdown} from "@/lib/stats";

const FILL: Record<string, string> = {
    easy: "bg-easy",
    medium: "bg-medium",
    hard: "bg-hard",
};

const pct = (n: number, total: number) => (total ? Math.round((n / total) * 100) : 0);

/** Stacked Easy / Medium / Hard bar with 2px surface gaps. */
export const DifficultyBar = ({solved, height = 10}: { solved: SolvedBreakdown; height?: number }) => {
    const total = DIFFICULTIES.reduce((sum, d) => sum + solved[d.id], 0);
    const parts = DIFFICULTIES.filter((d) => solved[d.id] > 0);
    return (
        <div className="flex w-full gap-[2px] overflow-hidden rounded-full bg-surface" style={{height}} aria-hidden="true">
            {total === 0 ? (
                <div className="h-full w-full rounded-full bg-subtle"/>
            ) : (
                parts.map((d) => (
                    <div
                        key={d.id}
                        className={`h-full first:rounded-l-full last:rounded-r-full ${FILL[d.id]}`}
                        style={{flexGrow: solved[d.id], flexBasis: 0, minWidth: 3}}
                        title={`${d.label}: ${solved[d.id]} (${pct(solved[d.id], total)}%)`}
                    />
                ))
            )}
        </div>
    );
};

type LegendProps = {
    solved: SolvedBreakdown;
    showPercent?: boolean;
    /** Keep each count next to its label instead of right-aligning it. */
    inline?: boolean;
    className?: string;
};

export const DifficultyLegend = ({solved, showPercent = false, inline = false, className = ""}: LegendProps) => {
    const total = DIFFICULTIES.reduce((sum, d) => sum + solved[d.id], 0);
    return (
        <dl className={className}>
            {DIFFICULTIES.map((d) => (
                <div key={d.id} className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${FILL[d.id]}`} aria-hidden="true"/>
                    <dt className="text-[13px] text-ink-2">{d.label}</dt>
                    <dd className={`${inline ? "ml-1" : "ml-auto"} text-[13px] font-semibold text-ink tabular`}>
                        {solved[d.id]}
                        {showPercent && (
                            <span className="ml-1.5 font-normal text-ink-3">{pct(solved[d.id], total)}%</span>
                        )}
                    </dd>
                </div>
            ))}
        </dl>
    );
};
