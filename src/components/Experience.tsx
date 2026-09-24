import {Fragment} from "react";
import {GraduationCap} from "lucide-react";
import Section from "@/components/Section";
import {EDUCATION, ROLE_STACK, ROLES} from "@/data/profile";

/** Renders **figures** from the copy in profile.ts in ink, so they're easy to scan. */
const Rich = ({text}: { text: string }) => (
    <>
        {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") ? (
                <strong key={i} className="font-medium text-ink">
                    {part.slice(2, -2)}
                </strong>
            ) : (
                <Fragment key={i}>{part}</Fragment>
            ),
        )}
    </>
);

const Experience = () => (
    <Section
        id="experience"
        title="Experience"
        lede="Nearly three years at Maya Data Privacy, starting as an intern in December 2023."
    >
        <ol className="relative space-y-6">
            {ROLES.map((role, index) => (
                <li key={role.title} className="card card-pad grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                    <div>
                        <p className="text-[13px] text-ink-3 tabular">{role.period}</p>
                        <h3 className="mt-2 text-[20px] font-semibold">{role.title}</h3>
                        <p className="mt-1 text-[15px] text-ink-2">
                            {role.company} · {role.location}
                        </p>
                        {index === 0 && (
                            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent-strong">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true"/>
                                Current
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="text-[16px] leading-relaxed text-ink">{role.summary}</p>

                        {role.groups.length > 0 && (
                            <dl className="mt-6 divide-y divide-line border-t border-line">
                                {role.groups.map((group) => (
                                    <div key={group.theme} className="grid gap-2 py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
                                        <dt className="pt-px text-[13px] font-medium text-ink-3">
                                            {group.theme}
                                        </dt>
                                        <dd className="space-y-2.5">
                                            {group.points.map((point) => (
                                                <p key={point} className="text-[15px] leading-relaxed text-ink-2">
                                                    <Rich text={point}/>
                                                </p>
                                            ))}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {index === 0 && (
                            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
                                {ROLE_STACK.map((tech) => (
                                    <li key={tech} className="chip">
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </li>
            ))}
        </ol>

        <div className="card-pad-x mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface/60 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-subtle text-ink-2">
                    <GraduationCap size={20} aria-hidden="true"/>
                </span>
                <div>
                    <p className="text-[15px] font-semibold text-ink">
                        {EDUCATION.degree}, {EDUCATION.school}
                    </p>
                    <p className="text-[14px] text-ink-2">{EDUCATION.score}</p>
                </div>
            </div>
            <p className="text-[13px] text-ink-3">Graduated {EDUCATION.year}</p>
        </div>
    </Section>
);

export default Experience;
