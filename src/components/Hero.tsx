import {ArrowUpRight, Mail, MapPin} from "lucide-react";
import portrait from "@/assets/portrait.webp";
import {GitHubIcon, LinkedInIcon} from "@/components/icons";
import {HIGHLIGHTS, PROFILE} from "@/data/profile";

const Hero = () => (
    <section id="top">
        <div className="page-container grid items-center gap-12 pb-14 pt-10 sm:pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:pb-20 lg:pt-20">
            <div className="fade-up">
                <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-2 pr-3 text-[13px] text-ink-2 shadow-card">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive/60 motion-reduce:animate-none"/>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-positive"/>
                    </span>
                    {PROFILE.role} at <span className="font-medium text-ink">{PROFILE.company}</span>
                </p>

                <h1 className="mt-6 text-[42px] font-semibold leading-[1.02] tracking-[-0.022em] sm:text-[58px] lg:text-[66px]">
                    Vishwajeet
                    <br/>
                    Pratap Singh
                </h1>

                <p className="mt-6 max-w-xl text-[20px] leading-snug text-ink sm:text-[22px]">
                    Backend developer working with Java, Spring Boot and relational databases.
                </p>
                <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
                    I design, build and run backend services: REST APIs backed by PostgreSQL, Oracle and SAP HANA, a
                    licensing service with its IAM layer, and data pipelines for datasets of 100k+ tables. Outside
                    work, I solve algorithm problems on LeetCode, Codeforces, CodeChef and GeeksforGeeks.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
                    <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        <span className="sm:hidden">Résumé</span>
                        <span className="hidden sm:inline">View résumé</span>
                        <ArrowUpRight size={16} aria-hidden="true"/>
                    </a>
                    <a href={`mailto:${PROFILE.email}`} className="btn-secondary">
                        <Mail size={16} aria-hidden="true"/>
                        Email me
                    </a>
                    <a href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-icon"
                       aria-label="GitHub">
                        <GitHubIcon size={18}/>
                    </a>
                    <a href={PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-icon"
                       aria-label="LinkedIn">
                        <LinkedInIcon size={17}/>
                    </a>
                </div>

                <p className="mt-6 flex items-center gap-2 text-[13px] text-ink-3">
                    <MapPin size={14} aria-hidden="true"/>
                    {PROFILE.location} · IST (UTC+5:30)
                </p>
            </div>

            <div className="fade-up mx-auto w-full max-w-[420px] lg:mr-0" style={{animationDelay: "120ms"}}>
                <div className="overflow-hidden rounded-3xl border border-line bg-[#0b2f63] shadow-lift">
                    <img
                        src={portrait}
                        alt="Portrait of Vishwajeet Pratap Singh"
                        width={880}
                        height={1100}
                        className="block aspect-[4/5] w-full object-cover"
                    />
                </div>
            </div>
        </div>

        <div className="page-container pb-4">
            <dl className="card grid grid-cols-2 lg:grid-cols-4">
                {HIGHLIGHTS.map((h, i) => (
                    <div
                        key={h.label}
                        className={`card-pad-x py-6 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                            i >= 2 ? "border-t border-line lg:border-t-0" : ""
                        } ${i === 2 ? "lg:border-l" : ""}`}
                    >
                        <dt className="text-[14px] font-medium text-ink">{h.label}</dt>
                        <dd className="mt-3 text-[32px] font-semibold leading-none tracking-[-0.02em] text-ink sm:text-[36px]">
                            {h.value}
                        </dd>
                        <dd className="mt-2 text-[13px] leading-snug text-ink-3">{h.detail}</dd>
                    </div>
                ))}
            </dl>
        </div>
    </section>
);

export default Hero;
