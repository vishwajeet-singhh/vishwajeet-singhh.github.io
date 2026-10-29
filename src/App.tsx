import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import OpenSource from "@/components/OpenSource";
import ProblemSolving from "@/components/ProblemSolving";
import SiteHeader from "@/components/SiteHeader";
import Stack from "@/components/Stack";
import StatsProvider from "@/components/StatsProvider";
import VisitorLogger from "@/components/VisitorLogger";
import {SHOW_PROBLEM_SOLVING} from "@/data/features";

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
            {/* Visibility is controlled by the feature flag and platform-visibility.ts. */}
            {SHOW_PROBLEM_SOLVING && <ProblemSolving/>}
            <OpenSource/>
            <Stack/>
            <Contact/>
        </main>
    </StatsProvider>
);

export default App;
