import {Cloud, Code2, Database, Server, Wrench, type LucideIcon} from "lucide-react";
import Section from "@/components/Section";
import {STACK} from "@/data/profile";

const GROUP_ICONS: Record<string, LucideIcon> = {
    Languages: Code2,
    "Backend & APIs": Server,
    "Databases & caching": Database,
    "Cloud & deployment": Cloud,
    "Build, tools & logging": Wrench,
};

const Stack = () => (
    <Section
        id="skills"
        title="Technical skills"
        lede="Technologies used in my backend work and Helix."
    >
        <div className="grid gap-4 sm:grid-cols-2">
            {STACK.map((group, index) => {
                const Icon = GROUP_ICONS[group.title] ?? Wrench;
                const spansRow = STACK.length % 2 === 1 && index === STACK.length - 1;

                return (
                    <article key={group.title} className={`card card-pad min-w-0 ${spansRow ? "sm:col-span-2" : ""}`}>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent" aria-hidden="true">
                                <Icon size={18} strokeWidth={1.7}/>
                            </span>
                            <h3 className="text-[15px] font-semibold leading-snug">{group.title}</h3>
                        </div>
                        <ul className="flex flex-wrap gap-2" aria-label={group.title}>
                            {group.items.map((item) => (
                                <li key={item} className="chip text-[13px]">{item}</li>
                            ))}
                        </ul>
                    </article>
                );
            })}
        </div>
    </Section>
);

export default Stack;
