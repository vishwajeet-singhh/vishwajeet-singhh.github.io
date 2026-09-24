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
    <section id={id} aria-labelledby={`${id}-title`} className={`py-14 sm:py-20 ${className}`}>
        <div className="page-container">
            <header className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between md:gap-8">
                <div className="max-w-2xl">
                    <h2 id={`${id}-title`} className="text-[30px] font-semibold tracking-[-0.025em] sm:text-[36px]">
                        {title}
                    </h2>
                    {lede && <p className="mt-3 text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">{lede}</p>}
                </div>
                {aside && <div className="shrink-0">{aside}</div>}
            </header>
            {children}
        </div>
    </section>
);

export default Section;
