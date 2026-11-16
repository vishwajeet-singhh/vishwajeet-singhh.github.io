import {Fragment} from "react";
import {Building2, GraduationCap} from "lucide-react";
import Section from "@/components/Section";
import {EDUCATION, ROLE_STACK, ROLES} from "@/data/profile";

/** Keep the emphasis in the source copy without rendering arbitrary HTML. */
const Rich = ({text}: { text: string }) => (
    <>
        {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") ? (
                <strong key={i} className="font-semibold text-ink">
                    {part.slice(2, -2)}
                </strong>
            ) : (
                <Fragment key={i}>{part}</Fragment>
            ),
        )}
    </>
);

const COMPANIES = [...new Set(ROLES.map((role) => role.company))];
const PRIMARY_TOOL_NAMES = new Set(["Java", "Python", "Spring Boot", "PostgreSQL", "Redis", "Docker"]);
const PRIMARY_TOOLS = ROLE_STACK.filter((tool) => PRIMARY_TOOL_NAMES.has(tool));
const MORE_TOOLS = ROLE_STACK.filter((tool) => !PRIMARY_TOOL_NAMES.has(tool));

const Experience = () => (
    <Section
        id="experience"
        title="Experience"
        lede="Hands-on engineering, from API design to production reliability."
    >
        <div className="space-y-4">
            {COMPANIES.map((company) => {
                const roles = ROLES.filter((role) => role.company === company);
                const locations = [...new Set(roles.map((role) => role.location))].join(" · ");

                return (
                    <article key={company} className="card card-pad">
                        <header className="flex items-center gap-3.5 border-b border-line pb-5">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-subtle text-ink-2" aria-hidden="true">
                                <Building2 size={22} strokeWidth={1.6}/>
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-[19px] font-semibold">{company}</h3>
                                <p className="mt-1 text-[13px] text-ink-3">{locations}</p>
                            </div>
                        </header>

                        <ol className="mt-5">
                            {roles.map((role, index) => {
                                const isCurrent = role.period.includes("Present");
                                return (
                                    <li key={`${role.title}-${role.period}`} className="relative pb-7 pl-6 last:pb-0">
                                        {index < roles.length - 1 && (
                                            <span className="absolute bottom-[-7px] left-[4px] top-3 w-px bg-line-strong" aria-hidden="true"/>
                                        )}
                                        <span
                                            className={`absolute left-0 top-[7px] h-[9px] w-[9px] rounded-full ring-4 ring-surface ${isCurrent ? "bg-accent" : "bg-ink-3"}`}
                                            aria-hidden="true"
                                        />
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                            <h4 className="text-[17px] font-semibold leading-snug">{role.title}</h4>
                                            {isCurrent && (
                                                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[12px] font-semibold text-accent-strong">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-[13px] text-ink-3 tabular">{role.period}</p>
                                        {role.summary && (
                                            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{role.summary}</p>
                                        )}

                                        {role.points.length > 0 && (
                                            <ul className="mt-4 list-disc space-y-3 pl-4 marker:text-ink-3">
                                                {role.points.map((point) => (
                                                    <li key={point} className="pl-1 text-[15px] leading-relaxed text-ink-2">
                                                        <Rich text={point}/>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {role === ROLES[0] && (
                                            <div className="mt-5 border-t border-line pt-4">
                                                <p className="mb-2.5 text-[12px] font-medium text-ink-3">Tools used in this role</p>
                                                <ul className="flex flex-wrap gap-1.5" aria-label="Selected technologies used in this role">
                                                    {PRIMARY_TOOLS.map((tech) => <li key={tech} className="chip">{tech}</li>)}
                                                </ul>
                                                {MORE_TOOLS.length > 0 && (
                                                    <details className="mt-3">
                                                        <summary className="min-h-11 w-fit cursor-pointer py-2 text-[13px] font-medium text-accent marker:text-accent hover:underline">
                                                            {MORE_TOOLS.length} more tools
                                                        </summary>
                                                        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Additional technologies used in this role">
                                                            {MORE_TOOLS.map((tech) => <li key={tech} className="chip">{tech}</li>)}
                                                        </ul>
                                                    </details>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </article>
                );
            })}
        </div>

        <div className="card card-pad mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-subtle text-ink-2" aria-hidden="true">
                    <GraduationCap size={22} strokeWidth={1.6}/>
                </span>
                <div>
                    <p className="text-[12px] font-medium text-ink-3">Education</p>
                    <h3 className="mt-1 text-[16px] font-semibold">{EDUCATION.degree} · {EDUCATION.school}</h3>
                    <p className="mt-1 text-[14px] text-ink-2">{EDUCATION.score}</p>
                </div>
            </div>
            <p className="pl-[60px] text-[13px] text-ink-3 sm:pl-0">Graduated {EDUCATION.year}</p>
        </div>
    </Section>
);

export default Experience;
