import Section from "@/components/Section";
import {STACK} from "@/data/profile";

const Stack = () => (
    <Section
        id="skills"
        title="Skills"
        lede="Languages, frameworks and tools I use at work and in my own projects."
    >
        <div className="card divide-y divide-line">
            {STACK.map((group) => (
                <div key={group.title} className="card-pad-x grid gap-3 py-5 sm:grid-cols-[200px_1fr] sm:gap-8 sm:py-6">
                    <h3 className="text-[15px] font-semibold text-ink">{group.title}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                            <li key={item} className="chip">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </Section>
);

export default Stack;
