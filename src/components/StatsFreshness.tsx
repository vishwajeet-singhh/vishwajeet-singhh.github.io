import {RefreshCw} from "lucide-react";
import {useNow, useStats} from "@/lib/live-stats";
import {formatUpdated} from "@/lib/stats";

/** "Updated 3 min ago", or "Updating…" while this visit's refresh is running. */
const StatsFreshness = () => {
    const {stats, updating} = useStats();
    const now = useNow(15_000);

    return (
        <p
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface px-3.5 text-[12.5px] text-ink-3"
            aria-live="polite"
        >
            <RefreshCw
                size={13}
                className={updating ? "animate-spin motion-reduce:animate-none" : ""}
                aria-hidden="true"
            />
            {updating ? "Updating…" : `Updated ${formatUpdated(stats.generatedAt, now)}`}
        </p>
    );
};

export default StatsFreshness;
