import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import OpenSource from "@/components/OpenSource";
import ProblemSolving from "@/components/ProblemSolving";
import SiteHeader from "@/components/SiteHeader";
import Stack from "@/components/Stack";
import StatsProvider from "@/components/StatsProvider";
import VisitorLogger from "@/components/VisitorLogger";
import {FEATURES} from "@/data/features";

const App = () => (
    <StatsProvider>
        {/* Runs once per visit */}
        <VisitorLogger/>

        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
        >
            Skip to content
        </a>
        <SiteHeader/>
        <main id="main">
            <Hero/>
            <Experience/>
            {/* Hidden until FEATURES.problemSolving is turned on (src/data/features.ts). */}
            {FEATURES.problemSolving && <ProblemSolving/>}
            <OpenSource/>
            <Stack/>
            <Contact/>
        </main>
    </StatsProvider>
);

export default App;
