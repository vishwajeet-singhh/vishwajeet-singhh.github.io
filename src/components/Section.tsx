import type {ReactNode} from "react";

type SectionProps = {
    id: string;
    title: string;
    lede?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
    className?: string;
};

const Section = ({id, title, lede, aside, children, className = ""}: SectionProps) => (
    <section id={id} aria-labelledby={`${id}-title`} className={`pt-7 sm:pt-8 ${className}`}>
        <header className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-1">
            <div className="max-w-2xl">
                <h2 id={`${id}-title`} className="text-[21px] font-semibold leading-tight sm:text-[22px]">{title}</h2>
                {lede && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">{lede}</p>}
            </div>
            {aside}
        </header>
        {children}
    </section>
);

export default Section;
