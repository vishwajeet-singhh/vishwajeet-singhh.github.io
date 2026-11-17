import Section from "@/components/Section";
import {ABOUT, ENGINEERING_FOCUS} from "@/data/profile";
import {useStats} from "@/lib/live-stats";
import {availablePlatforms, formatNumber} from "@/lib/stats";

const About = () => {
    const {stats} = useStats();
    const platforms = availablePlatforms(stats);
    const showSolved = platforms.includes("codeforces") && platforms.includes("leetcode");
    const solved = (stats.platforms.codeforces?.total ?? 0) + (stats.platforms.leetcode?.total ?? 0);

    return (
        <Section id="about" title="About">
            <div className="card card-pad">
                <div className="space-y-4 text-[15px] leading-relaxed text-ink-2">
                    {ABOUT.slice(0, 2).map((paragraph, index) => (
                        <p key={paragraph} className={index === 0 ? "text-ink" : undefined}>{paragraph}</p>
                    ))}
                    {showSolved && solved > 0 && (
                        <p>I've solved {formatNumber(solved)} problems across Codeforces and LeetCode, and I practise regularly to improve my problem-solving skills.</p>
                    )}
                    {ABOUT.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <ul aria-label="Backend work" className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
                    {ENGINEERING_FOCUS.map((focus) => <li className="chip" key={focus.title}>{focus.title}</li>)}
                </ul>
            </div>
        </Section>
    );
};

export default About;
