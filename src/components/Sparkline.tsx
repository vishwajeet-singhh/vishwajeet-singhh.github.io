import {useId, useLayoutEffect, useRef, useState} from "react";
import type {RatingPoint} from "@/lib/stats";

type SparklineProps = {
    points: RatingPoint[];
    height?: number;
    label: string;
};

/** Rating trend that fills its container's width: 2px line, faint wash, ringed end dot. */
const Sparkline = ({points, height = 36, label}: SparklineProps) => {
    const gradientId = useId();
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => setWidth(el.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    if (points.length < 2) return null;

    const pad = 5;
    const values = points.map((p) => p.rating);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const x = (i: number) => pad + (i / (points.length - 1)) * (width - pad * 2);
    const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

    const line = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`).join(" ");
    const area = `${line} L${x(points.length - 1).toFixed(1)},${height} L${x(0).toFixed(1)},${height} Z`;
    const last = points.at(-1)!;

    return (
        <div ref={ref} style={{height}}>
            {width > 0 && (
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="block">
                    <defs>
                        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.16"/>
                            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${gradientId})`}/>
                    <path d={line} fill="none" stroke="rgb(var(--accent))" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx={x(points.length - 1)} cy={y(last.rating)} r={4} fill="rgb(var(--accent))" stroke="rgb(var(--surface))" strokeWidth={2}/>
                </svg>
            )}
        </div>
    );
};

export default Sparkline;
