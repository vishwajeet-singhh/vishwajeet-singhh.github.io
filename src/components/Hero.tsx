import {ArrowUpRight, Mail, MapPin} from "lucide-react";
import banner from "@/assets/backend-banner.webp";
import portrait from "@/assets/profile-photo.webp";
import {CodeforcesIcon, LeetCodeIcon} from "@/components/icons";
import {HIGHLIGHTS, PROFILE} from "@/data/profile";
import {useStats} from "@/lib/live-stats";
import {availablePlatforms, formatNumber} from "@/lib/stats";

const Hero = () => {
    const {stats} = useStats();
    const platforms = availablePlatforms(stats);
    const codeforces = platforms.includes("codeforces") ? stats.platforms.codeforces : null;
    const leetcode = platforms.includes("leetcode") ? stats.platforms.leetcode : null;
    const rank = codeforces?.rating.rank?.replace(/\b\w/g, (letter) => letter.toUpperCase());
    const rating = leetcode?.rating?.current;
    const codingProfiles = [
        ...(codeforces ? [{
            id: "codeforces", name: "Codeforces", Icon: CodeforcesIcon, url: codeforces.url,
            label: "Rank", value: rank ?? "—", solved: codeforces.total,
            accessibleLabel: rank ? `Codeforces rank: ${rank}; ${codeforces.total} problems solved` : "Codeforces profile; rank unavailable",
        }] : []),
        ...(leetcode ? [{
            id: "leetcode", name: "LeetCode", Icon: LeetCodeIcon, url: leetcode.url,
            label: "Rating", value: rating != null ? formatNumber(rating) : "—", solved: leetcode.total,
            accessibleLabel: rating != null ? `LeetCode contest rating: ${rating}; ${leetcode.total} problems solved` : "LeetCode profile; contest rating unavailable",
        }] : []),
    ];
    const hasProfiles = codingProfiles.length > 0;

    return (
        <section id="top" aria-labelledby="profile-name" className="card overflow-hidden fade-up">
            <div className="profile-cover relative overflow-hidden" aria-hidden="true">
                <img src={banner} alt="" width={1920} height={640}
                     className="absolute inset-0 h-full w-full object-cover object-[65%_center] sm:object-center"/>
                <span
                    className="absolute left-5 top-5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent-strong sm:left-7 sm:text-[11px]">
                    Backend engineering
                </span>
            </div>
            <div
                className={`grid gap-5 px-5 pb-5 sm:gap-6 sm:px-7 sm:pb-7 ${hasProfiles ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""}`}>
                <div className="min-w-0">
                    <img src={portrait} alt="Vishwajeet Pratap Singh" width={640} height={640}
                         className="relative -mt-14 h-28 w-28 rounded-full border-4 border-white bg-surface object-cover object-center sm:-mt-16 sm:h-36 sm:w-36"
                         style={{objectPosition: "center", objectFit: "cover"}}
                    />
                    <div className="mt-4">
                        <h1 id="profile-name"
                            className="text-[28px] font-semibold leading-tight sm:text-[32px]">{PROFILE.name}</h1>
                        <p className="mt-1 text-[19px] font-medium text-ink sm:text-[20px]">{PROFILE.role}</p>
                        <p className="mt-2 text-[14px] text-ink-2">REST APIs <span className="mx-1.5 text-line-strong"
                                                                                   aria-hidden="true">|</span> Microservices
                        </p>
                        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
                            I design, build and improve the systems behind the product.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-3">
                            <p className="inline-flex items-center gap-1.5"><MapPin size={14}
                                                                                    aria-hidden="true"/>{PROFILE.location} ·
                                IST</p>
                            <span>vishwajeet.me</span>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                        <a href="#contact" className="btn-primary min-h-11"><Mail size={16} aria-hidden="true"/>Get in
                            touch</a>
                        <a href={PROFILE.resumeUrl} target="_blank" rel="noopener noreferrer"
                           className="btn-secondary min-h-11">
                            View résumé<ArrowUpRight size={16} aria-hidden="true"/>
                        </a>
                    </div>
                </div>
                {hasProfiles && (
                    <aside aria-labelledby="coding-profiles-title" aria-live="polite"
                           className="min-w-0 overflow-hidden rounded-xl border border-line bg-surface lg:self-center">
                        <header className="border-b border-line bg-subtle/70 px-3 py-3">
                            <h2 id="coding-profiles-title" className="text-[13px] font-semibold text-ink">Coding profiles</h2>
                        </header>
                        <div className={`grid ${codingProfiles.length === 2 ? "min-[380px]:grid-cols-2 lg:grid-cols-1" : "grid-cols-1"}`}>
                            {codingProfiles.map((profile, index) => {
                                const Icon = profile.Icon;
                                return (
                                    <a key={profile.id} href={profile.url} target="_blank" rel="noopener noreferrer"
                                       aria-label={profile.accessibleLabel}
                                       className={`group min-w-0 px-3 py-3 transition-colors hover:bg-subtle ${index > 0 ? "border-t border-line min-[380px]:border-l min-[380px]:border-t-0 lg:border-l-0 lg:border-t" : ""}`}>
                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className="grid h-5 w-5 shrink-0 place-items-center"><Icon size={16}/></span>
                                            <span className="min-w-0 flex-1 text-[12px] font-semibold text-ink">{profile.name}</span>
                                            <ArrowUpRight size={13} className="shrink-0 text-ink-3 transition-colors group-hover:text-accent" aria-hidden="true"/>
                                        </div>
                                        <dl className="mt-3 grid grid-cols-2 gap-3">
                                            <div className="min-w-0">
                                                <dt className="text-[11px] leading-4 text-ink-3">{profile.label}</dt>
                                                <dd className="mt-1 min-h-6 break-words text-[16px] font-semibold leading-6 text-ink tabular">{profile.value}</dd>
                                            </div>
                                            <div className="min-w-0 text-right">
                                                <dt className="text-[11px] leading-4 text-ink-3">Solved</dt>
                                                <dd className="mt-1 min-h-6 text-[16px] font-semibold leading-6 text-ink tabular">{formatNumber(profile.solved)}</dd>
                                            </div>
                                        </dl>
                                    </a>
                                );
                            })}
                        </div>
                    </aside>
                )}
            </div>
            <dl className="grid grid-cols-2 border-t border-line bg-subtle/40 sm:grid-cols-4">
                {HIGHLIGHTS.map((highlight, i) => (
                    <div key={highlight.label}
                         className={`flex flex-col px-5 py-5 sm:px-5 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}>
                        <dt className="order-2 mt-2 text-[12px] font-medium leading-snug text-ink-2">{highlight.label}</dt>
                        <dd className="order-1 text-[27px] font-semibold leading-none tracking-tight text-ink">{highlight.value}</dd>
                        <dd className="order-3 mt-1 text-[11px] leading-snug text-ink-3">{highlight.detail}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
};

export default Hero;
